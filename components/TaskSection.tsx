import React from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import TaskCardToggle from '@/components/TaskCardToggle';
import { styles as sharedStyles } from '@/styles/styles';

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

interface TaskSectionProps {
  title: string;
  tasks: Task[];
  onStatusChange: () => void;
  onDelete: (id: number) => void;
}

const TaskSection: React.FC<TaskSectionProps> = ({
  title,
  tasks,
  onStatusChange,
  onDelete,
}) => {
  return (
    <View style={sharedStyles.section}>
      <View style={sharedStyles.sectionHeader}>
        <ThemedText type='subtitle'>{title}</ThemedText>
        <View style={sharedStyles.taskCountBadge}>
          <ThemedText style={sharedStyles.taskCountText}>
            {tasks.length}
          </ThemedText>
        </View>
      </View>

      {tasks.length === 0 ? (
        <ThemedText style={sharedStyles.emptyText}>
          No tasks in this section.
        </ThemedText>
      ) : (
        tasks.map(task => (
          <TaskCardToggle
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        ))
      )}
    </View>
  );
};

export default TaskSection;
