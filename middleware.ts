import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken, authCookieOptions } from '@/lib/auth';

const ADMIN_PREFIX = '/admin';
const LOGIN_PATH = '/admin/login';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const cookieName = authCookieOptions().name;
  const token = req.cookies.get(cookieName)?.value;
  const isLogin = pathname === LOGIN_PATH;
  const isAdminArea = pathname.startsWith(ADMIN_PREFIX);
  const isApi = pathname.startsWith('/api/');

  // Protect /admin pages
  if(isAdminArea && !isLogin) {
    if(!token) {
      return NextResponse.redirect(new URL(LOGIN_PATH, req.url));
    }
    try {
      await verifyAuthToken(token);
    } catch {
      return NextResponse.redirect(new URL(LOGIN_PATH, req.url));
    }
  }

  // Protect write API routes (works + uploads) except GET
  if(isApi) {
    const method = req.method.toUpperCase();
    if(['POST','PUT','DELETE','PATCH'].includes(method)) {
      // allow login route
      if(pathname.startsWith('/api/auth/')) return NextResponse.next();
      if(!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      try {
        await verifyAuthToken(token);
      } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*','/api/:path*']
};
