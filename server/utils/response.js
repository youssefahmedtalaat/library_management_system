import crypto from 'crypto';

/**
 * Standard API response envelope as defined in LMS Specification (Page 5 & 6)
 *
 * Success:
 * {
 *   "data": { ... },
 *   "error": null,
 *   "meta": { "requestId": "...", "timestamp": "..." }
 * }
 *
 * Error:
 * {
 *   "data": null,
 *   "error": { "code": "...", "message": "..." },
 *   "meta": { "requestId": "...", "timestamp": "..." }
 * }
 */

export function successResponse(res, data, status = 200, meta = {}) {
  const requestId = res.req?.requestId || crypto.randomUUID();
  return res.status(status).json({
    data,
    error: null,
    meta: {
      requestId,
      timestamp: new Date().toISOString(),
      ...meta
    }
  });
}

export function errorResponse(res, message, code = 'INTERNAL_ERROR', status = 500, details = null) {
  const requestId = res.req?.requestId || crypto.randomUUID();
  return res.status(status).json({
    data: null,
    error: {
      code,
      message,
      ...(details ? { details } : {})
    },
    meta: {
      requestId,
      timestamp: new Date().toISOString()
    }
  });
}
