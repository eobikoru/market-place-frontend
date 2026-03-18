import Link from 'next/link';

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold tracking-tight mb-6">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        <div className="prose prose-invert prose-sm max-w-none space-y-4 text-muted-foreground">
          <p>
            HelpMe respects your privacy. This policy describes how we collect, use, and protect your information.
          </p>
          <h2 className="text-white font-semibold mt-6">1. Information we collect</h2>
          <p>
            We collect information you provide (name, email, phone, address when booking, payment-related data) and
            data from your use of the platform (device, logs, booking history).
          </p>
          <h2 className="text-white font-semibold mt-6">2. How we use it</h2>
          <p>
            We use your information to provide and improve the service, process bookings and payments, verify
            identities, send notifications, and comply with legal obligations.
          </p>
          <h2 className="text-white font-semibold mt-6">3. Sharing</h2>
          <p>
            We share information with service providers you book (e.g. name, address, contact) and with payment and
            infrastructure providers as needed to run the platform. We do not sell your personal data to third
            parties for marketing.
          </p>
          <h2 className="text-white font-semibold mt-6">4. Security</h2>
          <p>
            We use reasonable measures to protect your data. No system is completely secure; you provide information
            at your own risk.
          </p>
          <h2 className="text-white font-semibold mt-6">5. Your rights</h2>
          <p>
            You may access, correct, or request deletion of your data where applicable by law. Contact us to exercise
            these rights.
          </p>
          <h2 className="text-white font-semibold mt-6">6. Changes</h2>
          <p>
            We may update this policy. We will indicate the last updated date. Continued use after changes constitutes
            acceptance.
          </p>
          <p className="mt-8">
            For questions or requests, contact us at the support address provided in the app.
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
