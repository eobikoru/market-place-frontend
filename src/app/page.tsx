'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { services } from '@/lib/api';

export default function HomePage() {
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);

  useEffect(() => {
    services.list().then(setCategories).catch(() => setCategories([]));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-bg bg-gradient-mesh">
      <header className="sticky top-0 z-50 border-b border-bg-border bg-bg/80 backdrop-blur-xl">
        <div className="container-custom flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-accent tracking-tight">
            HelpMe
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="btn-ghost text-sm"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="btn-primary text-sm px-5 py-2.5"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container-custom py-20 lg:py-28">
        <section className="text-center max-w-3xl mx-auto mb-20 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Trusted local services,{' '}
            <span className="text-accent bg-clip-text text-transparent bg-gradient-to-r from-accent to-emerald-400">
              one tap away
            </span>
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
            Connect with verified plumbers, electricians, cleaners, tutors and more. Book, pay, and rate — all in one app.
          </p>
          <Link
            href="/register"
            className="btn-primary text-base px-8 py-4 rounded-2xl"
          >
            Get started
          </Link>
        </section>

        <section className="mb-24">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-6">
            Browse by service
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.length === 0 ? (
              <div className="col-span-full flex items-center justify-center py-12 text-muted">
                <span className="animate-pulse">Loading services…</span>
              </div>
            ) : (
              categories.map((c, i) => (
                <Link
                  key={c.id}
                  href={`/services/${c.id}/workers`}
                  className="card-hover block animate-slide-up group"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <span className="font-semibold text-white group-hover:text-accent transition-colors">
                    {c.name}
                  </span>
                </Link>
              ))
            )}
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              ),
              title: 'Verified workers',
              desc: 'ID checks and reviews so you book with confidence.',
            },
            {
              icon: (
                <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              ),
              title: 'Near you',
              desc: 'See nearby professionals and choose by distance.',
            },
            {
              icon: (
                <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6.375c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6.375a1.125 1.125 0 01-1.125-1.125v-3.75c0-.621.504-1.125 1.125-1.125z" />
                </svg>
              ),
              title: 'Pay in app',
              desc: 'Secure payment and clear pricing before booking.',
            },
          ].map((item, i) => (
            <div key={i} className="card group hover:border-bg-borderHover transition-all duration-200">
              <div className="mb-4">{item.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-bg-border py-8 mt-auto">
        <div className="container-custom text-center text-sm text-muted">
          © {new Date().getFullYear()} HelpMe. Local services marketplace.
        </div>
      </footer>
    </div>
  );
}
