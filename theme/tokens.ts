/**
 * Boni design tokens — JS mirror of tailwind.config.js.
 * Use these for Skia paints, Reanimated values, native shadows — anywhere
 * NativeWind classes can't reach.
 */

export const colors = {
  canvas: {
    DEFAULT: 'oklch(22% 0.022 270)',
    deep: 'oklch(15% 0.018 270)',
    soft: 'oklch(28% 0.020 270)',
  },
  blob: {
    lavender: 'oklch(78% 0.135 290)',
    rose: 'oklch(80% 0.115 22)',
    peach: 'oklch(82% 0.105 55)',
    sky: 'oklch(80% 0.095 230)',
  },
  ink: {
    1: 'oklch(98% 0.004 80)',
    2: 'rgba(255, 255, 255, 0.78)',
    3: 'rgba(255, 255, 255, 0.58)',
    4: 'rgba(255, 255, 255, 0.38)',
    5: 'rgba(255, 255, 255, 0.16)',
  },
  onGlass: {
    1: 'oklch(22% 0.014 270)',
    2: 'oklch(40% 0.012 270)',
    3: 'oklch(58% 0.010 270)',
    4: 'oklch(75% 0.008 270)',
  },
  glass: {
    DEFAULT: 'rgba(255, 255, 255, 0.40)',
    strong: 'rgba(255, 255, 255, 0.62)',
    thin: 'rgba(255, 255, 255, 0.22)',
  },
  glassBorder: {
    DEFAULT: 'rgba(255, 255, 255, 0.55)',
    strong: 'rgba(255, 255, 255, 0.72)',
  },
  emerald: {
    300: 'oklch(86% 0.090 165)',
    400: 'oklch(80% 0.130 165)',
    500: 'oklch(72% 0.155 165)',
    600: 'oklch(62% 0.150 165)',
    glow: 'oklch(80% 0.14 165 / 0.55)',
  },
  honey: {
    300: 'oklch(83.5% 0.110 68)',
    400: 'oklch(76.5% 0.135 65)',
    500: 'oklch(70.0% 0.150 60)',
    600: 'oklch(62.0% 0.145 55)',
  },
  ambient: {
    warn: 'oklch(82% 0.13 70 / 0.55)',
    attention: 'oklch(80% 0.14 25 / 0.55)',
    info: 'oklch(80% 0.12 230 / 0.55)',
  },
} as const;

export const radii = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 22,
  xl: 28,
  '2xl': 36,
  pill: 999,
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
} as const;

export const durations = {
  quick: 140,
  base: 240,
  slow: 420,
  ambient: 900,
} as const;

export const easings = {
  outSoft: [0.22, 0.61, 0.36, 1] as const,
  inOutSoft: [0.45, 0, 0.2, 1] as const,
  spring: [0.34, 1.36, 0.64, 1] as const,
};

export const glassBlur = {
  thin: 12,
  regular: 24,
  strong: 36,
} as const;

export const glassSaturate = 1.7;

export const shadows = {
  pressOffset: { width: 0, height: 2 },
  pressOpacity: 0.18,
  pressRadius: 6,
} as const;
