type Entry = { count: number; resetsAt: number };
const buckets = new Map<string, Entry>();

export function takeRateLimit(key: string) {
  const now = Date.now();
  const limit = Number(process.env.RATE_LIMIT_REQUESTS ?? 5);
  const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MINUTES ?? 60) * 60_000;
  const current = buckets.get(key);
  if (!current || current.resetsAt <= now) {
    buckets.set(key, { count: 1, resetsAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }
  if (current.count >= limit) return { allowed: false, remaining: 0, retryAfter: Math.ceil((current.resetsAt - now) / 1000) };
  current.count += 1;
  return { allowed: true, remaining: limit - current.count };
}
