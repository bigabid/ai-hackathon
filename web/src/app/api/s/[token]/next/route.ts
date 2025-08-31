import { NextResponse } from 'next/server';
import { PrismaClient, CampaignStatus } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(_: Request, { params }: { params: { token: string } }) {
  const { token } = params;
  const campaign = await prisma.campaign.findFirst({ where: { shareToken: token, status: CampaignStatus.PUBLISHED } });
  if (!campaign) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const creatives = await prisma.creative.findMany({ where: { campaignId: campaign.id } });
  if (creatives.length === 0) return NextResponse.json({ done: true });

  const total = creatives.reduce((s, c) => s + (c.weight || 0), 0) || creatives.length;
  let r = Math.random() * total;
  let chosen = creatives[0];
  for (const c of creatives) {
    r -= c.weight || 0;
    if (r <= 0) { chosen = c; break; }
  }
  return NextResponse.json({ creative: chosen });
}


