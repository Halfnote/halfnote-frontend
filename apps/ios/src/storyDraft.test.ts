import assert from "node:assert/strict";
import { test } from "node:test";
import { splitReview, toggleSnippet } from "./storyDraft.ts";

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

  const long = ["a".repeat(300), "b".repeat(100), "c".repeat(400)];
  const one = [0];
  assert.equal(toggleSnippet(one, 1, long), one, "two that overflow the limit");
  assert.deepEqual(toggleSnippet([], 2, long), [2], "an overlong paragraph alone is still allowed");
});
