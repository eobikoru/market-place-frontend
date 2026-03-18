'use client';

import { useEffect, useState } from 'react';
import { bookings, payments } from '@/lib/api';

export default function WorkerDashboardPage() {
  const [jobs, setJobs] = useState<Array<Record<string, unknown>>>([]);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('helpme_token');
    if (!token) return;
    bookings.workerJobs(token).then(setJobs).catch(() => setJobs([]));
    payments.wallet(token).then((w) => setBalance(w.balance)).catch(() => setBalance(0));
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
      <h1 className="text-2xl font-bold tracking-tight mb-8">My jobs</h1>
      {balance !== null && (
        <div className="card mb-8 bg-gradient-to-br from-bg-card to-bg-surface border-accent/20">
          <p className="text-sm text-muted mb-1">Available balance</p>
          <p className="text-3xl font-bold text-accent">₦{balance.toLocaleString()}</p>
        </div>
      )}
      <div className="space-y-4">
        {jobs.length === 0 && (
          <div className="card text-center py-12 text-muted">No jobs yet.</div>
        )}
        {jobs.map((j) => (
          <div
            key={String(j.id)}
            className="card-hover flex flex-wrap items-center justify-between gap-4"
          >
            <div className="min-w-0">
              <p className="font-semibold text-white">
                {String(j.service_name)} — {String(j.customer_name)}
              </p>
              <p className="text-sm text-muted mt-1 truncate">{String(j.address)}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {new Date(String(j.scheduled_at)).toLocaleString()} · ₦{Number(j.price).toLocaleString()}
              </p>
            </div>
            <span className={`badge ${statusStyles[String(j.status)] || 'bg-bg-border text-muted'}`}>
              {String(j.status)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
