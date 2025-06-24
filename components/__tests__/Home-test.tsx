import Home from '@/app/(tabs)/home';
import { render, screen } from '@testing-library/react-native';
import React from 'react';

describe('<Home />', () => {
  test('loading text shows', () => {
    render(<Home />);
    expect(screen.getByText('Loading...')).toBeOnTheScreen();
  });

  //   test('summary text shows', async () => {
  //     render(<Auth />);

  //     await fireEvent.changeText(
  //       screen.getByPlaceholderText('Email Address'),
  //       'dev@email.com',
  //     );
  //     await fireEvent.changeText(
  //       screen.getByPlaceholderText('Password'),
  //       'password',
  //     );

  //     await fireEvent.press(screen.getByText('Sign In'));
  //     await router.replace('./index');
  //     await router.replace('/(tabs)/home');
  //     await waitFor(() => {
  //       expect(
  //         screen.getByText("Here's your summary for today."),
  //       ).toBeOnTheScreen();
  //     });
  //   });
});
