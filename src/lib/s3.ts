import { S3Client } from '@aws-sdk/client-s3';

const REGION = process.env.AWS_S3_REGION as string;
const ACCESS_KEY_ID = process.env.AWS_S3_ACCESS_KEY_ID as string;
const SECRET_ACCESS_KEY = process.env.AWS_S3_SECRET_ACCESS_KEY as string;

if (!REGION) console.warn('[s3] Missing AWS_S3_REGION');
if (!ACCESS_KEY_ID) console.warn('[s3] Missing AWS_S3_ACCESS_KEY_ID');
if (!SECRET_ACCESS_KEY) console.warn('[s3] Missing AWS_S3_SECRET_ACCESS_KEY');

export const s3Client = new S3Client({
  region: REGION,
  credentials: ACCESS_KEY_ID && SECRET_ACCESS_KEY ? {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  } : undefined,
});
