"use client";
import { useEffect, useMemo, useState } from 'react';

type Creative = {
  id: string;
  type: 'IMAGE' | 'VIDEO' | 'HTML5';
  src: string;
  weight: number;
  createdAt: string;
};

export default function CreativesPage({ searchParams }: { searchParams: { campaignId?: string } }) {
  const campaignId = useMemo(() => searchParams?.campaignId || '', [searchParams]);
  const [items, setItems] = useState<Creative[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<'IMAGE' | 'VIDEO' | 'HTML5'>('IMAGE');

  async function load() {
    if (!campaignId) return;
    const res = await fetch(`/api/admin/creatives?campaignId=${campaignId}`);
    const data = await res.json();
    setItems(data);
  }

  useEffect(() => {
    load();
  }, [campaignId]);

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    const fd = new FormData();
    fd.set('campaignId', campaignId);
    fd.set('type', type);
    fd.set('file', file);
    await fetch('/api/admin/creatives', { method: 'POST', body: fd });
    setFile(null);
    await load();
  }

  async function del(id: string) {
    await fetch(`/api/admin/creatives/${id}`, { method: 'DELETE' });
    await load();
  }

  async function setWeight(id: string, weight: number) {
    await fetch(`/api/admin/creatives/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ weight }) });
    await load();
  }

  if (!campaignId) return <main className="p-6">Missing campaignId</main>;

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Creatives</h1>
      <form onSubmit={upload} className="flex items-center gap-2">
        <select value={type} onChange={(e) => setType(e.target.value as any)} className="rounded border p-2">
          <option value="IMAGE">Image</option>
          <option value="VIDEO">Video</option>
          <option value="HTML5">HTML5</option>
        </select>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button className="rounded bg-black px-3 py-2 text-white">Upload</button>
      </form>

      <ul className="divide-y rounded border">
        {items.map((it) => (
          <li key={it.id} className="flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              {it.type === 'IMAGE' && <img src={it.src} className="h-16 w-16 object-cover" alt="" />}
              <div>
                <div className="font-medium">{it.type}</div>
                <div className="text-sm text-gray-600">{it.src}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm">Weight</label>
              <input type="number" min={0} value={it.weight} onChange={(e) => setWeight(it.id, Number(e.target.value))} className="w-20 rounded border p-1" />
              <button onClick={() => del(it.id)} className="rounded bg-red-100 px-3 py-1 text-red-700">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}


