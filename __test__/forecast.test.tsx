import ForecastScreen from '@/app/(tabs)/forecast';
import * as useTasksHook from '@/hooks/useTasks';
import { render, screen } from '@testing-library/react-native';
import React from 'react';

// Mock navigation focus behavior
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useFocusEffect: (cb: any) => cb(), // Immediately invoke the callback
}));

jest.mock('@/hooks/useTasks');

const mockRefetch = jest.fn();

const mockTasks = [
  {
    id: 1,
    taskName: 'Test Task 1',
    dueDate: new Date().toISOString(),
    repeatIn: 3,
    completed: false,
  },
  {
    id: 2,
    taskName: 'Test Task 2',
    dueDate: new Date().toISOString(),
    repeatIn: 5,
    completed: false,
  },
];

describe('<ForecastScreen />', () => {
  beforeEach(() => {
    (useTasksHook.useTasks as jest.Mock).mockReturnValue({
      tasks: mockTasks,
      loading: false,
      error: null,
      refetch: mockRefetch,
    });
  });

  test('shows next 7 days filter label', () => {
    render(<ForecastScreen />);
    expect(screen.getByText('Showing: Next 7 Days')).toBeTruthy();
  });

  test('renders repeating tasks', () => {
    render(<ForecastScreen />);
    expect(screen.getByText('Test Task 1')).toBeTruthy();
    expect(screen.getByText('Test Task 2')).toBeTruthy();
  });

  test('calls refetch on focus', () => {
    render(<ForecastScreen />);
    expect(mockRefetch).toHaveBeenCalled();
  });
});
