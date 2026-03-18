'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth, bookings, payments } from '@/lib/api';

type WorkerProfileItem = {
  id: string;
  service_name: string;
  bio?: string | null;
  price_min: number;
  price_max?: number | null;
  rating?: number | null;
  review_count?: number | null;
  verified?: boolean;
  id_verified?: boolean;
};

export default function WorkerDashboardPage() {
  const [jobs, setJobs] = useState<Array<Record<string, unknown>>>([]);
  const [balance, setBalance] = useState<number | null>(null);
  const [myServices, setMyServices] = useState<WorkerProfileItem[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('helpme_token');
    if (!token) return;
    auth.me(token).then((u) => {
      const profile = (u as { workerProfile?: WorkerProfileItem[] }).workerProfile;
      setMyServices(profile ?? []);
    }).catch(() => setMyServices([]));
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

  async function updateStatus(bookingId: string, status: string) {
    const token = localStorage.getItem('helpme_token');
    if (!token) return;
    try {
      await bookings.updateStatus(bookingId, status, token);
      const list = await bookings.workerJobs(token);
      setJobs(list);
    } catch {
      // keep UI as is on error
    }
  }

  return (
    <div className="animate-fade-in space-y-10">
      {/* Appointments – when they are booked */}
      <section>
        <h1 className="text-2xl font-bold tracking-tight mb-4">Appointments</h1>
        <p className="text-muted-foreground text-sm mb-4">
          Bookings from customers. Accept or update status as you complete jobs.
        </p>
        {jobs.length === 0 ? (
          <div className="card text-center py-12 text-muted">
            <p>No appointments yet.</p>
            <p className="text-sm mt-2">When customers book your services, they&apos;ll appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((j) => {
              const status = String(j.status);
              return (
                <div
                  key={String(j.id)}
                  className="card-hover flex flex-wrap items-start justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white">
                      {String(j.service_name)} — {String(j.customer_name)}
                    </p>
                    <p className="text-sm text-muted mt-1 truncate">{String(j.address)}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(String(j.scheduled_at)).toLocaleString()} · ₦{Number(j.price).toLocaleString()}
                    </p>
                    {j.notes ? (
                      <p className="text-sm text-muted mt-1 italic">&ldquo;{String(j.notes)}&rdquo;</p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`badge ${statusStyles[status] || 'bg-bg-border text-muted'}`}>
                      {status.replace('_', ' ')}
                    </span>
                    {status === 'pending' && (
                      <>
                        <button
                          type="button"
                          onClick={() => updateStatus(String(j.id), 'accepted')}
                          className="btn-primary px-3 py-1.5 text-sm rounded-lg"
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStatus(String(j.id), 'cancelled')}
                          className="btn-ghost px-3 py-1.5 text-sm rounded-lg text-danger hover:border-danger/50"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {status === 'accepted' && (
                      <button
                        type="button"
                        onClick={() => updateStatus(String(j.id), 'in_progress')}
                        className="btn-primary px-3 py-1.5 text-sm rounded-lg"
                      >
                        Start job
                      </button>
                    )}
                    {status === 'in_progress' && (
                      <button
                        type="button"
                        onClick={() => updateStatus(String(j.id), 'completed')}
                        className="btn-primary px-3 py-1.5 text-sm rounded-lg"
                      >
                        Mark complete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Balance */}
      {balance !== null && (
        <div className="card bg-gradient-to-br from-bg-card to-bg-surface border-accent/20">
          <p className="text-sm text-muted mb-1">Available balance</p>
          <p className="text-3xl font-bold text-accent">₦{balance.toLocaleString()}</p>
        </div>
      )}

      {/* My services */}
      <section>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold tracking-tight">My services</h2>
          <Link
            href="/dashboard/worker/services/new"
            className="btn-primary px-5 py-2.5 rounded-xl"
          >
            Add a service
          </Link>
        </div>
        {myServices.length === 0 ? (
          <div className="card text-center py-10">
            <p className="text-muted mb-4">You haven&apos;t added any service yet.</p>
            <Link href="/dashboard/worker/services/new" className="btn-primary inline-flex">
              Create your first service
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {myServices.map((s) => (
              <div key={s.id} className="card-hover">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-semibold text-white">{s.service_name}</h3>
                  {s.verified === true && <span className="badge-verified">Verified</span>}
                  {s.id_verified !== true && (
                    <span className="badge bg-muted/30 text-muted text-xs">Pending verification</span>
                  )}
                </div>
                {s.bio && <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{s.bio}</p>}
                <p className="text-sm text-accent font-medium">
                  ₦{Number(s.price_min).toLocaleString()}
                  {s.price_max ? ` – ₦${Number(s.price_max).toLocaleString()}` : '+'}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
