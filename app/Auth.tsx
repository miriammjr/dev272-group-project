import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../utils/supabase';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    if (!email || !password) {
      Alert.alert('Please enter both email and password.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Login failed', error.message);
      console.log(error);
      return;
    }

    console.log('LOGGED IN');
    router.replace('/(tabs)/home');
  }

  async function signUpWithEmail() {
    if (!email || !password) {
      Alert.alert('Please enter both email and password.');
      return;
    }

    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (error) {
      console.log(error);
      Alert.alert('Signup failed', error.message);
      return;
    }

    if (!session) {
      Alert.alert('Please check your inbox for email verification!');
    } else {
      router.replace('/(tabs)/home');
    }
  }

  async function forgotPassword() {
    setLoading(true);
    Alert.alert("This doesn't work yet; make a new account.");
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.div}>
        <Text style={styles.title}>Log In</Text>
      </View>

      <View style={styles.div}>
        <TextInput
          onChangeText={setEmail}
          value={email}
          placeholder="email@address.com"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>

      <View style={styles.div}>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      <View style={styles.div}>
        <View style={styles.button}>
          <Button title="Sign in" disabled={loading} onPress={signInWithEmail} />
        </View>
        <View style={styles.button}>
          <Button title="Sign up" disabled={loading} onPress={signUpWithEmail} />
        </View>
        <View style={styles.button}>
          <Button title="Reset Password" disabled={loading} onPress={forgotPassword} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  div: {
    marginBottom: 20,
    width: '100%',
  },
  button: {
    marginBottom: 10,
  },
  title: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
});
