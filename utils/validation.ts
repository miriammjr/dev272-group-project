export interface TaskValidationErrors {
  taskName: string;
  repeatDays: string;
}

export function validateTaskInput(
  taskName: string,
  isRepeating: boolean,
  repeatDays: string,
): TaskValidationErrors {
  const errors: TaskValidationErrors = { taskName: '', repeatDays: '' };

  if (!taskName.trim()) {
    errors.taskName = 'Task name is required.';
  }

  if (isRepeating) {
    if (!/^\d+$/.test(repeatDays)) {
      errors.repeatDays = 'Repeat interval must be a whole number.';
    } else {
      const repeatDaysInt = parseInt(repeatDays, 10);
      if (repeatDaysInt < 1) {
        errors.repeatDays = 'Repeat interval must be at least 1.';
      }
    }
  }

  return errors;
}
