import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { ApiError, createHalfnoteClient, refreshTokens, requestTokens } from "./index";

type Call = { url: string; init: RequestInit & { headers: Record<string, string> } };
const realFetch = globalThis.fetch;
let calls: Call[] = [];

function stubFetch(status: number, body: unknown) {
  calls = [];
  globalThis.fetch = (async (url: string, init: Call["init"]) => {
    calls.push({ url, init });
    const text = body === undefined ? "" : JSON.stringify(body);
    return new Response(status === 204 ? null : text, { status });
  }) as typeof fetch;
}

afterEach(() => {
  globalThis.fetch = realFetch;
});

test("JSON body: sends serialized json with a JSON content type", async () => {
  stubFetch(201, { id: 7 });
  const client = createHalfnoteClient({ baseUrl: "https://api.test/api" });
  const review = await client.createReview({ discogsId: "42", rating: null, headline: "good", body: "" });

  assert.deepEqual(review, { id: 7 });
  assert.equal(calls[0].url, "https://api.test/api/music/albums/42/review/");
  assert.equal(calls[0].init.method, "POST");
  assert.equal(calls[0].init.headers["Content-Type"], "application/json");
  assert.deepEqual(JSON.parse(calls[0].init.body as string), { rating: null, headline: "good", body: "" }, "genres left out when unset");
});

test("FormData body: sends multipart fields and files, no hand-set content type", async () => {
  stubFetch(200, { username: "odi" });
  const client = createHalfnoteClient({ baseUrl: "/api/halfnote" });
  const avatar = new Blob(["png-bytes"], { type: "image/png" });
  await client.editProfile({ name: "odi", bio: "", avatar });

  const body = calls[0].init.body;
  assert.ok(body instanceof FormData, "body is FormData");
  assert.equal(body.get("name"), "odi");
  assert.equal(body.has("bio"), false, "empty fields are omitted");
  assert.equal(await (body.get("avatar") as Blob).text(), "png-bytes");
  assert.equal(calls[0].init.method, "PUT");
  assert.equal("Content-Type" in calls[0].init.headers, false);
});

test("401 calls onUnauthorized once, then throws ApiError(401) with Django's message", async () => {
  stubFetch(401, { detail: "Given token not valid" });
  let unauthorized = 0;
  const client = createHalfnoteClient({ baseUrl: "/api/halfnote", onUnauthorized: () => unauthorized++ });

  await assert.rejects(client.profile(), (err: unknown) => {
    assert.ok(err instanceof ApiError);
    assert.equal(err.status, 401);
    assert.equal(err.message, "Given token not valid");
    return true;
  });
  assert.equal(unauthorized, 1);
});

test("non-401 errors do not call onUnauthorized and normalize message|error", async () => {
  stubFetch(400, { error: "bad rating" });
  let unauthorized = 0;
  const client = createHalfnoteClient({ baseUrl: "/x", onUnauthorized: () => unauthorized++ });
  await assert.rejects(client.setLike(1, true), { name: "ApiError", status: 400, message: "bad rating" });
  assert.equal(unauthorized, 0);
});

test("no Authorization header when getToken is absent or returns null", async () => {
  stubFetch(200, { results: [] });
  await createHalfnoteClient({ baseUrl: "/x" }).searchAlbums("radiohead");
  assert.equal("Authorization" in calls[0].init.headers, false);
  assert.equal(calls[0].url, "/x/music/search/?q=radiohead");

  stubFetch(200, { results: [] });
  await createHalfnoteClient({ baseUrl: "/x", getToken: async () => null }).searchAlbums("a b");
  assert.equal("Authorization" in calls[0].init.headers, false);
  assert.equal(calls[0].url, "/x/music/search/?q=a%20b");
});

test("searchUsers returns Django's { users } body", async () => {
  const iostest = {
    id: 1, username: "iostest", email: "iostest@example.com", name: "", bio: null, location: null,
    avatar: null, follower_count: 0, following_count: 0, review_count: 0, is_staff: false,
  };
  stubFetch(200, { users: [iostest] });
  const res = await createHalfnoteClient({ baseUrl: "/x" }).searchUsers("ios test");
  assert.equal(calls[0].url, "/x/accounts/users/search/?q=ios%20test");
  assert.deepEqual(res.users, [iostest]);
});

test("Bearer header when getToken returns a token", async () => {
  stubFetch(200, { username: "odi" });
  await createHalfnoteClient({ baseUrl: "/x", getToken: () => "tok123" }).profile();
  assert.equal(calls[0].init.headers.Authorization, "Bearer tok123");
});

test("204 / empty body resolves to undefined", async () => {
  stubFetch(204, undefined);
  assert.equal(await createHalfnoteClient({ baseUrl: "/x" }).createList({ name: "faves" }), undefined);
});

test("requestTokens maps Django's token fields and never sends a token", async () => {
  stubFetch(200, { access_token: "a", refresh_token: "r", username: "odi" });
  assert.deepEqual(await requestTokens("https://api.test/api", { username: "odi", password: "pw" }), {
    access: "a",
    refresh: "r",
  });
  assert.equal(calls[0].url, "https://api.test/api/accounts/login/");
  assert.equal("Authorization" in calls[0].init.headers, false);
});

test("refreshTokens posts the refresh token and returns the rotated pair", async () => {
  stubFetch(200, { access: "a2", refresh: "r2" });
  assert.deepEqual(await refreshTokens("https://api.test/api", "r1"), { access: "a2", refresh: "r2" });
  assert.equal(calls[0].url, "https://api.test/api/accounts/token/refresh/");
  assert.equal(calls[0].init.method, "POST");
  assert.deepEqual(JSON.parse(calls[0].init.body as string), { refresh: "r1" });

  stubFetch(200, { access: "a2" });
  await assert.rejects(refreshTokens("https://api.test/api", "r1"), /Invalid token data/);
});
