import { useMutation, useQueryClient } from '@tanstack/react-query';
import { driverAppConfigService, UpdateDriverAppConfigData } from '@/services/driver-app-config.service';
import { toast } from 'sonner';

export const useUpdateDriverAppConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateDriverAppConfigData) => driverAppConfigService.updateConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-app-config'] });
      toast.success('Driver app configuration updated successfully');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update configuration';
      toast.error(errorMessage);
    },
  });
};
