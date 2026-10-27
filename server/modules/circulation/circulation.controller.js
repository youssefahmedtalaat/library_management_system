import * as circService from './circulation.service.js';
import { successResponse, errorResponse } from '../../utils/response.js';

export async function issueLoan(req, res, next) {
  try {
    const { barcode, memberCode, memberId } = req.body;
    if (!barcode || (!memberCode && !memberId)) {
      return errorResponse(res, 'Barcode and memberCode (or memberId) are required', 'VALIDATION_ERROR', 400);
    }
    const loan = await circService.issueLoan({ barcode, memberCode, memberId }, req.user?.id);
    return successResponse(res, loan, 201, { message: 'Loan issued successfully' });
  } catch (err) {
    next(err);
  }
}

export async function returnLoan(req, res, next) {
  try {
    const { id } = req.params;
    const result = await circService.returnLoan(id, req.user?.id);
    return successResponse(res, result, 200, { message: 'Book returned successfully' });
  } catch (err) {
    next(err);
  }
}

export async function renewLoan(req, res, next) {
  try {
    const { id } = req.params;
    const result = await circService.renewLoan(id, req.user?.id);
    return successResponse(res, result, 200, { message: 'Loan renewed successfully' });
  } catch (err) {
    next(err);
  }
}

export async function createReservation(req, res, next) {
  try {
    const { bookId } = req.body;
    const memberId = req.body.memberId || req.user?.member_id;

    if (!bookId || !memberId) {
      return errorResponse(res, 'bookId and memberId are required', 'VALIDATION_ERROR', 400);
    }

    const reservation = await circService.placeReservation({ bookId, memberId }, req.user?.id);
    return successResponse(res, reservation, 201, { message: 'Reservation placed successfully' });
  } catch (err) {
    next(err);
  }
}

export async function getReservations(req, res, next) {
  try {
    const { bookId, memberId, status } = req.query;
    const reservations = await circService.listReservations({ bookId, memberId, status });
    return successResponse(res, reservations);
  } catch (err) {
    next(err);
  }
}

export async function cancelReservation(req, res, next) {
  try {
    const { id } = req.params;
    const result = await circService.cancelReservation(id, req.user?.id);
    return successResponse(res, result, 200, { message: 'Reservation cancelled' });
  } catch (err) {
    next(err);
  }
}

export async function getFines(req, res, next) {
  try {
    const { status, memberId } = req.query;
    const fines = await circService.listFines({ status, memberId });
    return successResponse(res, fines);
  } catch (err) {
    next(err);
  }
}

export async function settleFine(req, res, next) {
  try {
    const { id } = req.params;
    const result = await circService.settleFine(id, req.user?.id);
    return successResponse(res, result, 200, { message: 'Fine settled successfully' });
  } catch (err) {
    next(err);
  }
}
