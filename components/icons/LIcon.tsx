import type { ComponentType } from 'react';
import * as Lucide from 'lucide-react-native';
import type { LucideProps } from 'lucide-react-native';
import { colors } from '../../theme/tokens';

// Lucide v1 doesn't expose an `icons` map; it ships each glyph as a
// named export. We index it as a Record<string, ComponentType<LucideProps>>
// to look up by name string. The full set is pulled in — see
// "Bundle policy" in CLAUDE.md if this becomes a payload concern.
const LucideMap = Lucide as unknown as Record<string, ComponentType<LucideProps>>;

export type LIconName = Exclude<
  keyof typeof Lucide,
  'createLucideIcon' | 'Icon' | 'IconNode' | 'LucideProps' | 'LucideIcon'
>;

type Surface = 'glass' | 'canvas' | 'active';
type SizePreset = 'tab' | 'row' | 'inline' | 'chip';

const SIZE: Record<SizePreset, number> = {
  tab: 22,
  row: 20,
  inline: 18,
  chip: 16,
};

const COLOR_FOR: Record<Surface, string> = {
  glass: colors.onGlass[2] as string,
  canvas: colors.ink[2] as string,
  active: colors.emerald[500] as string,
};

type LIconProps = {
  name: LIconName;
  size?: SizePreset | number;
  surface?: Surface;
  color?: string;
  strokeWidth?: number;
  testID?: string;
};

/**
 * LIcon — Lucide outline icon wrapper. Outline only (system uses no
 * filled variants in chrome). Default stroke 1.5px; bumps to 2px on
 * the active state per spec.
 */
export function LIcon({
  name,
  size = 'row',
  surface = 'glass',
  color,
  strokeWidth,
  testID,
}: LIconProps) {
  const Icon = LucideMap[name as string];
  if (!Icon) {
    if (__DEV__) console.warn(`[LIcon] unknown name: ${String(name)}`);
    return null;
  }
  const px = typeof size === 'number' ? size : SIZE[size];
  const resolvedColor = color ?? COLOR_FOR[surface];
  const resolvedStroke = strokeWidth ?? (surface === 'active' ? 2 : 1.5);
  return (
    <Icon
      size={px}
      color={resolvedColor}
      strokeWidth={resolvedStroke}
      testID={testID}
    />
  );
}
