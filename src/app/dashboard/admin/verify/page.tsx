'use client';

import { useEffect, useState } from 'react';
import { admin } from '@/lib/api';

export default function AdminVerifyPage() {
  const [list, setList] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('helpme_token');
    if (!token) return;
    admin.workersPendingVerification(token).then(setList).catch(() => setList([])).finally(() => setLoading(false));
  }, []);

  async function handleVerify(workerId: string, approved: boolean) {
    const token = localStorage.getItem('helpme_token');
    if (!token) return;
    try {
      await admin.workerIdVerify(workerId, approved, token);
      setList((prev) => prev.filter((w) => w.id !== workerId));
    } catch {
      // keep list
    }
  }

  if (loading) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold tracking-tight mb-8">Pending ID verification</h1>
        <p className="text-muted">Loading…</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold tracking-tight mb-8">Pending ID verification</h1>
      {list.length === 0 ? (
        <div className="card text-center py-12 text-muted">No workers pending verification.</div>
      ) : (
        <div className="space-y-4">
          {list.map((w) => (
            <div key={String(w.id)} className="card flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-semibold text-white">{String(w.name)}</p>
                <p className="text-sm text-muted">{String(w.email)} · {String(w.service_name)}</p>
                {w.id_document_url ? (
                  <a
                    href={String(w.id_document_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent hover:underline mt-1 inline-block"
                  >
                    View ID document →
                  </a>
                ) : null}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleVerify(String(w.id), true)}
                  className="btn-primary px-4 py-2 rounded-xl text-sm"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => handleVerify(String(w.id), false)}
                  className="btn-ghost px-4 py-2 rounded-xl text-sm text-danger hover:border-danger/50"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
