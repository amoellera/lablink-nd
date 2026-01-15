import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isConfigured = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your_project_url_here' && 
  supabaseAnonKey !== 'your_anon_key_here' &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseAnonKey.includes('placeholder');

if (!isConfigured) {
  console.warn('⚠️ Missing or invalid Supabase environment variables.');
  console.warn('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.');
  console.warn('Get your credentials from: https://app.supabase.com → Your Project → Settings → API');
}

// Only create client if properly configured, otherwise create a mock that throws helpful errors
export const supabase = isConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : ({
      auth: {
        signUp: async () => ({
          data: null,
          error: {
            message: 'Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file. See SUPABASE_SETUP.md for instructions.',
          },
        }),
        signInWithPassword: async () => ({
          data: null,
          error: {
            message: 'Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file. See SUPABASE_SETUP.md for instructions.',
          },
        }),
      },
    } as any);
