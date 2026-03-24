"use client";

import { useQuery } from "@tanstack/react-query";
import { driverService } from "@/services/driver.service";

export function useStations(params?: { name?: string; locationId?: string }) {
  return useQuery({
    queryKey: ["driver", "stations", params],
    queryFn: () => driverService.getStations(params),
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useStation(stationId: string | null) {
  return useQuery({
    queryKey: ["driver", "station", stationId],
    queryFn: async () => {
      if (!stationId) return null;
      const stations = await driverService.getStations({ name: stationId });
      // The API might return a list, but we usually look for a specific one by Serial/ID
      return stations.find(s => s.serialNumber === stationId || s.id === stationId) || null;
    },
    enabled: !!stationId,
  });
}
