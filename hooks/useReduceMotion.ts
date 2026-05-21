import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * useReduceMotion — boolean that tracks the OS Reduce Motion setting.
 * Subscribes to changes so a runtime toggle disables drifts immediately.
 * Used by AmbientCanvas and any motion-bearing component (toggle drift,
 * spring on milestone unlock, etc).
 */
export function useReduceMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (mounted) setReduceMotion(value);
    });
    const sub = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (value) => {
        if (mounted) setReduceMotion(value);
      }
    );
    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  return reduceMotion;
}
