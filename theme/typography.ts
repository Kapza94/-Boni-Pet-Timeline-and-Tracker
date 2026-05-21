/**
 * Text style presets. Pair with NativeWind className for layout; use these
 * for font-family + size + leading + tracking + weight combinations that
 * recur across screens.
 *
 * Colors are sRGB hex strings (see `theme/tokens.ts` for the oklch
 * source values — RN's color parser doesn't accept oklch).
 */

import type { TextStyle } from 'react-native';
import { colors } from './tokens';

const display = 'SFProDisplay-Regular';
const displayMedium = 'SFProDisplay-Medium';
const displayBold = 'SFProDisplay-Bold';
const editorial = 'InstrumentSerif_400Regular';
const editorialItalic = 'InstrumentSerif_400Regular_Italic';

const inkPrimary = colors.ink[1];
const inkBody = colors.ink[2];
const inkMeta = colors.ink[3];
const onGlassPrimary = colors.onGlass[1];
const onGlassMeta = colors.onGlass[3];

export const text = {
  largeTitle: {
    fontFamily: displayBold,
    fontSize: 34,
    lineHeight: 37,
    letterSpacing: -0.748,
    color: inkPrimary,
  },
  title1: {
    fontFamily: displayBold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.336,
    color: inkPrimary,
  },
  title2: {
    fontFamily: displayBold,
    fontSize: 24,
    lineHeight: 29,
    letterSpacing: -0.288,
    color: inkPrimary,
  },
  body: {
    fontFamily: display,
    fontSize: 15,
    lineHeight: 22,
    color: inkBody,
  },
  bodyOnGlass: {
    fontFamily: display,
    fontSize: 15,
    lineHeight: 22,
    color: onGlassPrimary,
  },
  row: {
    fontFamily: displayMedium,
    fontSize: 17,
    lineHeight: 22,
    color: inkPrimary,
  },
  meta: {
    fontFamily: display,
    fontSize: 13,
    lineHeight: 18,
    color: inkMeta,
  },
  metaOnGlass: {
    fontFamily: display,
    fontSize: 13,
    lineHeight: 18,
    color: onGlassMeta,
  },
  eyebrow: {
    fontFamily: displayMedium,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.44,
    color: inkMeta,
    textTransform: 'uppercase' as const,
  },
  milestone: {
    fontFamily: editorialItalic,
    fontSize: 44,
    lineHeight: 46,
    letterSpacing: -0.44,
    color: inkPrimary,
  },
  serifHero: {
    fontFamily: editorialItalic,
    fontSize: 28,
    lineHeight: 32,
    color: inkPrimary,
  },
  serifTitle: {
    fontFamily: editorial,
    fontSize: 20,
    lineHeight: 24,
    color: inkPrimary,
  },
} satisfies Record<string, TextStyle>;

export const fontFamilies = {
  display,
  displayMedium,
  displayBold,
  editorial,
  editorialItalic,
} as const;
