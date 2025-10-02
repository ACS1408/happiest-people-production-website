// Simple in-memory cache (per Node.js process) for reducing redundant S3 metadata lookups
// and repeated signed URL generations inside the lifespan of an object version.
// This works in both local dev (single process) and production (each server instance
// keeps its own memory). If you horizontally scale, each instance maintains its own
// cache which is acceptable for short‑lived signed URLs. For stronger consistency
// you can later replace this with Redis – API surface kept intentionally small.

type CacheEntry<T> = {
  value: T;
  // Hard expiry epoch ms
  expiresAt: number;
  // Optional S3 object ETag (without quotes) for change detection
  etag?: string;
  // Last time we validated the etag via HEAD (epoch ms)
  lastValidated?: number;
};

// Namespacing keys keeps things clear; use helper buildKey().
const store = new Map<string, CacheEntry<any>>();

interface GetOptions {
  // Minimum ms remaining required; if below this threshold we treat as expired early
  softTTLBufferMs?: number;
}

// ---------------- Configuration (env overridable) ----------------
function numEnv(name: string, fallback: number, bounds?: { min?: number; max?: number }) {
  const raw = process.env[name];
  if (!raw) return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  if (bounds?.min !== undefined && n < bounds.min) return bounds.min;
  if (bounds?.max !== undefined && n > bounds.max) return bounds.max;
  return n;
}

// How long we retain a signed URL in cache (ms) – must always be < actual AWS signature expiry.
// Default 50s; max clamp now 7 days (604800000 ms) to align with AWS SigV4 presign hard limit.
const CONFIG_TTL_MS = numEnv('CACHE_SIGNED_URL_TTL_MS', 50_000, { min: 1_000, max: 604_800_000 });
// Early-expiration safety buffer (ms) to avoid serving a near-expiry URL. Default 5s.
const CONFIG_SOFT_BUFFER_MS = numEnv('CACHE_SIGNED_URL_SOFT_BUFFER_MS', 5_000, { min: 0, max: 300_000 });
// Interval after which we would consider revalidating ETag (if longer TTL strategies are used). Default 5m.
const CONFIG_ETAG_REVALIDATE_INTERVAL_MS = numEnv('CACHE_ETAG_REVALIDATE_INTERVAL_MS', 5 * 60_000, { min: 60_000, max: 7 * 24 * 60 * 60 * 1000 });

export const cacheConfig = {
  ttlMs: CONFIG_TTL_MS,
  softBufferMs: CONFIG_SOFT_BUFFER_MS,
  etagRevalidateIntervalMs: CONFIG_ETAG_REVALIDATE_INTERVAL_MS,
};

export function getCache<T>(key: string, opts: GetOptions = {}): T | null {
  const entry = store.get(key);
  if (!entry) return null;
  const buffer = opts.softTTLBufferMs ?? cacheConfig.softBufferMs; // configurable safety window
  if (Date.now() + buffer >= entry.expiresAt) {
    // Expired (or about to) – remove and miss.
    store.delete(key);
    return null;
  }
  return entry.value as T;
}

export function setCache<T>(key: string, value: T, ttlMs: number, meta?: { etag?: string }): void {
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
    etag: meta?.etag,
    lastValidated: meta?.etag ? Date.now() : undefined,
  });
}

export function getCacheEntry(key: string): CacheEntry<any> | undefined {
  const e = store.get(key);
  if (!e) return undefined;
  if (Date.now() >= e.expiresAt) {
    store.delete(key);
    return undefined;
  }
  return e;
}

export function deleteCache(key: string): boolean {
  return store.delete(key);
}

export function clearCacheByPrefix(prefix: string): number {
  let count = 0;
  for (const k of store.keys()) {
    if (k.startsWith(prefix)) {
      store.delete(k);
      count++;
    }
  }
  return count;
}

export function clearAllCache(): void { store.clear(); }

// Domain specific helpers ----------------------------------------------------

// Build canonical keys – if we later move to Redis the key strategy persists.
const K = {
  signedWorkImage: (s3Key: string) => `signed:work-image:${s3Key}`,
  signedResume: (s3Key: string) => `signed:resume:${s3Key}`,
};

export const cacheKeys = K;

// Signed URL envelope so we know when it naturally expires without parsing query params.
export interface SignedUrlCacheValue {
  url: string;
  // When the AWS signature itself expires (epoch ms). We set our cache expiry a bit earlier.
  awsExpiresAt: number;
  etag?: string;
}

// Legacy constants kept for reference (now replaced by env-config values).
// const SIGNED_URL_EFFECTIVE_TTL_MS = 50_000;
// const ETAG_REVALIDATE_INTERVAL_MS = 5 * 60_000;

// Decide if we should attempt an on-demand etag revalidation (caller performs HEAD and updates).
export function needsEtagRevalidation(entry?: CacheEntry<SignedUrlCacheValue>): boolean {
  if (!entry || !entry.etag) return false;
  if (!entry.lastValidated) return true;
  return Date.now() - entry.lastValidated > cacheConfig.etagRevalidateIntervalMs;
}

export function cacheSignedUrl(kind: 'work-image' | 'resume', s3Key: string, value: Omit<SignedUrlCacheValue, 'awsExpiresAt'> & { awsExpiresAt: number }, etag?: string) {
  const key = kind === 'work-image' ? K.signedWorkImage(s3Key) : K.signedResume(s3Key);
  setCache(key, { ...value, etag }, Math.min(cacheConfig.ttlMs, value.awsExpiresAt - Date.now()), { etag });
}

export function getCachedSignedUrl(kind: 'work-image' | 'resume', s3Key: string): SignedUrlCacheValue | null {
  const key = kind === 'work-image' ? K.signedWorkImage(s3Key) : K.signedResume(s3Key);
  return getCache<SignedUrlCacheValue>(key) || null;
}

export function invalidateSignedUrl(kind: 'work-image' | 'resume', s3Key: string): boolean {
  const key = kind === 'work-image' ? K.signedWorkImage(s3Key) : K.signedResume(s3Key);
  return deleteCache(key);
}

// Export a lightweight snapshot for optional debugging endpoint.
export function snapshotCache(): Array<{ key: string; expiresInMs: number; hasEtag: boolean; }> {
  const out: Array<{ key: string; expiresInMs: number; hasEtag: boolean; }> = [];
  const now = Date.now();
  for (const [k, v] of store.entries()) {
    if (now >= v.expiresAt) continue;
    out.push({ key: k, expiresInMs: v.expiresAt - now, hasEtag: !!v.etag });
  }
  return out;
}

// NOTE: Because this is purely in-memory, a deployment / process restart clears the cache –
// safe fallback behavior (will just regenerate on demand).
