import { NextRequest, NextResponse } from 'next/server';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '@/lib/s3';
import { authCookieOptions, verifyAuthToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { cacheSignedUrl, getCachedSignedUrl, invalidateSignedUrl, cacheConfig } from '@/lib/cache';

export const dynamic = 'force-dynamic';

async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(authCookieOptions().name)?.value;
  if (!token) throw new Error('UNAUTHORIZED');
  try { await verifyAuthToken(token); } catch { throw new Error('UNAUTHORIZED'); }
}

export async function GET(req: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');
    if (!key) return NextResponse.json({ error: 'Missing key param' }, { status: 400 });
    if (!process.env.AWS_S3_BUCKET) return NextResponse.json({ error: 'S3 not configured' }, { status: 500 });

    // Enforce prefix to prevent arbitrary object access
    if (!key.startsWith('work-images/')) {
      return NextResponse.json({ error: 'Invalid key' }, { status: 400 });
    }

    // Try cache first
    const cached = getCachedSignedUrl('work-image', key);
    if (cached) {
      return NextResponse.json({ url: cached.url, cached: true });
    }

    // Obtain current etag via HEAD (best-effort; ignore failures)
    let etag: string | undefined;
    try {
      const head = await s3Client.send(new HeadObjectCommand({ Bucket: process.env.AWS_S3_BUCKET, Key: key }));
      if (head.ETag) etag = head.ETag.replace(/"/g, '');
    } catch (e) {
      // If the object disappeared invalidate any stale cache and return error
      invalidateSignedUrl('work-image', key);
    }
    const command = new GetObjectCommand({ Bucket: process.env.AWS_S3_BUCKET, Key: key });
    // Allow override of signed URL lifespan (seconds) but clamp to 1..7 days for safety.
    const rawExp = process.env.SIGNED_URL_EXPIRES_IN_SECONDS;
    let expiresIn = 60; // default 60s
    if (rawExp) {
      const n = Number(rawExp);
      if (Number.isFinite(n)) {
        // Hard clamp between 10s and 604800s (7 days) - AWS S3 v4 presign practical limit.
        expiresIn = Math.min(Math.max(n, 10), 604800);
      }
    }
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    cacheSignedUrl('work-image', key, { url: signedUrl, awsExpiresAt: Date.now() + expiresIn * 1000 }, etag);
    return NextResponse.json({ url: signedUrl, cached: false });
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
