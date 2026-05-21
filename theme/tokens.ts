/**
 * Boni design tokens — JS mirror of tailwind.config.js.
 *
 * Source-of-truth in `/tmp/boni-design/extracted/boni/project/colors_and_type.css`
 * uses `oklch(...)` for everything. React Native's
 * `@react-native/normalize-colors` returns `null` for oklch (parser
 * supports only hex / rgb / rgba / hsl / hsla / named colors), so these
 * values are math-derived sRGB hex equivalents. The mapping is locked
 * here — when a designer-side oklch changes, recompute via the script
 * in `theme/oklch.ts` (or any oklch→sRGB tool) and update.
 *
 * Use these for Skia paints, Reanimated values, native shadows — and
 * anywhere NativeWind classes can't reach.
 */

export const colors = {
  canvas: {
    // oklch(22% 0.022 270)
    DEFAULT: '#171a25',
    // oklch(15% 0.018 270)
    deep: '#080b13',
    // oklch(28% 0.020 270)
    soft: '#252933',
  },
  blob: {
    // oklch(78% 0.135 290)
    lavender: '#b6a8ff',
    // oklch(80% 0.115 22)
    rose: '#ff9f9c',
    // oklch(82% 0.105 55)
    peach: '#f9b281',
    // oklch(80% 0.095 230)
    sky: '#7ac9ef',
  },
  ink: {
    // oklch(98% 0.004 80)
    1: '#faf8f5',
    2: 'rgba(255, 255, 255, 0.78)',
    3: 'rgba(255, 255, 255, 0.58)',
    4: 'rgba(255, 255, 255, 0.38)',
    5: 'rgba(255, 255, 255, 0.16)',
  },
  onGlass: {
    // oklch(22% 0.014 270)
    1: '#181a21',
    // oklch(40% 0.012 270)
    2: '#45474e',
    // oklch(58% 0.010 270)
    3: '#787a80',
    // oklch(75% 0.008 270)
    4: '#acaeb3',
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
    // oklch(86% 0.090 165)
    300: '#97e4c2',
    // oklch(80% 0.130 165)
    400: '#5ed8a9',
    // oklch(72% 0.155 165)
    500: '#00c28c',
    // oklch(62% 0.150 165)
    600: '#00a16f',
    // oklch(80% 0.14 165 / 0.55)
    glow: 'rgba(81, 218, 167, 0.55)',
  },
  honey: {
    // oklch(83.5% 0.110 68)
    300: '#f9bb78',
    // oklch(76.5% 0.135 65)
    400: '#ed9f4c',
    // oklch(70.0% 0.150 60)
    500: '#e18528',
    // oklch(62.0% 0.145 55)
    600: '#c76a18',
  },
  ambient: {
    // oklch(82% 0.13 70 / 0.55)
    warn: 'rgba(250, 180, 95, 0.55)',
    // oklch(80% 0.14 25 / 0.55)
    attention: 'rgba(255, 152, 144, 0.55)',
    // oklch(80% 0.12 230 / 0.55)
    info: 'rgba(96, 204, 252, 0.55)',
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
