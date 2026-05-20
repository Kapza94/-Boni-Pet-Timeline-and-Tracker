import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { Glass } from './Glass';

function flatStyle(node: { props: { style?: unknown } }) {
  const s = node.props.style;
  if (Array.isArray(s)) return Object.assign({}, ...s.flat().filter(Boolean));
  return (s as Record<string, unknown>) ?? {};
}

describe('Glass (characterization — locks F00 contract)', () => {
  it('renders its children', () => {
    const { getByText } = render(
      <Glass>
        <Text>inside glass</Text>
      </Glass>
    );
    expect(getByText('inside glass')).toBeTruthy();
  });

  it('always carries the 1px white refraction border (non-negotiable)', () => {
    const { getByTestId } = render(
      <Glass testID="g">
        <Text>x</Text>
      </Glass>
    );
    const style = flatStyle(getByTestId('g'));
    expect(style.borderWidth).toBe(1);
    expect(style.borderColor).toBe('rgba(255, 255, 255, 0.55)');
  });

  it('strong strength uses the stronger white border + fill', () => {
    const { getByTestId } = render(
      <Glass strength="strong" testID="g">
        <Text>x</Text>
      </Glass>
    );
    const style = flatStyle(getByTestId('g'));
    expect(style.borderColor).toBe('rgba(255, 255, 255, 0.72)');
    expect(style.backgroundColor).toBe('rgba(255, 255, 255, 0.62)');
  });

  it('default radius is lg (22px); xl and 2xl propagate', () => {
    const { getByTestId, rerender } = render(
      <Glass testID="g">
        <Text>x</Text>
      </Glass>
    );
    expect(flatStyle(getByTestId('g')).borderRadius).toBe(22);

    rerender(
      <Glass radius="xl" testID="g">
        <Text>x</Text>
      </Glass>
    );
    expect(flatStyle(getByTestId('g')).borderRadius).toBe(28);

    rerender(
      <Glass radius="2xl" testID="g">
        <Text>x</Text>
      </Glass>
    );
    expect(flatStyle(getByTestId('g')).borderRadius).toBe(36);
  });

  it('elevation tiers escalate shadow opacity + radius', () => {
    const { getByTestId, rerender } = render(
      <Glass elevation="sm" testID="g">
        <Text>x</Text>
      </Glass>
    );
    const sm = flatStyle(getByTestId('g'));

    rerender(
      <Glass elevation="md" testID="g">
        <Text>x</Text>
      </Glass>
    );
    const md = flatStyle(getByTestId('g'));

    rerender(
      <Glass elevation="lg" testID="g">
        <Text>x</Text>
      </Glass>
    );
    const lg = flatStyle(getByTestId('g'));

    expect((md.shadowOpacity as number) ?? 0).toBeGreaterThan(
      (sm.shadowOpacity as number) ?? 0
    );
    expect((lg.shadowOpacity as number) ?? 0).toBeGreaterThan(
      (md.shadowOpacity as number) ?? 0
    );
    expect((md.shadowRadius as number) ?? 0).toBeGreaterThan(
      (sm.shadowRadius as number) ?? 0
    );
  });
});
