import { Text, type TextProps } from 'react-native';
import { text } from '../theme/typography';
import { colors } from '../theme/tokens';

type EyebrowProps = TextProps & {
  children?: React.ReactNode;
  /** Use on a white-tinted glass surface; switches to on-glass-3 color. */
  onGlass?: boolean;
};

/**
 * Eyebrow — small uppercase tracked label used above titles, section
 * headers, NEXT-UP cards, and the BEST VALUE badge. Sentence case rule
 * is suspended here: eyebrows + paywall badges are the only ALL CAPS
 * surfaces in the system.
 */
export function Eyebrow({ children, style, onGlass = false, ...rest }: EyebrowProps) {
  const content = typeof children === 'string' ? children.toUpperCase() : children;
  return (
    <Text
      {...rest}
      style={[text.eyebrow, onGlass && { color: colors.onGlass[3] }, style]}
    >
      {content}
    </Text>
  );
}
