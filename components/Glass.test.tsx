import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { Glass } from './Glass';

const flatten = (style: unknown): Record<string, unknown> => {
  if (!style) return {};
  if (Array.isArray(style)) {
    return Object.assign(
      {},
      ...style.flat().filter(Boolean).map((s) => flatten(s))
    );
  }
  return style as Record<string, unknown>;
};

describe('Glass', () => {
  it('renders its children', () => {
    const { getByText } = render(
      <Glass>
        <Text>Inside</Text>
      </Glass>
    );
    expect(getByText('Inside')).toBeTruthy();
  });

  it('always carries the 1px refraction border (never optional)', () => {
    const { getByTestId } = render(
      <Glass testID="g">
        <Text>x</Text>
      </Glass>
    );
    const style = flatten(getByTestId('g').props.style);
    expect(style.borderWidth).toBe(1);
    expect(style.borderColor).toBe('rgba(255, 255, 255, 0.55)');
  });

  it('uses the stronger refraction border when strength="strong"', () => {
    const { getByTestId } = render(
      <Glass testID="g" strength="strong">
        <Text>x</Text>
      </Glass>
    );
    const style = flatten(getByTestId('g').props.style);
    expect(style.borderColor).toBe('rgba(255, 255, 255, 0.72)');
  });

  it('applies the fill opacity per strength', () => {
    const { getByTestId, rerender } = render(
      <Glass testID="g" strength="thin">
        <Text>x</Text>
      </Glass>
    );
    expect(flatten(getByTestId('g').props.style).backgroundColor).toBe(
      'rgba(255, 255, 255, 0.22)'
    );
    rerender(
      <Glass testID="g" strength="regular">
        <Text>x</Text>
      </Glass>
    );
    expect(flatten(getByTestId('g').props.style).backgroundColor).toBe(
      'rgba(255, 255, 255, 0.40)'
    );
    rerender(
      <Glass testID="g" strength="strong">
        <Text>x</Text>
      </Glass>
    );
    expect(flatten(getByTestId('g').props.style).backgroundColor).toBe(
      'rgba(255, 255, 255, 0.62)'
    );
  });

  it('uses radius="lg" (22px) by default and accepts overrides', () => {
    const { getByTestId, rerender } = render(
      <Glass testID="g">
        <Text>x</Text>
      </Glass>
    );
    expect(flatten(getByTestId('g').props.style).borderRadius).toBe(22);
    rerender(
      <Glass testID="g" radius="xl">
        <Text>x</Text>
      </Glass>
    );
    expect(flatten(getByTestId('g').props.style).borderRadius).toBe(28);
  });

  it('layers the small-tier shadow by default', () => {
    const { getByTestId } = render(
      <Glass testID="g">
        <Text>x</Text>
      </Glass>
    );
    const style = flatten(getByTestId('g').props.style);
    expect(style.shadowOpacity).toBe(0.28);
    expect(style.shadowRadius).toBe(32);
  });

  it('switches to the lg shadow tier when elevation="lg"', () => {
    const { getByTestId } = render(
      <Glass testID="g" elevation="lg">
        <Text>x</Text>
      </Glass>
    );
    const style = flatten(getByTestId('g').props.style);
    expect(style.shadowOpacity).toBe(0.45);
    expect(style.shadowRadius).toBe(100);
  });
});
