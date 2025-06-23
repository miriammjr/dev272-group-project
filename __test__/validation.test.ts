import { validateTaskInput } from '../utils/validation';

describe('validateTaskInput', () => {
  it('should return error if task name is empty', () => {
    const result = validateTaskInput('', false, '');
    expect(result.taskName).toBe('Task name is required.');
    expect(result.repeatDays).toBe('');
  });

  it('should return no errors for valid non-repeating task', () => {
    const result = validateTaskInput('Buy groceries', false, '');
    expect(result.taskName).toBe('');
    expect(result.repeatDays).toBe('');
  });

  it('should return error if repeatDays is not a number when repeating', () => {
    const result = validateTaskInput('Workout', true, 'abc');
    expect(result.taskName).toBe('');
    expect(result.repeatDays).toBe('Repeat interval must be a whole number.');
  });

  it('should return error if repeatDays is less than 1', () => {
    const result = validateTaskInput('Workout', true, '0');
    expect(result.taskName).toBe('');
    expect(result.repeatDays).toBe('Repeat interval must be at least 1.');
  });

  it('should return no errors for valid repeating task', () => {
    const result = validateTaskInput('Workout', true, '3');
    expect(result.taskName).toBe('');
    expect(result.repeatDays).toBe('');
  });

  it('should trim task name before validation', () => {
    const result = validateTaskInput('   ', false, '');
    expect(result.taskName).toBe('Task name is required.');
  });
});
