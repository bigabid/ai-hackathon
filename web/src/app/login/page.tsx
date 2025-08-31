"use client";
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function requestLink(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch('/api/auth/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (res.ok) setSent(true);
    else setError('Failed to send link');
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm rounded border p-6 shadow">
        <h1 className="mb-4 text-xl font-semibold">Admin Sign-in</h1>
        {sent ? (
          <p>Check your inbox for a login link.</p>
        ) : (
          <form onSubmit={requestLink} className="space-y-3">
            <input
              type="email"
              className="w-full rounded border p-2"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button className="w-full rounded bg-black p-2 text-white">Send magic link</button>
          </form>
        )}
      </div>
    </main>
  );
}


