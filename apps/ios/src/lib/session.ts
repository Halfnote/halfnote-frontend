import * as SecureStore from "expo-secure-store";
import { useSyncExternalStore } from "react";
import {
  ApiError,
  createHalfnoteClient,
  refreshTokens,
  signIn as requestSignIn,
  type SignInMethod,
  type Tokens,
} from "@halfnote/data";

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "https://halfnote-backend.onrender.com/api";

const KEY = "halfnote.session";
const REFRESH_WINDOW_MS = 60_000;

type Session = Tokens & {
  username: string;
  /** Absent in sessions saved before onboarding existed, whose accounts all count as finished. */
  needsOnboarding?: boolean;
};

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
  if (session) void checkOnboarding(session);
}

// The stored flag opens the app without waiting on the network; the server has the final say.
async function checkOnboarding(stored: Session) {
  const before = !!stored.needsOnboarding;
  const user = await client.profile().catch(() => null);
  if (!user || !session || session.username !== stored.username || !!session.needsOnboarding !== before) return;
  const needsOnboarding = !!user.needs_onboarding;
  if (needsOnboarding !== before) await save({ ...session, needsOnboarding });
}

export function useSession(): Session | null | undefined {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => session,
  );
}

export async function signIn(method: SignInMethod) {
  await save(await requestSignIn(API_URL, method));
}

export async function setUsername(username: string) {
  if (session) await save({ ...session, username });
}

/** Stored at once, but the onboarding screens stay up until `leaveOnboarding`, so "You're in" can show. */
export async function storeOnboarded() {
  if (session) await SecureStore.setItemAsync(KEY, JSON.stringify({ ...session, needsOnboarding: false }));
}

export async function leaveOnboarding() {
  if (session) await save({ ...session, needsOnboarding: false });
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
    // A logout, or signing in again, while the refresh was in flight wins.
    if (session?.refresh !== current.refresh) return session?.access ?? null;
    await save({ ...session, ...tokens });
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
