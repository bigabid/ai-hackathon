"use client";
import { useEffect, useState } from 'react';
import { ensureSessionId } from '@/lib/session';

type Creative = { id: string; type: 'IMAGE' | 'VIDEO' | 'HTML5'; src: string };

export default function SwipePage({ params }: { params: { token: string } }) {
  const { token } = params;
  const [creative, setCreative] = useState<Creative | null>(null);
  const [history, setHistory] = useState<Creative[]>([]);
  const sessionId = ensureSessionId();

  async function loadNext() {
    const res = await fetch(`/api/s/${token}/next`);
    const data = await res.json();
    if (data?.creative) setCreative(data.creative);
    else setCreative(null);
  }

  useEffect(() => { loadNext(); }, [token]);

  async function send(type: 'LIKE' | 'DISLIKE' | 'SUPERLIKE' | 'SKIP') {
    if (!creative) return;
    await fetch(`/api/s/${token}/event`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creativeId: creative.id, sessionId, type }),
    });
    setHistory((h) => [creative, ...h].slice(0, 20));
    await loadNext();
  }

  async function undo() {
    const prev = history[0];
    if (!prev) return;
    await fetch(`/api/s/${token}/event`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creativeId: prev.id, sessionId, type: 'UNDO' }),
    });
    setHistory(([, ...rest]) => rest);
    setCreative(prev);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      {!creative ? (
        <p>No more creatives.</p>
      ) : (
        <div className="w-full max-w-sm space-y-3">
          <div className="rounded border p-2">
            {creative.type === 'IMAGE' && <img src={creative.src} alt="" className="w-full" />}
            {creative.type === 'VIDEO' && (
              <video controls className="w-full">
                <source src={creative.src} />
              </video>
            )}
            {creative.type === 'HTML5' && (
              <iframe src={creative.src} className="h-96 w-full" title="HTML5 creative" />
            )}
          </div>
          <div className="flex justify-between">
            <button onClick={() => send('DISLIKE')} className="rounded bg-gray-200 px-3 py-2">Dislike</button>
            <button onClick={() => send('SKIP')} className="rounded bg-gray-200 px-3 py-2">Skip</button>
            <button onClick={() => send('LIKE')} className="rounded bg-green-600 px-3 py-2 text-white">Like</button>
            <button onClick={() => send('SUPERLIKE')} className="rounded bg-blue-600 px-3 py-2 text-white">Superlike</button>
          </div>
          <div className="text-center">
            <button onClick={undo} className="text-sm underline">Undo last</button>
          </div>
        </div>
      )}
    </main>
  );
}


