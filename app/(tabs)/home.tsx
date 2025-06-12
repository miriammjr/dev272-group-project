import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import {
  isToday,
  isThisWeek,
  isThisMonth,
  parseISO,
  isBefore,
  startOfToday,
  differenceInDays,
} from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import TaskCardToggle from '@/components/TaskCardToggle';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { useTasks } from '@/hooks/useTasks';
import { useAddTask } from '@/hooks/useAddTask';

type Task = {
  id: number;
  taskName: string;
  dueDate: string;
  completed: boolean;
  frequency?: number;
  lastCompletedAt?: string | null;
};

export default function Resupply() {
  const router = useRouter();
  const { tasks, loading, error, refetch } = useTasks();
  const { addTask } = useAddTask(refetch);

  const [modalVisible, setModalVisible] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleAddTask = async () => {
    if (!taskName || !dueDate) return;

    try {
      const localDate = new Date(`${dueDate}T00:00:00`);
      const offsetMinutes = localDate.getTimezoneOffset();
      const utcDate = new Date(localDate.getTime() - offsetMinutes * 60000);

      await addTask({
        taskName,
        dueDate: utcDate.toISOString(),
      });

      setModalVisible(false);
      setTaskName('');
      setDueDate('');
    } catch (err) {
      alert('Error adding task: ' + err.message);
    }
  };

  const categorizeTasks = (tasks: Task[]) => {
    const today: Task[] = [];
    const week: Task[] = [];
    const month: Task[] = [];
    const completed: Task[] = [];

    const now = new Date();
    const todayStart = startOfToday();

    tasks.forEach(task => {
      if (task.completed) {
        completed.push(task);
        return;
      }

      const due = parseISO(task.dueDate);

      if (task.frequency && task.lastCompletedAt) {
        const lastDone = parseISO(task.lastCompletedAt);
        const daysSince = differenceInDays(now, lastDone);
        if (daysSince >= task.frequency) {
          today.push(task);
          return;
        }
      }

      if (isBefore(due, todayStart) || isToday(due)) {
        today.push(task);
      } else if (isThisWeek(due, { weekStartsOn: 1 })) {
        week.push(task);
      } else if (isThisMonth(due)) {
        month.push(task);
      }
    });

    const sortByDueDate = (a: Task, b: Task) =>
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();

    return {
      today: today.sort(sortByDueDate),
      week: week.sort(sortByDueDate),
      month: month.sort(sortByDueDate),
      completed: completed.sort(sortByDueDate),
    };
  };

  const { today, week, month, completed } = categorizeTasks(tasks);

  const renderSection = (title: string, tasks: Task[]) => (
    <View style={styles.section}>
      <ThemedText type='subtitle'>{title}</ThemedText>
      {tasks.length === 0 ? (
        <Text style={styles.emptyText}>No tasks</Text>
      ) : (
        tasks.map(task => (
          <TaskCardToggle
            key={task.id}
            task={task}
            onStatusChange={refetch}
            onDelete={refetch}
          />
        ))
      )}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Absolute Settings Button */}
      <TouchableOpacity
        style={styles.settingsIcon}
        onPress={() => router.push('/settings')}
        accessibilityLabel='Settings'
      >
        <Ionicons name='settings-outline' size={28} color='#444' />
      </TouchableOpacity>

      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
          />
        }
      >
        <ThemedView style={styles.headerRow}>
          <ThemedText type='title'>Resupply</ThemedText>
          <TouchableOpacity
            style={styles.addButtonTop}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonText}>+ Add Task</Text>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          {loading && <Text>Loading...</Text>}
          {error && <Text style={{ color: 'red' }}>{error}</Text>}
          {renderSection('Due Today', today)}
          {renderSection('Due This Week', week)}
          {renderSection('Due This Month', month)}
          {renderSection('Completed', completed)}
        </ThemedView>
      </ParallaxScrollView>

      <Modal visible={modalVisible} animationType='slide' transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Task</Text>

            <TextInput
              style={styles.input}
              placeholder='Task Name'
              value={taskName}
              onChangeText={setTaskName}
            />

            <TextInput
              style={styles.input}
              placeholder='Due Date (YYYY-MM-DD)'
              value={dueDate}
              onChangeText={setDueDate}
            />

            <View style={styles.modalButtons}>
              <Button title='Cancel' onPress={() => setModalVisible(false)} />
              <Button title='Add Task' onPress={handleAddTask} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  addButtonTop: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  section: {
    marginBottom: 24,
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#888',
    marginTop: 8,
  },
  settingsIcon: {
    position: 'absolute',
    top: 48,
    right: 22,
    zIndex: 100,
    padding: 6,
    backgroundColor: '#fff',
    borderRadius: 24,
    elevation: 4,
  },
});
