import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, AccessibilityInfo } from 'react-native';
import {
  Canvas,
  Circle,
  Blur,
  Group,
} from '@shopify/react-native-skia';
import {
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { colors } from '../theme/tokens';

/**
 * AmbientCanvas — the dark canvas with four soft pastel blobs that peek
 * through every Glass surface above it. Sits as the bottom-most layer of
 * any screen. Blobs drift slowly (60s+ cycles) when allowed by
 * Reduce Motion.
 */
export function AmbientCanvas() {
  const { width, height } = useWindowDimensions();
  const drift = useSharedValue(0);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (!mounted || reduce) return;
      drift.value = withRepeat(
        withTiming(1, { duration: 60_000, easing: Easing.inOut(Easing.cubic) }),
        -1,
        true
      );
    });
    return () => {
      mounted = false;
      cancelAnimation(drift);
    };
  }, [drift]);

  const blobRadius = Math.max(width, height) * 0.45;

  return (
    <Canvas style={[StyleSheet.absoluteFill, { backgroundColor: colors.canvas.DEFAULT }]}>
      {/* Lavender — top-left */}
      <Group opacity={0.78}>
        <Circle cx={width * 0.18} cy={height * 0.14} r={blobRadius} color={colors.blob.lavender}>
          <Blur blur={80} />
        </Circle>
      </Group>
      {/* Rose — top-right */}
      <Group opacity={0.62}>
        <Circle cx={width * 0.86} cy={height * 0.22} r={blobRadius * 0.9} color={colors.blob.rose}>
          <Blur blur={90} />
        </Circle>
      </Group>
      {/* Peach — bottom-right */}
      <Group opacity={0.7}>
        <Circle cx={width * 0.82} cy={height * 0.86} r={blobRadius} color={colors.blob.peach}>
          <Blur blur={100} />
        </Circle>
      </Group>
      {/* Sky — bottom-left */}
      <Group opacity={0.6}>
        <Circle cx={width * 0.14} cy={height * 0.78} r={blobRadius * 0.95} color={colors.blob.sky}>
          <Blur blur={95} />
        </Circle>
      </Group>
    </Canvas>
  );
}
