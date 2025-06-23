import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';

import TaskCard from '@/components/TaskCard';
import { useTasks } from '@/hooks/useTasks';

export default function CalendarScreen() {
  const { tasks, loading, error } = useTasks();
  const [selectedDate, setSelectedDate] = useState('');
  const [tasksOnDay, setTasksOnDay] = useState([]);

  // Set current date when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const today = new Date().toISOString().slice(0, 10);
      setSelectedDate(today);
    }, [])
  );

  useEffect(() => {
    if (!selectedDate || !tasks.length) return;

    const tasksForDay = tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate).toISOString().slice(0, 10);
      return taskDate === selectedDate;
    });

    setTasksOnDay(tasksForDay);
  }, [selectedDate, tasks]);

  const getMarkedDates = () => {
    const datesWithTasks: Record<string, any> = {};

    tasks.forEach(task => {
      if (task.dueDate) {
        const dateStr = new Date(task.dueDate).toISOString().slice(0, 10);
        datesWithTasks[dateStr] = {
          marked: true,
          dotColor: '#FF9800',
        };
      }
    });

    if (selectedDate) {
      datesWithTasks[selectedDate] = {
        ...(datesWithTasks[selectedDate] || {}),
        selected: true,
        selectedColor: '#1D3D47',
      };
    }

    return datesWithTasks;
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

      {loading && <Text>Loading...</Text>}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}

      <FlatList
        data={tasksOnDay}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TaskCard
            taskName={item.taskName}
            dueDate={item.dueDate}
            repeatIn={item.repeatIn}
          />
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
});
