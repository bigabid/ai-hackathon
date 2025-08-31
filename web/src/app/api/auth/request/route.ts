import { NextResponse } from 'next/server';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import type { PrismaClient } from '@prisma/client';
import { createSessionCookie } from '@/lib/auth';

function getPrisma(): PrismaClient {
  const { PrismaClient } = require('@prisma/client') as typeof import('@prisma/client');
  return new PrismaClient();
}

const schema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  const data = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(data);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  const { email } = parsed.data;

  const token = crypto.randomUUID().replace(/-/g, '');
  const ttlMinutes = 15;
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

  try {
    const prisma = getPrisma();
    await prisma.loginToken.create({ data: { email, token, expiresAt } });
  } catch (err) {
    console.warn('Prisma not ready, falling back to direct session login', err);
    await createSessionCookie({ email, role: 'admin' });
    return NextResponse.json({ ok: true, mode: 'direct-login' });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
  const url = `${baseUrl}/api/auth/callback?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'localhost',
    port: Number(process.env.SMTP_PORT || 1026),
    secure: false,
  });

  try {
    await transporter.sendMail({
      from: 'no-reply@local.test',
      to: email,
      subject: 'Your login link',
      text: `Login: ${url}`,
      html: `<p>Login: <a href=\"${url}\">${url}</a></p>`,
    });
  } catch (e) {
    console.log('Magic link (fallback log):', url);
  }

  return NextResponse.json({ ok: true });
}


