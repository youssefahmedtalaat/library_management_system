import { query, withTransaction } from '../../config/db.js';
import { recordAuditLog } from '../../middlewares/audit.js';

/**
 * Helper to fetch a numeric policy value from policies table with fallback
 */
async function getPolicy(key, defaultValue) {
  const rows = await query('SELECT policy_value FROM policies WHERE policy_key = ?', [key]);
  if (rows.length > 0 && rows[0].policy_value != null) {
    const val = parseFloat(rows[0].policy_value);
    return isNaN(val) ? rows[0].policy_value : val;
  }
  return defaultValue;
}

/**
 * Issue a loan to a member (Circulation Desk)
 * Enforces:
 * 1. Active member check
 * 2. Max loans quota check
 * 3. Outstanding overdue fines check
 * 4. Copy availability lock (FOR UPDATE)
 * 5. Single active loan per copy constraint
 */
export async function issueLoan({ barcode, memberCode, memberId }, actorUserId) {
  return await withTransaction(async (conn) => {
    // 1. Locate and validate Member
    let member;
    if (memberCode) {
      const [members] = await conn.query(
        `SELECT m.id, m.user_id, m.member_code, m.membership_status, m.max_allowed_loans, u.full_name
         FROM members m
         JOIN users u ON m.user_id = u.id
         WHERE m.member_code = ? FOR UPDATE`,
        [memberCode.trim()]
      );
      member = members[0];
    } else if (memberId) {
      const [members] = await conn.query(
        `SELECT m.id, m.user_id, m.member_code, m.membership_status, m.max_allowed_loans, u.full_name
         FROM members m
         JOIN users u ON m.user_id = u.id
         WHERE m.id = ? FOR UPDATE`,
        [memberId]
      );
      member = members[0];
    }

    if (!member) {
      const err = new Error('Member not found with the provided identifier');
      err.status = 404;
      err.code = 'MEMBER_NOT_FOUND';
      throw err;
    }

    if (member.membership_status !== 'active') {
      const err = new Error(`Member account is ${member.membership_status}. Cannot issue books.`);
      err.status = 403;
      err.code = 'MEMBER_BLOCKED';
      throw err;
    }

    // Check unpaid overdue fines
    const [unpaidFines] = await conn.query(
      `SELECT SUM(amount) AS total_unpaid
       FROM fines f
       JOIN loans l ON f.loan_id = l.id
       WHERE l.member_id = ? AND f.status = 'unpaid'`,
      [member.id]
    );

    const totalFines = parseFloat(unpaidFines[0]?.total_unpaid || 0);
    if (totalFines > 20) {
      const err = new Error(`Member has unpaid fines of ${totalFines} EGP exceeding allowed threshold.`);
      err.status = 403;
      err.code = 'OUTSTANDING_FINES';
      throw err;
    }

    // Check active loans limit
    const [activeLoans] = await conn.query(
      "SELECT COUNT(id) AS active_count FROM loans WHERE member_id = ? AND status = 'active'",
      [member.id]
    );
    const activeCount = activeLoans[0]?.active_count || 0;
    const maxAllowed = member.max_allowed_loans || 3;
    if (activeCount >= maxAllowed) {
      const err = new Error(`Member has reached the maximum allowed active loans limit (${maxAllowed}).`);
      err.status = 400;
      err.code = 'MAX_LOANS_EXCEEDED';
      throw err;
    }

    // 2. Locate and lock Copy
    const [copies] = await conn.query(
      `SELECT c.id, c.book_id, c.barcode, c.status, b.title
       FROM book_copies c
       JOIN books b ON c.book_id = b.id
       WHERE c.barcode = ? FOR UPDATE`,
      [barcode.trim()]
    );

    if (copies.length === 0) {
      const err = new Error(`Book copy with barcode ${barcode} was not found.`);
      err.status = 404;
      err.code = 'COPY_NOT_FOUND';
      throw err;
    }

    const copy = copies[0];

    // Check if currently borrowed
    if (copy.status === 'borrowed') {
      const err = new Error('This physical copy is currently borrowed by another member.');
      err.status = 409;
      err.code = 'COPY_ALREADY_BORROWED';
      throw err;
    }

    // Check if reserved
    if (copy.status === 'reserved') {
      // Allow only if reserved for this specific member
      const [res] = await conn.query(
        "SELECT id FROM reservations WHERE book_id = ? AND member_id = ? AND status = 'pending' LIMIT 1",
        [copy.book_id, member.id]
      );
      if (res.length > 0) {
        // Fulfill reservation
        await conn.query("UPDATE reservations SET status = 'fulfilled' WHERE id = ?", [res[0].id]);
      } else {
        const err = new Error('This copy is reserved for another member in the reservations queue.');
        err.status = 409;
        err.code = 'COPY_RESERVED';
        throw err;
      }
    }

    // 3. Calculate loan period from policies
    const loanDays = await getPolicy('default_loan_days', 14);

    // 4. Update Copy status
    await conn.query("UPDATE book_copies SET status = 'borrowed' WHERE id = ?", [copy.id]);

    // 5. Insert Loan record
    const [loanResult] = await conn.query(
      `INSERT INTO loans (copy_id, member_id, issued_by, issued_at, due_at, renewal_count, status)
       VALUES (?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL ? DAY), 0, 'active')`,
      [copy.id, member.id, actorUserId || 1, loanDays]
    );

    const loanId = loanResult.insertId;

    // 6. Record Audit Log
    await recordAuditLog(actorUserId, 'إصدار إعارة', 'Loan', loanId, {
      barcode: copy.barcode,
      book_title: copy.title,
      member_code: member.member_code,
      member_name: member.full_name
    });

    const [createdLoan] = await conn.query('SELECT * FROM loans WHERE id = ?', [loanId]);
    return createdLoan[0];
  });
}

/**
 * Return a book copy (Circulation Desk)
 * Handles:
 * 1. Marking loan returned
 * 2. Overdue detection & fine assessment in Egyptian Pounds (EGP)
 * 3. Copy status update (available or held for next reservation queue member)
 */
export async function returnLoan(loanId, actorUserId) {
  return await withTransaction(async (conn) => {
    const [loans] = await conn.query(
      `SELECT l.id, l.copy_id, l.member_id, l.due_at, l.status, c.book_id, c.barcode, b.title, u.full_name
       FROM loans l
       JOIN book_copies c ON l.copy_id = c.id
       JOIN books b ON c.book_id = b.id
       JOIN members m ON l.member_id = m.id
       JOIN users u ON m.user_id = u.id
       WHERE l.id = ? FOR UPDATE`,
      [loanId]
    );

    if (loans.length === 0) {
      const err = new Error('Loan record not found.');
      err.status = 404;
      err.code = 'LOAN_NOT_FOUND';
      throw err;
    }

    const loan = loans[0];
    if (loan.status === 'returned') {
      const err = new Error('This loan has already been marked as returned.');
      err.status = 400;
      err.code = 'ALREADY_RETURNED';
      throw err;
    }

    // 1. Mark loan returned
    await conn.query("UPDATE loans SET status = 'returned', returned_at = NOW() WHERE id = ?", [loanId]);

    // 2. Assess overdue fines if overdue
    const now = new Date();
    const dueDate = new Date(loan.due_at);
    let fineAssessed = 0;

    if (now > dueDate) {
      const diffTime = Math.abs(now - dueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const finePerDay = await getPolicy('fine_per_day', 5.0);
      fineAssessed = diffDays * finePerDay;

      if (fineAssessed > 0) {
        await conn.query(
          `INSERT INTO fines (loan_id, amount, currency, status, assessed_at)
           VALUES (?, ?, 'EGP', 'unpaid', NOW())`,
          [loanId, fineAssessed]
        );
      }
    }

    // 3. Check if there are pending reservations for this book
    const [nextRes] = await conn.query(
      `SELECT id, member_id
       FROM reservations
       WHERE book_id = ? AND status = 'pending'
       ORDER BY queue_position ASC LIMIT 1 FOR UPDATE`,
      [loan.book_id]
    );

    let nextStatus = 'available';
    if (nextRes.length > 0) {
      // Mark copy reserved for the reservation holder
      nextStatus = 'reserved';
      const expiryHours = await getPolicy('reservation_expiry_hours', 48);
      await conn.query(
        `UPDATE reservations
         SET expires_at = DATE_ADD(NOW(), INTERVAL ? HOUR)
         WHERE id = ?`,
        [expiryHours, nextRes[0].id]
      );
    }

    await conn.query("UPDATE book_copies SET status = ? WHERE id = ?", [nextStatus, loan.copy_id]);

    await recordAuditLog(actorUserId, 'إرجاع كتاب', 'Loan', loanId, {
      barcode: loan.barcode,
      book_title: loan.title,
      overdue_fine_egp: fineAssessed
    });

    return {
      loanId,
      returnedAt: new Date().toISOString(),
      fineAssessed,
      copyStatus: nextStatus
    };
  });
}

/**
 * Renew a loan
 * Enforces policy:
 * - Cannot renew if overdue
 * - Cannot exceed max renewals (2)
 * - Cannot renew if book has reservations queue
 */
export async function renewLoan(loanId, actorUserId) {
  return await withTransaction(async (conn) => {
    const [loans] = await conn.query(
      `SELECT l.id, l.copy_id, l.member_id, l.due_at, l.renewal_count, l.status, c.book_id, b.title
       FROM loans l
       JOIN book_copies c ON l.copy_id = c.id
       JOIN books b ON c.book_id = b.id
       WHERE l.id = ? FOR UPDATE`,
      [loanId]
    );

    if (loans.length === 0) {
      const err = new Error('Loan not found.');
      err.status = 404;
      err.code = 'LOAN_NOT_FOUND';
      throw err;
    }

    const loan = loans[0];

    if (loan.status !== 'active') {
      const err = new Error('Only active loans can be renewed.');
      err.status = 400;
      err.code = 'LOAN_NOT_ACTIVE';
      throw err;
    }

    // Overdue check
    if (new Date() > new Date(loan.due_at)) {
      const err = new Error('Cannot renew an overdue book. Please return it to the circulation desk and settle fines.');
      err.status = 400;
      err.code = 'LOAN_OVERDUE';
      throw err;
    }

    // Max renewals check
    const maxRenewals = await getPolicy('max_renewals', 2);
    if (loan.renewal_count >= maxRenewals) {
      const err = new Error(`Loan has already been renewed the maximum allowed times (${maxRenewals}).`);
      err.status = 400;
      err.code = 'MAX_RENEWALS_REACHED';
      throw err;
    }

    // Reservation hold check
    const [res] = await conn.query(
      "SELECT COUNT(id) AS cnt FROM reservations WHERE book_id = ? AND status = 'pending'",
      [loan.book_id]
    );
    if (res[0]?.cnt > 0) {
      const err = new Error('This book cannot be renewed because other members are waiting in the reservation queue.');
      err.status = 409;
      err.code = 'RESERVATION_EXISTS';
      throw err;
    }

    const loanDays = await getPolicy('default_loan_days', 14);

    await conn.query(
      `UPDATE loans
       SET due_at = DATE_ADD(due_at, INTERVAL ? DAY),
           renewal_count = renewal_count + 1
       WHERE id = ?`,
      [loanDays, loanId]
    );

    const [updated] = await conn.query('SELECT * FROM loans WHERE id = ?', [loanId]);

    await recordAuditLog(actorUserId, 'تجديد إعارة', 'Loan', loanId, {
      book_title: loan.title,
      renewal_count: updated[0].renewal_count,
      new_due_at: updated[0].due_at
    });

    return updated[0];
  });
}

/**
 * Place a reservation on a book
 */
export async function placeReservation({ bookId, memberId }, actorUserId) {
  return await withTransaction(async (conn) => {
    // Check member
    const [member] = await conn.query(
      "SELECT id, membership_status FROM members WHERE id = ?",
      [memberId]
    );
    if (member.length === 0 || member[0].membership_status !== 'active') {
      const err = new Error('Member account is not active.');
      err.status = 403;
      err.code = 'MEMBER_NOT_ACTIVE';
      throw err;
    }

    // Check if copies are available
    const [availCopies] = await conn.query(
      "SELECT COUNT(id) AS avail FROM book_copies WHERE book_id = ? AND status = 'available'",
      [bookId]
    );
    if (availCopies[0]?.avail > 0) {
      const err = new Error('Copies of this book are currently available on the shelf. You do not need to place a hold.');
      err.status = 400;
      err.code = 'COPIES_AVAILABLE';
      throw err;
    }

    // Check duplicate reservation
    const [existing] = await conn.query(
      "SELECT id FROM reservations WHERE book_id = ? AND member_id = ? AND status = 'pending'",
      [bookId, memberId]
    );
    if (existing.length > 0) {
      const err = new Error('You already have an active reservation for this book.');
      err.status = 409;
      err.code = 'DUPLICATE_RESERVATION';
      throw err;
    }

    // Compute queue position
    const [maxQueue] = await conn.query(
      "SELECT COALESCE(MAX(queue_position), 0) AS max_pos FROM reservations WHERE book_id = ? AND status = 'pending'",
      [bookId]
    );
    const nextQueuePos = (maxQueue[0]?.max_pos || 0) + 1;

    const [resResult] = await conn.query(
      `INSERT INTO reservations (book_id, member_id, queue_position, status, placed_at)
       VALUES (?, ?, ?, 'pending', NOW())`,
      [bookId, memberId, nextQueuePos]
    );

    const reservationId = resResult.insertId;

    await recordAuditLog(actorUserId, 'تسجيل حجز كتاب', 'Reservation', reservationId, {
      book_id: bookId,
      member_id: memberId,
      queue_position: nextQueuePos
    });

    const [created] = await conn.query('SELECT * FROM reservations WHERE id = ?', [reservationId]);
    return created[0];
  });
}

/**
 * List reservations
 */
export async function listReservations({ bookId, memberId, status }) {
  const conditions = [];
  const params = [];

  if (bookId) {
    conditions.push('r.book_id = ?');
    params.push(bookId);
  }
  if (memberId) {
    conditions.push('r.member_id = ?');
    params.push(memberId);
  }
  if (status) {
    conditions.push('r.status = ?');
    params.push(status);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  return await query(
    `SELECT r.id, r.book_id, r.member_id, r.queue_position, r.status, r.placed_at, r.expires_at,
            b.title AS book_title, b.isbn, u.full_name AS member_name, m.member_code
     FROM reservations r
     JOIN books b ON r.book_id = b.id
     JOIN members m ON r.member_id = m.id
     JOIN users u ON m.user_id = u.id
     ${whereClause}
     ORDER BY r.placed_at DESC`,
    params
  );
}

/**
 * Cancel a reservation
 */
export async function cancelReservation(reservationId, actorUserId) {
  return await withTransaction(async (conn) => {
    const [res] = await conn.query('SELECT * FROM reservations WHERE id = ? FOR UPDATE', [reservationId]);
    if (res.length === 0) {
      const err = new Error('Reservation not found.');
      err.status = 404;
      err.code = 'RESERVATION_NOT_FOUND';
      throw err;
    }

    const reservation = res[0];
    await conn.query("UPDATE reservations SET status = 'cancelled' WHERE id = ?", [reservationId]);

    // Recalculate queue positions for other waiting members
    await conn.query(
      `UPDATE reservations
       SET queue_position = queue_position - 1
       WHERE book_id = ? AND status = 'pending' AND queue_position > ?`,
      [reservation.book_id, reservation.queue_position]
    );

    await recordAuditLog(actorUserId, 'إلغاء حجز كتاب', 'Reservation', reservationId);
    return { id: reservationId, cancelled: true };
  });
}

/**
 * List fines
 */
export async function listFines({ status, memberId }) {
  const conditions = [];
  const params = [];

  if (status) {
    conditions.push('f.status = ?');
    params.push(status);
  }
  if (memberId) {
    conditions.push('l.member_id = ?');
    params.push(memberId);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  return await query(
    `SELECT f.id, f.loan_id, f.amount, f.currency, f.status, f.assessed_at, f.settled_at,
            b.title AS book_title, u.full_name AS member_name, m.member_code, l.due_at, l.returned_at
     FROM fines f
     JOIN loans l ON f.loan_id = l.id
     JOIN book_copies c ON l.copy_id = c.id
     JOIN books b ON c.book_id = b.id
     JOIN members m ON l.member_id = m.id
     JOIN users u ON m.user_id = u.id
     ${whereClause}
     ORDER BY f.assessed_at DESC`,
    params
  );
}

/**
 * Settle a fine
 */
export async function settleFine(fineId, actorUserId) {
  const [fine] = await query('SELECT * FROM fines WHERE id = ?', [fineId]);
  if (fine.length === 0) {
    const err = new Error('Fine not found.');
    err.status = 404;
    err.code = 'FINE_NOT_FOUND';
    throw err;
  }

  await query(
    "UPDATE fines SET status = 'paid', settled_at = NOW(), settled_by = ? WHERE id = ?",
    [actorUserId || null, fineId]
  );

  await recordAuditLog(actorUserId, 'تحصيل غرامة تأخير', 'Fine', fineId, { amount: fine[0].amount });
  return { id: fineId, status: 'paid', settledAt: new Date().toISOString() };
}
