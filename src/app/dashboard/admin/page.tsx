'use client';

import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold tracking-tight mb-8">Admin</h1>
      <div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
        <Link href="/dashboard/admin/verify" className="card-hover block p-6">
          <h2 className="font-semibold text-white mb-1">Verify worker ID</h2>
          <p className="text-sm text-muted-foreground">Review and approve workers who submitted ID documents.</p>
        </Link>
      </div>
    </div>
  );
}
