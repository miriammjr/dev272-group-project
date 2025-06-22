import { render, screen } from '@testing-library/react-native';
import TaskCard from '../TaskCard';

describe('<TaskCard />', () => {
  test('Taskname renders correctly in TaskCard', () => {
    render(<TaskCard taskName={'TODO'} repeatIn={''} />);

    expect(screen.getByText(/todo/i)).toBeOnTheScreen();
  });
});
