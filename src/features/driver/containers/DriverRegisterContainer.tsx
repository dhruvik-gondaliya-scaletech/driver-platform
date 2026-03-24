'use client';

import { DriverRegisterForm } from '../components/DriverRegisterForm';
import { useRegister } from '@/hooks/post/use-register';
import { DriverRegisterInput } from '@/lib/validations/driver-auth.schema';

export function DriverRegisterContainer() {
  const registerMutation = useRegister();

  const handleSubmit = async (data: DriverRegisterInput) => {
    const { confirmPassword, ...registerData } = data;
    await registerMutation.mutateAsync(registerData);
  };

  return (
    <DriverRegisterForm 
      onSubmit={handleSubmit} 
      isLoading={registerMutation.isPending} 
    />
  );
}
