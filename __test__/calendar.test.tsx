import CalendarScreen from '@/app/(tabs)/calendar';
import * as useTasksHook from '@/hooks/useTasks';
import { NavigationContext } from '@react-navigation/native';
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

describe('<CalendarScreen />', () => {
  const navContext = {
    isFocused: () => true,
    addListener: jest.fn(() => jest.fn()),
  };
  beforeEach(() => {
    (useTasksHook.useTasks as jest.Mock).mockReturnValue({
      tasks: mockTasks,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });
  });
  test('loads date', async () => {
    render(
      <NavigationContext.Provider value={navContext}>
        <CalendarScreen />
      </NavigationContext.Provider>,
    );

    expect(
      screen.getByText(
        '📝 Tasks for ' + new Date().toLocaleDateString('en-CA'),
      ),
    ).toBeOnTheScreen();
  });
});
