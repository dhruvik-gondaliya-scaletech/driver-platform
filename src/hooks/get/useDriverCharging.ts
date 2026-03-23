import { useQuery } from '@tanstack/react-query';
import { driverService } from '@/services/driver.service';

export const useDriverSessions = () => {
  return useQuery({
    queryKey: ['driver-sessions'],
    queryFn: () => driverService.getSessions(),
    staleTime: 10000,
    refetchInterval: 30000,
  });
};

export const useDriverActiveSession = () => {
  return useQuery({
    queryKey: ['driver-active-session'],
    queryFn: () => driverService.getActiveSession(),
    staleTime: 5000,
    refetchInterval: 10000,
  });
};
