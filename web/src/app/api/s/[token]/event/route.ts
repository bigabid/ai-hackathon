import { NextResponse } from 'next/server';
import { PrismaClient, CampaignStatus, EventType } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request, { params }: { params: { token: string } }) {
  const { token } = params;
  const json = await req.json().catch(() => ({} as any));
  const { creativeId, sessionId, type } = json as { creativeId: string; sessionId: string; type: EventType };
  const campaign = await prisma.campaign.findFirst({ where: { shareToken: token, status: CampaignStatus.PUBLISHED } });
  if (!campaign) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (!creativeId || !sessionId || !type) return NextResponse.json({ error: 'Invalid' }, { status: 400 });
  await prisma.event.create({ data: { campaignId: campaign.id, creativeId, sessionId, type } });
  return NextResponse.json({ ok: true });
}


