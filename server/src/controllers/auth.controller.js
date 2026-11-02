import { successResponse } from '../utils/apiResponse.js';

export async function verifySessionHandler(req, res) {
  return successResponse(res, {
    user: {
      id: req.user.id,
      email: req.user.email,
      user_metadata: req.user.user_metadata
    }
  }, 'Session verified successfully.');
}

