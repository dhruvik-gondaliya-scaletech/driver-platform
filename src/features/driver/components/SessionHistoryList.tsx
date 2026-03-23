'use client';

import { ChargingSession } from '@/services/driver.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Clock, Battery, DollarSign, Calendar } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface SessionHistoryListProps {
  sessions: ChargingSession[];
}

export function SessionHistoryList({ sessions }: SessionHistoryListProps) {
  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Session History</CardTitle>
          <CardDescription>View your past charging sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Zap className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 font-semibold">No Sessions Yet</h3>
            <p className="text-sm text-muted-foreground">
              Your charging session history will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      completed: { variant: 'default', label: 'Completed' },
      'in-progress': { variant: 'secondary', label: 'In Progress' },
      failed: { variant: 'destructive', label: 'Failed' },
    };
    return variants[status] || variants['in-progress'];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session History</CardTitle>
        <CardDescription>View your past charging sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sessions.map((session) => {
            const statusInfo = getStatusBadge(session.status);
            return (
              <div
                key={session.id}
                className="flex flex-col gap-3 rounded-lg border bg-card p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {session.station?.name || `Station ${session.stationId.slice(0, 8)}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Connector {session.connectorId}
                      </p>
                    </div>
                  </div>
                  <Badge variant={statusInfo.variant} className="rounded-full">
                    {statusInfo.label}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="text-sm font-medium">
                        {format(new Date(session.startTime), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="text-sm font-medium">
                        {Number(session.durationMinutes).toFixed(0)} min
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Battery className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Energy</p>
                      <p className="text-sm font-medium">
                        {Number(session.energyDeliveredKwh).toFixed(2)} kWh
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Cost</p>
                      <p className="text-sm font-medium">
                        ${session.totalCost ? Number(session.totalCost).toFixed(2) : '0.00'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
