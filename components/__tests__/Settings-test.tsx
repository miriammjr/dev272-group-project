import SettingsScreen from '@/app/settings';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';

describe('<SettingsScreen />', () => {
  test('Title shows', () => {
    render(<SettingsScreen />);

    expect(screen.getByText('Settings')).toBeOnTheScreen();
  });

  test('Save button works', async () => {
    jest.spyOn(Alert, 'alert');
    render(<SettingsScreen />);
    fireEvent.changeText(screen.getByPlaceholderText('Name your home'), 'TEST');
    fireEvent.press(screen.getByText('Save Settings'));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Saved!',
        'Your settings were saved.',
      );
    });
  });

  test('Time picker', async () => {
    render(<SettingsScreen />);
    fireEvent.press(screen.getByAccessibilityHint('Time Picker Button'));
    await waitFor(() => {
      expect(screen.getByAccessibilityHint('Time Picker')).toBeOnTheScreen();
    });
  });

  test('logout', async () => {
    render(<SettingsScreen />);
    fireEvent.press(screen.getByText('Logout'));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Logged Out',
        'You have been logged out.',
      );
    });
  });

  // cannot see how this function works on my devices so unsure what it's supposed to look like
  //   test('changes time', async () => {
  //     render(<SettingsScreen />);
  //     fireEvent.press(screen.getByAccessibilityHint('Time Picker Button'));
  //     fireEvent.changeText(
  //       screen.getByAccessibilityHint('Time Picker'),
  //       Date.now() + 1,
  //     );
  //     await waitFor(() => {
  //       expect(
  //         screen.getByAccessibilityHint('Time Picker'),
  //       ).not.toBeOnTheScreen();
  //     });
  //   });
});
