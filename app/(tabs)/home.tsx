import React, { useEffect, useState, useMemo } from 'react';
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  startOfToday,
  parseISO,
  isBefore,
  isToday,
  isThisWeek,
  isThisMonth,
  differenceInDays,
} from 'date-fns';

import { styles as sharedStyles } from '@/styles/styles';
import AddTaskModal from '@/components/AddTaskModal';
import TaskSection from '@/components/TaskSection';
import { ThemedText } from '@/components/ThemedText';
import { useAddTask } from '@/hooks/useAddTask';
import { useDeleteTask } from '@/hooks/useDeleteTask';
import { useTasks } from '@/hooks/useTasks';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning!';
  if (hour < 18) return 'Good afternoon!';
  return 'Good evening!';
};

interface Task {
  id: number;
  taskName: string;
  dueDate: string;
  completed: boolean;
  frequency?: number;
  lastCompletedAt?: string | null;
  shouldRepeat?: boolean;
  repeatIn?: number;
  type?: string;
}

export default function Home() {
  const { tasks: fetchedTasks, loading, error, refetch } = useTasks();
  const { addTask } = useAddTask(refetch);
  const { deleteTask } = useDeleteTask();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setTasks(fetchedTasks);
  }, [fetchedTasks]);

  const handleAddTask = async (
    taskName: string,
    dueDate: string,
    isRepeating: boolean,
    repeatDays: number | null,
    taskType: string,
  ) => {
    try {
      await addTask({
        taskName,
        dueDate,
        shouldRepeat: isRepeating,
        repeatIn: repeatDays ?? undefined,
        type: taskType,
      });
      setModalVisible(false);
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const handleDeleteTask = async (id: number) => {
    const success = await deleteTask(id);
    if (success) {
      setTasks(prev => prev.filter(task => task.id !== id));
    } else {
      console.warn('Failed to delete task from Supabase:', id);
    }
  };

  const categorizeTasks = (tasks: Task[]) => {
    const today: Task[] = [];
    const week: Task[] = [];
    const month: Task[] = [];
    const completed: Task[] = [];
    const overdue: Task[] = [];

    const now = new Date();
    const todayStart = startOfToday();

    tasks.forEach(task => {
      if (task.completed) return completed.push(task);

      const due = parseISO(task.dueDate);

      if (task.frequency && task.lastCompletedAt) {
        const lastDone = parseISO(task.lastCompletedAt);
        if (differenceInDays(now, lastDone) >= task.frequency) {
          return today.push(task);
        }
      }

      if (isBefore(due, todayStart)) return overdue.push(task);
      if (isToday(due)) return today.push(task);
      if (isThisWeek(due, { weekStartsOn: 1 })) return week.push(task);
      if (isThisMonth(due)) return month.push(task);
    });

    const sortByDueDate = (a: Task, b: Task) =>
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();

    return {
      sections: [
        { title: 'Due Today', data: [...overdue, ...today].sort(sortByDueDate) },
        { title: 'Due This Week', data: week.sort(sortByDueDate) },
        { title: 'Due This Month', data: month.sort(sortByDueDate) },
        { title: 'Completed', data: completed.sort(sortByDueDate) },
      ],
      overdueCount: overdue.length,
    };
  };

  const { sections, overdueCount } = useMemo(() => categorizeTasks(tasks), [tasks]);

  return (
    <>
      <ScrollView
        style={Platform.OS === 'web' ? sharedStyles.scrollContainer : undefined}
        contentContainerStyle={Platform.OS === 'web' ? sharedStyles.scrollContent : undefined}
      >
        {loading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
        ) : (
          <>
            <View style={sharedStyles.section}>
              <ThemedText type="title" style={sharedStyles.greetingText}>
                {getGreeting()}
              </ThemedText>
              <ThemedText style={sharedStyles.subGreetingText}>
                Here’s your summary for today.
              </ThemedText>

              <View style={sharedStyles.statsRow}>
                <View style={sharedStyles.statCard}>
                  <ThemedText style={sharedStyles.statNumber}>
                    {sections[1].data.length}
                  </ThemedText>
                  <ThemedText style={sharedStyles.statLabel}>Due this week</ThemedText>
                </View>
                <View style={sharedStyles.statCard}>
                  <ThemedText
                    style={[
                      sharedStyles.statNumber,
                      overdueCount > 0 && sharedStyles.overdueText,
                    ]}
                  >
                    {overdueCount}
                  </ThemedText>
                  <ThemedText style={sharedStyles.statLabel}>Overdue</ThemedText>
                </View>
              </View>

              <ThemedText style={sharedStyles.progressLabel}>
                Monthly Progress: {sections[3].data.length} / {tasks.length} tasks
              </ThemedText>
              <View style={sharedStyles.progressContainer}>
                <View
                  style={[
                    sharedStyles.progressBar,
                    {
                      width: `${
                        tasks.length > 0
                          ? (sections[3].data.length / tasks.length) * 100
                          : 0
                      }%`,
                    },
                  ]}
                />
              </View>
            </View>

            {sections.map((section) => (
              <TaskSection
                key={section.title}
                title={section.title}
                tasks={section.data}
                onStatusChange={refetch}
                onDelete={handleDeleteTask}
              />
            ))}
          </>
        )}
      </ScrollView>

      <TouchableOpacity
        style={sharedStyles.addButtonBottom}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={sharedStyles.addButtonText}>Add Task</Text>
      </TouchableOpacity>

      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddTask={handleAddTask}
      />
    </>
  );
}
