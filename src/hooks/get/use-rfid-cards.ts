"use client";

import { useQuery } from "@tanstack/react-query";
import { driverService } from "@/services/driver.service";

export function useRfidCards() {
  return useQuery({
    queryKey: ["driver", "rfid-cards"],
    queryFn: () => driverService.getRfidCards(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
