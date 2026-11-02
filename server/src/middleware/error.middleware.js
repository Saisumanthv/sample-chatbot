import { errorResponse } from '../utils/apiResponse.js';

export function errorHandler(err, req, res, next) {
  console.error('[Unhandled Error]', {
    path: req.path,
    method: req.method,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  // Handle SyntaxError for bad JSON body
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return errorResponse(res, 'Malformed JSON payload in request body.', 400, 'BAD_REQUEST');
  }

  // Handle specific custom status codes
  const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';
  const errorMessage = err.isPublic ? err.message : 'An unexpected internal server error occurred.';

  return errorResponse(res, errorMessage, statusCode, errorCode, err.details);
}

export function notFoundHandler(req, res) {
  return errorResponse(res, `Cannot ${req.method} ${req.path}`, 404, 'NOT_FOUND');
}

