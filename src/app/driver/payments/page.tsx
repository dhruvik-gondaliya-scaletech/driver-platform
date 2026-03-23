import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payments | Driver App',
  description: 'Manage your payment methods and view transactions',
};

export default function DriverPaymentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">
          Manage payment methods and view transactions
        </p>
      </div>
      
      <div className="grid gap-6">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
          <p className="text-muted-foreground">
            Payment methods coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}
