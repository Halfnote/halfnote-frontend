import { tw } from "@halfnote/ui";
import { Asset, requestPermissionsAsync } from "expo-media-library";
import { useCallback, useRef } from "react";
import { Alert, Linking, TurboModuleRegistry, View } from "react-native";
import { captureRef } from "react-native-view-shot";
import { Story, STORY_H, STORY_W } from "./story/Story";
import type { GenreKey, StoryContent } from "./storyDraft";

// Instagram silently ignores a share without the Meta App ID (developers.facebook.com → your app → App ID).
const META_APP_ID = process.env.EXPO_PUBLIC_META_APP_ID ?? "";
const SCALE = 1080 / STORY_W;

type Props = { c: StoryContent; genre: GenreKey; variant: number };

/**
 * Keeps a full-size, off-screen copy of the story mounted (the preview is scaled) and exports it at 1080×1920:
 * `share()` hands it to Instagram Stories as the background, `save()` adds it to Photos. Render `capture` anywhere.
 */
export function useShareToStory({ c, genre, variant }: Props, toast: (message: string) => void) {
  const ref = useRef<View>(null);
  const busy = useRef(false);
  // The copy remounts per look; each look's cover settles its own promise, so a stale load can't release a capture.
  const look = `${genre}-${variant}-${c.show.art}`;
  const arts = useRef(new Map<string, ReturnType<typeof deferred>>());
  const artFor = useCallback((k: string) => {
    if (!arts.current.has(k)) arts.current.set(k, deferred());
    return arts.current.get(k)!;
  }, []);

  const capture = useCallback(
    async (result: "data-uri" | "tmpfile") => {
      if (c.art && c.show.art) await Promise.race([artFor(look).promise, sleep(3000)]);
      // The copy can beat Fabric's native mount ("No view found with reactTag"); one frame lets it land.
      await new Promise(requestAnimationFrame);
      return captureRef(ref, { format: "png", width: STORY_W * SCALE, height: STORY_H * SCALE, result });
    },
    [c.art, c.show.art, artFor, look],
  );

  /** Serialises taps: a second tap while one export runs is ignored. */
  const once = useCallback(async (run: () => Promise<void>) => {
    if (busy.current) return;
    busy.current = true;
    try {
      await run();
    } finally {
      busy.current = false;
    }
  }, []);

  const share = useCallback(
    () =>
      once(async () => {
        if (!META_APP_ID) {
          Alert.alert("Instagram sharing isn't set up", "EXPO_PUBLIC_META_APP_ID is missing from this build.");
          return;
        }
        // Expo Go doesn't ship react-native-share; importing it there throws, hence the lazy import below.
        if (!TurboModuleRegistry.get("RNShare")) {
          Alert.alert("Not available in Expo Go", "Sharing to Instagram needs a development build (npx expo run:ios).");
          return;
        }
        // react-native-share opens the URL without checking it and always resolves, so check up front.
        if (!(await Linking.canOpenURL("instagram-stories://share"))) {
          Alert.alert("Couldn't open Instagram", "Make sure Instagram is installed, then try again.");
          return;
        }
        try {
          toast("Opening Instagram Stories…");
          const backgroundImage = await capture("data-uri");
          const { default: Share, Social } = await import("react-native-share");
          await Share.shareSingle({ social: Social.InstagramStories, appId: META_APP_ID, backgroundImage });
        } catch (e) {
          console.warn("Instagram story share failed", e);
          Alert.alert("Couldn't share to Instagram", "Try again.");
        }
      }),
    [once, capture, toast],
  );

  const save = useCallback(
    () =>
      once(async () => {
        try {
          if (!(await requestPermissionsAsync(true)).granted) {
            Alert.alert("Can't save to Photos", "Allow halfnote to add photos in Settings, then try again.");
            return;
          }
          await Asset.create(await capture("tmpfile"));
          toast("Saved to Photos");
        } catch (e) {
          console.warn("Saving the story failed", e);
          Alert.alert("Couldn't save to Photos", "Try again.");
        }
      }),
    [once, capture, toast],
  );

  // Laid out (so it can be captured) but never visible.
  const copy = (
    <View style={tw`absolute -left-[10000px] top-0`} pointerEvents="none" aria-hidden>
      <Story key={look} ref={ref} c={c} genre={genre} variant={variant} onArtSettled={() => artFor(look).resolve()} />
    </View>
  );

  return { share, save, capture: copy };
}

function deferred() {
  let resolve = () => {};
  const promise = new Promise<void>((r) => (resolve = r));
  return { promise, resolve };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
