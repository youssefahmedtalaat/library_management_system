import * as memberService from './members.service.js';
import { successResponse, errorResponse } from '../../utils/response.js';

export async function getMyLoans(req, res, next) {
  try {
    const memberId = req.user?.member_id;
    if (!memberId) {
      return errorResponse(res, 'User is not linked to a member account', 'NOT_A_MEMBER', 400);
    }
    const { status } = req.query;
    const loans = await memberService.getMemberLoans(memberId, status || 'active');
    return successResponse(res, loans);
  } catch (err) {
    next(err);
  }
}

export async function getMyReservations(req, res, next) {
  try {
    const memberId = req.user?.member_id;
    if (!memberId) {
      return errorResponse(res, 'User is not linked to a member account', 'NOT_A_MEMBER', 400);
    }
    const reservations = await memberService.getMemberReservations(memberId);
    return successResponse(res, reservations);
  } catch (err) {
    next(err);
  }
}

export async function getMyFines(req, res, next) {
  try {
    const memberId = req.user?.member_id;
    if (!memberId) {
      return errorResponse(res, 'User is not linked to a member account', 'NOT_A_MEMBER', 400);
    }
    const fines = await memberService.getMemberFines(memberId);
    return successResponse(res, fines);
  } catch (err) {
    next(err);
  }
}

export async function getMembers(req, res, next) {
  try {
    const { q } = req.query;
    const members = await memberService.searchMembers(q);
    return successResponse(res, members);
  } catch (err) {
    next(err);
  }
}

export async function getMember(req, res, next) {
  try {
    const { id } = req.params;
    const member = await memberService.getMemberDetails(id);
    return successResponse(res, member);
  } catch (err) {
    next(err);
  }
}
