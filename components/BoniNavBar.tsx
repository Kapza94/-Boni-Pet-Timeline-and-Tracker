import { View, Text, type ViewProps } from 'react-native';
import { Eyebrow } from './Eyebrow';
import { text } from '../theme/typography';

type BoniNavBarProps = ViewProps & {
  title: string;
  /** Small uppercase tracked label above the title (e.g. date, section). */
  eyebrow?: string;
  /** Right-side slot for a glass icon button (search, +, filter, etc). */
  trailing?: React.ReactNode;
  testID?: string;
};

/**
 * BoniNavBar — iOS-style large title nav. 34px bold SF Pro Display
 * left-aligned, optional eyebrow above (e.g. "Friday · May 22"),
 * optional trailing slot for a glass icon button.
 *
 * No background of its own — sits on the ambient canvas + scroll
 * content beneath supplies its own glass surfaces. Outer page
 * padding (20px) handled by the parent screen.
 */
export function BoniNavBar({
  title,
  eyebrow,
  trailing,
  style,
  testID,
  ...rest
}: BoniNavBarProps) {
  return (
    <View
      {...rest}
      testID={testID}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          paddingVertical: 12,
        },
        style,
      ]}
    >
      <View style={{ flex: 1 }}>
        {eyebrow ? <Eyebrow style={{ marginBottom: 6 }}>{eyebrow}</Eyebrow> : null}
        <Text style={text.largeTitle}>{title}</Text>
      </View>
      {trailing ? (
        <View
          testID={testID ? `${testID}-trailing` : undefined}
          style={{ marginLeft: 12 }}
        >
          {trailing}
        </View>
      ) : null}
    </View>
  );
}
