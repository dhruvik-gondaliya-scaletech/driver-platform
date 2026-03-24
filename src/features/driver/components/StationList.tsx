'use client';

import { Station, ChargingStatus } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, MapPin, Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface StationListProps {
  stations: Station[];
  isLoading: boolean;
  onSelect?: (station: Station) => void;
}

export function StationList({ stations, isLoading, onSelect }: StationListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    );
  }

  if (stations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-muted/10">
        <MapPin className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="font-semibold text-lg">No Stations Found</h3>
        <p className="text-muted-foreground max-w-xs px-4">
          We couldn't find any charging stations. Check back later or try a different search.
        </p>
      </div>
    );
  }

  const getStatusColor = (status: ChargingStatus) => {
    switch (status) {
      case ChargingStatus.AVAILABLE:
        return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/50';
      case ChargingStatus.CHARGING:
      case ChargingStatus.OCCUPIED:
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {stations.map((station) => (
        <Card key={station.id} className="overflow-hidden hover:border-primary/50 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{station.name}</CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  {station.location?.name || 'Unknown Location'}
                </CardDescription>
              </div>
              <Badge variant="outline" className={getStatusColor(station.status)}>
                {station.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Power</span>
                <span className="font-medium">{station.maxPower} kW</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Connectors</span>
                <span className="font-medium">{station.connectors?.length || 0} available</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                className="flex-1" 
                size="sm"
                onClick={() => onSelect?.(station)}
                disabled={station.status !== ChargingStatus.AVAILABLE}
              >
                <Zap className="mr-2 h-4 w-4" />
                Start Charge
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
                <Info className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
