import { NextRequest, NextResponse } from 'next/server';
import { authCookieOptions } from '@/lib/auth';

// Logout semantics:
// - If the request prefers HTML (standard form submission / browser nav), redirect to /admin/login
// - If the request is an XHR/fetch expecting JSON (accept header includes application/json), return JSON { ok: true }
// Always clear the auth cookie.
export async function POST(req: NextRequest) {
  const cookie = authCookieOptions();
  const wantsJson = req.headers.get('accept')?.includes('application/json');
  const res = wantsJson ? NextResponse.json({ ok: true }) : NextResponse.redirect(new URL('/admin/login', req.url));
  // Clear cookie by setting empty value + immediate expiry
  res.cookies.set(cookie.name, '', { ...cookie, maxAge: 0 });
  return res;
}
