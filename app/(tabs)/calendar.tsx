import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';

interface Task {
  id: string;
  name: string;
  frequency: number;
}

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [allChores, setAllChores] = useState<Task[]>([]);
  const [scheduled, setScheduled] = useState<Record<string, Task[]>>({});

  useEffect(() => {
    const load = async () => {
      const rawChores = await AsyncStorage.getItem('chores');
      if (rawChores) setAllChores(JSON.parse(rawChores));
      const rawSchedule = await AsyncStorage.getItem('scheduledChores');
      if (rawSchedule) setScheduled(JSON.parse(rawSchedule));
    };
    load();
  }, []);

  const scheduleNotification = async (dateStr: string, task: Task) => {
    const date = new Date(dateStr + 'T09:00:00'); // 9 AM

    if (date.getTime() < Date.now()) {
      Alert.alert(
        'Invalid Date',
        'You cannot schedule a notification in the past.',
      );
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `⏰ ${task.name}`,
        body: `Reminder: Your task is scheduled for today!`,
      },
      trigger: {
        type: 'calendar',
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: 0,
        repeats: false,
      },
    });
  };

  const scheduleChore = (task: Task) => {
    if (!selectedDate) {
      Alert.alert('Select a date first');
      return;
    }

    const updated = { ...scheduled };
    updated[selectedDate] = [...(updated[selectedDate] || []), task];

    setScheduled(updated);
    AsyncStorage.setItem('scheduledChores', JSON.stringify(updated));
    scheduleNotification(selectedDate, task);

    Alert.alert('Scheduled!', `“${task.name}” set for ${selectedDate}`);
  };

  const removeScheduledChore = (index: number) => {
    const updated = { ...scheduled };
    updated[selectedDate] = updated[selectedDate].filter((_, i) => i !== index);
    if (updated[selectedDate].length === 0) delete updated[selectedDate];

    setScheduled(updated);
    AsyncStorage.setItem('scheduledChores', JSON.stringify(updated));
  };

  //  Create marked dates with dots
  const markedDates = Object.keys(scheduled).reduce(
    (acc, date) => {
      acc[date] = {
        marked: true,
        dotColor: '#1D3D47',
        selected: date === selectedDate,
        selectedColor: date === selectedDate ? '#1D3D47' : undefined,
      };
      return acc;
    },
    {} as Record<string, any>,
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📆 Calendar</Text>
      <Calendar
        onDayPress={day => setSelectedDate(day.dateString)}
        markedDates={markedDates}
      />

      <Text style={styles.sectionTitle}>🧹 Chores to Schedule</Text>
      <FlatList
        data={allChores}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.taskCard}
            onPress={() => scheduleChore(item)}
          >
            <Text style={styles.taskText}>{item.name}</Text>
            <Text style={styles.taskFreq}>Every {item.frequency} days</Text>
          </TouchableOpacity>
        )}
      />

      {scheduled[selectedDate]?.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>
            📋 Scheduled for {selectedDate}
          </Text>
          {scheduled[selectedDate].map((task, index) => (
            <View key={index} style={styles.scheduledItem}>
              <Text style={styles.scheduledText}>• {task.name}</Text>
              <TouchableOpacity onPress={() => removeScheduledChore(index)}>
                <Text style={styles.remove}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  taskCard: {
    backgroundColor: '#e6f2f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  taskText: {
    fontSize: 16,
    fontWeight: '500',
  },
  taskFreq: {
    fontSize: 14,
    color: '#555',
  },
  scheduledItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingRight: 10,
  },
  scheduledText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
  },
  remove: {
    fontSize: 16,
    color: 'red',
  },
});
