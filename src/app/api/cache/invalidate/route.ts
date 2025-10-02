import { NextRequest, NextResponse } from 'next/server';
import { clearAllCache, clearCacheByPrefix, deleteCache, snapshotCache } from '@/lib/cache';
import { authCookieOptions, verifyAuthToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(authCookieOptions().name)?.value;
  if (!token) throw new Error('UNAUTHORIZED');
  try { await verifyAuthToken(token); } catch { throw new Error('UNAUTHORIZED'); }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth();
    const body = await req.json().catch(() => ({}));
    const { scope, prefix, key } = body as { scope?: string; prefix?: string; key?: string };

    if (scope === 'all') {
      clearAllCache();
      return NextResponse.json({ ok: true, mode: 'all', message: 'All cache entries cleared' });
    }
    if (key) {
      const deleted = deleteCache(key);
      return NextResponse.json({ ok: true, mode: 'key', key, deleted });
    }
    if (prefix) {
      const count = clearCacheByPrefix(prefix);
      return NextResponse.json({ ok: true, mode: 'prefix', prefix, cleared: count });
    }
    return NextResponse.json({ ok: false, error: 'Provide one of: {"scope":"all"} | {"prefix":"..."} | {"key":"exact-cache-key"}' }, { status: 400 });
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// GET: diagnostics & selective operations via query params (admin use only)
// Examples:
//   /api/cache/invalidate?snapshot=1
//   /api/cache/invalidate?prefix=signed:work-image:
//   /api/cache/invalidate?key=signed:work-image:work-images/foo.webp
//   /api/cache/invalidate?all=1
export async function GET(req: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(req.url);
    if (searchParams.get('all') === '1') {
      clearAllCache();
      return NextResponse.json({ ok: true, mode: 'all', message: 'All cache entries cleared' });
    }
    const key = searchParams.get('key');
    if (key) {
      const deleted = deleteCache(key);
      return NextResponse.json({ ok: true, mode: 'key', key, deleted });
    }
    const prefix = searchParams.get('prefix');
    if (prefix) {
      const count = clearCacheByPrefix(prefix);
      return NextResponse.json({ ok: true, mode: 'prefix', prefix, cleared: count });
    }
    if (searchParams.get('snapshot') === '1') {
      return NextResponse.json({ ok: true, snapshot: snapshotCache() });
    }
    return NextResponse.json({ ok: false, error: 'No action specified. Use ?snapshot=1 | ?all=1 | ?prefix=... | ?key=...' }, { status: 400 });
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
