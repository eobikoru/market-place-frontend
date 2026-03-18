'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { auth } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await auth.login({ email, password });
      localStorage.setItem('helpme_token', token);
      const user = await auth.me(token);
      const role = (user as { role?: string }).role;
      if (role === 'admin') router.push('/dashboard/admin');
      else if (role === 'worker') router.push('/dashboard/worker');
      else router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
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
          <h1 className="text-2xl font-bold tracking-tight mb-6">Log in</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
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
              <label className="block text-sm font-medium text-muted-foreground mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                required
              />
            </div>
            {error && (
              <p className="text-danger text-sm bg-danger/10 rounded-xl px-3 py-2">{error}</p>
            )}
            <button type="submit" className="btn-primary w-full py-3 rounded-xl" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <p className="mt-6 text-sm text-muted text-center">
            Don’t have an account?{' '}
            <Link href="/register" className="text-accent font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
