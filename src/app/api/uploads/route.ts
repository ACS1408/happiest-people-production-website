import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '@/lib/s3';
import path from 'path';

export const dynamic = 'force-dynamic';

const BUCKET = process.env.AWS_S3_BUCKET as string | undefined;
const PUBLIC_BASE_URL = process.env.AWS_S3_PUBLIC_BASE_URL as string | undefined; // optional custom CDN/base URL

export async function POST(req: NextRequest) {
  if (!BUCKET) {
    return NextResponse.json(
      {
        error: 'S3 configuration missing',
        message: 'Resume uploads require S3. Ensure AWS_S3_REGION, AWS_S3_BUCKET, AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are set.'
      },
      { status: 500 }
    );
  }

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
    const ext = path.extname(file.name) || '.dat';

    // Extract optional meta fields for improved key naming
    const rawFirst = String(formData.get('firstName') || '').trim();
    const rawLast = String(formData.get('lastName') || '').trim();
    const rawDept = String(formData.get('department') || '').trim();

    const slug = (v: string) => v.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 40) || 'na';

    const firstSlug = slug(rawFirst);
    const lastSlug = slug(rawLast);
    const deptSlug = slug(rawDept);
    const rand = crypto.randomBytes(4).toString('hex');
    const timestamp = Date.now();

    // Final S3 object key format: career-resumes/<first>-<last>-<dept>-<timestamp>-<rand><ext>
    const key = `career-resumes/${firstSlug}-${lastSlug}-${deptSlug}-${timestamp}-${rand}${ext}`;

    await s3Client.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type || 'application/octet-stream',
      ACL: 'private',
      Metadata: {
        originalname: Buffer.from(file.name).toString('utf8'),
      },
    }));

    const base = PUBLIC_BASE_URL || `https://${BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com`;
    const url = `${base}/${key}`;
    return NextResponse.json({ url, key, name: file.name, size: buffer.length, storage: 's3' });
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
