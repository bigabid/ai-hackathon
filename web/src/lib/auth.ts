import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const DEFAULT_SESSION_NAME = 'session';

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET || 'dev-insecure-secret-change-me';
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  email: string;
  role: 'admin';
};

export async function createSessionCookie(payload: SessionPayload, maxAgeSeconds = 60 * 60 * 24 * 7) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${maxAgeSeconds}s`)
    .sign(getJwtSecret());

  cookies().set({
    name: DEFAULT_SESSION_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: maxAgeSeconds,
  });
}

export function clearSessionCookie() {
  cookies().set({ name: DEFAULT_SESSION_NAME, value: '', maxAge: 0, path: '/' });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookie = cookies().get(DEFAULT_SESSION_NAME);
  if (!cookie?.value) return null;
  try {
    const { payload } = await jwtVerify(cookie.value, getJwtSecret());
    return { email: String(payload.email), role: 'admin' };
  } catch {
    return null;
  }
}


