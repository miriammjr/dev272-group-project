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

  async function signup() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Create Account</Text>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={() => {
          signup();
          console.log(email);
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
            <Button title='Sign Up' onPress={() => handleSubmit()} />
          </ThemedView>
        )}
      </Formik>
      <Link href='/index' style={styles.link}>
        Sign in
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
