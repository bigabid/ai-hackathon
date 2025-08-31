import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  await prisma.campaign.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}


