"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { driverService } from "@/services/driver.service";
import { useRouter } from "next/navigation";
import { FRONTEND_ROUTES } from "@/constants/constants";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => driverService.logout(),
    onSuccess: () => {
      // Clear all queries from local cache
      queryClient.clear();
      // Redirect to login page
      router.push(FRONTEND_ROUTES.DRIVER_LOGIN);
      // Optional: reload to ensure all states are reset
      if (typeof window !== 'undefined') {
        window.location.href = FRONTEND_ROUTES.DRIVER_LOGIN;
      }
    },
  });
}
