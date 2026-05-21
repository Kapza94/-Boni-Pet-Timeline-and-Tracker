import { render } from '@testing-library/react-native';
import { AvatarStack } from './AvatarStack';

const PEOPLE = [
  { initials: 'SC', color: 'oklch(88% 0.10 290)' },
  { initials: 'JT', color: 'oklch(88% 0.10 25)' },
  { initials: 'RM', color: 'oklch(88% 0.10 230)', active: true },
];

describe('AvatarStack', () => {
  it('renders one avatar per person', () => {
    const { getByText } = render(<AvatarStack people={PEOPLE} />);
    expect(getByText('SC')).toBeTruthy();
    expect(getByText('JT')).toBeTruthy();
    expect(getByText('RM')).toBeTruthy();
  });

  it('overlaps subsequent avatars by -8px (first has no negative margin)', () => {
    const { getAllByTestId } = render(
      <AvatarStack people={PEOPLE} itemTestID="slot" />
    );
    const slots = getAllByTestId('slot');
    expect(slots).toHaveLength(3);
    const firstStyle = flatten(slots[0].props.style);
    const secondStyle = flatten(slots[1].props.style);
    const thirdStyle = flatten(slots[2].props.style);
    expect(firstStyle.marginLeft ?? 0).toBe(0);
    expect(secondStyle.marginLeft).toBe(-8);
    expect(thirdStyle.marginLeft).toBe(-8);
  });

  it('forwards the active flag to the matching avatar', () => {
    const { getByText } = render(<AvatarStack people={PEOPLE} />);
    const activeNode = getByText('RM');
    let node = activeNode.parent;
    let style = flatten(node?.props.style);
    while (node && style.borderColor === undefined) {
      node = node.parent;
      style = flatten(node?.props.style);
    }
    expect(style.borderColor).toBe('oklch(72% 0.155 165)');
  });

  it('passes the size prop down to each avatar (via initials font scale)', () => {
    const { getByText } = render(<AvatarStack people={PEOPLE} size={50} />);
    const node = getByText('SC');
    const style = flatten(node.props.style);
    expect(style.fontSize).toBe(18);
  });
});

function flatten(style: unknown): Record<string, unknown> {
  if (!style) return {};
  if (Array.isArray(style)) {
    return Object.assign(
      {},
      ...style.flat().filter(Boolean).map((s) => flatten(s))
    );
  }
  return style as Record<string, unknown>;
}
