import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authCookieOptions, verifyAuthToken } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(authCookieOptions().name)?.value;
  if (!token) throw new Error('UNAUTHORIZED');
  try { await verifyAuthToken(token); } catch { throw new Error('UNAUTHORIZED'); }
}

interface CleanResult { deleted: number; kept: number; files: Array<{ name: string; deleted: boolean; reason?: string }>; }

export async function POST(req: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(req.url);
    const ageMinutesParam = searchParams.get('ageMinutes');
    const dryRun = searchParams.get('dryRun') === 'true';
    const ageMinutes = ageMinutesParam ? Math.max(parseInt(ageMinutesParam, 10), 0) : 10; // default 10 minutes
    const minAgeMs = ageMinutes * 60 * 1000;

    const draftsDir = path.join(process.cwd(), 'public', 'uploads', 'work-drafts');
    const result: CleanResult = { deleted: 0, kept: 0, files: [] };

    if (!fs.existsSync(draftsDir)) {
      return NextResponse.json({ ...result, note: 'Drafts directory does not exist' });
    }

    const now = Date.now();
    const entries = await fs.promises.readdir(draftsDir);
    for (const entry of entries) {
      const filePath = path.join(draftsDir, entry);
      let stat: fs.Stats;
      try {
        stat = await fs.promises.stat(filePath);
      } catch (e: any) {
        result.files.push({ name: entry, deleted: false, reason: 'stat-failed' });
        continue;
      }
      if (!stat.isFile()) {
        result.files.push({ name: entry, deleted: false, reason: 'not-file' });
        continue;
      }
      const age = now - stat.mtimeMs; // use mtime as last modification
      if (age < minAgeMs) {
        result.kept++;
        result.files.push({ name: entry, deleted: false, reason: 'too-new' });
        continue;
      }
      if (!dryRun) {
        try {
          await fs.promises.unlink(filePath);
          result.deleted++;
          result.files.push({ name: entry, deleted: true });
        } catch (e: any) {
          result.kept++;
          result.files.push({ name: entry, deleted: false, reason: 'unlink-failed' });
        }
      } else {
        result.deleted++;// counts potential deletions
        result.files.push({ name: entry, deleted: false, reason: 'dry-run' });
      }
    }

    return NextResponse.json({ ...result, ageMinutes, dryRun });
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
