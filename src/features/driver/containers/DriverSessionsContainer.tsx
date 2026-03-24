'use client';

import { useSessions } from '@/hooks/get/use-sessions';
import { SessionHistoryList } from '../components/SessionHistoryList';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function DriverSessionsContainer() {
  const { data: sessions = [], isLoading, error } = useSessions();

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load sessions. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  return <SessionHistoryList sessions={sessions} />;
}
