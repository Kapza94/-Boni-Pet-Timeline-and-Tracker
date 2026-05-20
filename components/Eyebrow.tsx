import { Text, type TextProps } from 'react-native';
import { text } from '../theme/typography';

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
      style={[text.eyebrow, onGlass && { color: 'oklch(58% 0.010 270)' }, style]}
    >
      {content}
    </Text>
  );
}
