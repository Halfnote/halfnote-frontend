import { use, type Ref } from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import type { GenreKey, StoryContent } from "../storyDraft";
import { ArtSettled, F, Ink, T, font } from "./kit";
import { styleFor } from "./styles";

export const STORY_W = 360;
export const STORY_H = 640;

interface StoryProps {
  c: StoryContent;
  genre: GenreKey;
  variant: number;
  ref?: Ref<View>;
  onArtSettled?: () => void;
}

/** The 9:16 story at 360×640 points; captured at 3× for the 1080×1920 image. */
export function Story({ c, genre, variant, ref, onArtSettled = () => {} }: StoryProps) {
  const { Layout, variants } = styleFor(genre);
  const v = variants(c)[variant];
  const allOff = !Object.values(c.show).some(Boolean);
  return (
    <View
      ref={ref}
      collapsable={false}
      style={{
        width: STORY_W,
        height: STORY_H,
        overflow: "hidden",
        backgroundColor: v.bg,
        experimental_backgroundImage: v.img,
        experimental_backgroundSize: v.size ?? "3px 3px",
      }}
    >
      <ArtSettled value={onArtSettled}>
        <Ink value={{ ink: v.ink, sub: v.sub }}>
          <Layout c={c} i={variant} />
          {allOff && <Empty />}
          <Footer c={c} ink={v.ink} />
        </Ink>
      </ArtSettled>
    </View>
  );
}

function Empty() {
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 80,
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        opacity: 0.45,
      }}
    >
      <EmptyGlyph />
      <T style={font(F.sans, 15)}>Pick something to include</T>
    </View>
  );
}

function EmptyGlyph() {
  const { ink } = use(Ink);
  return (
    <Svg width={42} height={90} viewBox="0 0 7 15" fill={ink}>
      <Path d="M2 0h3v2h-3zM2 2h1v2h-1zM4 2h1v2h-1zM1 4h3v1h-3zM1 5h1v1h-1zM3 5h1v1h-1zM0 6h1v3h-1zM2 6h3v1h-3zM6 6h1v3h-1zM2 7h1v2h-1zM4 7h1v2h-1zM1 9h1v2h-1zM4 9h2v2h-2zM5 11h1v2h-1zM0 13h2v1h-2zM4 13h2v1h-2zM1 14h4v1h-4z" />
    </Svg>
  );
}

/** Always on: the reviewer's identicon and handle, and the wordmark. */
function Footer({ c, ink }: { c: StoryContent; ink: string }) {
  return (
    <View
      style={{
        position: "absolute",
        left: 28,
        right: 28,
        bottom: 26,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 9 }}>
        <View
          aria-hidden
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: c.label,
            boxShadow: `0 0 0 1.5px ${ink}`,
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <View style={{ width: 15, flexDirection: "row", flexWrap: "wrap" }}>
            {c.pixels.map((on, k) => (
              <View key={k} style={{ width: 3, height: 3, backgroundColor: on ? "#EEEEEE" : "transparent" }} />
            ))}
          </View>
        </View>
        <T style={font(F.sans500, 14)}>@{c.handle}</T>
      </View>
      {/* The design's logo image is the wordmark; the app draws it as text (see the header in app/_layout.tsx). */}
      <T accessibilityLabel="halfnote" style={font(F.serifItalic, 30, 0.93)}>
        halfnote.
      </T>
    </View>
  );
}
