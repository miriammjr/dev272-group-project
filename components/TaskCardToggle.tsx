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
    const { error: updateError } = await supabase
      .from('TaskList')
      .update({ completed: !task.completed })
      .eq('id', task.id);

    if (updateError) {
      Alert.alert('Error', 'Failed to update task status.');
      console.error('Toggle error:', updateError);
      return;
    }

    if (!task.completed && task.shouldRepeat && task.repeatIn > 0) {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('User not authenticated:', authError);
        return;
      }

      const nextDueDate = getNextDueDate(new Date(task.dueDate), task.repeatIn);

      const { error: insertError } = await supabase.from('TaskList').insert([
        {
          taskName: task.taskName,
          completed: false,
          dueDate: nextDueDate.toISOString(),
          shouldRepeat: true,
          repeatIn: task.repeatIn,
          idUserAccount: user.id, // ✅ Required for RLS
        },
      ]);

      if (insertError) {
        console.error('Failed to create repeated task:', {
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code,
        });
      }
    }

    onStatusChange(); // Refresh task list
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
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  taskName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dueDate: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});
