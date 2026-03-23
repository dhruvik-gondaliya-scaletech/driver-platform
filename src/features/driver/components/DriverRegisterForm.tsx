'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { driverRegisterSchema, DriverRegisterInput } from '@/lib/validations/driver-auth.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { FRONTEND_ROUTES } from '@/constants/constants';

interface DriverRegisterFormProps {
  onSubmit: (data: DriverRegisterInput) => Promise<void>;
  isLoading: boolean;
}

export function DriverRegisterForm({ onSubmit, isLoading }: DriverRegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DriverRegisterInput>({
    resolver: zodResolver(driverRegisterSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            type="text"
            placeholder="John"
            {...register('firstName')}
            aria-invalid={!!errors.firstName}
            disabled={isLoading}
          />
          {errors.firstName && (
            <p className="text-sm text-destructive" role="alert">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Doe"
            {...register('lastName')}
            aria-invalid={!!errors.lastName}
            disabled={isLoading}
          />
          {errors.lastName && (
            <p className="text-sm text-destructive" role="alert">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

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
        <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
        <Input
          id="phoneNumber"
          type="tel"
          placeholder="+1234567890"
          {...register('phoneNumber')}
          aria-invalid={!!errors.phoneNumber}
          disabled={isLoading}
        />
        {errors.phoneNumber && (
          <p className="text-sm text-destructive" role="alert">
            {errors.phoneNumber.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          placeholder="Create a strong password"
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

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <PasswordInput
          id="confirmPassword"
          placeholder="Confirm your password"
          {...register('confirmPassword')}
          aria-invalid={!!errors.confirmPassword}
          disabled={isLoading}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive" role="alert">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Create account'}
      </Button>

      <div className="mt-4 text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link 
          href={FRONTEND_ROUTES.DRIVER_LOGIN} 
          className="text-primary hover:underline font-medium"
        >
          Sign in
        </Link>
      </div>
    </form>
  );
}
