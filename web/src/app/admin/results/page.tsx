"use client";
import { useEffect, useState } from 'react';

type Metric = {
  id: string;
  type: string;
  src: string;
  weight: number;
  impressions: number;
  likes: number;
  superlikes: number;
  dislikes: number;
};

export default function ResultsPage({ searchParams }: { searchParams: { campaignId?: string } }) {
  const campaignId = searchParams?.campaignId || '';
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [significant, setSignificant] = useState(false);

  useEffect(() => {
    if (!campaignId) return;
    (async () => {
      const res = await fetch(`/api/admin/results/${campaignId}`);
      const data = await res.json();
      setMetrics(data.metrics || []);
      setSignificant(Boolean(data.significant));
    })();
  }, [campaignId]);

  if (!campaignId) return <main className="p-6">Missing campaignId</main>;

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Results {significant && <span className="text-sm text-green-700">(Significant)</span>}</h1>
      <a className="rounded bg-gray-800 px-3 py-1 text-white" href={`/api/admin/results/${campaignId}/csv`}>
        Export CSV
      </a>
      <table className="w-full table-auto text-left">
        <thead>
          <tr>
            <th className="p-2">Type</th>
            <th className="p-2">Preview</th>
            <th className="p-2">Impressions</th>
            <th className="p-2">Likes</th>
            <th className="p-2">Like Rate</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((m) => (
            <tr key={m.id} className="border-t">
              <td className="p-2">{m.type}</td>
              <td className="p-2">{m.type === 'IMAGE' ? <img src={m.src} className="h-12" /> : m.type}</td>
              <td className="p-2">{m.impressions}</td>
              <td className="p-2">{m.likes}</td>
              <td className="p-2">{((m.likes / Math.max(1, m.impressions)) * 100).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}


