import '@walletconnect/react-native-compat'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { WagmiProvider } from 'wagmi'
import { useColorScheme } from '@/hooks/useColorScheme';
import { baseSepolia } from "viem/chains";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit, defaultWagmiConfig, AppKit } from '@reown/appkit-wagmi-react-native'

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId at https://cloud.reown.com
const projectId = "b505d9048a489182eda5f28455a1f2db";

// 2. Create config
const metadata = {
  name: 'Nine Base',
  description: 'Seamless payments on Base',
  url: 'https://reown.com/appkit',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
  redirect: {
    native: 'YOUR_APP_SCHEME://',
    universal: 'YOUR_APP_UNIVERSAL_LINK.com'
  }
}

const chains = [baseSepolia] as const
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// 3. Create modal
createAppKit({
  projectId,
  wagmiConfig,
  defaultChain: baseSepolia, // Optional
  enableAnalytics: false
})

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
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
        <AppKit />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
