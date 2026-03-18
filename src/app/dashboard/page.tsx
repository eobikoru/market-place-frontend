'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { bookings } from '@/lib/api';

export default function DashboardPage() {
  const [list, setList] = useState<Array<Record<string, unknown>>>([]);

  useEffect(() => {
    const token = localStorage.getItem('helpme_token');
    if (!token) return;
    bookings.myBookings(token).then(setList).catch(() => setList([]));
  }, []);

  const statusStyles: Record<string, string> = {
    pending: 'bg-gold/20 text-gold',
    accepted: 'bg-blue-500/20 text-blue-400',
    in_progress: 'bg-accent-muted text-accent',
    completed: 'bg-muted/20 text-muted-foreground',
    cancelled: 'bg-danger/20 text-danger',
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold tracking-tight mb-8">My bookings</h1>
      <div className="space-y-4">
        {list.length === 0 && (
          <div className="card text-center py-12">
            <p className="text-muted mb-4">No bookings yet.</p>
            <Link href="/" className="btn-primary">
              Find a service
            </Link>
          </div>
        )}
        {list.map((b) => (
          <div
            key={String(b.id)}
            className="card-hover flex flex-wrap items-center justify-between gap-4"
          >
            <div className="min-w-0">
              <p className="font-semibold text-white">
                {String(b.service_name)} — {String(b.worker_name)}
              </p>
              <p className="text-sm text-muted mt-1 truncate">{String(b.address)}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {new Date(String(b.scheduled_at)).toLocaleString()} · ₦{Number(b.price).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`badge ${statusStyles[String(b.status)] || 'bg-bg-border text-muted'}`}>
                {String(b.status)}
              </span>
              {String(b.status) === 'completed' && (
                <Link
                  href={`/dashboard/bookings/${b.id}/review`}
                  className="btn-ghost text-sm"
                >
                  Rate
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
