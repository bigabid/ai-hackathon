import { NextResponse } from 'next/server';
import { PrismaClient, EventType } from '@prisma/client';
import { chiSquareLikesVsNotLikes } from '@/lib/stats';

const prisma = new PrismaClient();

export async function GET(_: Request, { params }: { params: { campaignId: string } }) {
  const { campaignId } = params;
  const creatives = await prisma.creative.findMany({ where: { campaignId } });
  const ids = creatives.map((c) => c.id);
  if (ids.length === 0) return NextResponse.json({ creatives: [], significant: false });

  const events = await prisma.event.findMany({ where: { campaignId } });
  const byId = new Map<string, { impressions: number; likes: number; superlikes: number; dislikes: number }>();
  for (const id of ids) byId.set(id, { impressions: 0, likes: 0, superlikes: 0, dislikes: 0 });
  for (const e of events) {
    const row = byId.get(e.creativeId);
    if (!row) continue;
    if (e.type === EventType.IMPRESSION) row.impressions++;
    if (e.type === EventType.LIKE) row.likes++;
    if (e.type === EventType.SUPERLIKE) row.superlikes++;
    if (e.type === EventType.DISLIKE) row.dislikes++;
    if (e.type === EventType.UNDO) {
      // heuristic: undo last action reduces like if any else skip
      if (row.likes > 0) row.likes--;
    }
  }

  const metrics = creatives.map((c) => ({
    id: c.id,
    type: c.type,
    weight: c.weight,
    src: c.src,
    ...byId.get(c.id)!,
  }));

  const likes = metrics.map((m) => m.likes);
  const totals = metrics.map((m) => m.impressions);
  const { significant } = chiSquareLikesVsNotLikes(likes, totals);
  const ranked = [...metrics].sort((a, b) => (b.likes / Math.max(1, b.impressions)) - (a.likes / Math.max(1, a.impressions))
    || b.impressions - a.impressions);

  return NextResponse.json({ metrics: ranked, significant });
}


