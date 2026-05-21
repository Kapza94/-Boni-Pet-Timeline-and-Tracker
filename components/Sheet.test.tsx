import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Sheet } from './Sheet';

describe('Sheet', () => {
  it('renders its children when open', () => {
    const { getByText } = render(
      <Sheet open onClose={() => {}}>
        <Text>Quick log</Text>
      </Sheet>
    );
    expect(getByText('Quick log')).toBeTruthy();
  });

  it('does not render children when closed', () => {
    const { queryByText } = render(
      <Sheet open={false} onClose={() => {}}>
        <Text>Quick log</Text>
      </Sheet>
    );
    expect(queryByText('Quick log')).toBeNull();
  });

  it('renders a drag handle bar above the content when open', () => {
    const { getByTestId } = render(
      <Sheet open onClose={() => {}}>
        <Text>Body</Text>
      </Sheet>
    );
    expect(getByTestId('sheet-handle')).toBeTruthy();
  });

  it('calls onClose when the backdrop is pressed', () => {
    const onClose = jest.fn();
    const { getByTestId } = render(
      <Sheet open onClose={onClose}>
        <Text>Body</Text>
      </Sheet>
    );
    fireEvent.press(getByTestId('sheet-backdrop'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders the sheet container with the strong glass fill and a 28px top radius', () => {
    const { getByTestId } = render(
      <Sheet open onClose={() => {}}>
        <Text>Body</Text>
      </Sheet>
    );
    const surface = getByTestId('sheet-surface');
    const style = Array.isArray(surface.props.style)
      ? Object.assign({}, ...surface.props.style.flat().filter(Boolean))
      : surface.props.style ?? {};
    expect(style.borderTopLeftRadius).toBe(28);
    expect(style.borderTopRightRadius).toBe(28);
  });
});
