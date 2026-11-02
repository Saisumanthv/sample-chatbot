export function successResponse(res, data = {}, message = 'Operation completed successfully.', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
    message
  });
}

export function errorResponse(res, message = 'An error occurred.', statusCode = 500, code = 'INTERNAL_SERVER_ERROR', details = null) {
  const errorObj = {
    code,
    message
  };

  if (details && process.env.NODE_ENV !== 'production') {
    errorObj.details = details;
  }

  return res.status(statusCode).json({
    success: false,
    error: errorObj
  });
}

