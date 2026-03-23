'use client';

import { useDriverActiveSession } from '@/hooks/get/useDriverCharging';
import { useStopCharging } from '@/hooks/post/useDriverChargingMutations';
import { ActiveSessionCard } from '../components/ActiveSessionCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function DriverChargingContainer() {
  const { data: activeSession, isLoading, error } = useDriverActiveSession();
  const stopChargingMutation = useStopCharging();

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load charging session. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (!activeSession) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Active Session</CardTitle>
          <CardDescription>Start charging at any of our stations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Zap className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 font-semibold">Ready to Charge</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Find a station near you and start your charging session
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <ActiveSessionCard
      session={activeSession}
      onStop={(sessionId) => stopChargingMutation.mutate(sessionId)}
      isStopping={stopChargingMutation.isPending}
    />
  );
}
