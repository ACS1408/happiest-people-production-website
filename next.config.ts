import type { NextConfig } from "next";

const CDN_HOST = process.env.AWS_S3_PUBLIC_BASE_URL ? new URL(process.env.AWS_S3_PUBLIC_BASE_URL).host : undefined;
const S3_BUCKET = process.env.AWS_S3_BUCKET;
const S3_REGION = process.env.AWS_S3_REGION;

const remotePatterns = [] as { protocol: 'https'; hostname: string; port?: string; pathname?: string }[];

// If a custom public base URL (CDN / CloudFront) is defined, allow that host
if (CDN_HOST) {
  remotePatterns.push({ protocol: 'https', hostname: CDN_HOST, pathname: '/work-images/**' });
}

// Allow direct S3 bucket host for work images (if accessing without CDN)
if (S3_BUCKET && S3_REGION) {
  remotePatterns.push({ protocol: 'https', hostname: `${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com`, pathname: '/work-images/**' });
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.jsx",
      },
    },
  },
  productionBrowserSourceMaps: false,
  webpack(config, { dev }) {
    if (!dev) {
      // prevents server-side sourcemaps
      config.devtool = false;
    }
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule: any) =>
      rule.test?.test?.(".svg")
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      }
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default nextConfig;
