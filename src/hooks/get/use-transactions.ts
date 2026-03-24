"use client";

import { useQuery } from "@tanstack/react-query";
import { driverService } from "@/services/driver.service";

export function useTransactions() {
  return useQuery({
    queryKey: ["driver", "transactions"],
    queryFn: () => driverService.getTransactions(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
