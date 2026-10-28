/** Characters of body text that fit on a story under the headline. */
export const SNIPPET_LIMIT = 340;

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

/** One paragraph, or two when they fit together. The first pick is always allowed, so an overlong paragraph still gets on. */
export function snippetBlocked(sel: number[], i: number, paras: string[]): boolean {
  if (sel.includes(i) || sel.length === 0) return false;
  const chars = sel.reduce((t, k) => t + paras[k].length, 0);
  return sel.length >= 2 || chars + paras[i].length > SNIPPET_LIMIT;
}

/** Selected paragraph indexes, in reading order. Returns `sel` itself when `i` can't be added. */
export function toggleSnippet(sel: number[], i: number, paras: string[]): number[] {
  if (sel.includes(i)) return sel.filter((k) => k !== i);
  if (snippetBlocked(sel, i, paras)) return sel;
  return [...sel, i].sort((a, b) => a - b);
}
