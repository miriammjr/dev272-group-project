import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';

import TaskCard from '@/components/TaskCard';
import { useTasks } from '@/hooks/useTasks';
import { ThemedText } from '@/components/ThemedText';

export default function CalendarScreen() {
  const { tasks, loading, error } = useTasks();
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toLocaleDateString('en-CA'),
  );
  const [tasksOnDay, setTasksOnDay] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const today = new Date().toLocaleDateString('en-CA');
      setSelectedDate(today);
    }, []),
  );

  useEffect(() => {
    if (!selectedDate || !tasks.length) return;

    const tasksForDay = tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate).toLocaleDateString('en-CA');
      return taskDate === selectedDate;
    });

    setTasksOnDay(tasksForDay);
  }, [selectedDate, tasks]);

  const markedDates = useMemo(() => {
    const datesWithTasks: Record<string, any> = {};

    tasks.forEach(task => {
      if (task.dueDate) {
        const dateStr = new Date(task.dueDate).toLocaleDateString('en-CA');
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
  }, [tasks, selectedDate]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.section}>
        <Calendar
          onDayPress={day => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          style={styles.calendar}
        />
      </View>

      <View style={styles.section}>
        <ThemedText type='subtitle' style={styles.sectionTitle}>
          {selectedDate
            ? `📝 Tasks for ${selectedDate}`
            : 'Select a date to see tasks.'}
        </ThemedText>

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
            <Text style={styles.emptyText}>No tasks for this day 🎉</Text>
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    backgroundColor: '#F3F4F6',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  calendar: {
    marginTop: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#6B7280',
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
});
