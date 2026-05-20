import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { PressableSurface } from './PressableSurface';

describe('PressableSurface', () => {
  it('renders its children', () => {
    const { getByText } = render(
      <PressableSurface onPress={() => {}}>
        <Text>Tap me</Text>
      </PressableSurface>
    );
    expect(getByText('Tap me')).toBeTruthy();
  });

  it('invokes onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <PressableSurface onPress={onPress} testID="surface">
        <Text>Tap</Text>
      </PressableSurface>
    );
    fireEvent.press(getByTestId('surface'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not invoke onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <PressableSurface onPress={onPress} disabled testID="surface">
        <Text>Tap</Text>
      </PressableSurface>
    );
    fireEvent.press(getByTestId('surface'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('exposes button accessibility role by default', () => {
    const { getByTestId } = render(
      <PressableSurface onPress={() => {}} testID="surface">
        <Text>Tap</Text>
      </PressableSurface>
    );
    expect(getByTestId('surface').props.accessibilityRole).toBe('button');
  });

  it('forwards explicit accessibilityLabel', () => {
    const { getByTestId } = render(
      <PressableSurface
        onPress={() => {}}
        accessibilityLabel="Mark walked as done"
        testID="surface"
      >
        <Text>Walked</Text>
      </PressableSurface>
    );
    expect(getByTestId('surface').props.accessibilityLabel).toBe(
      'Mark walked as done'
    );
  });
});
