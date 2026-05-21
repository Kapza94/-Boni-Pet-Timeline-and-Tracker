import { Pressable, type PressableProps, type GestureResponderEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { durations } from '../theme/tokens';

type PressProps = PressableProps & {
  children?: React.ReactNode;
};

/**
 * Press — base interactive primitive. Applies the spec's press feedback
 * (scale 0.98 + soft shadow, 140ms ease-out) on press-in and restores
 * on press-out. Use this anywhere a tap is the primary affordance.
 */
export function Press({
  children,
  onPressIn,
  onPressOut,
  style,
  ...rest
}: PressProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = (e: GestureResponderEvent) => {
    scale.value = withTiming(0.98, {
      duration: durations.quick,
      easing: Easing.out(Easing.cubic),
    });
    onPressIn?.(e);
  };

  const handlePressOut = (e: GestureResponderEvent) => {
    scale.value = withTiming(1, {
      duration: durations.quick,
      easing: Easing.out(Easing.cubic),
    });
    onPressOut?.(e);
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        {...rest}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={style}
      >
        {children as React.ReactNode}
      </Pressable>
    </Animated.View>
  );
}
