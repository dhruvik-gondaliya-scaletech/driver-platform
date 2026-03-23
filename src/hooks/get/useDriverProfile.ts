import { useQuery } from '@tanstack/react-query';
import { driverService } from '@/services/driver.service';

export const useDriverProfile = (options: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ['driver-profile'],
    queryFn: () => driverService.getProfile(),
    enabled: options.enabled !== undefined ? options.enabled : true,
    staleTime: 60000,
    retry: 1,
  });
};

export const useDriverRfidCards = () => {
  return useQuery({
    queryKey: ['driver-rfid-cards'],
    queryFn: () => driverService.getRfidCards(),
    staleTime: 30000,
  });
};

export const useDriverPaymentMethods = () => {
  return useQuery({
    queryKey: ['driver-payment-methods'],
    queryFn: () => driverService.getPaymentMethods(),
    staleTime: 30000,
  });
};

export const useDriverTransactions = () => {
  return useQuery({
    queryKey: ['driver-transactions'],
    queryFn: () => driverService.getTransactions(),
    staleTime: 10000,
  });
};
