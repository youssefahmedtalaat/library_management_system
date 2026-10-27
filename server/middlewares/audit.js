import { query } from '../config/db.js';

/**
 * Record an action into the immutable audit_logs table
 */
export async function recordAuditLog(actorUserId, action, entityType, entityId, details = null) {
  try {
    const detailsStr = details ? JSON.stringify(details) : null;
    await query(
      `INSERT INTO audit_logs (actor_user_id, action, entity_type, entity_id, details, created_at)
       VALUES (?, ?, ?, ?, ?, UTC_TIMESTAMP())`,
      [actorUserId || null, action, entityType, String(entityId), detailsStr]
    );
  } catch (err) {
    console.error('Failed to write audit log:', err.message);
  }
}
