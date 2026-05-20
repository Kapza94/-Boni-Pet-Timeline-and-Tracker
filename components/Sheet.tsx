import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { View } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import type {
  BottomSheetBackdropProps,
  BottomSheetModal as BottomSheetModalType,
} from '@gorhom/bottom-sheet';
import { colors, radii } from '../theme/tokens';

export type SheetRef = {
  present: () => void;
  dismiss: () => void;
};

type SheetProps = {
  children: React.ReactNode;
  /** Called once the sheet has fully dismissed (post-animation). */
  onClose?: () => void;
  /** Snap points; defaults to auto-height (single 'CONTENT' snap). */
  snapPoints?: (string | number)[];
};

/**
 * Sheet — the design system's standard bottom-sheet shell. Wraps
 * @gorhom/bottom-sheet's BottomSheetModal with our 28px top radii,
 * frosted backdrop, and Glass-aligned content padding. Caller drives
 * via `ref.current.present()` / `dismiss()`.
 *
 * The host app must render <BottomSheetModalProvider/> somewhere up
 * the tree (root layout) for the portal to mount.
 */
export const Sheet = forwardRef<SheetRef, SheetProps>(function Sheet(
  { children, onClose, snapPoints },
  ref
) {
  const inner = useRef<BottomSheetModalType>(null);
  const snaps = useMemo(() => snapPoints ?? ['50%', '90%'], [snapPoints]);

  useImperativeHandle(ref, () => ({
    present: () => inner.current?.present(),
    dismiss: () => inner.current?.dismiss(),
  }));

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.42}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={inner}
      snapPoints={snaps}
      onDismiss={onClose}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: colors.glass.strong,
        borderTopLeftRadius: radii.xl,
        borderTopRightRadius: radii.xl,
      }}
      handleIndicatorStyle={{
        backgroundColor: colors.glassBorder.strong,
      }}
    >
      <BottomSheetView>
        <View style={{ padding: 20 }}>{children}</View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});
