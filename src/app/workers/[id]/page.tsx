'use client';

import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { workers as workersApi, services } from '@/lib/api';

export default function WorkerProfilePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const serviceId = searchParams.get('service') || '';
  const [worker, setWorker] = useState<Record<string, unknown> | null>(null);
  const [serviceName, setServiceName] = useState('');

  useEffect(() => {
    workersApi.get(id).then(setWorker).catch(() => setWorker(null));
  }, [id]);

  useEffect(() => {
    if (serviceId) services.get(serviceId).then((s) => setServiceName(s.name)).catch(() => {});
  }, [serviceId]);

  if (!worker) {
    return (
      <div className="container-custom py-12 flex justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-muted">Loading…</p>
        </div>
      </div>
    );
  }

  const reviews = (worker.reviews as Array<{ rating: number; comment?: string; user_name: string }>) || [];

  return (
    <div className="container-custom py-8 max-w-2xl animate-fade-in">
      <Link
        href={serviceId ? `/services/${serviceId}/workers` : '/'}
        className="text-accent font-medium text-sm flex items-center gap-2 mb-6 hover:text-accent-hover transition-colors"
      >
        ← Back
      </Link>
      <div className="card mb-8">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-bg-surface border border-bg-border flex items-center justify-center text-2xl font-bold shrink-0">
            {String(worker.name).charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold text-white">{String(worker.name)}</h1>
            {worker.verified === true && <span className="badge-verified mt-2 inline-block">Verified</span>}
            <p className="text-muted mt-1">{String(worker.service_name)}</p>
            <p className="star mt-1">★ {Number(worker.rating || 0).toFixed(1)} ({Number(worker.review_count || 0)} reviews)</p>
            <p className="mt-2 font-semibold text-accent">
              ₦{Number(worker.price_min).toLocaleString()}
              {worker.price_max ? ` – ₦${Number(worker.price_max).toLocaleString()}` : '+'}
            </p>
            {worker.bio != null && worker.bio !== '' ? (
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{String(worker.bio)}</p>
            ) : null}
          </div>
        </div>
        <Link
          href={`/book?worker=${id}&service=${serviceId}`}
          className="btn-primary w-full mt-6 py-3 rounded-xl"
        >
          Book {serviceName || 'service'}
        </Link>
      </div>
      {reviews.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Reviews</h2>
          <div className="space-y-3">
            {reviews.map((r, i) => (
              <div key={i} className="card">
                <p className="star text-sm">★ {r.rating}</p>
                {r.comment && <p className="text-sm text-white/90 mt-1">{r.comment}</p>}
                <p className="text-xs text-muted mt-2">— {r.user_name}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
