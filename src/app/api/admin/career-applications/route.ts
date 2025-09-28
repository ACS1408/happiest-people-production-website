import { NextRequest, NextResponse } from 'next/server';
import { authCookieOptions, verifyAuthToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { findCareerApplicationsPaginated } from '@/lib/repositories/careerApplicationRepository';

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
    const page = parseInt(searchParams.get('page') || '1', 10) || 1;
    const limit = parseInt(searchParams.get('limit') || '10', 10) || 10;
  const search = searchParams.get('search') || undefined;
  const result = await findCareerApplicationsPaginated(page, limit, search);
    return NextResponse.json(result);
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
