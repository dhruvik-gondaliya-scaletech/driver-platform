"use client";

import { useQuery } from "@tanstack/react-query";
import { driverService } from "@/services/driver.service";

export function useActiveSession() {
  return useQuery({
    queryKey: ["driver", "active-session"],
    queryFn: () => driverService.getActiveSession(),
    refetchInterval: 10000, // Refetch every 10 seconds if active
  });
}
