import { useEffect, useState } from "react";

const useFetchSignedWorkImages = (value: string) => {
  // Resolve whether this is a private S3 work image that needs signing.
  const [signedSrc, setSignedSrc] = useState<string | null>(null);
  const [imgError, setImgError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchSigned() {
      const rawUrl = value;
      // Draft images (local) or already presigned (has X-Amz-Signature) skip signing.
      const isLocalDraft =
        rawUrl.startsWith("/uploads/work-drafts/") ||
        rawUrl.startsWith("/api/admin/work-drafts/image?");
      const alreadySigned = rawUrl.includes("X-Amz-Signature");
      // Extract key if it looks like an S3 style URL we generated in migration (base/.../work-images/..)
      // We only sign if the object is in work-images/ prefix.
      let key: string | null = null;
      if (!isLocalDraft && !alreadySigned) {
        const idx = rawUrl.indexOf("work-images/");
        if (idx !== -1) {
          key = rawUrl.substring(idx);
        }
      }
      if (!key) {
        // nothing to sign; just use original URL (could be local draft or something else)
        setSignedSrc(rawUrl);
        return;
      }
      try {
        const res = await fetch(
          `/api/admin/works/images/sign?key=${encodeURIComponent(key)}`
        );
        if (!res.ok) throw new Error(`sign failed ${res.status}`);
        const data = await res.json();
        if (!cancelled) setSignedSrc(data.url);
      } catch (e: any) {
        if (!cancelled) {
          setImgError(e.message || "sign error");
          setSignedSrc(value); // fallback
        }
      }
    }
    fetchSigned();
    return () => {
      cancelled = true;
    };
  }, [value]);

  return { signedSrc, imgError, setImgError };
};

export default useFetchSignedWorkImages;
