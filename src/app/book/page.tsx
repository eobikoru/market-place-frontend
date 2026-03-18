'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { workers as workersApi, services as servicesApi, bookings } from '@/lib/api';

function BookPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workerId = searchParams.get('worker') || '';
  const serviceId = searchParams.get('service') || '';
  const [worker, setWorker] = useState<Record<string, unknown> | null>(null);
  const [service, setService] = useState<{ id: string; name: string } | null>(null);
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (workerId) workersApi.get(workerId).then(setWorker).catch(() => setWorker(null));
  }, [workerId]);
  useEffect(() => {
    if (serviceId) servicesApi.get(serviceId).then(setService).catch(() => setService(null));
  }, [serviceId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem('helpme_token');
    if (!token) {
      router.replace('/login');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await bookings.book(
        {
          worker_id: workerId,
          service_category_id: service?.id ?? serviceId,
          price: parseFloat(price),
          address,
          scheduled_at: new Date(scheduledAt).toISOString(),
          notes: notes || undefined,
        },
        token
      );
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed');
    } finally {
      setLoading(false);
    }
  }

  if (!worker || !service) {
    return (
      <div className="container-custom py-12 flex justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-muted">Loading…</p>
        </div>
      </div>
    );
  }

  const suggestedPrice = worker.price_min ? Number(worker.price_min) : 0;

  return (
    <div className="container-custom py-8 max-w-lg animate-fade-in">
      <Link
        href={`/workers/${workerId}?service=${serviceId}`}
        className="text-accent font-medium text-sm flex items-center gap-2 mb-6 hover:text-accent-hover transition-colors"
      >
        ← Back to worker
      </Link>
      <div className="card">
        <h1 className="text-xl font-bold tracking-tight mb-1">Book {service.name}</h1>
        <p className="text-muted mb-6">with {String(worker.name)}</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="input"
              placeholder="Where should the worker come?"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Price (₦)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input"
              min={suggestedPrice}
              placeholder={String(suggestedPrice)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Date & time</label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input min-h-[80px] resize-y"
              rows={2}
            />
          </div>
          {error && (
            <p className="text-danger text-sm bg-danger/10 rounded-xl px-3 py-2">{error}</p>
          )}
          <button type="submit" className="btn-primary w-full py-3 rounded-xl" disabled={loading}>
            {loading ? 'Booking…' : 'Confirm booking'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={
      <div className="container-custom py-12 flex justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <BookPageContent />
    </Suspense>
  );
}
