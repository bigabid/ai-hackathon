import { mkdir, writeFile, stat, unlink } from 'fs/promises';
import { join } from 'path';

export const assetsDir = join(process.cwd(), 'public', 'assets');

export async function ensureAssetsDir() {
  try {
    await stat(assetsDir);
  } catch {
    await mkdir(assetsDir, { recursive: true });
  }
}

export async function saveAsset(filename: string, data: Buffer) {
  await ensureAssetsDir();
  const filePath = join(assetsDir, filename);
  await writeFile(filePath, data);
  return `/assets/${filename}`;
}

export async function removeAsset(relativePath: string) {
  // relativePath like /assets/xyz
  const filePath = join(process.cwd(), 'public', relativePath.replace(/^\/+/, ''));
  await unlink(filePath).catch(() => {});
}


