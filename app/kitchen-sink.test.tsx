import { render } from '@testing-library/react-native';
import KitchenSink from './kitchen-sink';

describe('Kitchen sink screen (F01 visual harness)', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<KitchenSink />);
    expect(toJSON()).toBeTruthy();
  });

  it('exercises every F01 primitive on the page', () => {
    const { getByText } = render(<KitchenSink />);
    // Eyebrow + BoniNavBar large title
    expect(getByText('F01 · KITCHEN SINK')).toBeTruthy();
    expect(getByText('Primitives')).toBeTruthy();
    // SerifTitle (hero size, italic)
    expect(getByText('Every day, every memory.')).toBeTruthy();
    // Avatar initials
    expect(getByText('SA')).toBeTruthy();
    // AvatarStack overflow badge
    expect(getByText('+2')).toBeTruthy();
    // PressableSurface label
    expect(getByText('Open sheet')).toBeTruthy();
    // Glass card body copy
    expect(getByText(/refraction edge/i)).toBeTruthy();
  });
});
