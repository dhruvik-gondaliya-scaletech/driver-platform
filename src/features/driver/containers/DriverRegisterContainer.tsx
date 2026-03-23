'use client';

import { DriverRegisterForm } from '../components/DriverRegisterForm';
import { useDriverRegister } from '@/hooks/post/useDriverAuthMutations';
import { DriverRegisterInput } from '@/lib/validations/driver-auth.schema';

export function DriverRegisterContainer() {
  const registerMutation = useDriverRegister();

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
