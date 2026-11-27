import assert from "node:assert/strict";
import { test } from "node:test";
import { cleanHandle, isPlaceholder, samePicks, suggestHandle, togglePick, validHandle, type AlbumPick } from "./onboarding/model.ts";

const album = (discogsId: string): AlbumPick => ({ discogsId, title: discogsId, artist: "" });
const four = ["1", "2", "3", "4"].map(album);

test("picking adds in order, picking again removes, and a fifth is ignored", () => {
  assert.deepEqual(togglePick([album("1")], album("2")).map((p) => p.discogsId), ["1", "2"]);
  assert.deepEqual(togglePick(four, album("2")).map((p) => p.discogsId), ["1", "3", "4"]);
  assert.equal(togglePick(four, album("5")), four);
});

test("only a different set of albums counts as a change", () => {
  assert.ok(samePicks(four, [...four].reverse()));
  assert.ok(!samePicks(four, four.slice(1)));
  assert.ok(!samePicks([album("1")], [album("2")]));
});

test("usernames are suggested from the name, accents included", () => {
  assert.equal(suggestHandle("José Núñez"), "josenunez");
  assert.equal(suggestHandle("x".repeat(40)).length, 24);
  assert.equal(suggestHandle("日本"), "");
});

test("username rules match the server's", () => {
  assert.equal(cleanHandle(" Dee D "), "deed");
  for (const ok of ["ab", "a.b_c", "a".repeat(24)]) assert.ok(validHandle(ok), ok);
  for (const bad of ["a", "a".repeat(25), "..", "__", "a-b", "é1", ""]) assert.ok(!validHandle(bad), bad);
});

test("the server's placeholder username is recognised", () => {
  assert.ok(isPlaceholder("user0329ac3f9e3acc87041d"));
  assert.ok(!isPlaceholder("user2000"));
});
