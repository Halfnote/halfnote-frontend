import { test, mock, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { createLikeSync, patchLike, type LikeResult } from "./likeSync";

type Pending = { liked: boolean; resolve: (r: LikeResult) => void; reject: (e: Error) => void };

let sent: Pending[];
let confirmed: [number, LikeResult][];
let failed: [number, boolean][];
let server: boolean;

function setup() {
  return createLikeSync({
    send: (_id, liked) =>
      new Promise<LikeResult>((resolve, reject) => {
        sent.push({ liked, resolve, reject });
      }),
    onConfirmed: (id, r) => confirmed.push([id, r]),
    onFailed: (id, liked) => failed.push([id, liked]),
  });
}

/** Resolve the oldest open request the way the server would. */
async function respond() {
  const req = sent.find((r) => r.resolve !== undefined)!;
  server = req.liked;
  req.resolve({ liked: req.liked, likes_count: req.liked ? 1 : 0 });
  (req as Partial<Pending>).resolve = undefined;
  await Promise.resolve(); // let .then run
}

beforeEach(() => {
  mock.timers.enable({ apis: ["setTimeout"] });
  sent = [];
  confirmed = [];
  failed = [];
  server = false;
});
afterEach(() => mock.timers.reset());

test("like then unlike inside the debounce sends nothing", () => {
  const s = setup();
  s.set(1, true);
  s.set(1, false);
  mock.timers.tick(400);
  assert.equal(sent.length, 0);
});

test("rapid taps send only the final state, once", async () => {
  const s = setup();
  for (let i = 0; i < 9; i++) {
    s.set(1, i % 2 === 0); // ends on liked after 9 taps
    mock.timers.tick(100);
  }
  mock.timers.tick(400);
  assert.deepEqual(sent.map((r) => r.liked), [true]);
  await respond();
  assert.equal(server, true);
  assert.deepEqual(confirmed, [[1, { liked: true, likes_count: 1 }]]);
});

test("unlike while the like is in flight: DELETE goes after the PUT settles, never alongside it", async () => {
  const s = setup();
  s.set(1, true);
  mock.timers.tick(400);
  s.set(1, false);
  mock.timers.tick(400);
  assert.equal(sent.length, 1, "second request waits for the first");
  await respond();
  assert.deepEqual(sent.map((r) => r.liked), [true, false]);
  assert.deepEqual(confirmed, [], "no confirmation while the user's state is still unsent");
  await respond();
  assert.equal(server, false);
  assert.deepEqual(confirmed, [[1, { liked: false, likes_count: 0 }]]);
});

test("unlike after the like has landed sends a DELETE", async () => {
  const s = setup();
  s.set(1, true);
  mock.timers.tick(400);
  await respond();
  s.set(1, false);
  mock.timers.tick(400);
  await respond();
  assert.deepEqual(sent.map((r) => r.liked), [true, false]);
  assert.equal(server, false);
});

test("failure reverts to the server's last state", async () => {
  const s = setup();
  s.set(1, true);
  mock.timers.tick(400);
  sent[0].reject(new Error("offline"));
  await Promise.resolve();
  assert.deepEqual(failed, [[1, false]]);
});

test("flush sends a pending unlike without waiting for the debounce", async () => {
  const s = setup();
  s.set(1, true);
  mock.timers.tick(400);
  await respond();
  s.set(1, false);
  s.flush();
  assert.deepEqual(sent.map((r) => r.liked), [true, false]);
});

test("reviews debounce independently", () => {
  const s = setup();
  s.set(1, true);
  mock.timers.tick(300);
  s.set(2, true);
  mock.timers.tick(100);
  assert.equal(sent.length, 1);
  mock.timers.tick(300);
  assert.equal(sent.length, 2);
});

test("patchLike flips the review in every cached shape and leaves other ids alone", () => {
  const feed = { pages: [{ results: [{ review: { id: 1, is_liked: false, likes_count: 4 } }, { review: { id: 2, is_liked: false, likes_count: 0 } }] }] };
  const activity = [{ id: 1, review_details: { id: 9, is_liked_by_user: true, likes_count: 3 } }];
  const liked = patchLike(feed, 1, true) as typeof feed;
  assert.deepEqual(liked.pages[0].results[0].review, { id: 1, is_liked: true, likes_count: 5 });
  assert.equal(liked.pages[0].results[1], feed.pages[0].results[1], "untouched card keeps its reference");
  assert.deepEqual(patchLike(liked, 1, true, 12), { pages: [{ results: [{ review: { id: 1, is_liked: true, likes_count: 12 } }, feed.pages[0].results[1]] }] });
  assert.equal(patchLike(activity, 1, false), activity, "activity id 1 is not review 1");
  assert.deepEqual((patchLike(activity, 9, false) as typeof activity)[0].review_details, { id: 9, is_liked_by_user: false, likes_count: 2 });
});
