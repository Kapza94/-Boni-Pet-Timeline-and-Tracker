import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { Canvas, Circle, Blur, Group } from '@shopify/react-native-skia';
import {
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { colors } from '../theme/tokens';
import { useReduceMotion } from '../hooks/useReduceMotion';

/**
 * AmbientCanvas — the dark canvas with four soft pastel blobs that peek
 * through every Glass surface above it. Sits as the bottom-most layer of
 * any screen. Blobs drift slowly (60s+ cycles); the drift stays parked
 * whenever Reduce Motion is on (and starts/stops live as the user
 * flips the OS setting).
 */
export function AmbientCanvas() {
  const { width, height } = useWindowDimensions();
  const reduceMotion = useReduceMotion();
  const drift = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      cancelAnimation(drift);
      drift.value = 0;
      return;
    }
    drift.value = withRepeat(
      withTiming(1, { duration: 60_000, easing: Easing.inOut(Easing.cubic) }),
      -1,
      true
    );
    return () => {
      cancelAnimation(drift);
    };
  }, [reduceMotion, drift]);

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
