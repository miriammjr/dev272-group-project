import { ThemedText } from '@/components/ThemedText';
import { useTasks } from '@/hooks/useTasks';
import {
  addDays,
  formatDistanceToNowStrict,
  isBefore,
  parseISO,
} from 'date-fns';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ForecastScreen() {
  const { tasks, loading, error } = useTasks();
  const [filterNext7Days, setFilterNext7Days] = useState(true);

  const repeatingTasks = tasks.filter(task => task.repeatIn);

  const filteredTasks = repeatingTasks.filter(task => {
    if (!filterNext7Days) return true;
    const dueDate = parseISO(task.dueDate);
    return isBefore(dueDate, addDays(new Date(), 7));
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <ThemedText type='title' style={styles.title}>
          Forecast
        </ThemedText>
        <TouchableOpacity
          style={[styles.filterButton, filterNext7Days && styles.filterActive]}
          onPress={() => setFilterNext7Days(!filterNext7Days)}
        >
          <ThemedText style={styles.filterText}>
            {filterNext7Days
              ? 'Showing: Next 7 Days'
              : 'Showing: All Repeating Tasks'}
          </ThemedText>
        </TouchableOpacity>
      </View>

      {loading && (
        <ActivityIndicator size='large' color='#3B82F6' style={styles.loader} />
      )}
      {error && <ThemedText type='error'>{error}</ThemedText>}

      {!loading && filteredTasks.length === 0 && (
        <View style={styles.emptyState}>
          <ThemedText style={styles.emptyText}>
            No tasks found in this range.
          </ThemedText>
        </View>
      )}

      {filteredTasks.map(task => {
        const dueIn = formatDistanceToNowStrict(parseISO(task.dueDate), {
          addSuffix: true,
        });

        return (
          <View key={task.id} style={styles.card}>
            <View style={styles.cardTop}>
              <ThemedText style={styles.taskName}>{task.taskName}</ThemedText>
              <View style={styles.badge}>
                <ThemedText style={styles.badgeText}>
                  Repeats every {task.repeatIn} days
                </ThemedText>
              </View>
            </View>
            <ThemedText style={styles.dueText}>Due {dueIn}</ThemedText>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  filterButton: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  filterActive: {
    backgroundColor: '#3B82F6',
  },
  filterText: {
    color: '#111827',
    fontSize: 13,
  },
  loader: {
    marginTop: 20,
  },
  emptyState: {
    marginTop: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  taskName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  badge: {
    backgroundColor: '#D1FAE5',
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  badgeText: {
    fontSize: 12,
    color: '#047857',
  },
  dueText: {
    fontSize: 14,
    color: '#6B7280',
  },
});
