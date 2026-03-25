"use client";

import { useQuery } from "@tanstack/react-query";
import { driverService } from "@/services/driver.service";

export function useLocations(params?: { name?: string }) {
  return useQuery({
    queryKey: ["driver", "locations", params],
    queryFn: () => driverService.getLocations(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useLocation(locationId: string | null) {
  return useQuery({
    queryKey: ["driver", "location", locationId],
    queryFn: async () => {
      if (!locationId) return null;
      return driverService.getLocations({ name: locationId }).then(locations => 
        locations.find(l => l.id === locationId) || null
      );
    },
    enabled: !!locationId,
  });
}
