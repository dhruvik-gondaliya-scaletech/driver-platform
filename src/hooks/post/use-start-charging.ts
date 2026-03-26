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
    onSuccess: (session: any) => {
      const id = session.id || session.sessionId;
      if (id && id !== 'undefined') {
        toast.success("Charging session started successfully!");
        queryClient.invalidateQueries({ queryKey: ["driver", "active-session"] });
        router.push(`/charging/${id}`);
      } else {
        toast.error("Session started but ID is missing");
        console.error("Started session data:", session);
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to start charging session");
    },
  });
}
