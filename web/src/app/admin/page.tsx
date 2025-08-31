import Link from 'next/link';

export default function AdminHome() {
  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Admin Dashboard</h1>
      <div className="space-x-3">
        <Link className="underline" href="/admin/campaigns">Manage Campaigns</Link>
        <form action="/api/auth/logout" method="post" className="inline">
          <button className="rounded bg-gray-200 px-3 py-1">Logout</button>
        </form>
      </div>
    </main>
  );
}


