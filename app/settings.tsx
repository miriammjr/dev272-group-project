import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase'; // Adjust path if needed
import { router } from 'expo-router';

import {
  Alert,
  Button,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function SettingsScreen() {
  const [notificationTime, setNotificationTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [householdName, setHouseholdName] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedTime = await AsyncStorage.getItem('notificationTime');
        const storedTheme = await AsyncStorage.getItem('darkMode');
        const storedName = await AsyncStorage.getItem('householdName');
        if (storedTime) setNotificationTime(new Date(storedTime));
        if (storedTheme) setDarkMode(storedTheme === 'true');
        if (storedName) setHouseholdName(storedName);
      } catch (e) {
        console.error('Error loading settings:', e);
      }
    };
    loadSettings();
  }, []);

  const saveNotificationTime = async (time: Date) => {
    setNotificationTime(time);
    await AsyncStorage.setItem('notificationTime', time.toISOString());
  };

  const toggleTheme = async () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    await AsyncStorage.setItem('darkMode', newValue.toString());
  };

  const saveHouseholdName = async () => {
    await AsyncStorage.setItem('householdName', householdName);
    Alert.alert('Saved', 'Household name updated.');
  };

  const resetAllData = () => {
    Alert.alert('Reset App', 'Are you sure you want to delete all data?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.clear();
            Alert.alert('Reset Complete', 'All data cleared.');
          } catch {
            Alert.alert('Error', 'Failed to reset data.');
          }
        },
      },
    ]);
  };

  const logoutUser = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      Alert.alert('Logged Out', 'You have been logged out.');
      router.replace('/'); // Assuming your login screen is at the root route
    } catch (e) {
      console.error('Logout error:', e);
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Settings</Text>

      {/* 1. Notification Time */}
      <View style={styles.section}>
        <Text style={styles.label}>⏰ Daily Reminder Time</Text>
        <Button
          title={`Set Time (${notificationTime.toLocaleTimeString()})`}
          onPress={() => setShowTimePicker(true)}
        />
        {showTimePicker && (
          <DateTimePicker
            value={notificationTime}
            mode='time'
            is24Hour={false}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(e, selectedTime) => {
              if (selectedTime) saveNotificationTime(selectedTime);
              setShowTimePicker(false);
            }}
          />
        )}
      </View>

      {/* 2. Theme Toggle */}
      <View style={styles.section}>
        <Text style={styles.label}>🎨 Dark Mode</Text>
        <Switch value={darkMode} onValueChange={toggleTheme} />
      </View>

      {/* 3. Household Name */}
      <View style={styles.section}>
        <Text style={styles.label}>👤 Household Name</Text>
        <TextInput
          value={householdName}
          onChangeText={setHouseholdName}
          placeholder='e.g., Smith Family'
          style={styles.input}
        />
        <Button title='Save Name' onPress={saveHouseholdName} />
      </View>

      {/* Reset */}
      <View style={styles.section}>
        <Button
          title='Reset All App Data'
          color='#FF3B30'
          onPress={resetAllData}
        />
      </View>

      {/* Logout */}
      <View style={styles.section}>
        <Button title='Logout' color='#007AFF' onPress={logoutUser} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
});
