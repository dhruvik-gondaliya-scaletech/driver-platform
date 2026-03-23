'use client';

import { useDriverProfile } from '@/hooks/get/useDriverProfile';
import { useDriverSessions, useDriverActiveSession } from '@/hooks/get/useDriverCharging';
import { useDriverTransactions } from '@/hooks/get/useDriverProfile';
import { DashboardStatsCard } from '../components/DashboardStatsCard';
import { ActiveSessionCard } from '../components/ActiveSessionCard';
import { useStopCharging } from '@/hooks/post/useDriverChargingMutations';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Wallet, Zap, History, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { useConfig } from '@/contexts/ConfigContext';
import { PricingModel } from '@/services/config.service';

export function DriverDashboardContainer() {
  const { config } = useConfig();
  const { data: driver, isLoading: isLoadingProfile } = useDriverProfile();
  const { data: sessions = [], isLoading: isLoadingSessions } = useDriverSessions();
  const { data: activeSession } = useDriverActiveSession();
  const { data: transactions = [] } = useDriverTransactions();
  const stopChargingMutation = useStopCharging();

  if (isLoadingProfile || isLoadingSessions) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!driver) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load dashboard data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const completedSessions = sessions.filter(s => s.status === 'completed');
  const totalEnergy = completedSessions.reduce((sum, s) => sum + Number(s.energyDeliveredKwh), 0);
  const totalSpent = transactions
    .filter(t => t.type === 'charge' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  // Determine visibility of cards
  const showWallet = config?.pricingModel !== PricingModel.PAY_PER_USE || config?.requirePaymentMethod;
  const showLoyalty = config?.features?.loyaltyPoints !== false;

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div>
        <h2 className="text-2xl font-bold">
          Welcome back, {driver.firstName}! 👋
        </h2>
        <p className="text-muted-foreground">
          Here's your charging overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {showWallet && (
          <DashboardStatsCard
            title="Wallet Balance"
            value={`$${Number(driver.walletBalance).toFixed(2)}`}
            icon={Wallet}
            iconColor="text-green-600 dark:text-green-400"
            iconBgColor="bg-green-500/10"
          />
        )}
        <DashboardStatsCard
          title="Total Sessions"
          value={completedSessions.length}
          subtitle={`${sessions.length} total`}
          icon={Zap}
          iconColor="text-blue-600 dark:text-blue-400"
          iconBgColor="bg-blue-500/10"
        />
        <DashboardStatsCard
          title="Energy Charged"
          value={`${Number(totalEnergy).toFixed(1)} kWh`}
          icon={History}
          iconColor="text-purple-600 dark:text-purple-400"
          iconBgColor="bg-purple-500/10"
        />
        {showLoyalty && (
          <DashboardStatsCard
            title="Loyalty Points"
            value={driver.loyaltyPoints}
            icon={Award}
            iconColor="text-amber-600 dark:text-amber-400"
            iconBgColor="bg-amber-500/10"
          />
        )}
      </div>

      {/* Active Session */}
      {activeSession ? (
        <ActiveSessionCard
          session={activeSession}
          onStop={(sessionId) => stopChargingMutation.mutate(sessionId)}
          isStopping={stopChargingMutation.isPending}
        />
      ) : (
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
              <p className="text-sm text-muted-foreground">
                Find a station near you and start your charging session
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest charging sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {completedSessions.length > 0 ? (
            <div className="space-y-3">
              {completedSessions.slice(0, 3).map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {session.station?.name || `Station ${session.stationId.slice(0, 8)}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {Number(session.energyDeliveredKwh).toFixed(2)} kWh
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">
                    ${session.totalCost ? Number(session.totalCost).toFixed(2) : '0.00'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-4">
              No recent activity
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
