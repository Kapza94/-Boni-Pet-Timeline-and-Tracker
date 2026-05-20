import { render } from '@testing-library/react-native';
import { LIcon } from './LIcon';

describe('LIcon', () => {
  it('renders the named Lucide icon', () => {
    const { UNSAFE_root } = render(<LIcon name="PawPrint" testID="paw" />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('returns null and warns for an unknown icon name', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { toJSON } = render(
      // @ts-expect-error — intentionally bad name to assert defensive return
      <LIcon name="ThisIconDoesNotExist" />
    );
    expect(toJSON()).toBeNull();
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('ThisIconDoesNotExist')
    );
    warn.mockRestore();
  });

  it('maps size preset "tab" to 22px', () => {
    const { UNSAFE_getByType } = render(<LIcon name="PawPrint" size="tab" />);
    // Lucide icons render an svg root; size lands on width/height props.
    const svg = UNSAFE_getByType(require('react-native-svg').default);
    expect(svg.props.width).toBe(22);
    expect(svg.props.height).toBe(22);
  });

  it('maps size preset "row" to 20px by default', () => {
    const { UNSAFE_getByType } = render(<LIcon name="PawPrint" />);
    const svg = UNSAFE_getByType(require('react-native-svg').default);
    expect(svg.props.width).toBe(20);
  });

  it('accepts numeric size override', () => {
    const { UNSAFE_getByType } = render(<LIcon name="PawPrint" size={32} />);
    const svg = UNSAFE_getByType(require('react-native-svg').default);
    expect(svg.props.width).toBe(32);
  });

  it('bumps stroke to 2px for the active surface', () => {
    const { UNSAFE_getByType } = render(<LIcon name="PawPrint" surface="active" />);
    const svg = UNSAFE_getByType(require('react-native-svg').default);
    expect(svg.props.strokeWidth).toBe(2);
  });

  it('uses 1.5px stroke for non-active surfaces', () => {
    const { UNSAFE_getByType } = render(<LIcon name="PawPrint" surface="canvas" />);
    const svg = UNSAFE_getByType(require('react-native-svg').default);
    expect(svg.props.strokeWidth).toBe(1.5);
  });
});
