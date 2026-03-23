import { Metadata } from 'next';
import { DriverDashboardContainer } from '@/features/driver/containers/DriverDashboardContainer';

export const metadata: Metadata = {
  title: 'Dashboard | Driver App',
  description: 'View your charging activity and quick stats',
};

export default function DriverDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <DriverDashboardContainer />
    </div>
  );
}
