import assert from "node:assert/strict";
import { before, beforeEach, mock, test } from "node:test";

const store = new Map<string, string>();
mock.module("expo-secure-store", {
  namedExports: {
    getItemAsync: async (k: string) => store.get(k) ?? null,
    setItemAsync: async (k: string, v: string) => void store.set(k, v),
    deleteItemAsync: async (k: string) => void store.delete(k),
  },
});
let session: typeof import("./session");
before(async () => {
  session = await import("./session");
});

const jwt = (exp: number) => `h.${btoa(JSON.stringify({ exp }))}.s`;
const expiring = jwt(Math.floor(Date.now() / 1000) + 10);
const KEY = "halfnote.session";

let profileAuth: string | undefined;
const settle = () => new Promise((r) => setTimeout(r, 5));

function stubRefresh(status: number | "offline") {
  globalThis.fetch = (async (url: string, init: RequestInit & { headers: Record<string, string> }) => {
    if (url.endsWith("/accounts/token/refresh/")) {
      if (status === "offline") throw new TypeError("Network request failed");
      return new Response("{}", { status });
    }
    profileAuth = init.headers.Authorization;
    return new Response(JSON.stringify({ username: "odi" }), { status: 200 });
  }) as typeof fetch;
}

beforeEach(async () => {
  profileAuth = undefined;
  store.set(KEY, JSON.stringify({ access: expiring, refresh: "r", username: "odi" }));
  stubRefresh("offline");
  await session.loadSession();
  await settle();
  profileAuth = undefined;
});

for (const status of [404, 500, 503, "offline"] as const) {
  test(`refresh ${status} keeps the session and sends the current token`, async () => {
    stubRefresh(status);
    await session.client.profile();
    assert.equal(profileAuth, `Bearer ${expiring}`);
    assert.ok(store.has(KEY));
  });
}

for (const status of [400, 401]) {
  test(`refresh ${status} signs out and sends no token`, async () => {
    stubRefresh(status);
    await session.client.profile();
    assert.equal(profileAuth, undefined);
    assert.ok(!store.has(KEY));
  });
}

const signedIn = { access: jwt(Math.floor(Date.now() / 1000) + 3600), refresh: "r", username: "odi" };
const stored = () => JSON.parse(store.get(KEY)!) as { username: string; needsOnboarding?: boolean; access: string };

function stubProfile(respond: () => Promise<Response> | Response) {
  globalThis.fetch = (async (url: string) => (url.endsWith("/accounts/profile/") ? respond() : new Response("{}", { status: 404 }))) as typeof fetch;
}

const profile = (needs_onboarding: boolean) => () => new Response(JSON.stringify({ username: "odi", needs_onboarding }));

test("launch takes the server's answer over the stored onboarding flag, both ways", async () => {
  for (const needs of [true, false]) {
    store.set(KEY, JSON.stringify({ ...signedIn, needsOnboarding: !needs }));
    stubProfile(profile(needs));
    await session.loadSession();
    await settle();
    assert.equal(stored().needsOnboarding, needs);
  }
});

test("launch offline keeps the stored onboarding flag", async () => {
  store.set(KEY, JSON.stringify({ ...signedIn, needsOnboarding: true }));
  stubProfile(() => Promise.reject(new TypeError("Network request failed")));
  await session.loadSession();
  await settle();
  assert.equal(stored().needsOnboarding, true);
});

test("a slow launch check doesn't undo onboarding that finished meanwhile", async () => {
  store.set(KEY, JSON.stringify({ ...signedIn, needsOnboarding: true }));
  let answer!: (r: Response) => void;
  stubProfile(() => new Promise((r) => (answer = r)));
  await session.loadSession();
  await settle();
  await session.leaveOnboarding();
  answer(profile(true)());
  await settle();
  assert.equal(stored().needsOnboarding, false);
});

test("a username picked while tokens refresh survives the refresh", async () => {
  let answer!: (r: Response) => void;
  globalThis.fetch = (async (url: string) =>
    url.endsWith("/accounts/token/refresh/") ? new Promise<Response>((r) => (answer = r)) : profile(false)()) as typeof fetch;
  const request = session.client.profile();
  await settle();
  await session.setUsername("dee");
  answer(new Response(JSON.stringify({ access: signedIn.access, refresh: "r2" })));
  await request;
  assert.equal(stored().username, "dee");
  assert.equal(stored().access, signedIn.access);
});

test("signing in keeps the server's username and onboarding flag", async () => {
  globalThis.fetch = (async () =>
    new Response(JSON.stringify({ access_token: signedIn.access, refresh_token: "r", needs_onboarding: true, user: { username: "user01" } }))) as typeof fetch;
  await session.signIn({ kind: "login", login: "Dee@Example.com", password: "x" });
  assert.equal(stored().username, "user01");
  assert.equal(stored().needsOnboarding, true);
});
