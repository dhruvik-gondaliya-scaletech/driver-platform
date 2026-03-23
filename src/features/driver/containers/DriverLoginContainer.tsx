'use client';

import { DriverLoginForm } from '../components/DriverLoginForm';
import { useDriverLogin } from '@/hooks/post/useDriverAuthMutations';
import { DriverLoginInput } from '@/lib/validations/driver-auth.schema';

export function DriverLoginContainer() {
  const loginMutation = useDriverLogin();

  const handleSubmit = async (data: DriverLoginInput) => {
    await loginMutation.mutateAsync(data);
  };

  return (
    <DriverLoginForm 
      onSubmit={handleSubmit} 
      isLoading={loginMutation.isPending} 
    />
  );
}
