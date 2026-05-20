import { View, Text, type ViewProps } from 'react-native';
import { Avatar } from './Avatar';
import { colors } from '../theme/tokens';

type Person = {
  initials: string;
  name?: string;
  color?: string;
};

type AvatarStackProps = ViewProps & {
  people: Person[];
  /** Maximum number of avatars to render before a +N overflow badge. */
  max?: number;
  /** Diameter of each avatar in px. Default 28. */
  size?: number;
  testID?: string;
};

/**
 * AvatarStack — overlapping circular avatars (e.g. the household row
 * on Today and the contributions row on Family). Caps at `max` and
 * spills the rest into a `+N` overflow badge.
 */
export function AvatarStack({
  people,
  max = 4,
  size = 28,
  style,
  testID,
  ...rest
}: AvatarStackProps) {
  if (people.length === 0) return null;

  const visible = people.slice(0, max);
  const overflow = people.length - visible.length;

  return (
    <View
      {...rest}
      testID={testID}
      style={[{ flexDirection: 'row', alignItems: 'center' }, style]}
    >
      {visible.map((p, i) => (
        <View key={`${p.initials}-${i}`} style={{ marginLeft: i === 0 ? 0 : -size * 0.33 }}>
          <Avatar
            initials={p.initials}
            name={p.name}
            color={p.color}
            size={size}
            testID={testID ? `${testID}-avatar-${i}` : undefined}
          />
        </View>
      ))}
      {overflow > 0 && (
        <View
          testID={testID ? `${testID}-overflow` : undefined}
          style={{
            marginLeft: -size * 0.33,
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors.glass.DEFAULT,
            borderWidth: 1,
            borderColor: colors.glassBorder.DEFAULT,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontFamily: 'SFProDisplay-Semibold',
              fontSize: Math.round(size * 0.36),
              color: 'oklch(22% 0.014 270)',
            }}
          >
            +{overflow}
          </Text>
        </View>
      )}
    </View>
  );
}
