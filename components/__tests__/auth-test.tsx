import { describe, expect, test } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import Auth from '../../app/Auth';

test('Just to make sure jest is installed', () => {
  expect(1 + 2).toEqual(3);
});

describe('Login', () => {
  render(<Auth />);
  expect(screen.getByText('Log In')).toBeTruthy();
});
