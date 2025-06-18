import React, { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { supabase } from '@/utils/supabase';

export default function SettingsScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [homeName, setHomeName] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const storedEmail = await AsyncStorage.getItem('email');
      const storedPassword = await AsyncStorage.getItem('password');
      const storedHomeName = await AsyncStorage.getItem('homeName');
      const notif = await AsyncStorage.getItem('notifications');
      const storedTime = await AsyncStorage.getItem('reminderTime');

      if (storedEmail) setEmail(storedEmail);
      if (storedPassword) setPassword(storedPassword);
      if (storedHomeName) setHomeName(storedHomeName);
      if (notif === 'true') setNotificationsEnabled(true);
      if (storedTime) setReminderTime(new Date(storedTime));
    };

    loadData();
    if (Platform.OS !== 'web') {
      Notifications.requestPermissionsAsync();
    }
  }, []);

  const scheduleDailyNotification = async (time: Date) => {
    if (Platform.OS === 'web') return;

    await Notifications.cancelAllScheduledNotificationsAsync();

    const hour = time.getHours();
    const minute = time.getMinutes();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Reminder',
        body: "Don't forget to check your household tasks today!",
        sound: 'default',
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });
  };

  const saveSettings = async () => {
    await AsyncStorage.setItem('email', email);
    await AsyncStorage.setItem('password', password);
    await AsyncStorage.setItem('homeName', homeName);
    await AsyncStorage.setItem('notifications', notificationsEnabled.toString());
    await AsyncStorage.setItem('reminderTime', reminderTime.toISOString());

    if (Platform.OS !== 'web') {
      if (notificationsEnabled) {
        await scheduleDailyNotification(reminderTime);
      } else {
        await Notifications.cancelAllScheduledNotificationsAsync();
      }
    }

    Alert.alert('Saved!', 'Your settings were saved.');
  };

  const logoutUser = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      await AsyncStorage.multiRemove([
        'email',
        'password',
        'homeName',
        'reminderTime',
      ]);

      if (Platform.OS !== 'web') {
        await Notifications.cancelAllScheduledNotificationsAsync();
      }

      Alert.alert('Logged Out', 'You have been logged out.');
      router.replace('/');
    } catch (e) {
      console.error('Logout error:', e);
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) setReminderTime(selectedTime);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>Home Name</Text>
        <TextInput
          style={styles.input}
          value={homeName}
          onChangeText={setHomeName}
          placeholder="Name your home"
          placeholderTextColor="#aaa"
        />

        <View style={styles.switchRow}>
          <Text style={styles.label}>Enable Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            thumbColor={Platform.OS === 'android' ? '#fff' : undefined}
            trackColor={{ true: '#007AFF', false: '#ccc' }}
          />
        </View>

        <Text style={styles.label}>Reminder Time</Text>
        <Pressable
          style={styles.timeBox}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.timeText}>
            {reminderTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </Pressable>

        {showTimePicker && (
          <DateTimePicker
            mode="time"
            value={reminderTime}
            is24Hour={true}
            display="default"
            onChange={onTimeChange}
          />
        )}

        <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={logoutUser}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 24,
    color: '#111827',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#f9fafb',
    fontSize: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeBox: {
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    color: '#111827',
  },
  saveButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
