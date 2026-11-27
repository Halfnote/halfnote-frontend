// Token-returning calls stay off HalfnoteClient, so the browser client can never receive raw tokens.
// Callers: web login/register server actions, the iOS session module.
import { send } from "./client";
import type { Credentials, RegisterInput } from "./endpoints";

export interface Tokens {
  access: string;
  refresh: string;
}

function toTokens(raw: unknown): Tokens {
  const { access_token, refresh_token } = (raw ?? {}) as Record<string, unknown>;
  if (typeof access_token !== "string" || typeof refresh_token !== "string") {
    throw new Error("Invalid token data received");
  }
  return { access: access_token, refresh: refresh_token };
}

export function requestTokens(baseUrl: string, c: Credentials): Promise<Tokens> {
  return send(
    { baseUrl },
    {
      method: "POST",
      path: "/accounts/login/",
      json: { username: c.username, password: c.password },
      parse: toTokens,
    },
  );
}

export type SignInMethod =
  /** `login` is a username or an email. */
  | { kind: "login"; login: string; password: string }
  | { kind: "register"; email: string; password: string }
  | { kind: "google"; idToken: string };

export interface SignedIn extends Tokens {
  username: string;
  needsOnboarding: boolean;
}

function toSignedIn(raw: unknown): SignedIn {
  const { needs_onboarding, user } = (raw ?? {}) as { needs_onboarding?: unknown; user?: { username?: unknown } };
  if (typeof needs_onboarding !== "boolean" || typeof user?.username !== "string") {
    throw new Error("Invalid sign-in data received");
  }
  return { ...toTokens(raw), username: user.username, needsOnboarding: needs_onboarding };
}

function signInRequest(m: SignInMethod): { path: `/${string}/`; json: object } {
  switch (m.kind) {
    case "login":
      return { path: "/accounts/login/", json: { login: m.login, password: m.password } };
    case "register":
      return { path: "/accounts/register/", json: { email: m.email, password: m.password } };
    case "google":
      return { path: "/accounts/auth/google/", json: { id_token: m.idToken } };
  }
}

/** Google creates the account the first time; `needsOnboarding` says whether the profile is still to be filled in. */
export function signIn(baseUrl: string, method: SignInMethod): Promise<SignedIn> {
  return send({ baseUrl }, { method: "POST", ...signInRequest(method), parse: toSignedIn });
}

/** SimpleJWT rotates refresh tokens: persist the returned `refresh`. The backend has no blacklist, so the old one stays valid until it expires. */
export function refreshTokens(baseUrl: string, refresh: string): Promise<Tokens> {
  return send(
    { baseUrl },
    {
      method: "POST",
      path: "/accounts/token/refresh/",
      json: { refresh },
      parse: (raw) => {
        const { access, refresh } = (raw ?? {}) as Record<string, unknown>;
        if (typeof access !== "string" || typeof refresh !== "string") {
          throw new Error("Invalid token data received");
        }
        return { access, refresh };
      },
    },
  );
}

export function registerAccount(baseUrl: string, input: RegisterInput): Promise<Tokens> {
  return send(
    { baseUrl },
    {
      method: "POST",
      path: "/accounts/register/",
      form: {
        username: input.username,
        email: input.email,
        password: input.password,
        bio: input.bio || undefined,
        avatar: input.avatar,
      },
      parse: toTokens,
    },
  );
}
