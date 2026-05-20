import { render } from '@testing-library/react-native';
import { Avatar } from './Avatar';

function flatStyle(node: { props: { style?: unknown } }) {
  const s = node.props.style;
  if (Array.isArray(s)) return Object.assign({}, ...s.flat().filter(Boolean));
  return (s as Record<string, unknown>) ?? {};
}

describe('Avatar', () => {
  it('renders the provided initials', () => {
    const { getByText } = render(<Avatar initials="SA" />);
    expect(getByText('SA')).toBeTruthy();
  });

  it('uppercases lowercase initials', () => {
    const { getByText } = render(<Avatar initials="sa" />);
    expect(getByText('SA')).toBeTruthy();
  });

  it('default size is 32px circle', () => {
    const { getByTestId } = render(<Avatar initials="SA" testID="av" />);
    const style = flatStyle(getByTestId('av'));
    expect(style.width).toBe(32);
    expect(style.height).toBe(32);
    expect(style.borderRadius).toBe(16);
  });

  it('accepts numeric size override and keeps the circle (radius = size/2)', () => {
    const { getByTestId } = render(<Avatar initials="SA" size={48} testID="av" />);
    const style = flatStyle(getByTestId('av'));
    expect(style.width).toBe(48);
    expect(style.height).toBe(48);
    expect(style.borderRadius).toBe(24);
  });

  it('uses the provided color as backgroundColor', () => {
    const { getByTestId } = render(
      <Avatar initials="SA" color="oklch(80% 0.115 22)" testID="av" />
    );
    expect(flatStyle(getByTestId('av')).backgroundColor).toBe(
      'oklch(80% 0.115 22)'
    );
  });

  it('does NOT render an active ring by default', () => {
    const { queryByTestId } = render(<Avatar initials="SA" testID="av" />);
    expect(queryByTestId('av-active-ring')).toBeNull();
  });

  it('renders an emerald active ring when active prop is true', () => {
    const { getByTestId } = render(<Avatar initials="SA" active testID="av" />);
    const ring = getByTestId('av-active-ring');
    const style = flatStyle(ring);
    expect(style.borderColor).toContain('165'); // emerald hue
    expect(style.borderWidth).toBeGreaterThan(0);
  });

  it('exposes an accessibilityLabel from name prop', () => {
    const { getByTestId } = render(
      <Avatar initials="SA" name="Sara" testID="av" />
    );
    expect(getByTestId('av').props.accessibilityLabel).toBe('Sara');
  });
});
