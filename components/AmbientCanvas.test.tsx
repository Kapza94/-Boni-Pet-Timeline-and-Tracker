import { render } from '@testing-library/react-native';
import { AmbientCanvas } from './AmbientCanvas';

describe('AmbientCanvas (characterization — locks F00 contract)', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<AmbientCanvas />);
    expect(toJSON()).toBeTruthy();
  });

  it('mounts the four pastel blobs (lavender, rose, peach, sky)', () => {
    const { toJSON } = render(<AmbientCanvas />);
    const tree = JSON.stringify(toJSON());
    expect(tree).toContain('oklch(78% 0.135 290)'); // lavender
    expect(tree).toContain('oklch(80% 0.115 22)'); // rose
    expect(tree).toContain('oklch(82% 0.105 55)'); // peach
    expect(tree).toContain('oklch(80% 0.095 230)'); // sky
  });

  it('paints the dark canvas (never pure black) behind the blobs', () => {
    const { toJSON } = render(<AmbientCanvas />);
    const tree = JSON.stringify(toJSON());
    expect(tree).toContain('oklch(22% 0.022 270)');
  });
});
