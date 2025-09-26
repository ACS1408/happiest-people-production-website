import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

function ensureDir() {
  if(!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    if(!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 });
    }
    const formData = await req.formData();
    const file = formData.get('file');
    if(!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'Missing file field "file"' }, { status: 400 });
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = path.extname(file.name) || '.png';
    const nameHash = crypto.randomBytes(8).toString('hex');
    const filename = `${Date.now()}-${nameHash}${ext}`;
    ensureDir();
    const target = path.join(UPLOAD_DIR, filename);
    fs.writeFileSync(target, buffer);
    return NextResponse.json({ url: `/uploads/${filename}`, name: file.name, size: buffer.length });
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
