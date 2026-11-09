import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HalfnoteProvider, queryClientDefaults, useClearSession } from "@halfnote/data/react";
import {
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
  InstrumentSans_600SemiBold,
  InstrumentSans_700Bold,
} from "@expo-google-fonts/instrument-sans";
import { InstrumentSerif_400Regular, InstrumentSerif_400Regular_Italic } from "@expo-google-fonts/instrument-serif";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { client, loadSession, useSession } from "../session";

// Deep links to an album still get the search screen underneath, so Back works.
export const unstable_settings = { anchor: "index" };

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
        headerTitleStyle: { fontFamily: "InstrumentSerifItalic", fontSize: 28 },
      }}
    >
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="index" />
        <Stack.Screen name="album/[discogsId]" />
        <Stack.Screen name="share" options={{ presentation: "fullScreenModal", headerShown: false }} />
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
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
    InstrumentSans_600SemiBold,
    InstrumentSans_700Bold,
    InstrumentSerif_400Regular,
    // headerTitleStyle has no fontStyle, so the wordmark needs a family name that is already italic.
    InstrumentSerifItalic: InstrumentSerif_400Regular_Italic,
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
