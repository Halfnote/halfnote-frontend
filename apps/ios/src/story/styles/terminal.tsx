import { View } from "react-native";
import type { StoryContent } from "../../storyDraft";
import { Dots, Duotone, F, font, Lines, T } from "../kit";
import type { StyleDef, Variant } from "./types";

type V = Variant & { rule: string; duoLight: string; duoDark: string };

const mini = (ink: string) => ({ glyph: "$ _", font: F.mono, size: 18, ink });
const variants = (): [V, V, V] => [
  {
    name: "Phosphor",
    bg: "#0A0F0B",
    ink: "#3DFF7A",
    sub: "rgba(61,255,122,0.6)",
    dark: true,
    rule: "rgba(61,255,122,0.25)",
    duoLight: "#3DFF7A",
    duoDark: "#0A0F0B",
    mini: mini("#3DFF7A"),
  },
  {
    name: "Amber",
    bg: "#120C03",
    ink: "#FFB547",
    sub: "rgba(255,181,71,0.6)",
    dark: true,
    rule: "rgba(255,181,71,0.25)",
    duoLight: "#FFB547",
    duoDark: "#120C03",
    mini: mini("#FFB547"),
  },
  {
    name: "Paper",
    bg: "#F4F1E8",
    ink: "#1F2A44",
    sub: "#6B7280",
    dark: false,
    rule: "rgba(31,42,68,0.2)",
    duoLight: "#F4F1E8",
    duoDark: "#1F2A44",
    mini: mini("#1F2A44"),
  },
];

/** `[#########+.]`: a hash per point, `+` for a half. */
function asciiBar(score: number) {
  const full = Math.floor(score);
  const half = score - full >= 0.5 ? 1 : 0;
  return "#".repeat(full) + (half ? "+" : "") + ".".repeat(Math.max(0, 10 - full - half));
}

function Layout({ c, i }: { c: StoryContent; i: number }) {
  const v = variants()[i];
  const { show } = c;
  const long = c.mode === "long";
  const artS = long ? 104 : 128;
  const dim = (t: string) => <T sub>{t}</T>;
  const line = font(F.mono, 13, 1.45);
  const slug = `${c.handle}/${c.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <View style={{ position: "absolute", inset: 0, paddingTop: 24, paddingHorizontal: 24, paddingBottom: 82, gap: 12 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingBottom: 10, borderBottomWidth: 1, borderColor: v.rule }}>
        {[0, 1, 2].map((k) => (
          <View key={k} style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: v.sub }} />
        ))}
        <T sub style={[font(F.mono, 11), { flex: 1, textAlign: "center" }]}>
          halfnote — zsh — 80×24
        </T>
      </View>
      <T style={font(F.mono, 13, 1.5)}>
        {dim("~/crate $")} halfnote review --id {slug}
      </T>
      {(show.art || show.artist || show.rating) && (
        <View style={{ flexDirection: "row", gap: 14, alignItems: "flex-start" }}>
          {show.art && (
            <Duotone
              uri={c.art}
              light={v.duoLight}
              dark={v.duoDark}
              filter="grayscale(1) contrast(2.2)"
              style={{ width: artS, height: artS, borderWidth: 1, borderColor: v.rule }}
            >
              <Dots color={v.duoDark} r1={0.9} r2={1.3} size={4} />
              <Lines color="rgba(0,0,0,0.22)" period={3} offset={2} />
            </Duotone>
          )}
          <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
            {show.artist && (
              <>
                <T style={line}>
                  {dim("artist:")} {c.artist}
                </T>
                <T style={line}>
                  {dim("title:")} {c.title}
                </T>
              </>
            )}
            {show.rating && (
              <>
                <T style={line}>
                  {dim("rating:")} {c.scoreText}/10
                </T>
                <T style={line} numberOfLines={1}>
                  [{asciiBar(c.score)}]
                </T>
              </>
            )}
          </View>
        </View>
      )}
      {show.head && (
        <T style={font(F.mono500, long ? 14 : c.n <= 120 ? 17 : 15, 1.45)}>
          {dim("> ")}&quot;{c.head}&quot;
        </T>
      )}
      {show.body && (
        <View style={{ gap: 8 }}>
          {c.paras.map((p, k) => (
            <T key={k} style={[font(F.mono, 12.5, 1.55), { opacity: 0.85 }]}>
              {p}
            </T>
          ))}
        </View>
      )}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <T sub style={font(F.mono, 13)}>
          ~/crate $
        </T>
        {/* The design blinks this cursor; a story is a still, so it stays lit. */}
        <View style={{ width: 8, height: 15, backgroundColor: v.ink }} />
      </View>
    </View>
  );
}

export const terminal: StyleDef = { variants, Layout };
