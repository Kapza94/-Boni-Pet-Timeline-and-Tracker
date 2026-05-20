import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AmbientCanvas } from '../components/AmbientCanvas';
import { Glass } from '../components/Glass';
import { text } from '../theme/typography';

/**
 * F00 scaffold demo. Confirms:
 *  - Expo Router boots
 *  - Fonts loaded (SF Pro Display + Instrument Serif)
 *  - NativeWind classes compile
 *  - Skia AmbientCanvas paints the four blobs over the dark canvas
 *  - Glass primitive renders the 1px refraction border + frosted blur
 *
 * Delete once F01 ships its own kitchen-sink screen.
 */
export default function Scaffold() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-canvas">
      <AmbientCanvas />
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1 items-center justify-center px-5">
          <Text style={text.eyebrow}>F00 · scaffold check</Text>

          <Glass
            radius="2xl"
            elevation="md"
            style={{
              marginTop: 24,
              padding: 24,
              width: '100%',
              maxWidth: 360,
            }}
          >
            <Text style={text.serifHero}>Every day, every memory.</Text>
            <Text style={[text.bodyOnGlass, { marginTop: 12 }]}>
              Boni&apos;s glass canvas is live. SF Pro Display, Instrument
              Serif, NativeWind, Skia blobs, and the refraction edge are
              all wired.
            </Text>
          </Glass>

          <View className="mt-6 w-full max-w-[360px] flex-row gap-3">
            <Pressable
              onPress={() => router.push('/(onboarding)/splash')}
              className="flex-1"
            >
              <Glass radius="pill" strength="regular" style={{ padding: 14 }}>
                <Text
                  style={[text.row, { textAlign: 'center', color: 'oklch(22% 0.014 270)' }]}
                >
                  Onboarding
                </Text>
              </Glass>
            </Pressable>
            <Pressable
              onPress={() => router.push('/(app)/(tabs)')}
              className="flex-1"
            >
              <Glass radius="pill" strength="regular" style={{ padding: 14 }}>
                <Text
                  style={[text.row, { textAlign: 'center', color: 'oklch(22% 0.014 270)' }]}
                >
                  Main app
                </Text>
              </Glass>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
