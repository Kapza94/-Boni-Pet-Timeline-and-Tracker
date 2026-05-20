import { render } from '@testing-library/react-native';
import { SerifTitle } from './SerifTitle';

function flatStyle(node: { props: { style?: unknown } }) {
  const s = node.props.style;
  if (Array.isArray(s)) return Object.assign({}, ...s.flat().filter(Boolean));
  return (s as Record<string, unknown>) ?? {};
}

describe('SerifTitle', () => {
  it('renders provided children', () => {
    const { getByText } = render(<SerifTitle>Mochi</SerifTitle>);
    expect(getByText('Mochi')).toBeTruthy();
  });

  it('uses Instrument Serif regular by default (no italic)', () => {
    const { getByText } = render(<SerifTitle>Mochi</SerifTitle>);
    expect(flatStyle(getByText('Mochi')).fontFamily).toBe('InstrumentSerif_400Regular');
  });

  it('uses the italic Instrument Serif when italic prop set', () => {
    const { getByText } = render(<SerifTitle italic>Cherish every moment.</SerifTitle>);
    expect(flatStyle(getByText('Cherish every moment.')).fontFamily).toBe(
      'InstrumentSerif_400Regular_Italic'
    );
  });

  it('default title size is 20px', () => {
    const { getByText } = render(<SerifTitle>Mochi</SerifTitle>);
    expect(flatStyle(getByText('Mochi')).fontSize).toBe(20);
  });

  it('hero size is 28px', () => {
    const { getByText } = render(<SerifTitle size="hero">Keep her story going.</SerifTitle>);
    expect(flatStyle(getByText('Keep her story going.')).fontSize).toBe(28);
  });

  it('milestone size is 44px (the editorial display moment)', () => {
    const { getByText } = render(
      <SerifTitle size="milestone">First day home.</SerifTitle>
    );
    expect(flatStyle(getByText('First day home.')).fontSize).toBe(44);
  });
});
