import { View, Platform, type ViewProps, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import {
  colors,
  glassBlur,
  glassSaturate as _glassSaturate,
  radii,
} from '../theme/tokens';

type GlassStrength = 'thin' | 'regular' | 'strong';
type GlassRadius = keyof typeof radii;

type GlassProps = ViewProps & {
  strength?: GlassStrength;
  radius?: GlassRadius;
  /** Apply the multi-layer shadow tier. */
  elevation?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
};

const FILL: Record<GlassStrength, string> = {
  thin: colors.glass.thin,
  regular: colors.glass.DEFAULT,
  strong: colors.glass.strong,
};

const BORDER: Record<GlassStrength, string> = {
  thin: colors.glassBorder.DEFAULT,
  regular: colors.glassBorder.DEFAULT,
  strong: colors.glassBorder.strong,
};

const BLUR_INTENSITY: Record<GlassStrength, number> = {
  thin: glassBlur.thin * 2,
  regular: glassBlur.regular * 2,
  strong: glassBlur.strong * 2,
};

const SHADOWS: Record<NonNullable<GlassProps['elevation']>, ViewStyle> = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 32,
    elevation: 6,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 28 },
    shadowOpacity: 0.38,
    shadowRadius: 60,
    elevation: 12,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 48 },
    shadowOpacity: 0.45,
    shadowRadius: 100,
    elevation: 24,
  },
};

/**
 * Glass — the signature white-tinted frosted surface. Always carries the
 * 1px white refraction border. Pair with elevation for the multi-layer
 * shadow tiers from the design system.
 */
export function Glass({
  strength = 'regular',
  radius = 'lg',
  elevation = 'sm',
  style,
  children,
  ...rest
}: GlassProps) {
  const r = radii[radius];

  const containerStyle: ViewStyle = {
    borderRadius: r,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER[strength],
    backgroundColor: FILL[strength],
    ...SHADOWS[elevation],
  };

  // iOS BlurView gives the real frosted look; Android falls back to the
  // tinted fill alone (BlurView on Android is best-effort).
  if (Platform.OS === 'ios') {
    return (
      <View {...rest} style={[containerStyle, style]}>
        <BlurView
          intensity={BLUR_INTENSITY[strength]}
          tint="systemUltraThinMaterialLight"
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
        {children}
      </View>
    );
  }

  return (
    <View {...rest} style={[containerStyle, style]}>
      {children}
    </View>
  );
}
