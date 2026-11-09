import assert from "node:assert/strict";
import { test } from "node:test";
import { canPost, emptyDraft, spill } from "./reviewDraft.ts";

test("spill: a headline that fits three lines stays put", () => {
  assert.deepEqual(spill(["The best album ", "of the decade, ", "no contest "]), {
    headline: "The best album of the decade, no contest ",
    rest: "",
  });
});

test("spill: a fourth line moves to the body", () => {
  assert.deepEqual(spill(["One two ", "three four ", "five six ", "seven eight"]), {
    headline: "One two three four five six",
    rest: "seven eight",
  });
});

test("spill: 150 characters before line 3 cuts at the last whole word", () => {
  const words = "word ".repeat(40).trim(); // 199 chars, "word" at every 5th index
  const { headline, rest } = spill([words]);
  assert.equal(headline, "word ".repeat(30).trim(), "149 chars, the 31st word would pass 150");
  assert.equal(rest, "word ".repeat(10).trim());
});

test("canPost needs a rating or a headline", () => {
  assert.equal(canPost(emptyDraft), false, "neither");
  assert.equal(canPost({ ...emptyDraft, rating: 7 }), true, "rating only");
  assert.equal(canPost({ ...emptyDraft, headline: "Yes." }), true, "headline only");
  assert.equal(canPost({ ...emptyDraft, rating: 7, headline: "Yes." }), true, "both");
  assert.equal(canPost({ ...emptyDraft, headline: "   " }), false, "a blank headline is no headline");
});
