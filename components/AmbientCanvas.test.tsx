import { AccessibilityInfo } from 'react-native';
import { render } from '@testing-library/react-native';
import { AmbientCanvas } from './AmbientCanvas';

describe('AmbientCanvas', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('mounts without throwing when Reduce Motion is off', () => {
    jest
      .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
      .mockResolvedValue(false);
    jest
      .spyOn(AccessibilityInfo, 'addEventListener')
      .mockReturnValue({ remove: jest.fn() } as never);
    expect(() => render(<AmbientCanvas />)).not.toThrow();
  });

  it('mounts without throwing when Reduce Motion is on', () => {
    jest
      .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
      .mockResolvedValue(true);
    jest
      .spyOn(AccessibilityInfo, 'addEventListener')
      .mockReturnValue({ remove: jest.fn() } as never);
    expect(() => render(<AmbientCanvas />)).not.toThrow();
  });

  it('subscribes to reduceMotionChanged so a runtime toggle disables drift', () => {
    jest
      .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
      .mockResolvedValue(false);
    const add = jest
      .spyOn(AccessibilityInfo, 'addEventListener')
      .mockReturnValue({ remove: jest.fn() } as never);
    render(<AmbientCanvas />);
    expect(add).toHaveBeenCalledWith('reduceMotionChanged', expect.any(Function));
  });
});
