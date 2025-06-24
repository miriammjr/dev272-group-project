import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import Auth from '../app/Auth';

jest.mock('../utils/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
      signInWithPassword: jest.fn().mockReturnValue('error'),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn(),
    })),
  },
}));

describe('<Home />', () => {
  jest.spyOn(Alert, 'alert');
  test('Intro text shows', () => {
    render(<Auth />);
    expect(screen.getByText('Welcome Back')).toBeOnTheScreen();
    expect(screen.getByText('Sign in to continue')).toBeOnTheScreen();
  });

  test('Fails if no email/password entered', async () => {
    render(<Auth />);

    fireEvent.changeText(screen.getByPlaceholderText('Email Address'), '');

    fireEvent.press(screen.getByText('Sign In'));
    expect(Alert.alert).toHaveBeenCalledWith(
      'Please enter both email and password.',
    );
  });

  //   test('Fails if bad email/password entered', async () => {
  //     render(<Auth />);

  //     await fireEvent.changeText(
  //       screen.getByPlaceholderText('Email Address'),
  //       'fakeEmail',
  //     );
  //     await fireEvent.changeText(
  //       screen.getByPlaceholderText('Password'),
  //       'fakePassword',
  //     );

  //     await fireEvent.press(screen.getByText('Sign In'));
  //     await waitFor(() => {
  //       expect(Alert.alert).toHaveBeenCalledWith(
  //         'Login Failed',
  //         'Invalid login credentials',
  //       );
  //     });
  //   });

  test('Succeeds if correct email/password entered', async () => {
    render(<Auth />);
    router.replace = jest.fn();
    await fireEvent.changeText(
      screen.getByPlaceholderText('Email Address'),
      'dev@email.com',
    );
    await fireEvent.changeText(
      screen.getByPlaceholderText('Password'),
      'password',
    );

    await fireEvent.press(screen.getByText('Sign In'));
    await waitFor(() => {
      expect(router.replace).toHaveBeenCalled();
    });
  });

  test('Sign up fails if no email/password entered', async () => {
    render(<Auth />);

    fireEvent.changeText(screen.getByPlaceholderText('Email Address'), '');

    fireEvent.press(screen.getByText('Create Account'));
    expect(Alert.alert).toHaveBeenCalledWith(
      'Please enter both email and password.',
    );
  });

  test('Password Visibility', async () => {
    render(<Auth />);

    fireEvent.press(screen.getByAccessibilityHint('Password Hidden'));
    await waitFor(() => {
      expect(screen.getByAccessibilityHint('Password Visible')).toBeTruthy();
    });
  });
});
