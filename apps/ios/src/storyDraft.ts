import type { Album, Review } from "@halfnote/data";

/** Characters of body text that fit on a story under the headline. */
export const SNIPPET_LIMIT = 340;

/** An album with its average rating, or one review of it. */
export type Source = { album: Album; rating?: number } | { album: Album; review: Review };

export type Element = "art" | "head" | "body" | "artist" | "rating";
/** Short-take styles fit a headline; full-review styles fit a headline over paragraphs. */
export type Mode = "short" | "long";
export type Step = "elements" | "snippet" | "style";

export type GenreKey =
  | "billboard"
  | "sleeve"
  | "score"
  | "editorial"
  | "liner"
  | "system"
  | "matchbook"
  | "cassette"
  | "ticket"
  | "terminal"
  | "receipt"
  | "postcard"
  | "tattoo"
  | "graffiti"
  | "beer"
  | "heatmap";

/** In picker order: filtering by mode gives the design's standard and Plus rows. */
export const GENRES: Record<GenreKey, { name: string; fits: Mode | "both"; plus?: true }> = {
  billboard: { name: "Billboard", fits: "short" },
  sleeve: { name: "Sleeve", fits: "short" },
  score: { name: "Score", fits: "short" },
  editorial: { name: "Editorial", fits: "long" },
  liner: { name: "Liner Notes", fits: "long" },
  system: { name: "System", fits: "both" },
  matchbook: { name: "Matchbook", fits: "short", plus: true },
  cassette: { name: "Cassette", fits: "short", plus: true },
  ticket: { name: "Ticket Stub", fits: "short", plus: true },
  terminal: { name: "Terminal", fits: "both", plus: true },
  receipt: { name: "Receipt", fits: "both", plus: true },
  postcard: { name: "Postcard", fits: "both", plus: true },
  tattoo: { name: "Tattoo", fits: "short", plus: true },
  graffiti: { name: "Graffiti", fits: "short", plus: true },
  beer: { name: "Beer Can", fits: "short", plus: true },
  heatmap: { name: "Heat Map", fits: "short", plus: true },
};

export interface Draft {
  /** What the user switched on; `resolveShow` drops what the source can't show. */
  show: Record<Element, boolean>;
  /** Selected body paragraph indexes, in reading order. */
  snip: number[];
  genre: Record<Mode, GenreKey>;
  /** Variant index per style, remembered while browsing styles. */
  variant: Partial<Record<GenreKey, number>>;
  step: number;
}

export const initialDraft: Draft = {
  show: { art: true, head: true, body: true, artist: true, rating: true },
  snip: [0],
  genre: { short: "billboard", long: "editorial" },
  variant: {},
  step: 0,
};

/**
 * Reviews are one text field. The first paragraph reads as the headline; the rest is the body the
 * snippet step picks from. A one-paragraph review is headline only.
 */
export function splitReview(content: string): { head: string; paras: string[] } {
  const [head = "", ...paras] = content
    .split(/\s*\n\s*/)
    .map((p) => p.trim())
    .filter(Boolean);
  return { head, paras };
}

const textOf = (s: Source) => ("review" in s ? splitReview(s.review.content) : { head: "", paras: [] });
const ratingOf = (s: Source) => ("review" in s ? s.review.rating : s.rating);

/** The element toggles this source offers, in display order. */
export function elements(s: Source): Element[] {
  const { head, paras } = textOf(s);
  const all: [Element, boolean][] = [
    ["art", true],
    ["head", !!head],
    ["body", paras.length > 0],
    ["artist", true],
    ["rating", ratingOf(s) != null],
  ];
  return all.filter(([, ok]) => ok).map(([k]) => k);
}

export function resolveShow(s: Source, d: Draft): Record<Element, boolean> {
  const offered = elements(s);
  const on = (k: Element) => offered.includes(k) && d.show[k];
  return { art: on("art"), head: on("head"), body: on("body"), artist: on("artist"), rating: on("rating") };
}

export const modeOf = (s: Source, d: Draft): Mode => (resolveShow(s, d).body ? "long" : "short");

export const steps = (s: Source, d: Draft): Step[] =>
  modeOf(s, d) === "long" ? ["elements", "snippet", "style"] : ["elements", "style"];

/** Toggling Review off can remove the snippet step under the cursor, so the index is clamped. */
export function currentStep(s: Source, d: Draft): { index: number; step: Step; last: boolean } {
  const all = steps(s, d);
  const index = Math.min(d.step, all.length - 1);
  return { index, step: all[index], last: index === all.length - 1 };
}

export function nextBlocked(s: Source, d: Draft): boolean {
  const { step } = currentStep(s, d);
  if (step === "elements") return !Object.values(resolveShow(s, d)).some(Boolean);
  if (step === "snippet") return selected(s, d).length === 0;
  return false;
}

export function elementsNote(s: Source, d: Draft): string {
  const { head, paras } = textOf(s);
  if (!head) return "Sharing the album, so there's no headline. Short-take styles apply.";
  if (!paras.length) return "This is a short take, so the headline is the whole review. Short-take styles apply.";
  if (d.show.body) return `Full review, ${paras.length} paragraphs. Next you’ll choose which part to share.`;
  return "Review is off, so this shares as a short take: headline only, short-take styles.";
}

export function genresFor(mode: Mode): { std: GenreKey[]; plus: GenreKey[] } {
  const keys = (Object.keys(GENRES) as GenreKey[]).filter((k) => GENRES[k].fits === mode || GENRES[k].fits === "both");
  return { std: keys.filter((k) => !GENRES[k].plus), plus: keys.filter((k) => GENRES[k].plus) };
}

export function activeStyle(s: Source, d: Draft): { genre: GenreKey; variant: number } {
  const genre = d.genre[modeOf(s, d)];
  return { genre, variant: d.variant[genre] ?? 0 };
}

const selected = (s: Source, d: Draft) => d.snip.filter((i) => i < textOf(s).paras.length);

/** One paragraph, or two when they fit together. The first pick is always allowed, so an overlong paragraph still gets on. */
export function snippetBlocked(sel: number[], i: number, paras: string[]): boolean {
  if (sel.includes(i) || sel.length === 0) return false;
  const chars = sel.reduce((t, k) => t + paras[k].length, 0);
  return sel.length >= 2 || chars + paras[i].length > SNIPPET_LIMIT;
}

/** Selected paragraph indexes, in reading order. Returns `sel` itself when `i` can't be added or is the last one left. */
export function toggleSnippet(sel: number[], i: number, paras: string[]): number[] {
  if (sel.includes(i)) return sel.length > 1 ? sel.filter((k) => k !== i) : sel;
  if (snippetBlocked(sel, i, paras)) return sel;
  return [...sel, i].sort((a, b) => a - b);
}

// The API has no record-label colour, so each album gets a stable one from the muted label tones in the design's samples.
const LABELS = ["#6E5A3E", "#8A5A2B", "#4A4A52", "#7E1416", "#A3482A", "#1F6F78"];

function fnv(seed: string): number {
  let h = 2166136261;
  for (let k = 0; k < seed.length; k++) {
    h ^= seed.charCodeAt(k);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

/** Everything a story layout draws, already filtered by the draft. */
export interface StoryContent {
  art?: string;
  head: string;
  /** Headline length; layouts size the headline from it. */
  n: number;
  paras: string[];
  artist: string;
  title: string;
  score: number;
  /** One decimal, like "9.0". */
  scoreText: string;
  handle: string;
  show: Record<Element, boolean>;
  mode: Mode;
  /** The album's label colour, `L` in the design. */
  label: string;
  /** 5×5 mirrored identicon for the handle, row-major. */
  pixels: boolean[];
}

/** `viewer` signs album shares, which have no reviewer. */
export function storyContent(s: Source, d: Draft, viewer: string): StoryContent {
  const { head, paras } = textOf(s);
  const score = ratingOf(s) ?? 0;
  const handle = "review" in s ? s.review.username : viewer;
  const h = fnv(handle);
  return {
    art: s.album.cover_url,
    head,
    n: head.length,
    paras: selected(s, d).map((i) => paras[i]),
    artist: s.album.artist,
    title: s.album.title,
    score,
    scoreText: score.toFixed(1),
    handle,
    show: resolveShow(s, d),
    mode: modeOf(s, d),
    label: LABELS[fnv(s.album.discogs_id) % LABELS.length],
    pixels: Array.from({ length: 25 }, (_, i) => {
      const r = Math.floor(i / 5);
      const c = i % 5;
      return ((h >> (r * 3 + (c < 3 ? c : 4 - c))) & 1) === 1;
    }),
  };
}
