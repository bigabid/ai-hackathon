import { NextResponse } from 'next/server';
import { PrismaClient, CreativeType } from '@prisma/client';
import { saveAsset } from '@/src/lib/fs';
import { extname } from 'path';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const campaignId = searchParams.get('campaignId') || '';
  const rows = await prisma.creative.findMany({ where: { campaignId }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const form = await req.formData();
  const campaignId = String(form.get('campaignId') || '');
  const file = form.get('file') as File | null;
  const type = String(form.get('type') || '');
  if (!campaignId || !file || !type) return NextResponse.json({ error: 'Invalid form' }, { status: 400 });

  const buf = Buffer.from(await file.arrayBuffer());
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}${extname(file.name)}`;
  const src = await saveAsset(safeName, buf);

  const ct: CreativeType = type as CreativeType;
  const row = await prisma.creative.create({
    data: { campaignId, type: ct, src, weight: 1 },
  });
  return NextResponse.json(row, { status: 201 });
}


