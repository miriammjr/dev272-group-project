import { supabase } from '@/utils/supabase';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  async function updatePassword() {
    setLoading(true);
    const error = await supabase.auth.updateUser({ password: password });

    setLoading(false);
    if (!error) {
      Alert.alert('Success! Log in now.');
      router.replace('/Auth');
    } else {
      console.log(error);
    }
  }

  return (
    <View style={styles.inputContainer}>
      <TextInput
        placeholder='Password'
        placeholderTextColor='#9CA3AF'
        autoCapitalize='none'
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />

      <Pressable onPress={updatePassword} disabled={loading}>
        <Text>Change Password</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827', // Dark blue-gray background
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#1F2937',
  },
  eyeIcon: {
    padding: 4,
  },
  spinner: {
    marginVertical: 16,
  },
  button: {
    backgroundColor: '#3B82F6', // Primary blue color
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3B82F6',
    marginTop: 12,
  },
  secondaryButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    color: '#3B82F6',
    textAlign: 'center',
    marginTop: 24,
    fontSize: 14,
    fontWeight: '500',
  },
});
