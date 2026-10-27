import bcrypt from 'bcryptjs';
import { query } from '../../config/db.js';
import { recordAuditLog } from '../../middlewares/audit.js';

export async function listStaff() {
  return await query(
    `SELECT id, full_name, email, role, status, created_at, updated_at
     FROM users
     WHERE role IN ('admin', 'librarian')
     ORDER BY id ASC`
  );
}

export async function createStaff({ fullName, email, password, role = 'librarian' }, actorUserId) {
  const existing = await query('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
  if (existing.length > 0) {
    const err = new Error('A user with this email address already exists');
    err.status = 409;
    err.code = 'EMAIL_EXISTS';
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = await query(
    `INSERT INTO users (full_name, email, password_hash, role, status)
     VALUES (?, ?, ?, ?, 'active')`,
    [fullName.trim(), email.toLowerCase().trim(), passwordHash, role]
  );

  const staffId = result.insertId;
  await recordAuditLog(actorUserId, 'إضافة موظف جديد', 'User', staffId, { fullName, email, role });

  return { id: staffId, fullName, email, role, status: 'active' };
}

export async function updateStaffStatus(staffId, status, actorUserId) {
  await query('UPDATE users SET status = ? WHERE id = ? AND role IN (\'admin\', \'librarian\')', [status, staffId]);
  await recordAuditLog(actorUserId, 'تعديل حالة موظف', 'User', staffId, { status });
  return { id: staffId, status };
}

export async function getPolicies() {
  const rows = await query('SELECT policy_key, policy_value, description FROM policies');
  const policyMap = {};
  for (const r of rows) {
    const num = parseFloat(r.policy_value);
    if (!isNaN(num) && String(num) === r.policy_value) {
      policyMap[r.policy_key] = num;
    } else if (r.policy_value === 'true') {
      policyMap[r.policy_key] = true;
    } else if (r.policy_value === 'false') {
      policyMap[r.policy_key] = false;
    } else {
      policyMap[r.policy_key] = r.policy_value;
    }
  }
  return policyMap;
}

export async function updatePolicies(policyUpdates, actorUserId) {
  for (const [key, val] of Object.entries(policyUpdates)) {
    await query(
      `INSERT INTO policies (policy_key, policy_value)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE policy_value = ?`,
      [key, String(val), String(val)]
    );
  }

  await recordAuditLog(actorUserId, 'تحديث سياسات التداول', 'Policy', 'CIRCULATION_POLICY', policyUpdates);
  return getPolicies();
}

export async function getAuditLogs({ action, actorId, page = 1, limit = 20 }) {
  const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
  const conditions = [];
  const params = [];

  if (action && action.trim()) {
    conditions.push('a.action LIKE ?');
    params.push(`%${action.trim()}%`);
  }
  if (actorId) {
    conditions.push('a.actor_user_id = ?');
    params.push(actorId);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const sql = `
    SELECT a.id, a.actor_user_id, a.action, a.entity_type, a.entity_id, a.details, a.created_at,
           u.full_name AS actor_name, u.role AS actor_role, u.email AS actor_email
    FROM audit_logs a
    LEFT JOIN users u ON a.actor_user_id = u.id
    ${whereClause}
    ORDER BY a.created_at DESC
    LIMIT ? OFFSET ?
  `;

  const countSql = `SELECT COUNT(id) AS total FROM audit_logs a ${whereClause}`;

  const rows = await query(sql, [...params, parseInt(limit, 10), offset]);
  const countResult = await query(countSql, params);
  const total = countResult[0]?.total || 0;

  return {
    logs: rows.map(r => ({
      ...r,
      details: typeof r.details === 'string' ? JSON.parse(r.details || '{}') : r.details
    })),
    pagination: {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(total / limit)
    }
  };
}
