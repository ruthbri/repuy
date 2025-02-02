import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { SWRConfig } from 'swr';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SWRConfig
  value={{
    provider: () => new Map(),
    isOnline() {
      /* Personaliza el estado del detector de red */
      return true
    },
    isVisible() {
      /* Personaliza la visibilidad del detector de red */
      return true
    },
    
  }}
>
      <Stack screenOptions={{ headerShown: false}}>
        <Stack.Screen name="index" />
        <Stack.Screen name="GameScreen" />
        <Stack.Screen name="WaitingRoomScreen" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
      </SWRConfig>
    </ThemeProvider>
  );
}
