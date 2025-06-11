import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
// import 'react-native-url-polyfill/auto';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';
export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  console.log('IN THE INDEX');
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      // setSession(session);
      if (session) {
        console.log('apparently im logged in');
        router.replace('/(tabs)/home');
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      // setSession(session);
      if (session) {
        console.log('logging in');
        router.replace('/(tabs)/home');
      } else {
        console.log('LOGGED OUT');
        router.replace('/Auth');
      }
    });
  }, []);
}
