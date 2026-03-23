'use client';

import { DriverRfidCard } from '@/services/driver.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Trash2, Plus } from 'lucide-react';
import { format } from 'date-fns';

interface RfidCardListProps {
  cards: DriverRfidCard[];
  onAdd: () => void;
  onRemove: (cardId: string) => void;
  isRemoving?: boolean;
}

export function RfidCardList({ cards, onAdd, onRemove, isRemoving }: RfidCardListProps) {
  if (cards.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>RFID Cards</CardTitle>
          <CardDescription>Manage your RFID cards for tap-and-charge</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <CreditCard className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 font-semibold">No RFID Cards</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Add an RFID card to enable tap-and-charge at stations
            </p>
            <Button onClick={onAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add RFID Card
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>RFID Cards</CardTitle>
            <CardDescription>Manage your RFID cards for tap-and-charge</CardDescription>
          </div>
          <Button onClick={onAdd} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Card
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {cards.map((card) => (
            <div
              key={card.id}
              className="flex items-center justify-between rounded-lg border bg-card p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{card.visualNumber || card.idTag}</p>
                    {card.isActive ? (
                      <Badge variant="outline" className="rounded-full text-xs">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="rounded-full text-xs">
                        Inactive
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Added {format(new Date(card.createdAt), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(card.id)}
                disabled={isRemoving}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
