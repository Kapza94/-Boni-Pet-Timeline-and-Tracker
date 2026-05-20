import { renderHook, act, waitFor } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import { useReduceMotion } from './useReduceMotion';

describe('useReduceMotion', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('returns false initially', () => {
    jest
      .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
      .mockResolvedValue(false);
    const { result } = renderHook(() => useReduceMotion());
    expect(result.current).toBe(false);
  });

  it('resolves to true when AccessibilityInfo reports Reduce Motion on', async () => {
    jest
      .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
      .mockResolvedValue(true);
    const { result } = renderHook(() => useReduceMotion());
    await waitFor(() => expect(result.current).toBe(true));
  });

  it('updates when the OS preference changes', async () => {
    jest
      .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
      .mockResolvedValue(false);
    let listener: ((enabled: boolean) => void) | null = null;
    jest
      .spyOn(AccessibilityInfo, 'addEventListener')
      .mockImplementation((event, cb) => {
        if (event === 'reduceMotionChanged')
          listener = cb as (enabled: boolean) => void;
        return { remove: jest.fn() };
      });

    const { result } = renderHook(() => useReduceMotion());

    expect(result.current).toBe(false);
    expect(listener).not.toBeNull();

    act(() => {
      listener?.(true);
    });

    await waitFor(() => expect(result.current).toBe(true));
  });

  it('unsubscribes the listener on unmount', () => {
    jest
      .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
      .mockResolvedValue(false);
    const remove = jest.fn();
    jest
      .spyOn(AccessibilityInfo, 'addEventListener')
      .mockReturnValue({ remove });

    const { unmount } = renderHook(() => useReduceMotion());
    unmount();
    expect(remove).toHaveBeenCalledTimes(1);
  });
});
