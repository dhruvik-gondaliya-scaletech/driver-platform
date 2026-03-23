import { useMutation, useQueryClient } from '@tanstack/react-query';
import { driverService, Driver } from '@/services/driver.service';
import { toast } from 'sonner';

export const useUpdateDriverProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Driver>) => driverService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-profile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
    },
  });
};

export const useAddRfidCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idTag, visualNumber }: { idTag: string; visualNumber?: string }) =>
      driverService.addRfidCard(idTag, visualNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-rfid-cards'] });
      toast.success('RFID card added successfully');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to add RFID card';
      toast.error(errorMessage);
    },
  });
};

export const useRemoveRfidCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cardId: string) => driverService.removeRfidCard(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-rfid-cards'] });
      toast.success('RFID card removed successfully');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to remove RFID card';
      toast.error(errorMessage);
    },
  });
};
