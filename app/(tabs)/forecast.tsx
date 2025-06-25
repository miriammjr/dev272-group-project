import React, { useState, useCallback } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import {
  addDays,
  formatDistanceToNowStrict,
  isBefore,
  parseISO,
  compareAsc,
} from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';

import { ThemedText } from '@/components/ThemedText';
import { useTasks } from '@/hooks/useTasks';
import { styles as sharedStyles } from '@/styles/styles';

export default function ForecastScreen() {
  const { tasks, loading, error, refetch } = useTasks();
  const [filterNext7Days, setFilterNext7Days] = useState(true);

  useFocusEffect(
    useCallback(() => {
      refetch(); // Refetch tasks when screen is focused
    }, [refetch]),
  );

  // Step 1: Filter to only repeating and uncompleted tasks
  const uncompletedRepeatingTasks = tasks.filter(
    task => task.repeatIn && !task.completed
  );

  // Step 2: Group by taskName and keep only the soonest due task
  const latestTasksMap = new Map();

  uncompletedRepeatingTasks.forEach(task => {
    const existing = latestTasksMap.get(task.taskName);
    const dueDate = parseISO(task.dueDate);

    if (!existing || compareAsc(dueDate, parseISO(existing.dueDate)) < 0) {
      latestTasksMap.set(task.taskName, task);
    }
  });

  // Step 3: Convert to array and apply 7-day filter if needed
  const filteredTasks = Array.from(latestTasksMap.values()).filter(task => {
    if (!filterNext7Days) return true;
    const dueDate = parseISO(task.dueDate);
    return isBefore(dueDate, addDays(new Date(), 7));
  });

  return (
    <ScrollView
      style={Platform.OS === 'web' ? sharedStyles.scrollContainer : undefined}
      contentContainerStyle={
        Platform.OS === 'web' ? sharedStyles.scrollContent : undefined
      }
    >
      <View style={sharedStyles.section}>
        <TouchableOpacity
          style={[
            sharedStyles.filterButton,
            filterNext7Days && sharedStyles.filterActive,
          ]}
          onPress={() => setFilterNext7Days(!filterNext7Days)}
        >
          <ThemedText style={sharedStyles.filterText}>
            {filterNext7Days
              ? 'Showing: Next 7 Days'
              : 'Showing: All Repeating Tasks'}
          </ThemedText>
        </TouchableOpacity>
      </View>

      <View style={sharedStyles.section}>
        {loading && (
          <ActivityIndicator
            size="large"
            color="#3B82F6"
            style={sharedStyles.loader}
          />
        )}
        {error && <ThemedText type="error">{error}</ThemedText>}

        {!loading && filteredTasks.length === 0 && (
          <View style={sharedStyles.emptyState}>
            <ThemedText style={sharedStyles.emptyText}>
              No tasks found in this range.
            </ThemedText>
          </View>
        )}

        {filteredTasks.map(task => {
          const dueIn = formatDistanceToNowStrict(parseISO(task.dueDate), {
            addSuffix: true,
          });

          return (
            <View key={task.id} style={sharedStyles.taskCard}>
              <View style={sharedStyles.cardTop}>
                <ThemedText style={sharedStyles.taskCardName}>
                  {task.taskName}
                </ThemedText>
                <View style={sharedStyles.badge}>
                  <ThemedText style={sharedStyles.badgeText}>
                    Repeats every {task.repeatIn} days
                  </ThemedText>
                </View>
              </View>
              <ThemedText style={sharedStyles.taskCardText}>
                Due {dueIn}
              </ThemedText>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
