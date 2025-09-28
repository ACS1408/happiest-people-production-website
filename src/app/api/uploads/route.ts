import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const BUCKET = process.env.AWS_S3_BUCKET as string | undefined;
const PUBLIC_BASE_URL = process.env.AWS_S3_PUBLIC_BASE_URL as
  | string
  | undefined; // optional custom CDN/base URL

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Expected multipart/form-data" },
        { status: 400 }
      );
    }
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'Missing file field "file"' },
        { status: 400 }
      );
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = path.extname(file.name) || ".dat";

    const uploadType = String(formData.get("type") || "").trim();

    // Extract optional meta fields for improved resume key naming
    const rawFirst = String(formData.get("firstName") || "").trim();
    const rawLast = String(formData.get("lastName") || "").trim();
    const rawDept = String(formData.get("department") || "").trim();

    const slug = (v: string) =>
      v
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .substring(0, 40) || "na";

    const rand = crypto.randomBytes(4).toString("hex");
    const timestamp = Date.now();

    // Work image draft: store locally; resume or other: go to S3 (requires config)
    if (uploadType === "work-image") {
      const draftsDir = path.join(
        process.cwd(),
        "public",
        "uploads",
        "work-drafts"
      );
      if (!fs.existsSync(draftsDir))
        fs.mkdirSync(draftsDir, { recursive: true });
      const baseName = file.name ? path.basename(file.name, ext) : "image";
      const imageSlug = slug(baseName).substring(0, 60) || "image";
      const localName = `${imageSlug}-${timestamp}-${rand}${ext}`;
      const localPath = path.join(draftsDir, localName);
      await fs.promises.writeFile(localPath, buffer);
      // Instead of exposing the raw /uploads path (which may 404 in some prod platforms),
      // serve via an API route to guarantee availability even in serverless environments.
      const url = `/api/admin/work-drafts/image?file=${encodeURIComponent(
        localName
      )}`;
      return NextResponse.json({
        url,
        name: file.name,
        size: buffer.length,
        storage: "local-draft",
      });
    }

    if (!BUCKET) {
      return NextResponse.json(
        { error: "S3 configuration missing for non-draft upload" },
        { status: 500 }
      );
    }

    // Resume (or future types) -> S3 private
    const firstSlug = slug(rawFirst);
    const lastSlug = slug(rawLast);
    const deptSlug = slug(rawDept);
    const key = `career-resumes/${firstSlug}-${lastSlug}-${deptSlug}-${timestamp}-${rand}${ext}`;
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type || "application/octet-stream",
        // ACL omitted: Bucket likely uses ObjectOwnership=BucketOwnerEnforced (ACLs disabled)
        Metadata: {
          originalname: Buffer.from(file.name).toString("utf8"),
          uploadType: uploadType || "resume",
        },
      })
    );
    const base =
      PUBLIC_BASE_URL ||
      `https://${BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com`;
    const url = `${base}/${key}`;
    return NextResponse.json({
      url,
      key,
      name: file.name,
      size: buffer.length,
      storage: "s3",
      ownership: "bucket-owner-enforced",
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
