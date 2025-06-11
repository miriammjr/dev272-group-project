import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

const supabaseUrl = 'https://qyheyawfwjnixpyceckh.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5aGV5YXdmd2puaXhweWNlY2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNjk3NDgsImV4cCI6MjA2NDk0NTc0OH0.Qm66bM0_DZuOO0kWMciNgl3iDrsb7AlCfmitef_nZrQ';
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

AppState.addEventListener('change', state => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
