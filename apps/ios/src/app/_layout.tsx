import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HalfnoteProvider, queryClientDefaults, useClearSession, useFlushLikes } from "@halfnote/data/react";
import {
  EBGaramond_400Regular,
  EBGaramond_400Regular_Italic,
  EBGaramond_500Medium,
  EBGaramond_600SemiBold,
  EBGaramond_700Bold,
} from "@expo-google-fonts/eb-garamond";
import {
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
  InstrumentSans_600SemiBold,
  InstrumentSans_700Bold,
} from "@expo-google-fonts/instrument-sans";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { AppState } from "react-native";
import { client, loadSession, useSession } from "../session";

// Deep links (album, user, review) still get the tabs underneath, so Back works.
export const unstable_settings = { anchor: "(tabs)" };

const queryClient = new QueryClient({ defaultOptions: queryClientDefaults });
void loadSession();

function Routes() {
  const session = useSession();
  const clearSession = useClearSession();
  const flushLikes = useFlushLikes();

  // A like tapped just before leaving the app would otherwise wait out its debounce and may never send.
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "background") flushLikes();
    });
    return () => sub.remove();
  }, [flushLikes]);

  // Covers every logout path: the button, a 401, and a rejected refresh.
  useEffect(() => {
    if (session === null) clearSession();
  }, [session, clearSession]);

  if (session === undefined) return null;
  return (
    <Stack
      screenOptions={{
        headerTitle: "",
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="album/[discogsId]" options={{ headerShown: false }} />
        <Stack.Screen name="user/[username]" options={{ headerShown: false }} />
        <Stack.Screen name="search" options={{ headerShown: false }} />
        <Stack.Screen name="review/[id]" options={{ headerShown: false }} />
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
    EBGaramond_400Regular_Italic,
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
    InstrumentSans_600SemiBold,
    InstrumentSans_700Bold,
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
