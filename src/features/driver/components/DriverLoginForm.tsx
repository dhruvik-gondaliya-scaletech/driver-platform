'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { driverLoginSchema, DriverLoginInput } from '@/lib/validations/driver-auth.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { useConfig } from '@/contexts/ConfigContext';

interface DriverLoginFormProps {
  onSubmit: (data: DriverLoginInput) => Promise<void>;
  isLoading: boolean;
}

export function DriverLoginForm({ onSubmit, isLoading }: DriverLoginFormProps) {
  const { config } = useConfig();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DriverLoginInput>({
    resolver: zodResolver(driverLoginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          {...register('email')}
          aria-invalid={!!errors.email}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-sm text-destructive" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          placeholder="Enter your password"
          {...register('password')}
          aria-invalid={!!errors.password}
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-sm text-destructive" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>

      {config?.allowGuestCharging && (
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or</span>
          </div>
        </div>
      )}

      {config?.allowGuestCharging && (
        <Button 
          type="button" 
          variant="outline" 
          className="w-full" 
          onClick={() => {
            // Handle guest login logic here or redirect to guest flow
            console.log('Continuing as guest');
            window.location.href = '/dashboard/guest'; // Example path
          }}
          disabled={isLoading}
        >
          Continue as Guest
        </Button>
      )}

      <div className="mt-4 text-center text-sm">
        <span className="text-muted-foreground">Don&apos;t have an account? </span>
        <Link 
          href={FRONTEND_ROUTES.DRIVER_REGISTER} 
          className="text-primary hover:underline font-medium"
        >
          Sign up
        </Link>
      </div>
    </form>
  );
}
