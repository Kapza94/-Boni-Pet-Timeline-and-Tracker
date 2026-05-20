import { View, Text, type ViewProps, type ViewStyle } from 'react-native';
import { colors } from '../theme/tokens';

type AvatarProps = ViewProps & {
  initials: string;
  /** Display name; surfaced as the accessibilityLabel for VoiceOver. */
  name?: string;
  /** Circle diameter in px. Default 32. */
  size?: number;
  /** Background color; default honey-400. */
  color?: string;
  /** When true, wraps the avatar in an emerald active ring. */
  active?: boolean;
  testID?: string;
};

/**
 * Avatar — circular family-member badge with initials. When `active` is
 * true a 1.5px emerald ring orbits the avatar, marking the "active
 * now" state in the Family screen + the active member of a contribution
 * row in Today.
 */
export function Avatar({
  initials,
  name,
  size = 32,
  color = colors.honey[400] as string,
  active = false,
  style,
  testID,
  ...rest
}: AvatarProps) {
  const upper = initials.toUpperCase();
  const ringGap = 3;

  const inner: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: color,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const ring: ViewStyle = {
    width: size + ringGap * 2,
    height: size + ringGap * 2,
    borderRadius: (size + ringGap * 2) / 2,
    borderWidth: 1.5,
    borderColor: colors.emerald[500] as string,
    padding: ringGap - 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const label = (
    <Text
      style={{
        fontFamily: 'SFProDisplay-Semibold',
        fontSize: Math.round(size * 0.4),
        color: 'oklch(22% 0.014 270)',
      }}
    >
      {upper}
    </Text>
  );

  if (active) {
    return (
      <View testID={testID ? `${testID}-active-ring` : 'avatar-active-ring'} style={ring}>
        <View
          {...rest}
          testID={testID}
          accessibilityLabel={name}
          style={[inner, style as ViewStyle]}
        >
          {label}
        </View>
      </View>
    );
  }

  return (
    <View
      {...rest}
      testID={testID}
      accessibilityLabel={name}
      style={[inner, style as ViewStyle]}
    >
      {label}
    </View>
  );
}
