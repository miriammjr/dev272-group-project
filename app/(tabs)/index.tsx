import { ThemedView } from '@/components/ThemedView';
import { supabase } from '@/lib/supabase';
import { Link } from 'expo-router';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signin() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    console.log();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Log in</Text>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={() => {
          signin();
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          isSubmitting,
        }) => (
          <ThemedView style={styles.form}>
            <Text>Email</Text>
            <TextInput
              id='email'
              placeholder='email@email.com'
              value={values.email}
              onChangeText={handleChange('email')}
            ></TextInput>
            {errors.email && touched.email && <Text>{errors.email}</Text>}
            <Text>Password</Text>

            <TextInput
              id='password'
              value={values.password}
              onChangeText={handleChange('password')}
            ></TextInput>
            {errors.password && touched.password && (
              <Text>{errors.password}</Text>
            )}
            <Button title='Sign In' onPress={() => handleSubmit()} />
          </ThemedView>
        )}
      </Formik>
      <Link href='/createAccount' style={styles.link}>
        Create a new account
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  form: {
    margin: 'auto',
    backgroundColor: 'white',
  },
  link: {
    margin: 'auto',
  },
  text: {
    margin: 'auto',
    fontSize: 50,
  },
});
