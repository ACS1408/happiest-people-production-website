import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

const ALG = 'HS256';
const ISSUER = 'hpp-cms';
const AUD = 'hpp-admin';

function getSecret(): Uint8Array {
  const secret = process.env.CMS_AUTH_SECRET || process.env.NEXT_PUBLIC_CMS_AUTH_SECRET;
  if(!secret) throw new Error('CMS_AUTH_SECRET env not set');
  return new TextEncoder().encode(secret);
}

export interface AuthTokenPayload extends JWTPayload {
  sub: string; // username
  role: 'admin';
}

export async function signAuthToken(payload: AuthTokenPayload, expiresIn = '2h') {
  const jwt = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: ALG })
    .setIssuer(ISSUER)
    .setAudience(AUD)
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecret());
  return jwt;
}

export async function verifyAuthToken(token: string) {
  const { payload } = await jwtVerify(token, getSecret(), { issuer: ISSUER, audience: AUD });
  return payload as AuthTokenPayload & { iat: number; exp: number };
}

export function authCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    name: 'hpp_admin_auth',
    httpOnly: true,
    path: '/',
    sameSite: 'lax' as const,
    secure: isProd,
    maxAge: 60 * 60 * 2, // 2h
  };
}
