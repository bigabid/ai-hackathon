import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { removeAsset } from '@/src/lib/fs';

const prisma = new PrismaClient();

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const creative = await prisma.creative.delete({ where: { id } });
  if (creative.src) await removeAsset(creative.src);
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json().catch(() => ({}));
  const weight = Number(body?.weight);
  if (!Number.isFinite(weight) || weight < 0) return NextResponse.json({ error: 'Invalid weight' }, { status: 400 });
  const updated = await prisma.creative.update({ where: { id }, data: { weight } });
  return NextResponse.json(updated);
}


