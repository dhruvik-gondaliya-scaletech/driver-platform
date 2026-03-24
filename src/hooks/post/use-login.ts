"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { driverService, DriverLoginResponse } from "@/services/driver.service";
import { useRouter } from "next/navigation";
import { FRONTEND_ROUTES, DRIVER_AUTH_CONFIG } from "@/constants/constants";
import { toast } from "sonner";

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }: any) => driverService.login(email, password),
    onSuccess: (data: DriverLoginResponse) => {
      // Store token and user data
      if (typeof window !== 'undefined') {
        localStorage.setItem(DRIVER_AUTH_CONFIG.tokenKey, data.token);
        localStorage.setItem(DRIVER_AUTH_CONFIG.userKey, JSON.stringify(data.driver));
        
        // Set cookies for middleware
        document.cookie = `${DRIVER_AUTH_CONFIG.tokenKey}=${data.token}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `${DRIVER_AUTH_CONFIG.userKey}=${encodeURIComponent(JSON.stringify(data.driver))}; path=/; max-age=86400; SameSite=Lax`;
      }
      
      toast.success("Login successful!");
      queryClient.setQueryData(["driver", "profile"], data.driver);
      
      // Redirect to dashboard
      router.push(FRONTEND_ROUTES.DRIVER_DASHBOARD);
      // Force reload to ensure all contexts are updated if needed
      if (typeof window !== 'undefined') {
        window.location.href = FRONTEND_ROUTES.DRIVER_DASHBOARD;
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.message || "Failed to login");
    },
  });
}
