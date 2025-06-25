import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  Platform,
} from 'react-native';
import {
  addDays,
  formatDistanceToNowStrict,
  isBefore,
  parseISO,
} from 'date-fns';

import { ThemedText } from '@/components/ThemedText';
import { useTasks } from '@/hooks/useTasks';
import { styles as sharedStyles } from '@/styles/styles';

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
            size='large'
            color='#3B82F6'
            style={sharedStyles.loader}
          />
        )}
        {error && <ThemedText type='error'>{error}</ThemedText>}

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
