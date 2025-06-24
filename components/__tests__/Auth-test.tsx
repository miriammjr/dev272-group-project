import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { Alert } from 'react-native';
import Auth from '../../app/Auth';

describe('<Home />', () => {
  test('Intro text shows', () => {
    render(<Auth />);
    expect(screen.getByText('Welcome Back')).toBeOnTheScreen();
    expect(screen.getByText('Sign in to continue')).toBeOnTheScreen();
  });

  test('Fails if no email/password entered', async () => {
    jest.spyOn(Alert, 'alert');
    render(<Auth />);

    fireEvent.changeText(screen.getByPlaceholderText('Email Address'), '');

    fireEvent.press(screen.getByText('Sign In'));
    expect(Alert.alert).toHaveBeenCalledWith(
      'Please enter both email and password.',
    );
  });

  test('Fails if bad email/password entered', async () => {
    jest.spyOn(Alert, 'alert');
    render(<Auth />);

    await fireEvent.changeText(
      screen.getByPlaceholderText('Email Address'),
      'fakeEmail@email.com',
    );
    await fireEvent.changeText(
      screen.getByPlaceholderText('Password'),
      'fakePassword',
    );

    await fireEvent.press(screen.getByText('Sign In'));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Login Failed',
        'Invalid login credentials',
      );
    });
  });

  // UNSURE HOW TO DO :

  // test('Succeeds if correct email/password entered', async () => {
  //   render(<Auth />);
  //   await fireEvent.changeText(
  //     screen.getByPlaceholderText('Email Address'),
  //     'dev@email.com',
  //   );
  //   await fireEvent.changeText(
  //     screen.getByPlaceholderText('Password'),
  //     'password',
  //   );

  //   await fireEvent.press(screen.getByText('Sign In'));
  //   await waitFor(() => {
  //     expect(router.replace).toHaveBeenCalled();
  //   });
  // });

  test('Sign up fails if no email/password entered', async () => {
    jest.spyOn(Alert, 'alert');
    render(<Auth />);

    fireEvent.changeText(screen.getByPlaceholderText('Email Address'), '');

    fireEvent.press(screen.getByText('Create Account'));
    expect(Alert.alert).toHaveBeenCalledWith(
      'Please enter both email and password.',
    );
  });

  test('Sign up fails if bad email/password entered', async () => {
    jest.spyOn(Alert, 'alert');
    render(<Auth />);

    await fireEvent.changeText(
      screen.getByPlaceholderText('Email Address'),
      'notanemail',
    );
    await fireEvent.changeText(
      screen.getByPlaceholderText('Password'),
      'fakePassword',
    );
    fireEvent.press(screen.getByText('Create Account'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Signup Failed');
    });
  });
});
