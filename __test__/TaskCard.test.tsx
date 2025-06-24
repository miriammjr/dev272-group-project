import { render, screen } from '@testing-library/react-native';
import TaskCard from '../components/TaskCard';

describe('<TaskCard />', () => {
  test('Taskname renders correctly in TaskCard', () => {
    render(<TaskCard taskName={'TODO'} repeatIn={''} />);

    expect(screen.getByText(/todo/i)).toBeOnTheScreen();
  });

  test('Task repeated frequency is correct (for 1 day, i.e. no s)', () => {
    render(<TaskCard taskName={'X'} repeatIn={1} />);
    expect(screen.getByText('Task Frequency: every 1 day')).toBeTruthy();
  });

  test('Task repeated frequency is correct for mutliple days', () => {
    render(<TaskCard taskName={'X'} repeatIn={2} />);
    expect(screen.getByText('Task Frequency: every 2 days')).toBeTruthy();
  });

  test('Task repeated frequency is correct for no repeats', () => {
    render(<TaskCard taskName={'X'} repeatIn={undefined} />);
    expect(screen.getByText('No repeat scheduled')).toBeTruthy();
  });
});
