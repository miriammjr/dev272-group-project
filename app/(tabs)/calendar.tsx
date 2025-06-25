import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Platform, ScrollView, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';

import TaskCard from '@/components/TaskCard';
import { useTasks } from '@/hooks/useTasks';
import { ThemedText } from '@/components/ThemedText';
import { styles as sharedStyles } from '@/styles/styles';

export default function CalendarScreen() {
  const { tasks, loading, error, refetch } = useTasks();
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toLocaleDateString('en-CA'),
  );
  const [tasksOnDay, setTasksOnDay] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const today = new Date().toLocaleDateString('en-CA');
      setSelectedDate(today);
      refetch(); // Refetch tasks when screen is focused
    }, [refetch]),
  );

  useEffect(() => {
    if (!selectedDate || !tasks.length) return;

    const tasksForDay = tasks
      .filter(task => {
        if (!task.dueDate || task.completed) return false;
        const taskDate = new Date(task.dueDate).toLocaleDateString('en-CA');
        return taskDate === selectedDate;
      })
      .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

    setTasksOnDay(tasksForDay.slice(0, 1)); // Only the latest uncompleted task
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
    <ScrollView
      style={Platform.OS === 'web' ? sharedStyles.scrollContainer : undefined}
      contentContainerStyle={
        Platform.OS === 'web' ? sharedStyles.scrollContent : undefined
      }
    >
      <View style={sharedStyles.section}>
        <Calendar
          onDayPress={day => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          style={sharedStyles.calendar}
        />
      </View>

      <View style={sharedStyles.section}>
        <ThemedText type="subtitle" style={sharedStyles.sectionTitle}>
          {selectedDate
            ? `📝 Tasks for ${selectedDate}`
            : 'Select a date to see tasks.'}
        </ThemedText>

        {loading && <Text>Loading tasks...</Text>}
        {error && <Text style={{ color: 'red' }}>{error}</Text>}

        <FlatList
          data={tasksOnDay}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TaskCard
              taskName={item.taskName}
              dueDate={item.dueDate}
              repeatIn={item.repeatIn}
            />
          )}
          ListEmptyComponent={
            <Text style={sharedStyles.emptyText}>No tasks for this day 🎉</Text>
          }
        />
      </View>
    </ScrollView>
  );
}
