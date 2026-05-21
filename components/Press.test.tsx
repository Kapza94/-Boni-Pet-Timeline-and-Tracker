import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Press } from './Press';

describe('Press', () => {
  it('renders its children', () => {
    const { getByText } = render(
      <Press onPress={() => {}}>
        <Text>Tap me</Text>
      </Press>
    );
    expect(getByText('Tap me')).toBeTruthy();
  });

  it('fires onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Press onPress={onPress} testID="btn">
        <Text>Tap me</Text>
      </Press>
    );
    fireEvent.press(getByTestId('btn'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('forwards user onPressIn / onPressOut callbacks while applying its own animation', () => {
    const userIn = jest.fn();
    const userOut = jest.fn();
    const { getByTestId } = render(
      <Press onPress={() => {}} onPressIn={userIn} onPressOut={userOut} testID="btn">
        <Text>Tap me</Text>
      </Press>
    );
    const btn = getByTestId('btn');
    fireEvent(btn, 'pressIn');
    fireEvent(btn, 'pressOut');
    expect(userIn).toHaveBeenCalledTimes(1);
    expect(userOut).toHaveBeenCalledTimes(1);
  });

  it('does not crash on rapid press-in / press-out cycles', () => {
    const { getByTestId } = render(
      <Press onPress={() => {}} testID="btn">
        <Text>Tap me</Text>
      </Press>
    );
    const btn = getByTestId('btn');
    fireEvent(btn, 'pressIn');
    fireEvent(btn, 'pressOut');
    fireEvent(btn, 'pressIn');
    fireEvent(btn, 'pressOut');
    expect(btn).toBeTruthy();
  });

  it('respects the disabled prop and skips onPress', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Press onPress={onPress} testID="btn" disabled>
        <Text>Tap me</Text>
      </Press>
    );
    fireEvent.press(getByTestId('btn'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
