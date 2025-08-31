import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createSessionCookie } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token') || '';
  const row = await prisma.loginToken.findUnique({ where: { token } });
  if (!row || row.usedAt || row.expiresAt < new Date()) {
    return NextResponse.redirect(new URL('/login?error=invalid', req.url));
  }

  await prisma.$transaction([
    prisma.loginToken.update({ where: { token }, data: { usedAt: new Date() } }),
    prisma.admin.upsert({
      where: { email: row.email },
      update: { lastLoginAt: new Date() },
      create: { email: row.email },
    }),
  ]);

  await createSessionCookie({ email: row.email, role: 'admin' });
  return NextResponse.redirect(new URL('/admin', req.url));
}


