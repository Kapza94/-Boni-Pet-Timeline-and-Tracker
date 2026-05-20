import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { Eyebrow } from './Eyebrow';

describe('Eyebrow', () => {
  it('renders its string content in uppercase', () => {
    const { getByText } = render(<Eyebrow>Friday · May 22</Eyebrow>);
    expect(getByText('FRIDAY · MAY 22')).toBeTruthy();
  });

  it('passes through non-string children unchanged', () => {
    const { getByText } = render(
      <Eyebrow>
        <Text testID="inner">already mixed Case</Text>
      </Eyebrow>
    );
    expect(getByText('already mixed Case')).toBeTruthy();
  });

  it('applies eyebrow typography (uppercase via style, tracked, near-white)', () => {
    const { getByText } = render(<Eyebrow>Active care</Eyebrow>);
    const node = getByText('ACTIVE CARE');
    const style = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.flat().filter(Boolean))
      : node.props.style ?? {};
    expect(style.fontFamily).toBe('SFProDisplay-Medium');
    expect(style.fontSize).toBe(11);
    expect(style.letterSpacing).toBeGreaterThan(0);
    expect(style.textTransform).toBe('uppercase');
  });

  it('switches to on-glass color when onGlass prop is set', () => {
    const { getByText } = render(<Eyebrow onGlass>Next up</Eyebrow>);
    const node = getByText('NEXT UP');
    const style = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.flat().filter(Boolean))
      : node.props.style ?? {};
    expect(style.color).toBe('oklch(58% 0.010 270)');
  });
});
