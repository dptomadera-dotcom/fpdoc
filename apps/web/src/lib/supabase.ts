import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dsoxbghnlnlpztjnmpak.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_key_for_build';

if (process.env.NODE_ENV === 'production' && supabaseAnonKey === 'dummy_key_for_build') {
  console.error('CRITICAL: NEXT_PUBLIC_SUPABASE_ANON_KEY is missing in production environment!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
