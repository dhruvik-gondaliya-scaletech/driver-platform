'use client';

import { Driver } from '@/services/driver.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, User, Wallet, Award } from 'lucide-react';

interface DriverProfileCardProps {
  driver: Driver;
  onEdit: () => void;
}

export function DriverProfileCard({ driver, onEdit }: DriverProfileCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">
              {driver.firstName} {driver.lastName}
            </CardTitle>
            <CardDescription className="mt-1">
              <Badge variant="outline" className="rounded-full font-bold">
                {driver.driverType === 'registered' ? 'Registered Driver' : 
                 driver.driverType === 'guest' ? 'Guest' : 'RFID Only'}
              </Badge>
            </CardDescription>
          </div>
          <Button onClick={onEdit} variant="outline" size="sm">
            Edit Profile
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{driver.email}</p>
            </div>
          </div>

          {driver.phoneNumber && (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{driver.phoneNumber}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
              <Wallet className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Wallet Balance</p>
              <p className="font-medium text-green-600 dark:text-green-400">
                ${Number(driver.walletBalance).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
              <Award className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Loyalty Points</p>
              <p className="font-medium text-amber-600 dark:text-amber-400">
                {driver.loyaltyPoints} pts
              </p>
            </div>
          </div>
        </div>

        {!driver.isEmailVerified && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Please verify your email address to unlock all features.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
