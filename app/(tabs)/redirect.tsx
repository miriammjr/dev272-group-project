import { useEffect, useState } from 'react';
// import 'react-native-url-polyfill/auto';
import { User } from '@supabase/supabase-js';
import { Alert, Text, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  console.log('IN THE REDIRECT');
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        console.log(user);
      } else {
        Alert.alert('bad error');
        console.log("whoops something's gone horribly wrong");
      }
    });
  }, []);
  return (
    <View>
      <Text>Testing user login stuff</Text>
    </View>
  );
}
