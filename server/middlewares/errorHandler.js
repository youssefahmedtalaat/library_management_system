import { errorResponse } from '../utils/response.js';

export function errorHandler(err, req, res, _next) {
  console.error('Unhandled Server Error:', err);

  // MySQL Duplicate Entry (e.g. unique constraint violation on email, barcode, ISBN)
  if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
    return errorResponse(res, 'A record with this identifier already exists', 'DUPLICATE_ENTRY', 409);
  }

  // MySQL Foreign Key Constraint Fail
  if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.code === 'ER_NO_REFERENCED_ROW_2') {
    return errorResponse(res, 'Operation violates relational integrity constraints', 'RELATIONAL_ERROR', 400);
  }

  const statusCode = err.status || err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected internal error occurred';

  return errorResponse(res, message, errorCode, statusCode);
}
