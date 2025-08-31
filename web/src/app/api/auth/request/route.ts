import { NextResponse } from 'next/server';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const schema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  const data = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(data);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  const { email } = parsed.data;

  const token = crypto.randomUUID().replace(/-/g, '');
  const ttlMinutes = 15;
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

  await prisma.loginToken.create({ data: { email, token, expiresAt } });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
  const url = `${baseUrl}/api/auth/callback?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'localhost',
    port: Number(process.env.SMTP_PORT || 1026),
    secure: false,
  });

  await transporter.sendMail({
    from: 'no-reply@local.test',
    to: email,
    subject: 'Your login link',
    text: `Login: ${url}`,
    html: `<p>Login: <a href="${url}">${url}</a></p>`,
  });

  return NextResponse.json({ ok: true });
}


