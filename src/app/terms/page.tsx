import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg bg-gradient-mesh">
      <header className="border-b border-bg-border bg-bg/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="container-custom py-4">
          <Link href="/" className="text-accent font-semibold">
            ← HelpMe
          </Link>
        </div>
      </header>
      <main className="container-custom py-10 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Terms of Service</h1>
        <p className="text-muted-foreground text-sm mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        <div className="prose prose-invert prose-sm max-w-none space-y-4 text-muted-foreground">
          <p>
            Welcome to HelpMe. By using our platform you agree to these terms. Please read them carefully.
          </p>
          <h2 className="text-white font-semibold mt-6">1. Use of the platform</h2>
          <p>
            HelpMe connects customers with local service providers. You may use the service only for lawful purposes
            and in line with these terms. You must be at least 18 years old to create an account.
          </p>
          <h2 className="text-white font-semibold mt-6">2. Accounts</h2>
          <p>
            You are responsible for keeping your account credentials secure. You must provide accurate information.
            Service providers (workers) must comply with our verification and quality standards.
          </p>
          <h2 className="text-white font-semibold mt-6">3. Bookings and payments</h2>
          <p>
            Bookings are subject to availability and worker acceptance. Payment terms and refunds are as described at
            the time of booking. Cancellations may be subject to our cancellation policy (e.g. free cancellation more
            than 24 hours before the scheduled time).
          </p>
          <h2 className="text-white font-semibold mt-6">4. Fees</h2>
          <p>
            We may charge a commission or other fees as displayed on the platform. These may change with notice.
          </p>
          <h2 className="text-white font-semibold mt-6">5. Limitation of liability</h2>
          <p>
            HelpMe is a marketplace. We are not the provider of the underlying services. Our liability is limited to
            the extent permitted by law.
          </p>
          <h2 className="text-white font-semibold mt-6">6. Changes</h2>
          <p>
            We may update these terms. Continued use of the platform after changes constitutes acceptance.
          </p>
          <p className="mt-8">
            If you have questions, contact us at the support address provided in the app.
          </p>
        </div>
        <p className="mt-10">
          <Link href="/" className="text-accent hover:underline">
            Back to home
          </Link>
        </p>
      </main>
    </div>
  );
}
