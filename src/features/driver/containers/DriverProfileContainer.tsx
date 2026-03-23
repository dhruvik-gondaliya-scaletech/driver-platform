'use client';

import { useState } from 'react';
import { useDriverProfile, useDriverRfidCards, useDriverTransactions } from '@/hooks/get/useDriverProfile';
import { useRemoveRfidCard } from '@/hooks/post/useDriverProfileMutations';
import { DriverProfileCard } from '../components/DriverProfileCard';
import { RfidCardList } from '../components/RfidCardList';
import { TransactionList } from '../components/TransactionList';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function DriverProfileContainer() {
  const { data: driver, isLoading: isLoadingProfile, error: profileError } = useDriverProfile();
  const { data: rfidCards = [], isLoading: isLoadingCards } = useDriverRfidCards();
  const { data: transactions = [], isLoading: isLoadingTransactions } = useDriverTransactions();
  const removeCardMutation = useRemoveRfidCard();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false);

  if (profileError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load profile. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoadingProfile) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!driver) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No profile data available.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <DriverProfileCard 
        driver={driver} 
        onEdit={() => setIsEditDialogOpen(true)} 
      />

      {isLoadingCards ? (
        <Skeleton className="h-48 w-full" />
      ) : (
        <RfidCardList
          cards={rfidCards}
          onAdd={() => setIsAddCardDialogOpen(true)}
          onRemove={(cardId) => removeCardMutation.mutate(cardId)}
          isRemoving={removeCardMutation.isPending}
        />
      )}

      {isLoadingTransactions ? (
        <Skeleton className="h-48 w-full" />
      ) : (
        <TransactionList transactions={transactions} />
      )}
    </div>
  );
}
