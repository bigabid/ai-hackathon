import { NextResponse } from 'next/server';
import { PrismaClient, CreativeType } from '@prisma/client';
import { saveAsset } from '@/lib/fs';
import { extname } from 'path';
import mime from 'mime-types';
import sharp from 'sharp';

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
  
  // Basic validation per PRD
  const reportedMime = (file as any).type as string | undefined;
  const inferredMime = mime.lookup(file.name) || undefined;
  const mimeType = reportedMime || (typeof inferredMime === 'string' ? inferredMime : undefined) || '';

  const megabyte = 1024 * 1024;
  const ct: CreativeType = type as CreativeType;

  if (ct === 'IMAGE') {
    if (!(mimeType === 'image/jpeg' || mimeType === 'image/png')) {
      return NextResponse.json({ error: 'Only JPG/PNG allowed' }, { status: 400 });
    }
    if (buf.length > 2 * megabyte) {
      return NextResponse.json({ error: 'Image exceeds 2 MB' }, { status: 400 });
    }
    try {
      const meta = await sharp(buf).metadata();
      const w = meta.width || 0;
      const h = meta.height || 0;
      const allowed = (
        (w === 1080 && h === 1920) ||
        (w === 1080 && h === 1080) ||
        (w === 1200 && h === 628)
      );
      if (!allowed) {
        return NextResponse.json({ error: 'Image must be 1080x1920, 1080x1080, or 1200x628' }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid image file' }, { status: 400 });
    }
  } else if (ct === 'VIDEO') {
    if (!(mimeType === 'video/mp4' || extname(file.name).toLowerCase() === '.mp4')) {
      return NextResponse.json({ error: 'Only MP4 videos allowed' }, { status: 400 });
    }
    if (buf.length > 10 * megabyte) {
      return NextResponse.json({ error: 'Video exceeds 10 MB' }, { status: 400 });
    }
  } else if (ct === 'HTML5') {
    const isZip = mimeType === 'application/zip' || extname(file.name).toLowerCase() === '.zip';
    if (!isZip) {
      return NextResponse.json({ error: 'HTML5 package must be a ZIP' }, { status: 400 });
    }
    if (buf.length > 2 * megabyte) {
      return NextResponse.json({ error: 'ZIP exceeds 2 MB' }, { status: 400 });
    }
  } else {
    return NextResponse.json({ error: 'Unknown creative type' }, { status: 400 });
  }

  const src = await saveAsset(safeName, buf);

  const row = await prisma.creative.create({
    data: { campaignId, type: ct, src, weight: 1 },
  });
  return NextResponse.json(row, { status: 201 });
}


