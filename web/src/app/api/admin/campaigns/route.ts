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

const patchSchema = z.object({
  status: z.nativeEnum(CampaignStatus).optional(),
  publishAt: z.string().datetime().nullable().optional(),
  unpublishAt: z.string().datetime().nullable().optional(),
});

export async function PATCH(req: Request) {
  const json = await req.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  const { status, publishAt, unpublishAt } = parsed.data;
  const id = (json as any)?.id as string;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const row = await prisma.campaign.update({
    where: { id },
    data: {
      status: status ?? undefined,
      publishAt: publishAt ? new Date(publishAt) : publishAt === null ? null : undefined,
      unpublishAt: unpublishAt ? new Date(unpublishAt) : unpublishAt === null ? null : undefined,
    },
  });
  return NextResponse.json(row);
}


