/** "20m", "4h", "3d", "5w", "2y" */
export function ago(iso: string, now = Date.now()) {
  const s = Math.max(0, (now - Date.parse(iso)) / 1000);
  for (const [unit, size] of [["y", 31536000], ["w", 604800], ["d", 86400], ["h", 3600], ["m", 60]] as const) {
    if (s >= size) return Math.floor(s / size) + unit;
  }
  return "now";
}

/**
 * Position dots, at most nine, centred on the focused card. When more cards sit past
 * either end, the two outermost dots shrink to say so.
 */
export function dotWindow(count: number, focused: number) {
  const max = 9;
  const start = Math.max(0, Math.min(focused - Math.floor(max / 2), count - max));
  const end = Math.min(count, start + max);
  const dots = [];
  for (let i = start; i < end; i++) {
    const fromEdge = Math.min(start > 0 ? i - start : Infinity, end < count ? end - 1 - i : Infinity);
    const size = fromEdge === 0 ? 2 : fromEdge === 1 ? 3 : 4;
    dots.push({ i, width: i === focused ? 18 : size, height: size === 4 || i === focused ? 4 : size });
  }
  return dots;
}
