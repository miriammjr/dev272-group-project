import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from '../utils/supabase';
import { differenceInDays } from 'date-fns';

type Task = {
  id: number;
  taskName: string;
  completed: boolean;
  dueDate: string;
  shouldRepeat: boolean;
  repeatIn: number;
  type?: string;
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
  const getNextDueDate = (days: number): Date => {
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + days);
    return nextDate;
  };

  const handleToggle = async () => {
    const newCompletedState = !task.completed;

    const { error: updateError } = await supabase
      .from('TaskList')
      .update({ completed: newCompletedState })
      .eq('id', task.id);

    if (updateError) {
      Alert.alert('Error', 'Failed to update task status.');
      console.error('Toggle error:', updateError);
      return;
    }

    if (newCompletedState && task.shouldRepeat && task.repeatIn > 0) {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('User not authenticated:', authError);
      } else {
        const { data: existingTasks, error: checkError } = await supabase
          .from('TaskList')
          .select('id')
          .eq('taskName', task.taskName)
          .eq('idUserAccount', user.id)
          .eq('completed', false)
          .gt('dueDate', new Date().toISOString());

        if (checkError) {
          console.error('Error checking for duplicate repeat:', checkError);
        } else if (!existingTasks || existingTasks.length === 0) {
          const completionDate = new Date();
          const previousDueDate = new Date(task.dueDate);
          const actualInterval = Math.max(
            1,
            differenceInDays(completionDate, previousDueDate),
          );
          const newRepeatIn = Math.round((actualInterval + task.repeatIn) / 2);
          const nextDueDate = getNextDueDate(newRepeatIn);

          const { error: insertError } = await supabase
            .from('TaskList')
            .insert([
              {
                taskName: task.taskName,
                completed: false,
                dueDate: nextDueDate.toISOString(),
                shouldRepeat: true,
                repeatIn: newRepeatIn,
                idUserAccount: user.id,
                createdDate: new Date().toISOString(),
                type: task.type ?? 'chore',
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
        } else {
          console.log('Repeat task already exists. Skipping insert.');
        }
      }
    }

    onStatusChange();
  };

  const handleDelete = () => {
    console.log('Delete button pressed for task ID:', task.id);
    onDelete(task.id);
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
        <Button title='Delete' color='red' onPress={handleDelete} />
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
