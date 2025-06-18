import {
  ScrollView,
  Button,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
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
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

import TaskCardToggle from '@/components/TaskCardToggle';
import { ThemedText } from '@/components/ThemedText';

import { useAddTask } from '@/hooks/useAddTask';
import { useTasks } from '@/hooks/useTasks';

interface Task {
  id: number;
  taskName: string;
  dueDate: string;
  completed: boolean;
  frequency?: number;
  lastCompletedAt?: string | null;
  shouldRepeat?: boolean;
  repeatIn?: number;
}

interface DashboardMetricsProps {
  tasks: Task[];
  overdueCount: number;
  weekCount: number;
}

interface EmptyStateProps {
  title: 'Due Today' | 'Due This Week' | 'Due This Month' | 'Completed';
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning!';
  if (hour < 18) return 'Good afternoon!';
  return 'Good evening!';
};

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  tasks,
  overdueCount,
  weekCount,
}) => {
  const completedCount = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  return (
    <View style={styles.dashboardContainer}>
      <ThemedText type='title' style={styles.greetingText}>
        {getGreeting()}
      </ThemedText>
      <ThemedText style={styles.subGreetingText}>
        Here’s your summary for today.
      </ThemedText>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>{weekCount}</ThemedText>
          <ThemedText style={styles.statLabel}>Due this week</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText
            style={[styles.statNumber, overdueCount > 0 && styles.overdueText]}
          >
            {overdueCount}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Overdue</ThemedText>
        </View>
      </View>

      <View>
        <ThemedText style={styles.progressLabel}>
          Monthly Progress: {completedCount} / {totalTasks} tasks
        </ThemedText>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </View>
    </View>
  );
};

const EmptyState: React.FC<EmptyStateProps> = ({ title }) => {
  const messages = {
    'Due Today': {
      icon: 'cafe-outline',
      text: 'All clear for today! Enjoy the peace.',
    },
    'Due This Week': {
      icon: 'calendar-outline',
      text: 'Nothing due this week. Plan ahead or relax!',
    },
    'Due This Month': {
      icon: 'moon-outline',
      text: 'No tasks scheduled for this month.',
    },
    Completed: {
      icon: 'checkmark-done-circle-outline',
      text: 'Let’s get it done! Completed tasks will appear here.',
    },
  };
  const { icon, text } = messages[title];

  return (
    <View style={styles.emptyStateContainer}>
      <Ionicons name={icon as any} size={32} color='#9CA3AF' />
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
};

const SkeletonLoader = () => (
  <View style={styles.stepLoaderContainer}>
    {[...Array(3)].map((_, index) => (
      <View
        key={index}
        style={[styles.section, { backgroundColor: '#E5E7EB' }]}
      >
        <View
          style={[
            styles.skeletonLine,
            { width: '40%', height: 20, marginBottom: 15 },
          ]}
        />
        <View style={[styles.skeletonLine, { width: '90%', height: 40 }]} />
        <View
          style={[
            styles.skeletonLine,
            { width: '70%', height: 40, marginTop: 10 },
          ]}
        />
      </View>
    ))}
  </View>
);

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
      await addTask({ taskName, dueDate: utcDate.toISOString() });
      setModalVisible(false);
      setTaskName('');
      setDueDate('');
    } catch (err) {
      console.error('Error adding task:', err);
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
        if (differenceInDays(now, lastDone) >= task.frequency)
          return today.push(task);
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

  const renderSection = (
    title: 'Due Today' | 'Due This Week' | 'Due This Month' | 'Completed',
    tasksToRender: Task[],
  ) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <ThemedText type='subtitle'>{title}</ThemedText>
        <View style={styles.taskCountBadge}>
          <Text style={styles.taskCountText}>{tasksToRender.length}</Text>
        </View>
      </View>

      {tasksToRender.length === 0 ? (
        <EmptyState title={title} />
      ) : (
        tasksToRender.map(task => (
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
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <ThemedText type='title'>🏡 Resupply</ThemedText>
        <TouchableOpacity
          onPress={() => router.push('/settings')}
          accessibilityLabel='Settings'
        >
          <Ionicons name='settings-outline' size={24} color='#374151' />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {loading ? (
          <SkeletonLoader />
        ) : error ? (
          <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
        ) : (
          <>
            <DashboardMetrics
              tasks={tasks}
              overdueCount={overdueCount}
              weekCount={week.length}
            />
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

      <Modal
        visible={modalVisible}
        animationType='fade'
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Task</Text>
            <TextInput
              style={styles.input}
              placeholder='Task Name (e.g., Buy milk)'
              placeholderTextColor='#9CA3AF'
              value={taskName}
              onChangeText={setTaskName}
            />
            <TextInput
              style={styles.input}
              placeholder='Due Date (YYYY-MM-DD)'
              placeholderTextColor='#9CA3AF'
              value={dueDate}
              onChangeText={setDueDate}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={handleAddTask}
              >
                <Text style={styles.addButtonModalText}>Add Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    backgroundColor: 'transparent',
  },
  settingsIcon: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  // Dashboard Metrics
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
    color: '#EF4444', // Red for overdue tasks
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
    backgroundColor: '#3B82F6', // Vibrant blue for progress
  },

  // Task Sections
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16, // Use marginBottom for consistent spacing
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

  // Empty State & Skeleton
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#6B7280',
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  skeletonLine: {
    backgroundColor: '#D1D5DB',
    borderRadius: 4,
    height: 16,
  },

  // Floating Add Button
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

  // Modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.6)', // Darker overlay
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '70%',
    // maxWidth: 400,
    gap: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 10,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#2563EB',
  },
  addButtonModalText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
