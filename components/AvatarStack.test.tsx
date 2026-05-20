import { render } from '@testing-library/react-native';
import { AvatarStack } from './AvatarStack';

describe('AvatarStack', () => {
  const people = [
    { initials: 'SA', name: 'Sara', color: 'oklch(80% 0.115 22)' },
    { initials: 'LU', name: 'Luka', color: 'oklch(82% 0.105 55)' },
    { initials: 'JO', name: 'Jo', color: 'oklch(80% 0.095 230)' },
  ];

  it('renders each person initially', () => {
    const { getByText } = render(<AvatarStack people={people} />);
    expect(getByText('SA')).toBeTruthy();
    expect(getByText('LU')).toBeTruthy();
    expect(getByText('JO')).toBeTruthy();
  });

  it('caps visible avatars at max and shows a +N badge for the rest', () => {
    const five = [
      ...people,
      { initials: 'AL', name: 'Al' },
      { initials: 'NI', name: 'Ni' },
    ];
    const { getByText, queryByText } = render(<AvatarStack people={five} max={3} />);
    expect(getByText('SA')).toBeTruthy();
    expect(getByText('LU')).toBeTruthy();
    expect(getByText('JO')).toBeTruthy();
    expect(getByText('+2')).toBeTruthy();
    expect(queryByText('AL')).toBeNull();
    expect(queryByText('NI')).toBeNull();
  });

  it('renders nothing when given an empty list', () => {
    const { toJSON } = render(<AvatarStack people={[]} />);
    expect(toJSON()).toBeNull();
  });

  it('passes through the size to each avatar', () => {
    const { getByTestId } = render(
      <AvatarStack people={[people[0]]} size={48} testID="stack" />
    );
    const av = getByTestId('stack-avatar-0');
    const style = Array.isArray(av.props.style)
      ? Object.assign({}, ...av.props.style.flat().filter(Boolean))
      : av.props.style ?? {};
    expect(style.width).toBe(48);
  });
});
