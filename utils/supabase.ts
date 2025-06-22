import { createClient } from '@supabase/supabase-js';

// Validate environment variables
const supabaseUrl = 'https://dgskfdjzvcqslsbymlhd.supabase.co/';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnc2tmZGp6dmNxc2xzYnltbGhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MzYyMDIsImV4cCI6MjA2NDExMjIwMn0.GAWJmUjaqfzpMWElAtppPBHtjwXoS9ICspORZrx03rA';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Make sure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are defined in your .env.local file.',
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
