import { render, fireEvent } from '@testing-library/react-native';
import { BoniNavBar } from './BoniNavBar';

describe('BoniNavBar', () => {
  it('renders the title in the large-title style (34px bold)', () => {
    const { getByText } = render(<BoniNavBar title="Today" />);
    const node = getByText('Today');
    const style = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.flat().filter(Boolean))
      : node.props.style ?? {};
    expect(style.fontSize).toBe(34);
    expect(style.fontFamily).toBe('SFProDisplay-Bold');
  });

  it('renders the eyebrow uppercased above the title when provided', () => {
    const { getByText } = render(
      <BoniNavBar eyebrow="Friday · May 22" title="Today" />
    );
    expect(getByText('FRIDAY · MAY 22')).toBeTruthy();
    expect(getByText('Today')).toBeTruthy();
  });

  it('omits the eyebrow node when no eyebrow prop is provided', () => {
    const { queryByTestId } = render(<BoniNavBar title="Settings" />);
    expect(queryByTestId('bonibar-eyebrow')).toBeNull();
  });

  it('renders a trailing icon button when trailingIcon is provided', () => {
    const { getByTestId } = render(
      <BoniNavBar title="Today" trailingIcon="Settings" />
    );
    expect(getByTestId('bonibar-trailing')).toBeTruthy();
  });

  it('calls onTrailing when the trailing button is pressed', () => {
    const onTrailing = jest.fn();
    const { getByTestId } = render(
      <BoniNavBar title="Today" trailingIcon="Settings" onTrailing={onTrailing} />
    );
    fireEvent.press(getByTestId('bonibar-trailing'));
    expect(onTrailing).toHaveBeenCalledTimes(1);
  });

  it('does not render the trailing button when trailingIcon is omitted', () => {
    const { queryByTestId } = render(<BoniNavBar title="Today" />);
    expect(queryByTestId('bonibar-trailing')).toBeNull();
  });
});
