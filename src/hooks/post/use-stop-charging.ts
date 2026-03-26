"use client";

import { driverService } from "@/services/driver.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useStopCharging() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => {
      if (!sessionId || sessionId === 'undefined') {
        throw new Error("Invalid session ID");
      }
      return driverService.stopCharging(sessionId);
    },
    onSuccess: () => {
      toast.success("Charging session stopped successfully");
      queryClient.invalidateQueries({ queryKey: ["driver", "active-session"] });
      queryClient.invalidateQueries({ queryKey: ["driver", "sessions"] });
      queryClient.invalidateQueries({ queryKey: ["driver", "profile"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to stop charging session");
    },
  });
}
