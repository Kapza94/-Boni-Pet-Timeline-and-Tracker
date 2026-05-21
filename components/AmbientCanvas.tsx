import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { Canvas, Circle, Blur, Group, Rect } from '@shopify/react-native-skia';
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
 * AmbientCanvas — dark canvas with four soft pastel blobs that peek
 * through every Glass surface above it. Sits as the bottom-most layer
 * of any screen.
 *
 * Visual recipe mirrors the design source: blobs paint over the deep
 * canvas variant, then a translucent dark overlay knocks them back so
 * the page reads as "dark with subtle color washes" instead of a
 * pastel light-mode panel. Lavender is the dominant note; rose / peach
 * are kept low-opacity so the screen never drifts pink.
 *
 * Drift cycles 60s+ when Reduce Motion is off; parks instantly when on.
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
    <Canvas style={[StyleSheet.absoluteFill, { backgroundColor: colors.canvas.deep }]}>
      {/* Lavender — top-left, dominant note */}
      <Group opacity={0.55}>
        <Circle cx={width * 0.12} cy={height * 0.14} r={blobRadius} color={colors.blob.lavender}>
          <Blur blur={90} />
        </Circle>
      </Group>
      {/* Peach — top-right, low opacity so it warms without pinking */}
      <Group opacity={0.22}>
        <Circle cx={width * 0.88} cy={height * 0.22} r={blobRadius * 0.85} color={colors.blob.peach}>
          <Blur blur={95} />
        </Circle>
      </Group>
      {/* Sky — bottom-right, cool counterweight to the lavender */}
      <Group opacity={0.32}>
        <Circle cx={width * 0.86} cy={height * 0.90} r={blobRadius * 0.95} color={colors.blob.sky}>
          <Blur blur={95} />
        </Circle>
      </Group>
      {/* Rose — bottom-left, kept faint per the "never pink" rule */}
      <Group opacity={0.18}>
        <Circle cx={width * 0.16} cy={height * 0.88} r={blobRadius * 0.9} color={colors.blob.rose}>
          <Blur blur={100} />
        </Circle>
      </Group>
      {/* Dark overlay — knocks the whole field back toward the dark canvas */}
      <Rect x={0} y={0} width={width} height={height} color={colors.canvas.DEFAULT} opacity={0.55} />
    </Canvas>
  );
}
