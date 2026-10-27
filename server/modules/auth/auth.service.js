import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query, withTransaction } from '../../config/db.js';
import { env } from '../../config/env.js';

export async function loginUser(email, password) {
  const users = await query(
    `SELECT u.id, u.full_name, u.email, u.password_hash, u.role, u.status,
            m.id AS member_id, m.member_code, m.membership_status
     FROM users u
     LEFT JOIN members m ON u.id = m.user_id
     WHERE u.email = ?`,
    [email.toLowerCase().trim()]
  );

  if (users.length === 0) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const user = users[0];

  if (user.status !== 'active') {
    const error = new Error('Your account is currently inactive or suspended');
    error.status = 403;
    error.code = 'ACCOUNT_INACTIVE';
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role, email: user.email },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  );

  return {
    token,
    user: {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role,
      status: user.status,
      memberId: user.member_id,
      memberCode: user.member_code,
      membershipStatus: user.membership_status
    }
  };
}

export async function registerMember({ fullName, email, password, phone }) {
  const existing = await query('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
  if (existing.length > 0) {
    const error = new Error('An account with this email already exists');
    error.status = 409;
    error.code = 'EMAIL_ALREADY_EXISTS';
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const memberCode = `MEM-2026-${randomSuffix}`;

  return await withTransaction(async (conn) => {
    const [userResult] = await conn.query(
      `INSERT INTO users (full_name, email, password_hash, role, status)
       VALUES (?, ?, ?, 'member', 'active')`,
      [fullName.trim(), email.toLowerCase().trim(), passwordHash]
    );

    const userId = userResult.insertId;

    const [memberResult] = await conn.query(
      `INSERT INTO members (user_id, member_code, phone, membership_status, max_allowed_loans)
       VALUES (?, ?, ?, 'active', 3)`,
      [userId, memberCode, phone || null]
    );

    const token = jwt.sign(
      { userId, role: 'member', email },
      env.jwt.secret,
      { expiresIn: env.jwt.expiresIn }
    );

    return {
      token,
      user: {
        id: userId,
        fullName,
        email,
        role: 'member',
        status: 'active',
        memberId: memberResult.insertId,
        memberCode,
        membershipStatus: 'active'
      }
    };
  });
}
