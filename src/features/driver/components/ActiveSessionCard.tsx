'use client';

import { ChargingSession } from '@/services/driver.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Clock, Battery, DollarSign, StopCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActiveSessionCardProps {
  session: ChargingSession;
  onStop: (sessionId: string) => void;
  isStopping?: boolean;
}

export function ActiveSessionCard({ session, onStop, isStopping }: ActiveSessionCardProps) {
  return (
    <Card className="border-primary/50 bg-primary/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Zap className="h-5 w-5 text-primary animate-pulse" />
            </div>
            <div>
              <CardTitle className="text-lg">Active Charging Session</CardTitle>
              <Badge variant="outline" className="mt-1 rounded-full">
                In Progress
              </Badge>
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onStop(session.id)}
            disabled={isStopping}
          >
            <StopCircle className="mr-2 h-4 w-4" />
            {isStopping ? 'Stopping...' : 'Stop Charging'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
              <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-semibold">
                {formatDistanceToNow(new Date(session.startTime), { addSuffix: false })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
              <Battery className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Energy</p>
              <p className="font-semibold">
                {Number(session.energyDeliveredKwh).toFixed(2)} kWh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
              <DollarSign className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estimated Cost</p>
              <p className="font-semibold">
                ${session.totalCost ? Number(session.totalCost).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
              <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Station</p>
              <p className="font-semibold truncate">
                {session.station?.name || `Station ${session.stationId.slice(0, 8)}`}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-lg border bg-muted/50 p-3">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Connector {session.connectorId}</span> • 
            Started {formatDistanceToNow(new Date(session.startTime), { addSuffix: true })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
