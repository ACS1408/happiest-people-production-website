import { NextRequest, NextResponse } from "next/server";
import {
  listWorks,
  createWork,
  updateWork,
  deleteWork,
  reorderWorks,
  getPublishedWorks,
} from "@/lib/repositories/workRepository";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3";
import path from "path";
import fs from "fs";
import os from "os";
import crypto from "crypto";
import { extractYouTubeId } from "@/utils/youtube";
import type { NewWork } from "@/types/works";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const published = searchParams.get("published");
  const works =
    published === "true" ? await getPublishedWorks() : await listWorks();
  return NextResponse.json({ data: works });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.reorder && Array.isArray(body.ids)) {
      const updated = reorderWorks(body.ids as string[]);
      return NextResponse.json({ data: updated });
    }
    const input: NewWork = body;
    if (input.videoId) {
      const extracted = extractYouTubeId(input.videoId);
      input.videoId = extracted; // may become undefined if invalid
    }
    // Relaxed validation: only title required. Image optional; if provided, must have url. Alt defaults.
    if (!input.title) {
      return NextResponse.json({ error: "Invalid payload: title required" }, { status: 400 });
    }
    if (input.image && !input.image.url) {
      return NextResponse.json({ error: "Invalid payload: image url missing" }, { status: 400 });
    }
    if (input.image && !input.image.alt) {
      input.image.alt = 'Work image';
    }
    // assign next order if not provided
    if (typeof input.published !== "boolean") input.published = false;

    // Promote draft image (legacy local path or tmp-served API) to S3 when publishing
    if (input.published && input.image?.url && isDraftLikeUrl(input.image.url)) {
      try {
        const migrated = await migrateDraftImageToS3(
          input.image.url,
          input.title
        );
        if (migrated) {
          input.image.url = migrated;
        }
      } catch (e: any) {
        console.error("Failed to migrate draft image (POST)", e);
        return NextResponse.json(
          { error: "Image migration failed", details: e.message, code: e.code },
          { status: 500 }
        );
      }
    }
    const work = await createWork(input);
    return NextResponse.json({ data: work }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...rest } = body;
    if (rest.videoId) {
      const extracted = extractYouTubeId(rest.videoId);
      rest.videoId = extracted; // normalize
    }
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    // If publishing via update & image is still a draft-like URL, migrate
    if (rest.published && rest.image?.url && isDraftLikeUrl(rest.image.url)) {
      try {
        const migrated = await migrateDraftImageToS3(
          rest.image.url,
          rest.title || "work"
        );
        if (migrated) rest.image.url = migrated;
      } catch (e: any) {
        console.error("Failed to migrate draft image (PUT)", e);
        return NextResponse.json(
          { error: "Image migration failed", details: e.message, code: e.code },
          { status: 500 }
        );
      }
    }
    const updated = await updateWork(id, rest);
    if (!updated)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ data: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

class MigrationError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}

// Helper: migrate local draft image file to S3 and return new URL
function isDraftLikeUrl(url: string) {
  // Only support the temp API served form now
  if (url.startsWith("/api/admin/work-drafts/image?")) return true;
  return false;
}

async function migrateDraftImageToS3(
  draftUrl: string,
  title: string
): Promise<string | null> {
  const BUCKET = process.env.AWS_S3_BUCKET;
  const REGION = process.env.AWS_S3_REGION;
  if (!BUCKET || !REGION)
    throw new MigrationError(
      "S3 not configured (missing AWS_S3_BUCKET or AWS_S3_REGION)",
      "S3_CONFIG"
    );
  if (!s3Client) throw new MigrationError("S3 client unavailable", "S3_CLIENT");

  if (!isDraftLikeUrl(draftUrl)) {
    throw new MigrationError("Not a draft image path", "NOT_DRAFT");
  }
  if (draftUrl.includes("..")) {
    throw new MigrationError("Invalid path", "PATH_TRAVERSAL");
  }
  const PUBLIC_BASE_URL = process.env.AWS_S3_PUBLIC_BASE_URL;

  // Determine actual disk path for legacy or temp draft
  let diskPath: string | null = null;
  if (draftUrl.startsWith("/api/admin/work-drafts/image?")) {
    const qs = new URLSearchParams(draftUrl.split("?")[1] || "");
    const file = qs.get("file");
    if (!file)
      throw new MigrationError("Missing draft file param", "MISSING_FILE");
    if (file.includes("..") || file.includes("/") || file.includes("\\")) {
      throw new MigrationError("Invalid draft filename", "BAD_FILE");
    }
    const tmpRoot = process.env.TMPDIR || os.tmpdir();
    diskPath = path.join(tmpRoot, "hpp-work-drafts", file);
  }
  if (!diskPath)
    throw new MigrationError("Cannot resolve draft path", "RESOLVE_FAIL");
  if (!fs.existsSync(diskPath))
    throw new MigrationError("Draft image not found on disk", "FILE_NOT_FOUND");

  let buffer: Buffer;
  try {
    buffer = await fs.promises.readFile(diskPath);
  } catch (e: any) {
    throw new MigrationError(
      "Failed reading draft image: " + e.message,
      "READ_FAILED"
    );
  }
  const ext = (path.extname(diskPath).toLowerCase() || ".jpg") as string;
  const slug = (v: string) =>
    v
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .substring(0, 60) || "work";
  const key = `work-images/${slug(title)}-${Date.now()}-${crypto
    .randomBytes(4)
    .toString("hex")}${ext}`;
  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: mimeFromExt(ext),
        // ACL removed: bucket likely has ObjectOwnership=BucketOwnerEnforced (ACLs disabled)
        Metadata: {
          originalname: path.basename(diskPath),
          migratedFrom: draftUrl,
        },
      })
    );
  } catch (e: any) {
    throw new MigrationError(
      "S3 upload failed: " + e.message,
      "S3_UPLOAD_FAILED"
    );
  }
  // Optionally remove local file after success
  try {
    await fs.promises.unlink(diskPath);
  } catch (e) {
    /* ignore unlink errors */
  }
  const base =
    PUBLIC_BASE_URL || `https://${BUCKET}.s3.${REGION}.amazonaws.com`;
  return `${base}/${key}`;
}

function mimeFromExt(ext: string): string {
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    default:
      return "application/octet-stream";
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const ok = await deleteWork(id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
