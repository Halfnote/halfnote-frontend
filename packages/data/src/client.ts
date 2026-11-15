import { endpoints, type Endpoint, type Endpoints } from "./endpoints";

export interface ClientConfig {
  /** Django API root, or a same-origin proxy prefix. No trailing slash. */
  baseUrl: string;
  /** Omit on web, where the httpOnly cookie is attached by the proxy. */
  getToken?: () => string | null | Promise<string | null>;
  /** Called once per 401, before the ApiError is thrown. */
  onUnauthorized?: () => void;
}

type ResultOf<E> = E extends Endpoint<infer T> ? T : never;

export type HalfnoteClient = {
  [K in keyof Endpoints]: (
    ...args: Parameters<Endpoints[K]>
  ) => Promise<ResultOf<ReturnType<Endpoints[K]>>>;
};

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

function errorMessage(body: unknown): string | undefined {
  if (typeof body !== "object" || body === null) return undefined;
  const { message, detail, error } = body as Record<string, unknown>;
  const m = message ?? detail ?? error;
  return typeof m === "string" ? m : undefined;
}

export async function send<T>(config: ClientConfig, ep: Endpoint<T>): Promise<T> {
  let url = config.baseUrl + ep.path;
  if (ep.query) {
    url +=
      "?" +
      Object.entries(ep.query)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join("&");
  }

  const headers: Record<string, string> = {};
  const token = await config.getToken?.();
  if (token) headers.Authorization = `Bearer ${token}`;

  let body: string | FormData | undefined;
  if (ep.json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(ep.json);
  } else if (ep.form) {
    // No Content-Type: fetch sets multipart/form-data with the boundary.
    const form = new FormData();
    for (const [key, value] of Object.entries(ep.form)) {
      // RN FormData accepts {uri, name, type}; the DOM typings only know Blob.
      if (value !== undefined) form.append(key, value as Blob);
    }
    body = form;
  }

  const res = await fetch(url, { method: ep.method, headers, body });
  const text = await res.text();

  if (!res.ok) {
    if (res.status === 401) config.onUnauthorized?.();
    const message = errorMessage(parseJson(text)) ?? (res.statusText || `Request failed (${res.status})`);
    throw new ApiError(res.status, message);
  }
  if (!text) return undefined as T;
  const raw = parseJson(text);
  if (raw === undefined) throw new ApiError(res.status, "Invalid JSON response");
  return ep.parse(raw);
}

export function createHalfnoteClient(config: ClientConfig): HalfnoteClient {
  const client: Record<string, (...args: never[]) => Promise<unknown>> = {};
  for (const [name, endpoint] of Object.entries(endpoints)) {
    const toRequest = endpoint as (...args: unknown[]) => Endpoint<unknown>;
    client[name] = (...args) => send(config, toRequest(...args));
  }
  return client as HalfnoteClient;
}
