import { useMutation, useQueryClient } from '@tanstack/react-query';
import { driverService, DriverRegisterData } from '@/services/driver.service';
import { toast } from 'sonner';
import { DRIVER_AUTH_CONFIG, FRONTEND_ROUTES } from '@/constants/constants';
import { useRouter } from 'next/navigation';

export const useDriverLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      driverService.login(email, password),
    onSuccess: (data) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(DRIVER_AUTH_CONFIG.tokenKey, data.token);
        localStorage.setItem(DRIVER_AUTH_CONFIG.userKey, JSON.stringify(data.driver));
        
        // Also set cookies for the proxy middleware
        document.cookie = `${DRIVER_AUTH_CONFIG.tokenKey}=${data.token}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `${DRIVER_AUTH_CONFIG.userKey}=${encodeURIComponent(JSON.stringify(data.driver))}; path=/; max-age=86400; SameSite=Lax`;
      }
      toast.success('Login successful');
      router.push(FRONTEND_ROUTES.DRIVER_DASHBOARD);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
    },
  });
};

export const useDriverRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: DriverRegisterData) => driverService.register(data),
    onSuccess: (data) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(DRIVER_AUTH_CONFIG.tokenKey, data.token);
        localStorage.setItem(DRIVER_AUTH_CONFIG.userKey, JSON.stringify(data.driver));
        
        // Also set cookies for the proxy middleware
        document.cookie = `${DRIVER_AUTH_CONFIG.tokenKey}=${data.token}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `${DRIVER_AUTH_CONFIG.userKey}=${encodeURIComponent(JSON.stringify(data.driver))}; path=/; max-age=86400; SameSite=Lax`;
      }
      toast.success('Registration successful! Welcome aboard.');
      router.push(FRONTEND_ROUTES.DRIVER_DASHBOARD);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
    },
  });
};

export const useCreateGuestDriver = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, firstName }: { email: string; firstName?: string }) =>
      driverService.createGuest(email, firstName),
    onSuccess: (data) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(DRIVER_AUTH_CONFIG.tokenKey, data.token);
        localStorage.setItem(DRIVER_AUTH_CONFIG.userKey, JSON.stringify(data.driver));
        
        // Also set cookies for the proxy middleware
        document.cookie = `${DRIVER_AUTH_CONFIG.tokenKey}=${data.token}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `${DRIVER_AUTH_CONFIG.userKey}=${encodeURIComponent(JSON.stringify(data.driver))}; path=/; max-age=86400; SameSite=Lax`;
      }
      toast.success('Guest session created');
      router.push(FRONTEND_ROUTES.DRIVER_CHARGING);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to create guest session';
      toast.error(errorMessage);
    },
  });
};

export const useDriverLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => driverService.logout(),
    onSuccess: () => {
      localStorage.removeItem(DRIVER_AUTH_CONFIG.tokenKey);
      localStorage.removeItem(DRIVER_AUTH_CONFIG.userKey);
      
      // Clear cookies
      document.cookie = `${DRIVER_AUTH_CONFIG.tokenKey}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      document.cookie = `${DRIVER_AUTH_CONFIG.userKey}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      
      queryClient.clear();
      toast.success('Logged out successfully');
      router.push(FRONTEND_ROUTES.DRIVER_LOGIN);
    },
  });
};
