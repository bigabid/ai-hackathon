import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

async function verify(token: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-insecure-secret-change-me');
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload?.email ? true : false;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get('session')?.value;
    if (!token || !(await verify(token))) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};


