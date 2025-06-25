import { Session } from '@supabase/supabase-js';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        console.log('apparently im logged in');
        router.replace('/(tabs)/home');
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) {
          console.log('logging in');
          router.replace('/(tabs)/home');
        } else {
          console.log('LOGGED OUT');
          router.replace('/Auth');
        }
      },
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return null;
}
