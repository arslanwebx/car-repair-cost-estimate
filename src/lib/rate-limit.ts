type Entry = { count: number; resetsAt: number };
const buckets = new Map<string, Entry>();
const MAX_BUCKETS = 10_000;
let lastSweep = 0;

function positiveNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function removeStaleBuckets(now: number) {
  if (now - lastSweep < 60_000 && buckets.size < MAX_BUCKETS) return;
  for (const [key, entry] of buckets) if (entry.resetsAt <= now) buckets.delete(key);
  while (buckets.size >= MAX_BUCKETS) {
    const oldest = buckets.keys().next().value;
    if (oldest === undefined) break;
    buckets.delete(oldest);
  }
  lastSweep = now;
}

export function takeRateLimit(key: string) {
  const now = Date.now();
  removeStaleBuckets(now);
  const limit = positiveNumber(process.env.RATE_LIMIT_REQUESTS, 5);
  const windowMs = positiveNumber(process.env.RATE_LIMIT_WINDOW_MINUTES, 60) * 60_000;
  const current = buckets.get(key);
  if (!current || current.resetsAt <= now) {
    buckets.set(key, { count: 1, resetsAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }
  if (current.count >= limit) return { allowed: false, remaining: 0, retryAfter: Math.ceil((current.resetsAt - now) / 1000) };
  current.count += 1;
  return { allowed: true, remaining: limit - current.count };
}

export function resetRateLimitsForTests() {
  buckets.clear();
  lastSweep = 0;
}
