import type { ComponentType } from "react";
import type { StoryContent } from "../../storyDraft";

/** The part of a variant the story frame and the picker swatch read; each style extends it with its own params. */
export interface Variant {
  name: string;
  bg: string;
  /** CSS background-image for the whole story (dot screens, gradients). */
  img?: string;
  size?: string;
  ink: string;
  sub: string;
  dark: boolean;
  /** Plus swatch: a glyph over an optional shape `[w, h, radius, background]`. */
  mini?: { glyph?: string; font?: string; size?: number; ink?: string; sh?: [number, number, number, string]; bg?: string };
}

/** Variants depend on the content (label colour, headline length), so each style derives its three from it. */
export interface StyleDef {
  variants: (c: StoryContent) => readonly [Variant, Variant, Variant];
  /** Draws variant `i` inside the 360×640 story, above the background and under the footer. */
  Layout: ComponentType<{ c: StoryContent; i: number }>;
  /** The picker swatch; Plus styles fall back to the shared glyph swatch. */
  Mini?: ComponentType<{ c: StoryContent; i: number }>;
}
