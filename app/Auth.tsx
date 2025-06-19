import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { supabase } from '../utils/supabase';
export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) Alert.alert(error.message);
    setLoading(false);
    if (!error) {
      console.log('LOGGED IN');
      router.replace('/(tabs)/redirect');
    } else {
      Alert.alert('Login failed.');
      console.log(error);
    }
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({ email: email, password: password });
    console.log('TEST');
    if (error) console.log(error);
    if (!session)
      Alert.alert('Please check your inbox for email verification!');
    setLoading(false);
  }

  async function forgotPassword() {
    setLoading(true);
    // const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    // console.log(`resetting password for ${email}`);
    // Alert.alert('Check your email to reset your password!');
    // setLoading(false);
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
          onChangeText={text => setEmail(text)}
          value={email}
          placeholder='email@address.com'
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.div}>
        <TextInput
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry={true}
          placeholder='Password'
          autoCapitalize={'none'}
        />{' '}
      </View>{' '}
      <View style={styles.div}>
        <View style={styles.button}>
          {' '}
          <Button
            title='Sign in'
            disabled={loading}
            onPress={() => signInWithEmail()}
          />{' '}
        </View>{' '}
        <View style={styles.button}>
          {' '}
          <Button
            title='Sign up'
            disabled={loading}
            onPress={() => signUpWithEmail()}
          />{' '}
        </View>{' '}
        <View style={styles.button}>
          {' '}
          <Button
            title='Reset Password'
            disabled={loading}
            onPress={() => forgotPassword()}
          />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    margin: 'auto',
    padding: 12,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: 'white',
  },
  div: {
    marginBottom: 'auto',
    width: '100%',
  },
  button: {
    marginBottom: 20,
  },
  title: {
    paddingTop: 50,
    fontSize: 50,
    margin: 'auto',
  },
});
