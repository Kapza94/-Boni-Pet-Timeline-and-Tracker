import { Modal, View, Pressable, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, glassBlur, radii } from '../theme/tokens';

type SheetProps = {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};

/**
 * Sheet — bottom-sheet shell: scrim + strong glass surface with the
 * 28px top corners, drag-handle pill, and the refraction border. Used
 * by Quick Log, Paywall, Vet Visit, Memory Book, Invite.
 *
 * Visual + dismissal-by-scrim only at this layer. Drag-to-dismiss is
 * deferred to F06 (Quick Log) where it'll swap to @gorhom/bottom-sheet
 * over this same shell.
 */
export function Sheet({ open, onClose, children }: SheetProps) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Pressable
          testID="sheet-backdrop"
          onPress={onClose}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
          }}
        />
        <View
          testID="sheet-surface"
          style={{
            backgroundColor: colors.glass.strong,
            borderTopLeftRadius: radii.xl,
            borderTopRightRadius: radii.xl,
            borderWidth: 1,
            borderBottomWidth: 0,
            borderColor: colors.glassBorder.DEFAULT,
            paddingTop: 12,
            paddingHorizontal: 20,
            paddingBottom: 36,
            overflow: 'hidden',
          }}
        >
          {Platform.OS === 'ios' ? (
            <BlurView
              intensity={glassBlur.strong * 2}
              tint="systemUltraThinMaterialLight"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
          ) : null}
          <View
            testID="sheet-handle"
            style={{
              alignSelf: 'center',
              width: 36,
              height: 5,
              borderRadius: radii.pill,
              backgroundColor: 'rgba(0, 0, 0, 0.18)',
              marginBottom: 14,
            }}
          />
          {children}
        </View>
      </View>
    </Modal>
  );
}
