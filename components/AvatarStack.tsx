import { View } from 'react-native';
import { Avatar } from './Avatar';

type Person = {
  initials: string;
  color?: string;
  active?: boolean;
};

type AvatarStackProps = {
  people: Person[];
  /** Per-avatar diameter. Default 32. */
  size?: number;
  /** Optional testID applied to each overlap slot for assertions. */
  itemTestID?: string;
};

/**
 * AvatarStack — horizontal row of avatars overlapping by 8px each.
 * Used on Family / Today rows to show who contributed.
 */
export function AvatarStack({ people, size = 32, itemTestID }: AvatarStackProps) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {people.map((p, i) => (
        <View
          key={`${p.initials}-${i}`}
          testID={itemTestID}
          style={{ marginLeft: i === 0 ? 0 : -8 }}
        >
          <Avatar
            initials={p.initials}
            color={p.color}
            size={size}
            active={p.active}
          />
        </View>
      ))}
    </View>
  );
}
