import { useEffect, useState } from 'react';
// import 'react-native-url-polyfill/auto';
import { User } from '@supabase/supabase-js';
import { router } from 'expo-router';
import { Alert, Button, Text, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function App() {
  const [user, setUser] = useState<User | null>(null);

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

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Error');
      console.log(error);
    } else {
      console.log('LOGGED OUT');
      router.replace('/../Auth');
    }
  };

  return (
    <View>
      <Text>Testing user login stuff</Text>
      <Button title='Log Out' onPress={() => logout()} />
    </View>
  );
}
