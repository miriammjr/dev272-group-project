import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

interface Task {
  id: string;
  name: string;
  frequency: number;
  createdAt: number;
  lastCompletedAt?: number | null;
}

export default function ToDoScreen() {
  const [dueTasks, setDueTasks] = useState<Task[]>([]);

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

        for (const task of allTasks) {
          const lastDone = task.lastCompletedAt ?? task.createdAt ?? now;
          const daysSince = Math.floor(
            (now - lastDone) / (1000 * 60 * 60 * 24),
          );
          if (daysSince >= task.frequency) {
            due.push(task);
          }
        }

        setDueTasks(due);
      } catch (e) {
        console.error('Error loading tasks:', e);
      }
    };

    loadTasks();
  }, []);

  const markAsDone = async (task: Task) => {
    try {
      const updatedTask = { ...task, lastCompletedAt: Date.now() };
      // For supply, you may want to use a different prefix or pass a flag in management.tsx
      // Here, let's treat everything as chores except if it only exists in supplies
      const choresRaw = await AsyncStorage.getItem('chores');
      const suppliesRaw = await AsyncStorage.getItem('supplies');
      let found = false;

      if (choresRaw) {
        let chores: Task[] = JSON.parse(choresRaw);
        if (chores.some(t => t.id === task.id)) {
          chores = chores.map(t => (t.id === task.id ? updatedTask : t));
          await AsyncStorage.setItem('chores', JSON.stringify(chores));
          found = true;
        }
      }
      if (!found && suppliesRaw) {
        let supplies: Task[] = JSON.parse(suppliesRaw);
        if (supplies.some(t => t.id === task.id)) {
          supplies = supplies.map(t => (t.id === task.id ? updatedTask : t));
          await AsyncStorage.setItem('supplies', JSON.stringify(supplies));
        }
      }
      setDueTasks(prev => prev.filter(t => t.id !== task.id));
    } catch (e) {
      Alert.alert('Error', 'Could not mark task as done');
    }
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>📝 Today To-Do</Text>

      {dueTasks.length === 0 ? (
        <Text style={{ marginTop: 16 }}>All caught up! 🎉</Text>
      ) : (
        dueTasks.map(task => (
          <TouchableOpacity
            key={task.id}
            style={styles.card}
            onPress={() => markAsDone(task)}
          >
            <Text style={styles.cardText}>{task.name}</Text>
            <Text style={styles.sub}>Tap to mark as complete ✅</Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginTop: 12,
    padding: 16,
    borderRadius: 10,
    elevation: 2,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
  },
  sub: {
    color: 'gray',
    marginTop: 4,
  },
});
