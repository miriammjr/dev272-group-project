import ForecastScreen from '@/app/(tabs)/forecast';
import * as useTasksHook from '@/hooks/useTasks';
import { render, screen } from '@testing-library/react-native';
jest.mock('@/hooks/useTasks');
jest.mock('../utils/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn().mockReturnThis(),
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

describe('<ForecastScreen />', () => {
  beforeEach(() => {
    (useTasksHook.useTasks as jest.Mock).mockReturnValue({
      tasks: mockTasks,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });
  });
  test('shows next 7 days', () => {
    render(<ForecastScreen />);
    expect(screen.getByText('Showing: Next 7 Days')).toBeOnTheScreen();
  });
});
