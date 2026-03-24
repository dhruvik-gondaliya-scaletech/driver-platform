"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { driverService, Driver } from "@/services/driver.service";
import { toast } from "sonner";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Driver>) => driverService.updateProfile(data),
    onSuccess: (updatedDriver) => {
      toast.success("Profile updated successfully");
      queryClient.setQueryData(["driver", "profile"], updatedDriver);
      queryClient.invalidateQueries({ queryKey: ["driver", "profile"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update profile");
    },
  });
}
