import { useEffect } from 'react';
import {
  Pressable,
  type PressableProps,
  type ViewStyle,
  AccessibilityInfo,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { durations, easings } from '../theme/tokens';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type PressableSurfaceProps = PressableProps & {
  /** Disable the scale + shadow press animation (e.g. for inert tiles). */
  noPressFeedback?: boolean;
};

/**
 * PressableSurface — the design system's standard press feedback wrapper.
 * Press = scale(0.98) + a small shadow drop over 140ms `ease-out-soft`
 * (per spec). Respects Reduce Motion by skipping the animation.
 *
 * Use this in place of bare `Pressable` for every interactive surface
 * that doesn't already supply its own pressed treatment (toggle cards
 * handle their own emerald drift, for example).
 */
export function PressableSurface({
  style,
  onPressIn,
  onPressOut,
  noPressFeedback = false,
  accessibilityRole = 'button',
  children,
  ...rest
}: PressableSurfaceProps) {
  const scale = useSharedValue(1);
  const shadow = useSharedValue(0);
  const reduceMotion = useSharedValue(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((r) => {
      if (mounted) reduceMotion.value = r;
    });
    return () => {
      mounted = false;
    };
  }, [reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: 0.18 * shadow.value,
    shadowRadius: 6 * shadow.value,
    shadowOffset: { width: 0, height: 2 * shadow.value },
    shadowColor: '#000',
  }));

  const handlePressIn = (e: Parameters<NonNullable<PressableProps['onPressIn']>>[0]) => {
    if (!noPressFeedback && !reduceMotion.value) {
      const opts = {
        duration: durations.quick,
        easing: Easing.bezier(...easings.outSoft),
      };
      scale.value = withTiming(0.98, opts);
      shadow.value = withTiming(1, opts);
    }
    onPressIn?.(e);
  };

  const handlePressOut = (
    e: Parameters<NonNullable<PressableProps['onPressOut']>>[0]
  ) => {
    if (!noPressFeedback && !reduceMotion.value) {
      const opts = {
        duration: durations.quick,
        easing: Easing.bezier(...easings.outSoft),
      };
      scale.value = withTiming(1, opts);
      shadow.value = withTiming(0, opts);
    }
    onPressOut?.(e);
  };

  return (
    <AnimatedPressable
      {...rest}
      accessibilityRole={accessibilityRole}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle as ViewStyle, style as ViewStyle]}
    >
      {children as React.ReactNode}
    </AnimatedPressable>
  );
}
