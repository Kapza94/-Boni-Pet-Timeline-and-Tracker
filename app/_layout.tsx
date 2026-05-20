import 'react-native-url-polyfill/auto';
import '../global.css';

import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useFonts as useInstrumentSerif,
  InstrumentSerif_400Regular,
  InstrumentSerif_400Regular_Italic,
} from '@expo-google-fonts/instrument-serif';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, refetchOnWindowFocus: false },
  },
});

export default function RootLayout() {
  const [sfLoaded] = useFonts({
    'SFProDisplay-Regular': require('../assets/fonts/SFPRODISPLAYREGULAR.OTF'),
    'SFProDisplay-Medium': require('../assets/fonts/SFPRODISPLAYMEDIUM.OTF'),
    'SFProDisplay-Bold': require('../assets/fonts/SFPRODISPLAYBOLD.OTF'),
    'SFProDisplay-LightItalic': require('../assets/fonts/SFPRODISPLAYLIGHTITALIC.OTF'),
    'SFProDisplay-SemiboldItalic': require('../assets/fonts/SFPRODISPLAYSEMIBOLDITALIC.OTF'),
    'SFProDisplay-HeavyItalic': require('../assets/fonts/SFPRODISPLAYHEAVYITALIC.OTF'),
    'SFProDisplay-BlackItalic': require('../assets/fonts/SFPRODISPLAYBLACKITALIC.OTF'),
    'SFProDisplay-ThinItalic': require('../assets/fonts/SFPRODISPLAYTHINITALIC.OTF'),
    'SFProDisplay-UltralightItalic': require('../assets/fonts/SFPRODISPLAYULTRALIGHTITALIC.OTF'),
  });

  const [serifLoaded] = useInstrumentSerif({
    InstrumentSerif_400Regular,
    InstrumentSerif_400Regular_Italic,
  });

  const ready = sfLoaded && serifLoaded;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: 'oklch(22% 0.022 270)' },
            }}
          />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
