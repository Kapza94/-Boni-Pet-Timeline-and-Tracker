import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Press } from '../../components/Press';
import { Glass } from '../../components/Glass';
import { AmbientCanvas } from '../../components/AmbientCanvas';
import { SerifTitle } from '../../components/SerifTitle';
import { signOut } from '../../lib/auth';
import { text } from '../../theme/typography';
import { colors, spacing } from '../../theme/tokens';

export default function Splash() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (e) {
      if (__DEV__) console.warn('[signOut]', (e as Error).message);
    }
    router.replace('/');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas.deep }}>
      <AmbientCanvas />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing[5],
          gap: spacing[6],
        }}
      >
        <SerifTitle size="hero" italic>
          Welcome to Boni.
        </SerifTitle>
        <Text style={[text.body, { textAlign: 'center' }]}>
          Onboarding splash — F03.
        </Text>

        <Press onPress={handleSignOut} testID="dev-sign-out">
          <Glass
            radius="pill"
            strength="strong"
            style={{ paddingVertical: spacing[3], paddingHorizontal: spacing[5] }}
          >
            <Text style={[text.row, { color: colors.onGlass[1] }]}>Sign out (dev)</Text>
          </Glass>
        </Press>
      </View>
    </View>
  );
}
