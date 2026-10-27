import * as authService from './auth.service.js';
import { successResponse, errorResponse } from '../../utils/response.js';

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return errorResponse(res, 'Email and password are required', 'VALIDATION_ERROR', 400);
    }

    const result = await authService.loginUser(email, password);
    return successResponse(res, result, 200, { message: 'Logged in successfully' });
  } catch (err) {
    next(err);
  }
}

export async function register(req, res, next) {
  try {
    const { fullName, email, password, phone } = req.body;
    if (!fullName || !email || !password) {
      return errorResponse(res, 'Full name, email, and password are required', 'VALIDATION_ERROR', 400);
    }

    if (password.length < 6) {
      return errorResponse(res, 'Password must be at least 6 characters long', 'VALIDATION_ERROR', 400);
    }

    const result = await authService.registerMember({ fullName, email, password, phone });
    return successResponse(res, result, 201, { message: 'Account created successfully' });
  } catch (err) {
    next(err);
  }
}

export async function logout(_req, res) {
  return successResponse(res, { loggedOut: true }, 200, { message: 'Logged out successfully' });
}

export async function getMe(req, res) {
  return successResponse(res, {
    user: {
      id: req.user.id,
      fullName: req.user.full_name,
      email: req.user.email,
      role: req.user.role,
      status: req.user.status,
      memberId: req.user.member_id,
      memberCode: req.user.member_code,
      membershipStatus: req.user.membership_status
    }
  });
}
