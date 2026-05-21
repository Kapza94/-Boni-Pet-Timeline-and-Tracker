import { render } from '@testing-library/react-native';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('renders the initials', () => {
    const { getByText } = render(<Avatar initials="MK" />);
    expect(getByText('MK')).toBeTruthy();
  });

  it('uses a circular wrapper sized to the size prop', () => {
    const { getByTestId } = render(
      <Avatar initials="SC" testID="av" size={48} />
    );
    const node = getByTestId('av');
    const style = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.flat().filter(Boolean))
      : node.props.style ?? {};
    expect(style.width).toBe(48);
    expect(style.height).toBe(48);
    expect(style.borderRadius).toBe(24);
  });

  it('applies the color prop as the background', () => {
    const { getByTestId } = render(
      <Avatar initials="JT" testID="av" color="#d6cdff" />
    );
    const node = getByTestId('av');
    const style = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.flat().filter(Boolean))
      : node.props.style ?? {};
    expect(style.backgroundColor).toBe('#d6cdff');
  });

  it('falls back to a neutral background when no color is provided', () => {
    const { getByTestId } = render(<Avatar initials="RM" testID="av" />);
    const node = getByTestId('av');
    const style = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.flat().filter(Boolean))
      : node.props.style ?? {};
    expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0.06)');
  });

  it('scales the initials font with size (size * 0.36)', () => {
    const { getByText } = render(<Avatar initials="SC" size={50} />);
    const node = getByText('SC');
    const style = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.flat().filter(Boolean))
      : node.props.style ?? {};
    expect(style.fontSize).toBe(18);
  });

  it('shows an emerald ring when active', () => {
    const { getByTestId } = render(
      <Avatar initials="SC" testID="av" active />
    );
    const node = getByTestId('av');
    const style = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.flat().filter(Boolean))
      : node.props.style ?? {};
    expect(style.borderColor).toBe('#00c28c');
    expect(style.borderWidth).toBe(2);
  });

  it('uses a translucent white ring when not active', () => {
    const { getByTestId } = render(
      <Avatar initials="SC" testID="av" />
    );
    const node = getByTestId('av');
    const style = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.flat().filter(Boolean))
      : node.props.style ?? {};
    expect(style.borderColor).toBe('rgba(255, 255, 255, 0.7)');
    expect(style.borderWidth).toBe(2);
  });
});
