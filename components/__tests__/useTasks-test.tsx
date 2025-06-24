import { renderHook } from '@testing-library/react';
import { useTasks } from '../../hooks/useTasks';

describe('useTasks', () => {
  global.fetch = jest.fn();

  test('inital states', () => {
    const { result } = renderHook(() => useTasks());
    const { tasks, loading, error } = result.current;
    expect(tasks).toBeNull();
  });
});
