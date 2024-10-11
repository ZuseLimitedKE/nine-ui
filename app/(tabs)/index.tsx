
import '@walletconnect/react-native-compat'
import {useWalletConnectModal, WalletConnectModal} from "@walletconnect/modal-react-native";
import { Image, StyleSheet, Platform, Pressable, Button } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import "@/pollyfills";
import {baseSepolia} from "viem/chains";
import { createPublicClient, http, Address, getContract, createWalletClient, parseEther, parseGwei } from 'viem';
import abiFile from "@/abi.json";
const abi = abiFile.abi;

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http()
})

const walletClient = createWalletClient({
  chain: baseSepolia,
  transport: http()
});

const projectId = process.env.EXPO_PUBLIC_PROJECT_ID;

const providerMetadata = {
  name: 'Example dApp',
  description: 'Modern Example dApp from Callstack',
  url: 'https://callstack.com/',
  icons: ['https://example.com/'],
  redirect: {
    native: 'YOUR_APP_SCHEME://',
    universal: 'YOUR_APP_UNIVERSAL_LINK.com'
  }
}



export default function HomeScreen() {
  const { open, isConnected, provider, address: wcAddress } = useWalletConnectModal();
  const address = wcAddress as Address | undefined;

  async function payForRequest() {
    try {
        if (isConnected) {
            console.log("Address =>", address);
            const contract = getContract({
              //@ts-ignore
              address: process.env.EXPO_PUBLIC_CONTRACT_ADDRESS ?? "0xA0023Da71C274906F4c851DD8407E961667B26D5",
              abi,
              client: walletClient
            });

            // Simulate to get request
            const {request} = await publicClient.simulateContract({
              account: address,
              //@ts-ignore
              address: process.env.EXPO_PUBLIC_CONTRACT_ADDRESS ?? "0xA0023Da71C274906F4c851DD8407E961667B26D5",
              abi,
              gas: 1000000n,
              gasPrice: 10000000000n,
              functionName: 'payForRequest',
              args: ["0xB71232D96A0Bc81684CC3892d47032eB8cB40E36", 10, "Test CID 2"],
              value: 10n
            });

            // Write request
            const txHash = await walletClient.writeContract(request);
            console.log("Transaction =>", txHash);
        } else {
            console.log("Wallet Not Connected");
        }
    } catch(err) {
      console.log("Could Not Pay For Request =>", err);
    }
  }
  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({ ios: 'cmd + d', android: 'cmd + m' })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{' '}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
      <Button title="Connect Wallet" onPress={() => open()}/>
      <Button title="Pay For Request" onPress={payForRequest} />

      <WalletConnectModal projectId={projectId ?? ""} providerMetadata={providerMetadata}/>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
