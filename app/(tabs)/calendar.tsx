import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

interface Task {
  id: string;
  name: string;
  frequency: number;
  createdAt: number;
  lastCompletedAt?: number | null;
}

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [allChores, setAllChores] = useState<Task[]>([]);
  const [allSupplies, setAllSupplies] = useState<Task[]>([]);
  const [scheduled, setScheduled] = useState<Record<string, Task[]>>({});
  const [dueTasksOnDay, setDueTasksOnDay] = useState<Task[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const load = async () => {
        const rawChores = await AsyncStorage.getItem('chores');
        if (rawChores) setAllChores(JSON.parse(rawChores));
        const rawSupplies = await AsyncStorage.getItem('supplies');
        if (rawSupplies) setAllSupplies(JSON.parse(rawSupplies));
        const rawSchedule = await AsyncStorage.getItem('scheduledChores');
        if (rawSchedule) setScheduled(JSON.parse(rawSchedule));
      };
      load();
    }, []),
  );

  // Update due tasks whenever a date is selected or the task lists change
  useEffect(() => {
    if (!selectedDate) {
      setDueTasksOnDay([]);
      return;
    }
    const allTasks = [...allChores, ...allSupplies];
    const pickedDate = new Date(selectedDate + 'T00:00:00').getTime();

    // Helper to check if task is due on selectedDate
    const isTaskDueOnDate = (task: Task) => {
      const lastDone = task.lastCompletedAt ?? task.createdAt;
      const freqMs = task.frequency * 24 * 60 * 60 * 1000;
      let dueDate = lastDone + freqMs;

      // If task is overdue, calculate all due dates up to today
      while (dueDate < pickedDate) {
        dueDate += freqMs;
      }
      // If dueDate matches selectedDate, it's due that day
      return (
        new Date(dueDate).toDateString() === new Date(pickedDate).toDateString()
      );
    };

    const due = allTasks.filter(isTaskDueOnDate);

    // Also include explicitly scheduled chores for this date
    const scheduledForDay = scheduled[selectedDate] || [];
    const uniqueDue = [
      ...due,
      ...scheduledForDay.filter(s => !due.some(d => d.id === s.id)),
    ];

    setDueTasksOnDay(uniqueDue);
  }, [selectedDate, allChores, allSupplies, scheduled]);

  // Mark dates on the calendar with dots if any task is due
  const getMarkedDates = () => {
    const allTasks = [...allChores, ...allSupplies];
    const datesWithDueTasks: Record<string, any> = {};

    // For each task, calculate all due dates up to some reasonable range (e.g., next 60 days)
    const today = new Date();
    for (const task of allTasks) {
      const freqMs = task.frequency * 24 * 60 * 60 * 1000;
      let lastDone = task.lastCompletedAt ?? task.createdAt;
      let nextDue = lastDone + freqMs;

      for (let i = 0; i < 60; i++) {
        const dateStr = new Date(nextDue).toISOString().slice(0, 10);
        if (!datesWithDueTasks[dateStr]) {
          datesWithDueTasks[dateStr] = {
            marked: true,
            dotColor: '#1D3D47',
          };
        }
        nextDue += freqMs;
        if (nextDue > today.getTime() + 60 * freqMs) break;
      }
    }

    // Also mark scheduled chores
    Object.keys(scheduled).forEach(date => {
      datesWithDueTasks[date] = {
        ...(datesWithDueTasks[date] || {}),
        marked: true,
        dotColor: '#FF9800',
      };
    });

    // Highlight selected date
    if (selectedDate) {
      datesWithDueTasks[selectedDate] = {
        ...(datesWithDueTasks[selectedDate] || {}),
        selected: true,
        selectedColor: '#1D3D47',
      };
    }

    return datesWithDueTasks;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📆 Calendar</Text>
      <Calendar
        onDayPress={day => setSelectedDate(day.dateString)}
        markedDates={getMarkedDates()}
      />

      <Text style={styles.sectionTitle}>
        {selectedDate
          ? `📝 Tasks for ${selectedDate}`
          : 'Select a date to see tasks.'}
      </Text>

      <FlatList
        data={dueTasksOnDay}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <Text style={styles.taskText}>{item.name}</Text>
            <Text style={styles.taskFreq}>Every {item.frequency} days</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ margin: 16 }}>No tasks for this day 🎉</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 12 },
  title: { fontSize: 24, fontWeight: 'bold', marginVertical: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 24 },
  taskCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    elevation: 1,
  },
  taskText: { fontSize: 16, fontWeight: 'bold' },
  taskFreq: { fontSize: 13, color: '#555' },
});
