import { supabaseAdmin, createUserClient } from '../config/supabase.js';
import { errorResponse } from '../utils/apiResponse.js';

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Authentication required. No Bearer token provided.', 401, 'UNAUTHORIZED');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return errorResponse(res, 'Malformed Authorization header.', 401, 'UNAUTHORIZED');
    }

    // Verify token with Supabase Auth
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return errorResponse(res, 'Invalid, expired, or revoked authentication session.', 401, 'UNAUTHORIZED');
    }

    // Attach authenticated user and token-scoped client to request
    req.user = user;
    req.token = token;
    req.userSupabase = createUserClient(token);

    next();
  } catch (err) {
    console.error('[Auth Middleware] Exception during token verification:', err.message);
    return errorResponse(res, 'Authentication verification failed.', 401, 'UNAUTHORIZED');
  }
}

