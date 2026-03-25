"use client";

import { useRfidCards } from "@/hooks/get/use-rfid-cards";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, CreditCard, ShieldCheck, ShieldAlert, BadgeCheck, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { driverService } from "@/services/driver.service";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function RfidPage() {
  const queryClient = useQueryClient();
  const { data: cards, isLoading } = useRfidCards();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [visualNumber, setVisualNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag) return;

    setIsSubmitting(true);
    try {
      await driverService.addRfidCard(newTag, visualNumber);
      queryClient.invalidateQueries({ queryKey: ["driver", "rfid-cards"] });
      toast.success("RFID Card added successfully");
      setIsAddOpen(false);
      setNewTag("");
      setVisualNumber("");
    } catch (error) {
      toast.error("Failed to add RFID card");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveCard = async (cardId: string) => {
    if (!confirm("Are you sure you want to remove this RFID card?")) return;

    try {
      await driverService.removeRfidCard(cardId);
      queryClient.invalidateQueries({ queryKey: ["driver", "rfid-cards"] });
      toast.success("RFID Card removed");
    } catch (error) {
      toast.error("Failed to remove RFID card");
    }
  };

  if (isLoading) {
    return (
      <div className="py-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="py-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">RFID Cards</h1>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Card
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add RFID Card</DialogTitle>
              <DialogDescription>
                Enter the tag ID and visual number of your RFID card.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCard} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="tagId">Tag ID (UID)</Label>
                <Input 
                  id="tagId" 
                  placeholder="e.g. 1A2B3C4D" 
                  value={newTag} 
                  onChange={(e) => setNewTag(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visualNumber">Visual Number (Optional)</Label>
                <Input 
                  id="visualNumber" 
                  placeholder="The number printed on the card" 
                  value={visualNumber} 
                  onChange={(e) => setVisualNumber(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting || !newTag}>
                  {isSubmitting ? "Adding..." : "Add Card"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {cards?.length === 0 ? (
          <Card className="border-dashed bg-muted/30">
            <CardContent className="p-8 text-center space-y-3">
              <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                <CreditCard className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="font-bold">No RFID Cards</p>
                <p className="text-xs text-muted-foreground">Add a card to start charging without the app.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsAddOpen(true)}>Add Your First Card</Button>
            </CardContent>
          </Card>
        ) : (
          cards?.map((card) => (
            <motion.div key={card.id} variants={staggerItem}>
              <Card className="overflow-hidden border-border bg-card/50 relative group">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${card.isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold">{card.visualNumber || card.idTag}</p>
                        {card.isActive ? (
                          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-none text-[10px] h-4">Active</Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] h-4">Inactive</Badge>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider">UID: {card.idTag}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveCard(card.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
                {!card.isActive && (
                  <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                    <Badge variant="destructive" className="gap-1">
                      <ShieldAlert className="h-3 w-3" />
                      Blocked
                    </Badge>
                  </div>
                )}
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {cards && cards.length > 0 && (
        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-3">
          <AlertCircle className="h-5 w-5 text-blue-500 shrink-0" />
          <p className="text-xs text-blue-700/80 leading-relaxed">
            Active RFID cards can be used to initiate charging directly at any compatible station. 
            Charges will be deducted from your wallet balance.
          </p>
        </div>
      )}
    </motion.div>
  );
}
