'use client';

import { DriverLoginForm } from '../components/DriverLoginForm';
import { useLogin } from '@/hooks/post/use-login';
import { DriverLoginInput } from '@/lib/validations/driver-auth.schema';

export function DriverLoginContainer() {
  const loginMutation = useLogin();

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
