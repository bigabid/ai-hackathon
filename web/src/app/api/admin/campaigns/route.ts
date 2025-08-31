import { NextResponse } from 'next/server';
import { PrismaClient, CampaignStatus } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

export async function GET() {
  const rows = await prisma.campaign.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(rows);
}

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => ({}));
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  const { name, description } = parsed.data;
  const shareToken = crypto.randomUUID().replace(/-/g, '');
  const row = await prisma.campaign.create({
    data: { name, description, status: CampaignStatus.DRAFT, shareToken },
  });
  return NextResponse.json(row, { status: 201 });
}


