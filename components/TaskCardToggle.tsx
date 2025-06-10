import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from '../utils/supabase';

type Task = {
  id: number;
  taskName: string;
  completed: boolean;
  dueDate: string; // ISO string
  shouldRepeat: boolean;
  repeatIn: number; // Number of days
};

interface TaskCardToggleProps {
  task: Task;
  onStatusChange: () => void;
  onDelete: (id: number) => void;
}

export default function TaskCardToggle({
  task,
  onStatusChange,
  onDelete,
}: TaskCardToggleProps) {
  const getNextDueDate = (currentDate: Date, days: number): Date => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + days);
    return nextDate;
  };

  const handleToggle = async () => {
    const { error } = await supabase
      .from('TaskList')
      .update({ completed: !task.completed })
      .eq('id', task.id);

    if (error) {
      Alert.alert('Error', 'Failed to update task status.');
      console.error('Toggle error:', error);
    } else {
      if (!task.completed && task.shouldRepeat && task.repeatIn > 0) {
        const nextDueDate = getNextDueDate(
          new Date(task.dueDate),
          task.repeatIn,
        );

        const { error: insertError } = await supabase.from('TaskList').insert([
          {
            taskName: task.taskName,
            completed: false,
            dueDate: nextDueDate.toISOString(),
            shouldRepeat: true,
            repeatIn: task.repeatIn,
          },
        ]);

        if (insertError) {
          console.error('Failed to create repeated task:', insertError);
        }
      }

      onStatusChange(); // Refresh task list
    }
  };

  const handleDelete = async () => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase
            .from('TaskList')
            .delete()
            .eq('id', task.id);

          if (error) {
            Alert.alert('Error', 'Failed to delete task.');
            console.error('Delete error:', error);
          } else {
            onDelete(task.id); // Notify parent to refresh
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.taskName}>{task.taskName}</Text>
      <Text style={styles.dueDate}>Due: {task.dueDate.slice(0, 10)}</Text>
      <View style={styles.actions}>
        <Button
          title={task.completed ? 'Undo' : 'Complete'}
          onPress={handleToggle}
        />
        <Button title="Delete" color="red" onPress={handleDelete} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 8,
  },
  taskName: {
    fontSize: 16,
    fontWeight: '500',
  },
  dueDate: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});
