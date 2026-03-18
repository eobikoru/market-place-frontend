'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { auth, notifications as notificationsApi } from '@/lib/api';

type Notif = { id: string; type: string; title: string; body?: string; read_at?: string; created_at: string };

export default function NotificationsPage() {
  const [list, setList] = useState<Notif[]>([]);
  const [role, setRole] = useState<string>('customer');

  useEffect(() => {
    const token = localStorage.getItem('helpme_token');
    if (!token) return;
    notificationsApi.list(token).then(setList).catch(() => setList([]));
    auth.me(token).then((u) => setRole((u as { role?: string }).role || 'customer')).catch(() => {});
  }, []);

  async function markRead(id: string) {
    const token = localStorage.getItem('helpme_token');
    if (!token) return;
    try {
      await notificationsApi.markRead(id, token);
      setList((prev) => prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)));
    } catch {
      // ignore
    }
  }

  return (
    <div className="animate-fade-in max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Notifications</h1>
      {list.length === 0 ? (
        <div className="card text-center py-12 text-muted">No notifications yet.</div>
      ) : (
        <div className="space-y-3">
          {list.map((n) => (
            <div
              key={n.id}
              className={`card flex items-start justify-between gap-4 ${!n.read_at ? 'border-accent/40' : ''}`}
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-white">{n.title}</p>
                {n.body && <p className="text-sm text-muted-foreground mt-1">{n.body}</p>}
                <p className="text-xs text-muted mt-2">{new Date(n.created_at).toLocaleString()}</p>
              </div>
              {!n.read_at && (
                <button
                  type="button"
                  onClick={() => markRead(n.id)}
                  className="btn-ghost text-sm shrink-0"
                >
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      <p className="mt-6">
        <Link
          href={role === 'admin' ? '/dashboard/admin' : role === 'worker' ? '/dashboard/worker' : '/dashboard'}
          className="text-sm text-accent hover:underline"
        >
          ← Back to dashboard
        </Link>
      </p>
    </div>
  );
}
