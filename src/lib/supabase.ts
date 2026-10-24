import { createClient } from '@supabase/supabase-js';

// Safe environment variable resolution for both Vite and Node testing environments
const getEnvVar = (key: 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY'): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key].trim();
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key]!.trim();
  }
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-supabase') &&
  !supabaseAnonKey.includes('your-anon-key')
);

// Fallback dummy client if credentials not supplied to prevent frontend crashes
const fallbackUrl = 'https://placeholder-foodbridge.supabase.co';
const fallbackKey = 'placeholder-anon-key';

export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : fallbackUrl,
  isSupabaseConfigured ? supabaseAnonKey : fallbackKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);
