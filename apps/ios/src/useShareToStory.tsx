import { colors, tw } from "@halfnote/ui";
import { useCallback, useRef, useState } from "react";
import { Alert, Linking, TurboModuleRegistry, View } from "react-native";
import { captureRef } from "react-native-view-shot";
import { StoryCard, type StoryContent } from "./StoryCard";

// Instagram silently ignores a share without the Meta App ID (developers.facebook.com → your app → App ID).
const META_APP_ID = process.env.EXPO_PUBLIC_META_APP_ID ?? "";

/**
 * `share(content)` mounts an off-screen StoryCard, waits for its cover, captures it as a sticker and hands
 * it to Instagram's Story editor. Render `card` anywhere on the screen.
 */
export function useShareToStory() {
  const [content, setContent] = useState<StoryContent | null>(null);
  const cardRef = useRef<View>(null);
  // From the tap until the card unmounts; `sharing` lags behind the canOpenURL await, so double taps need this.
  const busy = useRef(false);
  // A late onLoad after the capture must not share a second time.
  const captured = useRef(false);

  const share = useCallback(async (next: StoryContent) => {
    if (busy.current) return;
    busy.current = true;
    if (!META_APP_ID) {
      busy.current = false;
      Alert.alert("Instagram sharing isn't set up", "EXPO_PUBLIC_META_APP_ID is missing from this build.");
      return;
    }
    // Expo Go doesn't ship react-native-share; importing it there throws, hence the lazy import in onReady.
    if (!TurboModuleRegistry.get("RNShare")) {
      busy.current = false;
      Alert.alert("Not available in Expo Go", "Sharing to Instagram needs a development build (npx expo run:ios).");
      return;
    }
    // react-native-share opens the URL without checking it and always resolves, so check up front.
    if (!(await Linking.canOpenURL("instagram-stories://share"))) {
      busy.current = false;
      Alert.alert("Couldn't open Instagram", "Make sure Instagram is installed, then try again.");
      return;
    }
    captured.current = false;
    setContent(next);
  }, []);

  const onReady = useCallback(async () => {
    if (captured.current) return;
    captured.current = true;
    try {
      // onReady can beat Fabric's native mount ("No view found with reactTag"); one frame lets it land.
      await new Promise(requestAnimationFrame);
      const stickerImage = await captureRef(cardRef, { format: "png", result: "data-uri" });
      const { default: Share, Social } = await import("react-native-share");
      await Share.shareSingle({
        social: Social.InstagramStories,
        appId: META_APP_ID,
        stickerImage,
        backgroundTopColor: colors.lemon,
        backgroundBottomColor: colors.coral,
      });
    } catch (e) {
      console.warn("Instagram story share failed", e);
      Alert.alert("Couldn't share to Instagram", "Try again.");
    } finally {
      busy.current = false;
      setContent(null);
    }
  }, []);

  // Laid out (so it can be captured) but never visible.
  const card = content && (
    <View style={tw`absolute -left-[10000px] top-0`} pointerEvents="none" aria-hidden>
      <StoryCard ref={cardRef} content={content} onReady={onReady} />
    </View>
  );

  return { share, sharing: content !== null, card };
}
