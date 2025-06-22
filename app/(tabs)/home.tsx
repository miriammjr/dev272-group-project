import { Ionicons } from '@expo/vector-icons';
import {
  differenceInDays,
  isBefore,
  isThisMonth,
  isThisWeek,
  isToday,
  parseISO,
  startOfToday,
} from 'date-fns';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import AddTaskModal from '@/components/AddTaskModal';
import TaskCardToggle from '@/components/TaskCardToggle';
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
    console.log('Attempting to delete task with id:', id);
    const success = await deleteTask(id);
    console.log('Delete task result:', success);
    if (success) {
      setTasks(prev => prev.filter(task => task.id !== id));
      console.log('Task removed from local state:', id);
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
      today: [...overdue, ...today].sort(sortByDueDate),
      week: week.sort(sortByDueDate),
      month: month.sort(sortByDueDate),
      completed: completed.sort(sortByDueDate),
      overdueCount: overdue.length,
    };
  };

  const { today, week, month, completed, overdueCount } =
    categorizeTasks(tasks);

  const renderSection = (title: string, tasksToRender: Task[]) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <ThemedText type='subtitle'>{title}</ThemedText>
        <View style={styles.taskCountBadge}>
          <Text style={styles.taskCountText}>{tasksToRender.length}</Text>
        </View>
      </View>

      {tasksToRender.length === 0 ? (
        <Text style={styles.emptyText}>No tasks in this section.</Text>
      ) : (
        tasksToRender.map(task => (
          <TaskCardToggle
            key={task.id}
            task={task}
            onStatusChange={refetch}
            onDelete={handleDeleteTask}
          />
        ))
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {loading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
        ) : (
          <>
            <View style={styles.dashboardContainer}>
              <ThemedText type='title' style={styles.greetingText}>
                {getGreeting()}
              </ThemedText>
              <ThemedText style={styles.subGreetingText}>
                Here’s your summary for today.
              </ThemedText>

              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <ThemedText style={styles.statNumber}>
                    {week.length}
                  </ThemedText>
                  <ThemedText style={styles.statLabel}>
                    Due this week
                  </ThemedText>
                </View>
                <View style={styles.statCard}>
                  <ThemedText
                    style={[
                      styles.statNumber,
                      overdueCount > 0 && styles.overdueText,
                    ]}
                  >
                    {overdueCount}
                  </ThemedText>
                  <ThemedText style={styles.statLabel}>Overdue</ThemedText>
                </View>
              </View>

              <ThemedText style={styles.progressLabel}>
                Monthly Progress: {completed.length} / {tasks.length} tasks
              </ThemedText>
              <View style={styles.progressContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${
                        tasks.length > 0
                          ? (completed.length / tasks.length) * 100
                          : 0
                      }%`,
                    },
                  ]}
                />
              </View>
            </View>

            {renderSection('Due Today', today)}
            {renderSection('Due This Week', week)}
            {renderSection('Due This Month', month)}
            {renderSection('Completed', completed)}
          </>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButtonBottom}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name='add' size={24} color='#fff' />
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>

      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddTask={handleAddTask}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  dashboardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  greetingText: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  subGreetingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  overdueText: {
    color: '#EF4444',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  progressLabel: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    fontWeight: '500',
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3B82F6',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskCountBadge: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  taskCountText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 12,
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#6B7280',
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  addButtonBottom: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
