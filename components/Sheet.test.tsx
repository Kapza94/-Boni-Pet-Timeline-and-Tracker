import { createRef } from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { Sheet, type SheetRef } from './Sheet';

describe('Sheet', () => {
  it('renders its children through to the bottom-sheet modal', () => {
    const { getByText } = render(
      <Sheet>
        <Text>sheet body</Text>
      </Sheet>
    );
    expect(getByText('sheet body')).toBeTruthy();
  });

  it('exposes present() and dismiss() on the forwarded ref', () => {
    const ref = createRef<SheetRef>();
    render(
      <Sheet ref={ref}>
        <Text>sheet body</Text>
      </Sheet>
    );
    expect(typeof ref.current?.present).toBe('function');
    expect(typeof ref.current?.dismiss).toBe('function');
  });

  it('calling present() and dismiss() through the ref does not throw', () => {
    const ref = createRef<SheetRef>();
    render(
      <Sheet ref={ref}>
        <Text>sheet body</Text>
      </Sheet>
    );
    expect(() => ref.current?.present()).not.toThrow();
    expect(() => ref.current?.dismiss()).not.toThrow();
  });
});
