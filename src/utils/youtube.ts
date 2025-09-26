// Utility to extract a YouTube video ID from a variety of possible inputs.
// Accepts:
//  - Raw ID (11 chars typical)
//  - https://www.youtube.com/watch?v=VIDEOID
//  - https://youtu.be/VIDEOID
//  - https://www.youtube.com/embed/VIDEOID
//  - With optional parameters (&t=30s etc.)
// Returns undefined if no plausible ID is found.
export function extractYouTubeId(input?: string | null): string | undefined {
  if(!input) return undefined;
  const trimmed = input.trim();
  // If looks like plain ID (alphanumeric, - or _ and length 11) trust it
  if(/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    // watch?v=ID
    const v = url.searchParams.get('v');
    if(v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
    // youtu.be/ID
    if(url.hostname.includes('youtu.be')) {
      const id = url.pathname.split('/').filter(Boolean)[0];
      if(id && /^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
    }
    // /embed/ID
    if(url.pathname.includes('/embed/')) {
      const id = url.pathname.split('/embed/')[1].split(/[?&#]/)[0];
      if(id && /^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
    }
  } catch {
    // Not a URL; fall through
  }
  return undefined;
}
