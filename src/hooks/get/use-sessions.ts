"use client";

import { useQuery } from "@tanstack/react-query";
import { driverService } from "@/services/driver.service";

export function useSessions() {
  return useQuery({
    queryKey: ["driver", "sessions"],
    queryFn: () => driverService.getSessions(),
    staleTime: 1000 * 60, // 1 minute
  });
}
