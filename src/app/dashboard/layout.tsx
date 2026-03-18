'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/api';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('helpme_token');
    if (!token) {
      router.replace('/login');
      return;
    }
    auth.me(token).then((u) => setUser(u)).catch(() => router.replace('/login'));
  }, [router]);

  function logout() {
    localStorage.removeItem('helpme_token');
    router.replace('/');
    router.refresh();
  }

  if (user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-muted">Loading…</p>
        </div>
      </div>
    );
  }

  const isWorker = user.role === 'worker';
  const navHref = isWorker ? '/dashboard/worker' : '/dashboard';
  const navLabel = isWorker ? 'My jobs' : 'My bookings';

  return (
    <div className="min-h-screen flex flex-col bg-bg bg-gradient-mesh">
      <header className="sticky top-0 z-50 border-b border-bg-border bg-bg/80 backdrop-blur-xl">
        <div className="container-custom flex items-center justify-between h-14">
          <Link href="/" className="font-bold text-accent tracking-tight">
            HelpMe
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href={navHref}
              className={`text-sm font-medium transition-colors ${
                pathname === navHref ? 'text-accent' : 'text-muted hover:text-white'
              }`}
            >
              {navLabel}
            </Link>
            <span className="text-sm text-muted">{user.name}</span>
            <button
              type="button"
              onClick={logout}
              className="btn-ghost text-sm"
            >
              Log out
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-1 container-custom py-8">{children}</main>
    </div>
  );
}
