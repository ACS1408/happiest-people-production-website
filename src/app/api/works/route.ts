import { NextRequest, NextResponse } from 'next/server';
import { listWorks, createWork, updateWork, deleteWork, reorderWorks, getPublishedWorks } from '@/lib/worksStore';
import { extractYouTubeId } from '@/utils/youtube';
import type { NewWork } from '@/types/works';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const published = searchParams.get('published');
  const works = published === 'true' ? getPublishedWorks() : listWorks();
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
    if(!input.title || !input.image?.url || !input.image?.alt) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    // assign next order if not provided
    if(typeof input.order !== 'number') {
      const works = listWorks();
      input.order = (works.at(-1)?.order ?? 0) + 1;
    }
    if(typeof input.published !== 'boolean') input.published = false;
    const work = createWork(input);
    return NextResponse.json({ data: work }, { status: 201 });
  } catch (e:any) {
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
    if(!id) return NextResponse.json({ error: 'Missing id' }, { status:400 });
    const updated = updateWork(id, rest);
    if(!updated) return NextResponse.json({ error: 'Not found' }, { status:404 });
    return NextResponse.json({ data: updated });
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if(!id) return NextResponse.json({ error: 'Missing id' }, { status:400 });
    const ok = deleteWork(id);
    if(!ok) return NextResponse.json({ error: 'Not found' }, { status:404 });
    return NextResponse.json({ success: true });
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
