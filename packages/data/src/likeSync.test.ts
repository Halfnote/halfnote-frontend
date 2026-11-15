import { test, mock, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { createLikeSync, patchLike } from "./likeSync";

type Req = { liked: boolean; resolve: () => void; reject: (e: Error) => void };
let sent: Req[];
let failed: [number, boolean][];

const setup = () =>
  createLikeSync({
    send: (_id, liked) => new Promise<void>((resolve, reject) => sent.push({ liked, resolve, reject })),
    onFailed: (id, liked) => failed.push([id, liked]),
  });
const settle = () => new Promise((r) => setImmediate(r));

beforeEach(() => {
  mock.timers.enable({ apis: ["setTimeout"] });
  sent = [];
  failed = [];
});
afterEach(() => mock.timers.reset());

test("a burst of taps sends one request with the last state", async () => {
  const likes = setup();
  for (const liked of [true, false, true, false, true]) likes.set(1, liked);
  mock.timers.tick(400);
  await settle();
  assert.deepEqual(sent.map((r) => r.liked), [true]);
});

test("an unlike made while the like is out waits for it, so the server ends unliked", async () => {
  const likes = setup();
  likes.set(1, true);
  mock.timers.tick(400);
  await settle();
  likes.set(1, false);
  mock.timers.tick(400);
  await settle();
  assert.equal(sent.length, 1, "DELETE must not race the PUT");
  sent[0].resolve();
  await settle();
  assert.deepEqual(sent.map((r) => r.liked), [true, false]);
});

test("a failed request reports what it asked for", async () => {
  const likes = setup();
  likes.set(1, true);
  mock.timers.tick(400);
  await settle();
  sent[0].reject(new Error("down"));
  await settle();
  assert.deepEqual(failed, [[1, true]]);
});

test("flush sends pending taps without waiting", async () => {
  const likes = setup();
  likes.set(1, true);
  likes.set(2, false);
  likes.flush();
  await settle();
  assert.deepEqual(sent.map((r) => r.liked), [true, false]);
  mock.timers.tick(400);
  await settle();
  assert.equal(sent.length, 2, "the cleared timers do not send again");
});

test("patchLike flips the review in every cached shape and leaves other ids alone", () => {
  const feed = { pages: [{ results: [{ review: { id: 1, is_liked: false, likes_count: 3 } }, { review: { id: 2, is_liked: false, likes_count: 0 } }] }] };
  const activity = [{ id: 1, review_details: { id: 9, is_liked_by_user: true, likes_count: 3 } }];
  const liked = patchLike(feed, 1, true) as typeof feed;
  assert.deepEqual(liked.pages[0].results[0].review, { id: 1, is_liked: true, likes_count: 4 });
  assert.equal(liked.pages[0].results[1], feed.pages[0].results[1], "untouched card keeps its reference");
  assert.equal(patchLike(activity, 1, false), activity, "activity id 1 is not review 1");
  assert.deepEqual((patchLike(activity, 9, false) as typeof activity)[0].review_details, { id: 9, is_liked_by_user: false, likes_count: 2 });
});
