'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { bookings } from '@/lib/api';

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      await bookings.review(id, { rating, comment }, token);
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-custom py-8 max-w-md animate-fade-in">
      <Link
        href="/dashboard"
        className="text-accent font-medium text-sm flex items-center gap-2 mb-6 hover:text-accent-hover transition-colors"
      >
        ← Back to bookings
      </Link>
      <div className="card">
        <h1 className="text-xl font-bold tracking-tight mb-6">Rate this booking</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-3">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRating(r)}
                  className={`w-11 h-11 rounded-xl border-2 flex items-center justify-center text-lg transition-all ${
                    rating >= r
                      ? 'border-accent bg-accent-muted text-accent'
                      : 'border-bg-border bg-bg-surface text-muted hover:border-bg-borderHover'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Comment (optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="input min-h-[88px] resize-y"
              rows={3}
            />
          </div>
          {error && (
            <p className="text-danger text-sm bg-danger/10 rounded-xl px-3 py-2">{error}</p>
          )}
          <button type="submit" className="btn-primary w-full py-3 rounded-xl" disabled={loading}>
            {loading ? 'Submitting…' : 'Submit review'}
          </button>
        </form>
      </div>
    </div>
  );
}
