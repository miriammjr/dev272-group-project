import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddTaskModal from '@/components/AddTaskModal';
import { validateTaskInput } from '@/utils/validation';

jest.mock('@/hooks/useSupplyShoppingRedirect', () => {
  return {
    useSupplyShoppingRedirect: () => ({
      promptAndRedirect: jest.fn(),
    }),
  };
});

jest.mock('@/utils/validation', () => ({
  validateTaskInput: jest.fn(),
}));

describe('AddTaskModal', () => {
  let onCloseMock: jest.Mock;
  let onAddTaskMock: jest.Mock;

  beforeEach(() => {
    onCloseMock = jest.fn();
    onAddTaskMock = jest.fn();
    jest.clearAllMocks();
  });

  it('renders correctly when visible', () => {
    (validateTaskInput as jest.Mock).mockReturnValue({
      taskName: '',
      repeatDays: '',
    });

    const { getByPlaceholderText } = render(
      <AddTaskModal
        visible={true}
        onClose={onCloseMock}
        onAddTask={onAddTaskMock}
      />,
    );

    expect(getByPlaceholderText('Task Name (e.g., Buy milk)')).toBeTruthy();
  });

  it('calls onAddTask and onClose on valid submit', async () => {
    (validateTaskInput as jest.Mock).mockReturnValue({
      taskName: '',
      repeatDays: '',
    });

    const { getByPlaceholderText, getByText } = render(
      <AddTaskModal
        visible={true}
        onClose={onCloseMock}
        onAddTask={onAddTaskMock}
      />,
    );

    fireEvent.changeText(
      getByPlaceholderText('Task Name (e.g., Buy milk)'),
      'Buy eggs',
    );
    fireEvent.press(getByText('Add Task'));

    await waitFor(() => {
      expect(onAddTaskMock).toHaveBeenCalled();
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  it('shows validation error if taskName is empty', async () => {
    (validateTaskInput as jest.Mock).mockReturnValueOnce({
      taskName: 'Task name is required',
      repeatDays: '',
    });

    const { getByText } = render(
      <AddTaskModal
        visible={true}
        onClose={onCloseMock}
        onAddTask={onAddTaskMock}
      />,
    );

    fireEvent.press(getByText('Add Task'));

    await waitFor(() => {
      expect(onAddTaskMock).not.toHaveBeenCalled();
      expect(getByText('Task name is required')).toBeTruthy();
    });
  });

  it('triggers promptAndRedirect for supply task', async () => {
    (validateTaskInput as jest.Mock).mockReturnValue({
      taskName: '',
      repeatDays: '',
    });

    const { getByPlaceholderText, getByText } = render(
      <AddTaskModal
        visible={true}
        onClose={onCloseMock}
        onAddTask={onAddTaskMock}
      />,
    );

    fireEvent.changeText(
      getByPlaceholderText('Task Name (e.g., Buy milk)'),
      'Buy soap',
    );
    fireEvent.press(getByText('supply')); // switch task type
    fireEvent.press(getByText('Add Task'));

    await waitFor(() => {
      expect(onAddTaskMock).toHaveBeenCalled();
    });
  });
});
