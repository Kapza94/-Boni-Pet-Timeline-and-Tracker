import { AccessibilityInfo } from 'react-native';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useReduceMotion } from './useReduceMotion';

describe('useReduceMotion', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns false initially and resolves to the system value', async () => {
    jest
      .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
      .mockResolvedValue(true);
    const listener = { remove: jest.fn() };
    jest
      .spyOn(AccessibilityInfo, 'addEventListener')
      .mockReturnValue(listener as never);

    const { result } = renderHook(() => useReduceMotion());
    expect(result.current).toBe(false);
    await waitFor(() => expect(result.current).toBe(true));
  });

  it('updates when the system fires a reduceMotionChanged event', async () => {
    jest
      .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
      .mockResolvedValue(false);
    let capturedHandler: ((v: boolean) => void) | null = null;
    const listener = { remove: jest.fn() };
    jest
      .spyOn(AccessibilityInfo, 'addEventListener')
      .mockImplementation((_evt: string, handler) => {
        capturedHandler = handler as (v: boolean) => void;
        return listener as never;
      });

    const { result } = renderHook(() => useReduceMotion());
    await waitFor(() => expect(result.current).toBe(false));

    act(() => {
      capturedHandler?.(true);
    });
    expect(result.current).toBe(true);
  });

  it('removes its subscription on unmount', () => {
    jest
      .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
      .mockResolvedValue(false);
    const listener = { remove: jest.fn() };
    jest
      .spyOn(AccessibilityInfo, 'addEventListener')
      .mockReturnValue(listener as never);

    const { unmount } = renderHook(() => useReduceMotion());
    unmount();
    expect(listener.remove).toHaveBeenCalledTimes(1);
  });
});
