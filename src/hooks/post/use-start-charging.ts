"use client";

import { driverService, StartChargingData } from "@/services/driver.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useStartCharging() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: StartChargingData) => driverService.startCharging(data),
    onSuccess: (session) => {
      toast.success("Charging session started successfully!");
      queryClient.invalidateQueries({ queryKey: ["driver", "active-session"] });
      router.push(`/charging/${session.id}`);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to start charging session");
    },
  });
}
