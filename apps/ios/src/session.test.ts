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
  await session.loadSession();
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
