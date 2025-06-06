import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hzieetxadezlbqkpvwhc.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6aWVldHhhZGV6bGJxa3B2d2hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MzE2MTksImV4cCI6MjA2NDUwNzYxOX0.LGlUlre5ySMwbJgc4GPxbaB5Onjztc74INguh0DhpSQ';
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
