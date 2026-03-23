import { useMutation, useQueryClient } from '@tanstack/react-query';
import { driverService, StartChargingData } from '@/services/driver.service';
import { toast } from 'sonner';

export const useStartCharging = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StartChargingData) => driverService.startCharging(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-active-session'] });
      queryClient.invalidateQueries({ queryKey: ['driver-sessions'] });
      toast.success('Charging session started successfully');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to start charging';
      toast.error(errorMessage);
    },
  });
};

export const useStopCharging = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => driverService.stopCharging(sessionId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['driver-active-session'] });
      queryClient.invalidateQueries({ queryKey: ['driver-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['driver-transactions'] });
      
      if (data.totalCost) {
        toast.success(`Charging stopped. Total cost: $${data.totalCost.toFixed(2)}`);
      } else {
        toast.success('Charging session stopped successfully');
      }
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to stop charging';
      toast.error(errorMessage);
    },
  });
};
