/**
 * Text style presets. Pair with NativeWind className for layout; use these
 * for font-family + size + leading + tracking + weight combinations that
 * recur across screens.
 */

import type { TextStyle } from 'react-native';

const display = 'SFProDisplay-Regular';
const displayMedium = 'SFProDisplay-Medium';
const displayBold = 'SFProDisplay-Bold';
const editorial = 'InstrumentSerif_400Regular';
const editorialItalic = 'InstrumentSerif_400Regular_Italic';

export const text = {
  // Large titles (iOS nav)
  largeTitle: {
    fontFamily: displayBold,
    fontSize: 34,
    lineHeight: 37,
    letterSpacing: -0.748,
    color: 'oklch(98% 0.004 80)',
  },
  title1: {
    fontFamily: displayBold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.336,
    color: 'oklch(98% 0.004 80)',
  },
  title2: {
    fontFamily: displayBold,
    fontSize: 24,
    lineHeight: 29,
    letterSpacing: -0.288,
    color: 'oklch(98% 0.004 80)',
  },
  body: {
    fontFamily: display,
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255, 255, 255, 0.78)',
  },
  bodyOnGlass: {
    fontFamily: display,
    fontSize: 15,
    lineHeight: 22,
    color: 'oklch(22% 0.014 270)',
  },
  row: {
    fontFamily: displayMedium,
    fontSize: 17,
    lineHeight: 22,
    color: 'oklch(98% 0.004 80)',
  },
  meta: {
    fontFamily: display,
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(255, 255, 255, 0.58)',
  },
  metaOnGlass: {
    fontFamily: display,
    fontSize: 13,
    lineHeight: 18,
    color: 'oklch(58% 0.010 270)',
  },
  eyebrow: {
    fontFamily: displayMedium,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.44,
    color: 'rgba(255, 255, 255, 0.58)',
    textTransform: 'uppercase' as const,
  },
  // Editorial moments
  milestone: {
    fontFamily: editorialItalic,
    fontSize: 44,
    lineHeight: 46,
    letterSpacing: -0.44,
    color: 'oklch(98% 0.004 80)',
  },
  serifHero: {
    fontFamily: editorialItalic,
    fontSize: 28,
    lineHeight: 32,
    color: 'oklch(98% 0.004 80)',
  },
  serifTitle: {
    fontFamily: editorial,
    fontSize: 20,
    lineHeight: 24,
    color: 'oklch(98% 0.004 80)',
  },
} satisfies Record<string, TextStyle>;

export const fontFamilies = {
  display,
  displayMedium,
  displayBold,
  editorial,
  editorialItalic,
} as const;
