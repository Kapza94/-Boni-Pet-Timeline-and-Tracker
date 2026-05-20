import { Text, type TextProps } from 'react-native';
import { text } from '../theme/typography';

type Size = 'title' | 'hero' | 'milestone';

type SerifTitleProps = TextProps & {
  size?: Size;
  italic?: boolean;
};

const STYLE_FOR: Record<Size, typeof text.serifHero> = {
  title: text.serifTitle,
  hero: text.serifHero,
  milestone: text.milestone,
};

/**
 * SerifTitle — Instrument Serif. Reserved for emotional moments per spec:
 * pet name on covers, milestone titles, paywall hero, memory book cover,
 * select quotes. Don't reach for it on chrome; that's SF Pro's job.
 */
export function SerifTitle({
  size = 'title',
  italic = false,
  style,
  ...rest
}: SerifTitleProps) {
  const base = STYLE_FOR[size];
  return (
    <Text
      {...rest}
      style={[
        base,
        italic && { fontFamily: 'InstrumentSerif_400Regular_Italic' },
        style,
      ]}
    />
  );
}
