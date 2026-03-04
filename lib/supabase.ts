import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Create a single supabase client for interacting with your database
// If keys are missing or invalid, we create a dummy client or throw a clear error when used
export const supabase: SupabaseClient | null = supabaseUrl && supabaseKey && isValidUrl(supabaseUrl)
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

export function getSupabase() {
  if (!supabase) {
    throw new Error('Supabase environment variables are missing. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }
  return supabase;
}
