import { useQuery } from '@tanstack/react-query';
import { driverAppConfigService } from '@/services/driver-app-config.service';

export const useDriverAppConfig = () => {
  return useQuery({
    queryKey: ['driver-app-config'],
    queryFn: async () => {
      try {
        const config = await driverAppConfigService.getConfig();
        console.log('Driver App Config loaded:', config);
        return config;
      } catch (error) {
        console.error('Driver App Config error:', error);
        throw error;
      }
    },
    staleTime: 60000,
    retry: false,
  });
};
