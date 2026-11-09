import assert from "node:assert/strict";
import { test } from "node:test";
import type { Album, Review } from "@halfnote/data";
import {
  activeStyle,
  currentStep,
  elements,
  genresFor,
  initialDraft,
  modeOf,
  nextBlocked,
  splitReview,
  steps,
  storyContent,
  toggleSnippet,
  type Draft,
  type Source,
} from "./storyDraft.ts";

const album = { id: "a", title: "Lemonade", artist: "Beyoncé", discogs_id: "123" } as Album;
const review = (content: string): Source => ({ album, review: { username: "priya", rating: 9, content } as Review });
const long = review("Quip.\n\nOne.\n\nTwo.");
const short = review("Just a quip.");
const albumOnly: Source = { album, rating: 8.46 };
const off = (d: Draft, ...keys: (keyof Draft["show"])[]): Draft => ({
  ...d,
  show: { ...d.show, ...Object.fromEntries(keys.map((k) => [k, false])) },
});

test("first paragraph is the headline, the rest is body", () => {
  assert.deepEqual(splitReview("Big quip.\n\nPara one.\n  \nPara two.\n"), { head: "Big quip.", paras: ["Para one.", "Para two."] });
  assert.deepEqual(splitReview("Just a quip."), { head: "Just a quip.", paras: [] });
  assert.deepEqual(splitReview(""), { head: "", paras: [] });
});

test("snippet takes one paragraph, or two that fit together", () => {
  const short = ["a".repeat(100), "b".repeat(100), "c".repeat(100)];
  assert.deepEqual(toggleSnippet([0], 2, short), [0, 2]);
  assert.deepEqual(toggleSnippet([2], 0, short), [0, 2], "kept in reading order");
  const two = [0, 1];
  assert.equal(toggleSnippet(two, 2, short), two, "no third paragraph");
  assert.deepEqual(toggleSnippet([0, 1], 0, short), [1], "deselect");
  const last = [1];
  assert.equal(toggleSnippet(last, 1, short), last, "the last selection stays");

  const long = ["a".repeat(300), "b".repeat(100), "c".repeat(400)];
  const one = [0];
  assert.equal(toggleSnippet(one, 1, long), one, "two that overflow the limit");
  assert.deepEqual(toggleSnippet([], 2, long), [2], "an overlong paragraph alone is still allowed");
});

test("a review with body paragraphs and Review on is long and gets a snippet step", () => {
  assert.equal(modeOf(long, initialDraft), "long");
  assert.deepEqual(steps(long, initialDraft), ["elements", "snippet", "style"]);
  assert.equal(modeOf(long, off(initialDraft, "body")), "short");
  assert.deepEqual(steps(long, off(initialDraft, "body")), ["elements", "style"]);
  assert.equal(modeOf(short, initialDraft), "short");
  assert.deepEqual(steps(short, initialDraft), ["elements", "style"]);
});

test("album shares offer art, album and rating only, and are short", () => {
  assert.deepEqual(elements(albumOnly), ["art", "artist", "rating"]);
  assert.deepEqual(elements({ album }), ["art", "artist"], "no rating without one");
  assert.deepEqual(elements(short), ["art", "head", "artist", "rating"]);
  assert.deepEqual(elements(long), ["art", "head", "body", "artist", "rating"]);
  const unrated: Source = { album, review: { username: "priya", rating: null, content: "Just a quip." } as Review };
  assert.deepEqual(elements(unrated), ["art", "head", "artist"], "an unrated review offers no rating toggle");
  assert.equal(storyContent(unrated, initialDraft, "odi").show.rating, false, "and never shows one");
  assert.equal(modeOf(albumOnly, initialDraft), "short");
  const c = storyContent(albumOnly, initialDraft, "viewer");
  assert.equal(c.handle, "viewer");
  assert.equal(c.scoreText, "8.5");
  assert.equal(c.show.head, false);
});

test("next is blocked when nothing is on, or no snippet is picked", () => {
  assert.equal(nextBlocked(albumOnly, off(initialDraft, "art", "artist", "rating")), true);
  assert.equal(nextBlocked(albumOnly, off(initialDraft, "art", "artist")), false);
  assert.equal(nextBlocked(long, { ...initialDraft, step: 1, snip: [] }), true);
  assert.equal(nextBlocked(long, { ...initialDraft, step: 1 }), false);
});

test("turning Review off past the snippet step lands on the last step", () => {
  const d = off({ ...initialDraft, step: 2 }, "body");
  assert.deepEqual(currentStep(long, d), { index: 1, step: "style", last: true });
});

test("styles are offered per mode in the design's order", () => {
  assert.deepEqual(genresFor("short"), {
    std: ["billboard", "sleeve", "score", "system"],
    plus: ["matchbook", "cassette", "ticket", "terminal", "receipt", "postcard", "tattoo", "graffiti", "beer", "heatmap"],
  });
  assert.deepEqual(genresFor("long"), { std: ["editorial", "liner", "system"], plus: ["terminal", "receipt", "postcard"] });
});

test("each mode keeps its own style, and each style its own variant", () => {
  const d: Draft = { ...initialDraft, genre: { short: "score", long: "liner" }, variant: { liner: 2 } };
  assert.deepEqual(activeStyle(long, d), { genre: "liner", variant: 2 });
  assert.deepEqual(activeStyle(short, d), { genre: "score", variant: 0 });
});

test("story content carries only the selected paragraphs", () => {
  assert.deepEqual(storyContent(long, { ...initialDraft, snip: [1] }, "v").paras, ["Two."]);
  assert.equal(storyContent(long, initialDraft, "v").scoreText, "9.0");
  assert.equal(storyContent(long, initialDraft, "v").label, storyContent(short, initialDraft, "v").label, "stable per album");
});
