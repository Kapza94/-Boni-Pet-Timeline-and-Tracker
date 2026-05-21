import { View, Text, type ViewProps } from 'react-native';
import { colors } from '../theme/tokens';

type AvatarProps = Omit<ViewProps, 'children'> & {
  initials: string;
  /** Background color of the circle. Defaults to a neutral grey. */
  color?: string;
  /** Diameter in px. Default 36. */
  size?: number;
  /** Emerald ring when true; otherwise translucent white ring. */
  active?: boolean;
};

/**
 * Avatar — circular monogram chip. The ring is always present; only the
 * color changes between resting (translucent white) and active (emerald)
 * to signal "this person logged something recently" on Family rows.
 */
export function Avatar({
  initials,
  color,
  size = 36,
  active = false,
  style,
  ...rest
}: AvatarProps) {
  return (
    <View
      {...rest}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color ?? 'rgba(0, 0, 0, 0.06)',
          borderWidth: 2,
          borderColor: active
            ? (colors.emerald[500] as string)
            : 'rgba(255, 255, 255, 0.7)',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        },
        style,
      ]}
    >
      <Text
        style={{
          fontFamily: 'SFProDisplay-Medium',
          fontSize: size * 0.36,
          color: colors.onGlass[1] as string,
        }}
      >
        {initials}
      </Text>
    </View>
  );
}
