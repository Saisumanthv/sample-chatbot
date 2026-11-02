import { createClient } from '@supabase/supabase-js';
import { config } from './env.js';

if (!config.supabase.url || (!config.supabase.serviceRoleKey && !config.supabase.anonKey)) {
  console.warn('[Supabase Config] Warning: SUPABASE_URL and key are not fully configured in environment.');
}

const supabaseKey = config.supabase.serviceRoleKey || config.supabase.anonKey;

// Primary server client with administrative / service privileges if configured
export const supabaseAdmin = createClient(
  config.supabase.url || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Helper to create a user-scoped Supabase client that respects RLS using the user's Bearer token
export function createUserClient(accessToken) {
  return createClient(
    config.supabase.url || 'https://placeholder.supabase.co',
    config.supabase.anonKey || supabaseKey || 'placeholder-key',
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

