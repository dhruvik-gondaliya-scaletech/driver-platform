"use client";

import { useQuery } from "@tanstack/react-query";
import { driverService } from "@/services/driver.service";

export function useProfile() {
  return useQuery({
    queryKey: ["driver", "profile"],
    queryFn: () => driverService.getProfile(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
