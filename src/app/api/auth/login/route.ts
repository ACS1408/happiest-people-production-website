import { NextRequest, NextResponse } from 'next/server';
import { signAuthToken, authCookieOptions } from '@/lib/auth';

// Expect env CMS_USERNAME / CMS_PASSWORD for simple auth
export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    const expectedUser = process.env.CMS_USERNAME;
    const expectedPass = process.env.CMS_PASSWORD;
    if(!expectedUser || !expectedPass) {
      return NextResponse.json({ error: 'Server auth not configured' }, { status: 500 });
    }
    if(username !== expectedUser || password !== expectedPass) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    const token = await signAuthToken({ sub: username, role: 'admin' });
    const cookie = authCookieOptions();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(cookie.name, token, cookie);
    return res;
  } catch (e:any) {
    return NextResponse.json({ error: e.message || 'Auth error' }, { status: 400 });
  }
}
