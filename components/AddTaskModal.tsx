import React, { useState, useEffect } from 'react';
import {
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Switch,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { validateTaskInput, TaskValidationErrors } from '../utils/validation';

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onAddTask: (
    taskName: string,
    dueDate: string,
    isRepeating: boolean,
    repeatDays: number | null,
    taskType: 'chore' | 'supply',
  ) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  visible,
  onClose,
  onAddTask,
}) => {
  const [taskName, setTaskName] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [repeatDays, setRepeatDays] = useState('');
  const [taskType, setTaskType] = useState<'chore' | 'supply'>('chore');
  const [errors, setErrors] = useState<TaskValidationErrors>({ taskName: '', repeatDays: '' });
const [dateInput, setDateInput] = useState('');
const [dateError, setDateError] = useState('');


  const formatDate = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };

useEffect(() => {
  if (visible) {
    const now = new Date();
    setDate(now);
    setDateInput(formatDate(now));
    setDateError('');
  }
}, [visible]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSubmit = () => {
    const validationErrors = validateTaskInput(taskName, isRepeating, repeatDays);
    const hasError = Object.values(validationErrors).some(error => error !== '');

    setErrors(validationErrors);
    if (hasError) return;

    const isoDueDate = date.toISOString();
    const repeatDaysInt = parseInt(repeatDays, 10);

    onAddTask(
      taskName,
      isoDueDate,
      isRepeating,
      isRepeating ? repeatDaysInt : null,
      taskType,
    );

    setTaskName('');
    setDate(new Date());
    setIsRepeating(false);
    setRepeatDays('');
    setTaskType('chore');
    setErrors({ taskName: '', repeatDays: '' });
    onClose();
  };

  const dueDate = formatDate(date);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New Task</Text>

          <TextInput
            style={styles.input}
            placeholder="Task Name (e.g., Buy milk)"
            placeholderTextColor="#9CA3AF"
            value={taskName}
            onChangeText={setTaskName}
          />
          {errors.taskName ? <Text style={styles.errorText}>{errors.taskName}</Text> : null}

          {Platform.OS === 'web' ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Due Date (MM-DD-YYYY)"
                placeholderTextColor="#9CA3AF"
                value={dateInput}
                onChangeText={(text) => {
                  setDateInput(text);
                  const [month, day, year] = text.split('-');
                  const parsedDate = new Date(`${year}-${month}-${day}`);
                  if (
                    /^\d{2}-\d{2}-\d{4}$/.test(text) &&
                    !isNaN(parsedDate.getTime())
                  ) {
                    setDate(parsedDate);
                    setDateError('');
                  } else {
                    setDateError('Please enter a valid date in MM-DD-YYYY format.');
                  }
                }}
              />
              {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => setShowPicker(true)}
                style={styles.input}
              >
                <Text style={{ color: formatDate(date) ? '#111827' : '#9CA3AF' }}>
                  {formatDate(date) || 'Select Due Date'}
                </Text>
              </TouchableOpacity>
              {showPicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </>
          )}


          <View style={styles.rowContainer}>
            <View style={styles.taskTypeContainer}>
              <Text style={styles.switchLabel}>Task Type</Text>
              <View style={styles.typeButtons}>
                {['chore', 'supply'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      taskType === type && styles.typeButtonSelected,
                    ]}
                    onPress={() => setTaskType(type as 'chore' | 'supply')}
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        taskType === type && styles.typeButtonTextSelected,
                      ]}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.switchRight}>
              <Text style={styles.switchLabel}>Repeat Task?</Text>
              <Switch value={isRepeating} onValueChange={setIsRepeating} />
            </View>
          </View>

          {isRepeating && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Repeat every X days"
                placeholderTextColor="#9CA3AF"
                value={repeatDays}
                onChangeText={setRepeatDays}
                keyboardType="numeric"
              />
              {errors.repeatDays ? (
                <Text style={styles.errorText}>{errors.repeatDays}</Text>
              ) : null}
            </>
          )}

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.addButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.addButtonModalText}>Add Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddTaskModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.6)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '70%',
    gap: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    marginTop: 4,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  taskTypeContainer: {
    flex: 1,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  typeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F3F4F6',
  },
  typeButtonSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  typeButtonText: {
    color: '#111827',
    fontWeight: '500',
  },
  typeButtonTextSelected: {
    color: '#FFFFFF',
  },
  switchRight: {
    alignItems: 'flex-end',
  },
  switchLabel: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 10,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#2563EB',
  },
  addButtonModalText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
