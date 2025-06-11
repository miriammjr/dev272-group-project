import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Task {
  id: string;
  name: string;
  frequency: number;
  createdAt: number;
  lastCompletedAt?: number | null;
}

export default function HomeScreen() {
  const router = useRouter();
  const [dueTasks, setDueTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

  // useEffect(() => {
  //   const loadTasks = async () => {
  //     try {
  //       const raw = await AsyncStorage.getItem('tasks');
  //       if (!raw) return;
  //       const allTasks: Task[] = JSON.parse(raw);
  //       const now = Date.now();

  //       const due: Task[] = [];
  //       const done: Task[] = [];

  //       for (const task of allTasks) {
  //         const lastDone = task.lastCompletedAt ?? task.createdAt;
  //         const daysSince = Math.floor(
  //           (now - lastDone) / (1000 * 60 * 60 * 24),
  //         );
  //         if (daysSince >= task.frequency) {
  //           due.push(task);
  //         } else if (daysSince === 0) {
  //           done.push(task);
  //         }
  //       }

  //       setDueTasks(due);
  //       setCompletedTasks(done);
  //     } catch (e) {
  //       console.error('Error loading tasks:', e);
  //     }
  //   };

  //   loadTasks();
  // }, []);
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const choresRaw = await AsyncStorage.getItem('chores');
        const suppliesRaw = await AsyncStorage.getItem('supplies');

        const chores: Task[] = choresRaw ? JSON.parse(choresRaw) : [];
        const supplies: Task[] = suppliesRaw ? JSON.parse(suppliesRaw) : [];
        const allTasks = [...chores, ...supplies];

        const now = Date.now();
        const due: Task[] = [];
        const done: Task[] = [];

        for (const task of allTasks) {
          const lastDone = task.lastCompletedAt ?? task.createdAt ?? now;
          const daysSince = Math.floor(
            (now - lastDone) / (1000 * 60 * 60 * 24),
          );
          if (daysSince >= task.frequency) {
            due.push(task);
          } else if (daysSince === 0) {
            done.push(task);
          }
        }

        setDueTasks(due);
        setCompletedTasks(done);
      } catch (e) {
        console.error('Error loading chores/supplies:', e);
      }
    };

    loadTasks();
  }, []);

  const markAsDone = async (task: Task) => {
    try {
      const raw = await AsyncStorage.getItem('tasks');
      const allTasks: Task[] = raw ? JSON.parse(raw) : [];

      const updatedTasks = allTasks.map(t =>
        t.id === task.id ? { ...t, lastCompletedAt: Date.now() } : t,
      );

      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));

      setDueTasks(prev => prev.filter(t => t.id !== task.id));
      setCompletedTasks(prev => [
        ...prev,
        { ...task, lastCompletedAt: Date.now() },
      ]);
    } catch (e) {
      console.error('Failed to mark task as done', e);
      Alert.alert('Error', 'Something went wrong marking the task as done.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Settings Icon in the top right */}
      <TouchableOpacity
        style={styles.settingsIcon}
        onPress={() => router.push('/settings')}
        accessibilityLabel='Settings'
      >
        <Ionicons name='settings-outline' size={28} color='#444' />
      </TouchableOpacity>
      <Text style={styles.heading}>🏡 Resupply</Text>
      <Text style={styles.subheading}>
        This is what you need to handle today:
      </Text>

      <Text style={styles.sectionTitle}>🛠 Tasks Due</Text>
      {dueTasks.length === 0 ? (
        <Text style={styles.noTasks}>No tasks due today 🎉</Text>
      ) : (
        dueTasks.map(task => (
          <TouchableOpacity
            key={task.id}
            onPress={() => markAsDone(task)}
            style={styles.taskCard}
          >
            <Text style={styles.taskText}>{task.name}</Text>
            <Text style={styles.taskFreq}>Every {task.frequency} days</Text>
            <Text style={styles.mark}>Tap to mark ✅</Text>
          </TouchableOpacity>
        ))
      )}

      <Text style={styles.sectionTitle}>✅ Completed Today</Text>
      {completedTasks.length === 0 ? (
        <Text style={styles.noTasks}>Nothing completed yet</Text>
      ) : (
        completedTasks.map(task => (
          <View key={task.id} style={[styles.taskCard, styles.completedCard]}>
            <Text style={styles.taskText}>{task.name}</Text>
            <Text style={styles.taskFreq}>Done today 🎉</Text>
          </View>
        ))
      )}

      <View style={styles.navButtons}>
        <NavButton
          label='🧹 Daily To Do'
          onPress={() => router.push('/daily-todo')}
        />
        <NavButton
          label='📅 Forecast'
          onPress={() => router.push('/(tabs)/forecast')}
        />
        <NavButton label='🛒 Shop' onPress={() => router.push('/shop')} />
      </View>
    </ScrollView>
  );
}

function NavButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  noTasks: {
    fontSize: 16,
    color: '#888',
    marginVertical: 10,
    textAlign: 'center',
  },
  taskCard: {
    backgroundColor: '#e7f0f7',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  completedCard: {
    backgroundColor: '#d4edda',
  },
  taskText: {
    fontSize: 18,
    fontWeight: '500',
  },
  taskFreq: {
    fontSize: 14,
    color: '#666',
  },
  mark: {
    fontSize: 14,
    color: '#1D3D47',
    marginTop: 4,
  },
  navButtons: {
    marginTop: 32,
    gap: 12,
  },
  button: {
    backgroundColor: '#1D3D47',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  settingsIcon: {
    position: 'absolute',
    top: 18,
    // left: 22,
    right: 22,
    zIndex: 10,
    padding: 6,
    backgroundColor: '#fff',
    borderRadius: 24,
    elevation: 2,
  },
});
