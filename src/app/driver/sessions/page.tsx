import { Metadata } from 'next';
import { DriverSessionsContainer } from '@/features/driver/containers/DriverSessionsContainer';

export const metadata: Metadata = {
  title: 'Sessions | Driver App',
  description: 'View your charging session history',
};

export default function DriverSessionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Session History</h1>
        <p className="text-muted-foreground">
          View all your past charging sessions
        </p>
      </div>
      
      <DriverSessionsContainer />
    </div>
  );
}
