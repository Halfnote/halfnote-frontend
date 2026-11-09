import * as SecureStore from "expo-secure-store";
import { useSyncExternalStore } from "react";
import {
  ApiError,
  createHalfnoteClient,
  refreshTokens,
  requestTokens,
  type Credentials,
  type Tokens,
} from "@halfnote/data";

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "https://halfnote-backend.vercel.app/api";

const KEY = "halfnote.session";
const REFRESH_WINDOW_MS = 60_000;

type Session = Tokens & { username: string };

// undefined until SecureStore has been read once.
let session: Session | null | undefined;
let refreshing: Promise<string | null> | null = null;
const listeners = new Set<() => void>();

function publish(next: Session | null) {
  session = next;
  listeners.forEach((l) => l());
}

async function save(next: Session | null) {
  if (next) await SecureStore.setItemAsync(KEY, JSON.stringify(next));
  else await SecureStore.deleteItemAsync(KEY);
  publish(next);
}

export async function loadSession() {
  const raw = await SecureStore.getItemAsync(KEY);
  publish(raw ? (JSON.parse(raw) as Session) : null);
}

export function useSession(): Session | null | undefined {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => session,
  );
}

export async function login(c: Credentials) {
  const tokens = await requestTokens(API_URL, c);
  await save({ ...tokens, username: c.username });
}

/** The root layout clears the query cache when the session becomes null. */
export async function logout() {
  await save(null);
}

function expiresAtMs(jwt: string): number {
  const b64 = jwt.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  const { exp } = JSON.parse(atob(b64.padEnd(Math.ceil(b64.length / 4) * 4, "="))) as { exp: number };
  return exp * 1000;
}

async function refresh(current: Session): Promise<string | null> {
  try {
    const tokens = await refreshTokens(API_URL, current.refresh);
    // A logout while the refresh was in flight wins.
    if (session !== current) return session?.access ?? null;
    await save({ ...current, ...tokens });
    return tokens.access;
  } catch (err) {
    if (err instanceof ApiError && (err.status === 400 || err.status === 401)) {
      await logout();
      return null;
    }
    return session?.access ?? null;
  }
}

async function getToken(): Promise<string | null> {
  if (!session) return null;
  if (expiresAtMs(session.access) - Date.now() > REFRESH_WINDOW_MS) return session.access;
  refreshing ??= refresh(session).finally(() => {
    refreshing = null;
  });
  return refreshing;
}

export const client = createHalfnoteClient({
  baseUrl: API_URL,
  getToken,
  onUnauthorized: () => void logout(),
});
