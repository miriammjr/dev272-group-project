import React from 'react';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import TaskCard from '@/components/TaskCard';

import { useTasks } from '@/hooks/useTasks';

export default function ForecastScreen() {
  const { tasks, loading, error } = useTasks();

  const repeatingTasks = tasks.filter(
    task => task.repeatIn !== null && task.repeatIn !== undefined,
  );

  return (
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
        <ThemedText type='title'>Forecast</ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        {loading && <ThemedText>Loading...</ThemedText>}
        {error && <ThemedText type='error'>{error}</ThemedText>}
        {!loading && repeatingTasks.length === 0 && (
          <ThemedText>No repeating tasks found.</ThemedText>
        )}

        {repeatingTasks.map(task => (
          <TaskCard
            key={task.id}
            taskName={task.taskName}
            dueDate={task.dueDate}
            repeatIn={task.repeatIn}
          />
        ))}
      </ThemedView>
    </ParallaxScrollView>
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
});
