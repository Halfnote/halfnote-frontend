import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HalfnoteProvider, queryClientDefaults, useClearSession } from "@halfnote/data/react";
import {
  EBGaramond_400Regular,
  EBGaramond_400Regular_Italic,
  EBGaramond_500Medium,
  EBGaramond_600SemiBold,
  EBGaramond_700Bold,
} from "@expo-google-fonts/eb-garamond";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { client, loadSession, useSession } from "../session";

// Deep links (album, dev/search) still get the tabs underneath, so Back works.
export const unstable_settings = { anchor: "(tabs)" };

const queryClient = new QueryClient({ defaultOptions: queryClientDefaults });
void loadSession();

function Routes() {
  const session = useSession();
  const clearSession = useClearSession();

  // Covers every logout path: the button, a 401, and a rejected refresh.
  useEffect(() => {
    if (session === null) clearSession();
  }, [session, clearSession]);

  if (session === undefined) return null;
  return (
    <Stack
      screenOptions={{
        headerTitle: "halfnote.",
        headerBackButtonDisplayMode: "minimal",
        headerTitleStyle: { fontFamily: "EBGaramond_400Regular_Italic", fontSize: 28 },
      }}
    >
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="dev/search" />
        <Stack.Screen name="album/[discogsId]" />
        <Stack.Screen name="share" options={{ presentation: "fullScreenModal", headerShown: false }} />
        <Stack.Screen name="write" options={{ presentation: "fullScreenModal", headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  // Runtime loading so Expo Go (which ignores app.json config plugins) gets the fonts too.
  const [fontsLoaded, fontError] = useFonts({
    EBGaramond_400Regular,
    EBGaramond_500Medium,
    EBGaramond_600SemiBold,
    EBGaramond_700Bold,
    // headerTitleStyle has no fontStyle, so the wordmark needs a family name that is already italic.
    EBGaramond_400Regular_Italic,
  });
  if (!fontsLoaded && !fontError) return null;
  return (
    <QueryClientProvider client={queryClient}>
      <HalfnoteProvider client={client}>
        <Routes />
      </HalfnoteProvider>
    </QueryClientProvider>
  );
}
