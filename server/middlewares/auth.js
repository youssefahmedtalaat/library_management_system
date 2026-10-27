import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { query } from '../config/db.js';
import { errorResponse } from '../utils/response.js';

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return errorResponse(res, 'Authentication token is required', 'UNAUTHORIZED', 401);
  }

  try {
    const decoded = jwt.verify(token, env.jwt.secret);
    const users = await query(
      `SELECT u.id, u.full_name, u.email, u.role, u.status,
              m.id AS member_id, m.member_code, m.membership_status
       FROM users u
       LEFT JOIN members m ON u.id = m.user_id
       WHERE u.id = ?`,
      [decoded.userId]
    );

    if (users.length === 0) {
      return errorResponse(res, 'User not found', 'USER_NOT_FOUND', 401);
    }

    const user = users[0];
    if (user.status !== 'active') {
      return errorResponse(res, 'Account is suspended or inactive', 'ACCOUNT_INACTIVE', 403);
    }

    req.user = user;
    next();
  } catch (err) {
    return errorResponse(res, 'Invalid or expired token', 'TOKEN_EXPIRED', 401);
  }
}

/**
 * Optional token authentication (attaches user if valid token exists, otherwise proceeds as guest)
 */
export async function optionalAuthenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, env.jwt.secret);
    const users = await query(
      `SELECT u.id, u.full_name, u.email, u.role, u.status,
              m.id AS member_id, m.member_code, m.membership_status
       FROM users u
       LEFT JOIN members m ON u.id = m.user_id
       WHERE u.id = ?`,
      [decoded.userId]
    );

    if (users.length > 0 && users[0].status === 'active') {
      req.user = users[0];
    } else {
      req.user = null;
    }
  } catch {
    req.user = null;
  }
  next();
}

/**
 * Require specific roles (e.g. ['librarian', 'admin'])
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required', 'UNAUTHORIZED', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(
        res,
        'You do not have permission to perform this action',
        'FORBIDDEN_ROLE',
        403
      );
    }

    next();
  };
}
