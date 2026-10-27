import { query } from '../../config/db.js';

export async function getMemberLoans(memberId, status = 'active') {
  const conditions = ['l.member_id = ?'];
  const params = [memberId];

  if (status && status !== 'all') {
    conditions.push('l.status = ?');
    params.push(status);
  }

  return await query(
    `SELECT l.id, l.copy_id, l.issued_at, l.due_at, l.returned_at, l.renewal_count, l.status,
            c.barcode AS copy_barcode, c.shelf_location,
            b.id AS book_id, b.title AS book_title, b.isbn, b.cover_url,
            GROUP_CONCAT(DISTINCT a.name SEPARATOR ', ') AS author_name,
            DATEDIFF(l.due_at, NOW()) AS days_left
     FROM loans l
     JOIN book_copies c ON l.copy_id = c.id
     JOIN books b ON c.book_id = b.id
     LEFT JOIN book_authors ba ON b.id = ba.book_id
     LEFT JOIN authors a ON ba.author_id = a.id
     WHERE ${conditions.join(' AND ')}
     GROUP BY l.id
     ORDER BY l.due_at ASC`,
    params
  );
}

export async function getMemberReservations(memberId) {
  return await query(
    `SELECT r.id, r.book_id, r.queue_position, r.status, r.placed_at, r.expires_at,
            b.title AS book_title, b.isbn, b.cover_url,
            GROUP_CONCAT(DISTINCT a.name SEPARATOR ', ') AS author_name
     FROM reservations r
     JOIN books b ON r.book_id = b.id
     LEFT JOIN book_authors ba ON b.id = ba.book_id
     LEFT JOIN authors a ON ba.author_id = a.id
     WHERE r.member_id = ?
     GROUP BY r.id
     ORDER BY r.placed_at DESC`,
    [memberId]
  );
}

export async function getMemberFines(memberId) {
  return await query(
    `SELECT f.id, f.loan_id, f.amount, f.currency, f.status, f.assessed_at, f.settled_at,
            b.title AS book_title, l.due_at
     FROM fines f
     JOIN loans l ON f.loan_id = l.id
     JOIN book_copies c ON l.copy_id = c.id
     JOIN books b ON c.book_id = b.id
     WHERE l.member_id = ?
     ORDER BY f.assessed_at DESC`,
    [memberId]
  );
}

export async function searchMembers(searchQuery) {
  const conditions = [];
  const params = [];

  if (searchQuery && searchQuery.trim()) {
    const term = `%${searchQuery.trim()}%`;
    conditions.push('(u.full_name LIKE ? OR m.member_code LIKE ? OR u.email LIKE ? OR m.phone LIKE ?)');
    params.push(term, term, term, term);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  return await query(
    `SELECT m.id, m.member_code, m.phone, m.membership_status, m.joined_at, m.max_allowed_loans,
            u.id AS user_id, u.full_name, u.email, u.status AS user_status,
            COUNT(DISTINCT CASE WHEN l.status = 'active' THEN l.id END) AS active_loans_count,
            COALESCE(SUM(CASE WHEN f.status = 'unpaid' THEN f.amount ELSE 0 END), 0) AS total_unpaid_fines
     FROM members m
     JOIN users u ON m.user_id = u.id
     LEFT JOIN loans l ON m.id = l.member_id
     LEFT JOIN fines f ON l.id = f.loan_id
     ${whereClause}
     GROUP BY m.id
     ORDER BY m.id ASC`,
    params
  );
}

export async function getMemberDetails(id) {
  const members = await searchMembers(null);
  const member = members.find(m => m.id === parseInt(id, 10));
  if (!member) {
    const err = new Error('Member not found');
    err.status = 404;
    err.code = 'MEMBER_NOT_FOUND';
    throw err;
  }

  const loans = await getMemberLoans(id, 'all');
  const reservations = await getMemberReservations(id);
  const fines = await getMemberFines(id);

  return {
    ...member,
    loans,
    reservations,
    fines
  };
}
