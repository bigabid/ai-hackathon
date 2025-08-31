"use client";
import { useEffect, useState } from 'react';

type Campaign = {
  id: string;
  name: string;
  description?: string | null;
  status: string;
  shareToken: string;
  createdAt: string;
};

export default function CampaignsPage() {
  const [items, setItems] = useState<Campaign[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch('/api/admin/campaigns');
    const data = await res.json();
    setItems(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function createCampaign(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/admin/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    });
    setName("");
    setDescription("");
    setLoading(false);
    await load();
  }

  async function del(id: string) {
    await fetch(`/api/admin/campaigns/${id}`, { method: 'DELETE' });
    await load();
  }

  async function publish(id: string) {
    await fetch(`/api/admin/campaigns`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: 'PUBLISHED' }) });
    await load();
  }

  async function unpublish(id: string) {
    await fetch(`/api/admin/campaigns`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: 'DRAFT' }) });
    await load();
  }

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Campaigns</h1>
      <form onSubmit={createCampaign} className="space-y-2 max-w-lg">
        <input className="w-full rounded border p-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <textarea className="w-full rounded border p-2" placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button disabled={loading} className="rounded bg-black px-4 py-2 text-white">Create</button>
      </form>

      <ul className="divide-y rounded border">
        {items.map((c) => (
          <li key={c.id} className="flex items-center justify-between p-3">
            <div>
              <div className="font-medium">{c.name}</div>
              <div className="text-sm text-gray-600">Status: {c.status} · Link token: {c.shareToken}</div>
            </div>
            <div className="space-x-2">
              <a href={`/admin/creatives?campaignId=${c.id}`} className="rounded bg-blue-600 px-3 py-1 text-white">Manage creatives</a>
              <a href={`/c/${c.shareToken}`} className="rounded bg-gray-800 px-3 py-1 text-white" target="_blank">Preview</a>
              {c.status !== 'PUBLISHED' ? (
                <button onClick={() => publish(c.id)} className="rounded bg-green-600 px-3 py-1 text-white">Publish</button>
              ) : (
                <button onClick={() => unpublish(c.id)} className="rounded bg-yellow-500 px-3 py-1 text-white">Unpublish</button>
              )}
              <a href={`/admin/results?campaignId=${c.id}`} className="rounded bg-purple-700 px-3 py-1 text-white">Results</a>
              <button onClick={() => del(c.id)} className="rounded bg-red-100 px-3 py-1 text-red-700">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}


