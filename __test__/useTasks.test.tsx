import React from 'react';
import { Text } from 'react-native';
import { render, waitFor, screen } from '@testing-library/react-native';
import { useTasks } from '../hooks/useTasks';
import { supabase } from '../utils/supabase';

jest.mock('../utils/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn(),
    })),
  },
}));

const TestComponent = () => {
  const { tasks, loading, error } = useTasks();

  return (
    <>
      <Text testID='loading'>{loading ? 'Loading' : 'Loaded'}</Text>
      <Text testID='error'>{error ?? ''}</Text>
      {tasks.map((task, index) => (
        <Text key={index} testID={`task-${index}`}>
          {task.title}
        </Text>
      ))}
    </>
  );
};

describe('useTasks (modern test)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches tasks successfully', async () => {
    const mockUser = { id: 'user123' };
    const mockTasks = [{ id: 1, title: 'Test Task' }];

    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ data: mockTasks, error: null }),
    });

    render(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('loading').props.children).toBe('Loaded');
      expect(screen.getByTestId('task-0').props.children).toBe('Test Task');
    });
  });

  it('handles user fetch error', async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: null },
      error: { message: 'User error' },
    });

    render(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('loading').props.children).toBe('Loaded');
      expect(screen.getByTestId('error').props.children).toBe(
        'Failed to get user',
      );
    });
  });

  it('handles task fetch error', async () => {
    const mockUser = { id: 'user123' };

    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest
        .fn()
        .mockResolvedValue({ data: null, error: { message: 'DB error' } }),
    });

    render(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('loading').props.children).toBe('Loaded');
      expect(screen.getByTestId('error').props.children).toBe('DB error');
    });
  });
});
