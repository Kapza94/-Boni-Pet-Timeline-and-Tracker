import { Pressable, Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { BoniNavBar } from './BoniNavBar';

function flatStyle(node: { props: { style?: unknown } }) {
  const s = node.props.style;
  if (Array.isArray(s)) return Object.assign({}, ...s.flat().filter(Boolean));
  return (s as Record<string, unknown>) ?? {};
}

describe('BoniNavBar', () => {
  it('renders the large title', () => {
    const { getByText } = render(<BoniNavBar title="Today" />);
    expect(getByText('Today')).toBeTruthy();
  });

  it('large title uses 34px bold SF Pro Display', () => {
    const { getByText } = render(<BoniNavBar title="Today" />);
    const style = flatStyle(getByText('Today'));
    expect(style.fontSize).toBe(34);
    expect(style.fontFamily).toBe('SFProDisplay-Bold');
  });

  it('renders the eyebrow above the title when provided', () => {
    const { getByText } = render(
      <BoniNavBar title="Today" eyebrow="Friday · May 22" />
    );
    expect(getByText('FRIDAY · MAY 22')).toBeTruthy();
  });

  it('omits the eyebrow when not provided', () => {
    const { queryByText } = render(<BoniNavBar title="Today" />);
    expect(queryByText(/·/)).toBeNull();
  });

  it('renders the trailing slot when provided', () => {
    const { getByTestId } = render(
      <BoniNavBar
        title="Today"
        trailing={
          <Pressable testID="trailing-btn">
            <Text>+</Text>
          </Pressable>
        }
      />
    );
    expect(getByTestId('trailing-btn')).toBeTruthy();
  });

  it('does not render a trailing container when no trailing element', () => {
    const { queryByTestId } = render(<BoniNavBar title="Today" testID="nav" />);
    expect(queryByTestId('nav-trailing')).toBeNull();
  });

  it('trailing element receives press events', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <BoniNavBar
        title="Today"
        trailing={
          <Pressable testID="trailing-btn" onPress={onPress}>
            <Text>+</Text>
          </Pressable>
        }
      />
    );
    fireEvent.press(getByTestId('trailing-btn'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
