// React-free like state machine: debounces taps per review and keeps one request in flight,
// so the server always ends on the last state the user picked (see runbooks/activity-contract.md).

export interface LikeResult {
  liked: boolean;
  likes_count: number;
}

interface Entry {
  confirmed: boolean;
  desired: boolean;
  timer?: ReturnType<typeof setTimeout>;
  inFlight: boolean;
}

export interface LikeSyncOptions {
  send: (reviewId: number, liked: boolean) => Promise<LikeResult>;
  /** The server agrees with the user's last tap. */
  onConfirmed: (reviewId: number, result: LikeResult) => void;
  /** A request failed; `liked` is the server's last known state to revert to. */
  onFailed: (reviewId: number, liked: boolean) => void;
  delayMs?: number;
}

export interface LikeSync {
  /** Record the user's tap. Every caller flips the heart, so the server state is `!liked` until we know better. */
  set: (reviewId: number, liked: boolean) => void;
  /** Send every pending change now (app going to the background). */
  flush: () => void;
}

/**
 * Set a review's like state anywhere inside cached data, whatever the shape: old reviews carry
 * `is_liked_by_user`, feed cards `is_liked`. Without `likesCount` the count moves by one when the state flips.
 * Returns `node` itself when nothing matched, so React Query keeps the old reference.
 */
export function patchLike(node: unknown, id: number, liked: boolean, likesCount?: number): unknown {
  if (Array.isArray(node)) {
    const out = node.map((n) => patchLike(n, id, liked, likesCount));
    return out.some((n, i) => n !== node[i]) ? out : node;
  }
  if (typeof node !== "object" || node === null) return node;
  const o = node as Record<string, unknown>;
  const key = "is_liked_by_user" in o ? "is_liked_by_user" : "is_liked" in o ? "is_liked" : null;
  if (key && o.id === id) {
    const flip = o[key] === liked ? 0 : liked ? 1 : -1;
    return { ...o, [key]: liked, likes_count: likesCount ?? (o.likes_count as number) + flip };
  }
  let changed = false;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(o)) {
    out[k] = patchLike(v, id, liked, likesCount);
    if (out[k] !== v) changed = true;
  }
  return changed ? out : node;
}

export function createLikeSync({ send, onConfirmed, onFailed, delayMs = 400 }: LikeSyncOptions): LikeSync {
  const entries = new Map<number, Entry>();

  function fire(id: number) {
    const e = entries.get(id);
    if (!e) return;
    e.timer = undefined;
    if (e.inFlight) return; // settle() re-checks
    if (e.desired === e.confirmed) {
      entries.delete(id);
      return;
    }
    e.inFlight = true;
    const sent = e.desired;
    send(id, sent).then(
      (result) => {
        e.inFlight = false;
        e.confirmed = result.liked;
        if (e.timer) return; // a newer tap is waiting on its debounce
        if (e.desired === e.confirmed) {
          entries.delete(id);
          onConfirmed(id, result);
        } else {
          fire(id);
        }
      },
      () => {
        clearTimeout(e.timer);
        entries.delete(id);
        onFailed(id, e.confirmed);
      },
    );
  }

  return {
    set(id, liked) {
      const e = entries.get(id) ?? { confirmed: !liked, desired: liked, inFlight: false };
      entries.set(id, e);
      e.desired = liked;
      clearTimeout(e.timer);
      e.timer = setTimeout(() => fire(id), delayMs);
    },
    flush() {
      for (const [id, e] of entries) {
        if (!e.timer) continue;
        clearTimeout(e.timer);
        fire(id);
      }
    },
  };
}
