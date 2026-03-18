'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { services, workers } from '@/lib/api';

type Category = { id: string; name: string; slug: string; description?: string };

export default function NewServicePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [serviceCategoryId, setServiceCategoryId] = useState('');
  const [bio, setBio] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [idDocumentUrl, setIdDocumentUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    services.list().then(setCategories).catch(() => setCategories([]));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('helpme_token');
    if (!token) {
      router.replace('/login');
      return;
    }
    const min = parseFloat(priceMin);
    if (Number.isNaN(min) || min < 0) {
      setError('Minimum price must be 0 or greater.');
      return;
    }
    const max = priceMax.trim() ? parseFloat(priceMax) : undefined;
    if (max !== undefined && (Number.isNaN(max) || max < 0 || max < min)) {
      setError('Maximum price must be 0 or greater and not less than minimum.');
      return;
    }
    if (!serviceCategoryId) {
      setError('Please select a service category.');
      return;
    }
    setLoading(true);
    try {
      await workers.apply(
        {
          service_category_id: serviceCategoryId,
          bio: bio.trim() || undefined,
          price_min: min,
          price_max: max,
          id_document_url: idDocumentUrl.trim() || undefined,
        },
        token
      );
      router.push('/dashboard/worker');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add service');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in max-w-lg">
      <Link
        href="/dashboard/worker"
        className="text-sm text-muted hover:text-white mb-6 inline-flex items-center gap-1"
      >
        ← Back to dashboard
      </Link>
      <div className="card mt-2">
        <h1 className="text-2xl font-bold tracking-tight mb-6">Add a service</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Choose the type of service you want to offer and set your rates. You can add more services later.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Service type</label>
            <select
              value={serviceCategoryId}
              onChange={(e) => setServiceCategoryId(e.target.value)}
              className="input"
              required
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Short bio (optional)</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="input min-h-[100px] resize-y"
              placeholder="Describe your experience and what you offer..."
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Minimum price (₦)</label>
            <input
              type="number"
              min="0"
              step="100"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="input"
              placeholder="e.g. 5000"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Maximum price (₦, optional)</label>
            <input
              type="number"
              min="0"
              step="100"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="input"
              placeholder="Leave blank for no max"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">ID document link (optional)</label>
            <input
              type="url"
              value={idDocumentUrl}
              onChange={(e) => setIdDocumentUrl(e.target.value)}
              className="input"
              placeholder="https://... (for verification; you can add later)"
            />
            <p className="text-xs text-muted mt-1">Upload your ID to a secure storage and paste the link here. Required for verification to appear in search.</p>
          </div>
          {error && (
            <p className="text-danger text-sm bg-danger/10 rounded-xl px-3 py-2">{error}</p>
          )}
          <button type="submit" className="btn-primary w-full py-3 rounded-xl" disabled={loading}>
            {loading ? 'Adding service…' : 'Add service'}
          </button>
        </form>
      </div>
    </div>
  );
}
