import { successResponse, errorResponse } from '../utils/apiResponse.js';

export async function getProfileHandler(req, res) {
  const { data, error } = await req.userSupabase
    .from('profiles')
    .select('id, full_name, email, created_at, updated_at')
    .eq('id', req.user.id)
    .single();

  if (error || !data) {
    // If profile row doesn't exist yet, return minimal profile from auth.user
    return successResponse(res, {
      profile: {
        id: req.user.id,
        email: req.user.email,
        full_name: req.user.user_metadata?.full_name || ''
      }
    });
  }

  return successResponse(res, { profile: data }, 'Profile retrieved successfully.');
}

export async function updateProfileHandler(req, res) {
  const { full_name } = req.body;

  const { data, error } = await req.userSupabase
    .from('profiles')
    .upsert({
      id: req.user.id,
      email: req.user.email,
      full_name,
      updated_at: new Date().toISOString()
    })
    .select('id, full_name, email, created_at, updated_at')
    .single();

  if (error) {
    return errorResponse(res, `Failed to update profile: ${error.message}`, 500);
  }

  return successResponse(res, { profile: data }, 'Profile updated successfully.');
}

