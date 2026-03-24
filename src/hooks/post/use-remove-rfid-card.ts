"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { driverService } from "@/services/driver.service";
import { toast } from "sonner";

export function useRemoveRfidCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cardId: string) => driverService.removeRfidCard(cardId),
    onSuccess: () => {
      toast.success("RFID card removed successfully");
      queryClient.invalidateQueries({ queryKey: ["driver", "rfid-cards"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to remove RFID card");
    },
  });
}
