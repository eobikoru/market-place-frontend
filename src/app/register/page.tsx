'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { auth } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'worker'>('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await auth.register({
        name,
        email,
        password,
        phone: phone || undefined,
        role,
      });
      localStorage.setItem('helpme_token', token);
      router.push(role === 'worker' ? '/dashboard/worker' : '/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-bg bg-gradient-mesh">
      <div className="w-full max-w-md animate-fade-in">
        <Link href="/" className="text-accent font-semibold text-sm flex items-center gap-2 mb-8 hover:text-accent-hover transition-colors">
          <span>←</span> HelpMe
        </Link>
        <div className="card">
          <h1 className="text-2xl font-bold tracking-tight mb-6">Create account</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">I am a</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'customer' | 'worker')}
                className="input"
              >
                <option value="customer">Customer</option>
                <option value="worker">Service provider (worker)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Phone (optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input"
                placeholder="+234..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Password (min 8 characters)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                minLength={8}
                required
              />
            </div>
            {error && (
              <p className="text-danger text-sm bg-danger/10 rounded-xl px-3 py-2">{error}</p>
            )}
            <button type="submit" className="btn-primary w-full py-3 rounded-xl" disabled={loading}>
              {loading ? 'Creating account…' : 'Sign up'}
            </button>
          </form>
          <p className="mt-6 text-sm text-muted text-center">
            Already have an account?{' '}
            <Link href="/login" className="text-accent font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
