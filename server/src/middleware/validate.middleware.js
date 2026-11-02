import { errorResponse } from '../utils/apiResponse.js';

export function validate(schema, source = 'body') {
  return (req, res, next) => {
    try {
      const dataToValidate = req[source];
      const parsed = schema.parse(dataToValidate);
      req[source] = parsed;
      next();
    } catch (err) {
      if (err.errors) {
        const firstError = err.errors[0]?.message || 'Validation failed.';
        const formattedErrors = err.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }));
        return errorResponse(res, firstError, 400, 'VALIDATION_ERROR', formattedErrors);
      }
      return errorResponse(res, 'Invalid request data.', 400, 'VALIDATION_ERROR');
    }
  };
}

