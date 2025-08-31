import { NextResponse } from 'next/server';
import { PrismaClient, EventType } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(_: Request, { params }: { params: { campaignId: string } }) {
  const { campaignId } = params;
  const creatives = await prisma.creative.findMany({ where: { campaignId } });
  const events = await prisma.event.findMany({ where: { campaignId } });
  const byId = new Map<string, { impressions: number; likes: number; superlikes: number; dislikes: number }>();
  for (const c of creatives) byId.set(c.id, { impressions: 0, likes: 0, superlikes: 0, dislikes: 0 });
  for (const e of events) {
    const row = byId.get(e.creativeId);
    if (!row) continue;
    if (e.type === EventType.IMPRESSION) row.impressions++;
    if (e.type === EventType.LIKE) row.likes++;
    if (e.type === EventType.SUPERLIKE) row.superlikes++;
    if (e.type === EventType.DISLIKE) row.dislikes++;
  }

  const header = 'creative_id,type,src,weight,impressions,likes,superlikes,dislikes\n';
  const lines = creatives.map((c) => {
    const m = byId.get(c.id)!;
    return `${c.id},${c.type},${c.src},${c.weight},${m.impressions},${m.likes},${m.superlikes},${m.dislikes}`;
  });
  const csv = header + lines.join('\n');
  return new NextResponse(csv, { headers: { 'Content-Type': 'text/csv' } });
}


