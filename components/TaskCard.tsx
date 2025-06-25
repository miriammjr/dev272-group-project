import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { styles as sharedStyles } from '@/styles/styles';

interface TaskCardProps {
  taskName: string;
  repeatIn?: number | null;
  dueDate?: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ taskName, repeatIn }) => {
  return (
    <View style={sharedStyles.taskCard}>
      <ThemedText style={sharedStyles.taskCardName}>{taskName}</ThemedText>
      <ThemedText style={sharedStyles.taskCardText}>
        {repeatIn !== null && repeatIn !== undefined
          ? `Task Frequency: every ${repeatIn} day${repeatIn === 1 ? '' : 's'}`
          : 'No repeat scheduled'}
      </ThemedText>
    </View>
  );
};

export default TaskCard;
