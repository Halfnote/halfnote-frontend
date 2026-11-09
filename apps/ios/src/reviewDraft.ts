import type { Review, SearchResult } from "@halfnote/data";

/** The contract's headline limits: three serif lines, 150 characters. */
export const HEADLINE_LINES = 3;
export const HEADLINE_CHARS = 150;

/** The composer is one screen moving through three steps. */
export type Step = { kind: "pick" } | { kind: "compose"; album: SearchResult } | { kind: "posted"; review: Review };

export interface Draft {
  rating: number | null;
  headline: string;
  body: string;
}

export const emptyDraft: Draft = { rating: null, headline: "", body: "" };

/**
 * Cuts the headline at the first of: the end of line 3, or the last word that fits in `maxChars`.
 * `lines` is the headline as laid out (onTextLayout), so joined they are the whole headline.
 * Returns the headline untouched when nothing spills, so a trailing space being typed survives.
 */
export function spill(lines: string[], maxChars = HEADLINE_CHARS): { headline: string; rest: string } {
  const full = lines.join("");
  let cut = lines.slice(0, HEADLINE_LINES).join("").length;
  if (cut > maxChars) {
    const space = full.lastIndexOf(" ", maxChars);
    cut = space > 0 ? space : maxChars;
  }
  if (cut >= full.length) return { headline: full, rest: "" };
  return { headline: full.slice(0, cut).trimEnd(), rest: full.slice(cut).trimStart() };
}

/** A review needs a rating, a headline, or both. */
export const canPost = (d: Draft) => d.rating !== null || d.headline.trim() !== "";

export const isFullReview = (body: string) => body !== "";
