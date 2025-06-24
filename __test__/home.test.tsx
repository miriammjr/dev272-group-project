// ✅ Mock Supabase before anything else
import Home from '@/app/(tabs)/home';
import * as useTasksHook from '@/hooks/useTasks';
import { render, waitFor } from '@testing-library/react-native';
import React from 'react';

jest.mock('@/hooks/useTasks');

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

const mockTasks = [
  {
    id: 1,
    taskName: 'Test Task 1',
    dueDate: new Date().toISOString(),
    completed: false,
  },
  {
    id: 2,
    taskName: 'Test Task 2',
    dueDate: new Date().toISOString(),
    completed: false,
  },
];

describe('Home Screen', () => {
  beforeEach(() => {
    (useTasksHook.useTasks as jest.Mock).mockReturnValue({
      tasks: mockTasks,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });
  });

  it('renders a list of tasks', async () => {
    const { getByText } = render(<Home />);

    await waitFor(() => {
      expect(getByText('Test Task 1')).toBeTruthy();
      expect(getByText('Test Task 2')).toBeTruthy();
    });
  });
});
