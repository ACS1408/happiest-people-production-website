import { NextRequest, NextResponse } from 'next/server';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '@/lib/s3';
import { authCookieOptions, verifyAuthToken } from '@/lib/auth';
import { cookies } from 'next/headers';

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

    // Basic prefix enforcement to limit exposure
    if (!key.startsWith('career-resumes/')) {
      return NextResponse.json({ error: 'Invalid key' }, { status: 400 });
    }

    const command = new GetObjectCommand({ Bucket: process.env.AWS_S3_BUCKET, Key: key });
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 }); // 60s validity

    return NextResponse.json({ url: signedUrl });
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
