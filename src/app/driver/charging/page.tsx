import { Metadata } from 'next';
import { DriverChargingContainer } from '@/features/driver/containers/DriverChargingContainer';

export const metadata: Metadata = {
  title: 'Charging | Driver App',
  description: 'Start and manage your charging sessions',
};

export default function DriverChargingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Charging</h1>
        <p className="text-muted-foreground">
          Manage your active charging session
        </p>
      </div>
      
      <DriverChargingContainer />
    </div>
  );
}
