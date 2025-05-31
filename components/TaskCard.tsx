import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TaskCard = ({ taskName, timeRemaining }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.taskName}>{taskName}</Text>
      <Text style={styles.timeRemaining}>Repeat in: {timeRemaining}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  timeRemaining: {
    fontSize: 14,
    color: '#666',
  },
});

export default TaskCard;
