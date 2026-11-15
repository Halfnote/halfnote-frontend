// Debounces like taps per review, then sends the last one. PUT and DELETE are idempotent, so the only
// hazard is two requests for one review arriving out of order: each waits for the one before it.

export interface LikeSync {
  set: (reviewId: number, liked: boolean) => void;
  /** Send every pending tap now (app going to the background). */
  flush: () => void;
}

/**
 * Set a review's like state anywhere inside cached data, whatever the shape: old reviews carry
 * `is_liked_by_user`, feed cards `is_liked`. The count moves by one when the state flips.
 * Returns `node` itself when nothing matched, so React Query keeps the old reference.
 */
export function patchLike(node: unknown, id: number, liked: boolean): unknown {
  if (Array.isArray(node)) {
    const out = node.map((n) => patchLike(n, id, liked));
    return out.some((n, i) => n !== node[i]) ? out : node;
  }
  if (typeof node !== "object" || node === null) return node;
  const o = node as Record<string, unknown>;
  const key = "is_liked_by_user" in o ? "is_liked_by_user" : "is_liked" in o ? "is_liked" : null;
  if (key && o.id === id) {
    const flip = o[key] === liked ? 0 : liked ? 1 : -1;
    return { ...o, [key]: liked, likes_count: (o.likes_count as number) + flip };
  }
  let changed = false;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(o)) {
    out[k] = patchLike(v, id, liked);
    if (out[k] !== v) changed = true;
  }
  return changed ? out : node;
}

export function createLikeSync({
  send,
  onFailed,
  delayMs = 400,
}: {
  send: (reviewId: number, liked: boolean) => Promise<unknown>;
  /** `liked` is what the failed request asked for. */
  onFailed: (reviewId: number, liked: boolean) => void;
  delayMs?: number;
}): LikeSync {
  const timers = new Map<number, ReturnType<typeof setTimeout>>();
  const pending = new Map<number, () => void>();
  const chains = new Map<number, Promise<unknown>>();

  const fire = (id: number) => {
    clearTimeout(timers.get(id));
    pending.get(id)?.();
  };

  return {
    set(id, liked) {
      clearTimeout(timers.get(id));
      pending.set(id, () => {
        pending.delete(id);
        const req = (chains.get(id) ?? Promise.resolve()).then(() => send(id, liked));
        chains.set(id, req.catch(() => {}));
        req.catch(() => onFailed(id, liked));
      });
      timers.set(id, setTimeout(() => fire(id), delayMs));
    },
    flush: () => [...pending.keys()].forEach(fire),
  };
}
