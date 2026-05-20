import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * useReduceMotion — true when iOS's Reduce Motion accessibility setting
 * is enabled. Pair with any animation that conveys state change (the
 * 900ms emerald drift on toggles, the ambient blob drift, sheet
 * presents) — when true, swap the animation for an instant state swap
 * per the system spec.
 */
export function useReduceMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setReduceMotion(enabled);
    });
    const sub = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled: boolean) => {
        if (mounted) setReduceMotion(enabled);
      }
    );
    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  return reduceMotion;
}
