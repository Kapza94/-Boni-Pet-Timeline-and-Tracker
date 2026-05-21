import { View, Pressable, Text } from 'react-native';
import { Eyebrow } from './Eyebrow';
import { LIcon, type LIconName } from './icons/LIcon';
import { text } from '../theme/typography';
import { colors, radii } from '../theme/tokens';

type BoniNavBarProps = {
  title: string;
  eyebrow?: string;
  trailingIcon?: LIconName;
  onTrailing?: () => void;
};

/**
 * BoniNavBar — top-of-screen nav: eyebrow + 34px bold large title, with
 * an optional round glass trailing button. Per spec the eyebrow + title
 * pair carries the screen's identity; the trailing slot is reserved for
 * a single secondary action (settings, share, edit).
 */
export function BoniNavBar({
  title,
  eyebrow,
  trailingIcon,
  onTrailing,
}: BoniNavBarProps) {
  return (
    <View
      style={{
        paddingTop: 8,
        paddingBottom: 14,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: 12,
      }}
    >
      <View style={{ flexShrink: 1, minWidth: 0 }}>
        {eyebrow ? (
          <Eyebrow testID="bonibar-eyebrow" style={{ marginBottom: 4 }}>
            {eyebrow}
          </Eyebrow>
        ) : null}
        <Text style={text.largeTitle}>{title}</Text>
      </View>
      {trailingIcon ? (
        <Pressable
          testID="bonibar-trailing"
          accessibilityRole="button"
          onPress={onTrailing}
          style={{
            width: 40,
            height: 40,
            borderRadius: radii.pill,
            backgroundColor: colors.glass.strong,
            borderWidth: 1,
            borderColor: colors.glassBorder.DEFAULT,
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <LIcon name={trailingIcon} size={18} surface="glass" />
        </Pressable>
      ) : null}
    </View>
  );
}
