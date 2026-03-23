import { Metadata } from 'next';
import { DriverProfileContainer } from '@/features/driver/containers/DriverProfileContainer';

export const metadata: Metadata = {
  title: 'My Profile | Driver App',
  description: 'Manage your driver profile, RFID cards, and view transaction history',
};

export default function DriverProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and view your activity
        </p>
      </div>
      
      <DriverProfileContainer />
    </div>
  );
}
