'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { services, workers } from '@/lib/api';

export default function WorkersPage() {
  const params = useParams();
  const id = params.id as string;
  const [service, setService] = useState<{ name: string } | null>(null);
  const [list, setList] = useState<Array<Record<string, unknown>>>([]);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  useEffect(() => {
    services.get(id).then(setService).catch(() => setService(null));
  }, [id]);

  useEffect(() => {
    if (!navigator.geolocation) {
      workers.list({ service: id }).then(setList).catch(() => setList([]));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
      },
      () => workers.list({ service: id }).then(setList).catch(() => setList([]))
    );
  }, [id]);

  useEffect(() => {
    if (lat != null && lng != null) {
      workers.list({ service: id, lat, lng }).then(setList).catch(() => setList([]));
    } else if (lat === null && lng === null) {
      workers.list({ service: id }).then(setList).catch(() => setList([]));
    }
  }, [id, lat, lng]);

  return (
    <div className="animate-fade-in">
      <Link
        href="/"
        className="text-accent font-medium text-sm flex items-center gap-2 mb-6 hover:text-accent-hover transition-colors"
      >
        ← Back
      </Link>
      <h1 className="text-2xl font-bold tracking-tight mb-1">{service?.name ?? 'Service'}</h1>
      <p className="text-muted mb-8">Choose a verified worker</p>
      <div className="grid gap-4 md:grid-cols-2">
        {list.length === 0 && (
          <p className="col-span-full text-muted text-center py-12">No workers found for this service.</p>
        )}
        {list.map((w) => (
          <Link
            key={String(w.id)}
            href={`/workers/${w.id}?service=${id}`}
            className="card-hover block group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-bg-surface border border-bg-border flex items-center justify-center text-lg font-bold shrink-0 group-hover:border-accent/50 transition-colors">
                {String(w.name).charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-white">{String(w.name)}</span>
                  {w.verified === true && <span className="badge-verified">Verified</span>}
                </div>
                <p className="text-sm text-muted mt-1">
                  ₦{Number(w.price_min).toLocaleString()}
                  {w.price_max ? ` – ₦${Number(w.price_max).toLocaleString()}` : '+'}
                  {w.distance_km != null && ` · ${w.distance_km} km away`}
                </p>
                <p className="text-sm mt-1 star">★ {Number(w.rating || 0).toFixed(1)} ({Number(w.review_count || 0)} reviews)</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
