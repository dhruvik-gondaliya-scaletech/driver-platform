"use client";

import { useProfile } from "@/hooks/get/use-profile";
import { useTransactions } from "@/hooks/get/use-transactions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, Zap, Filter, CreditCard, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function WalletPage() {
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const { data: transactions, isLoading: isTransactionsLoading } = useTransactions();

  const isLoading = isProfileLoading || isTransactionsLoading;

  if (isLoading) {
    return (
      <div className="py-6 space-y-6">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="py-6 space-y-6 pb-20"
    >
      <h1 className="text-2xl font-bold tracking-tight">Wallet</h1>

      {/* Balance Card */}
      <motion.div variants={staggerItem}>
        <Card className="bg-primary text-primary-foreground border-none shadow-xl overflow-hidden relative">
          <CardContent className="p-8 relative z-10">
            <div className="space-y-1">
              <p className="text-sm text-primary-foreground/70 font-medium uppercase tracking-wider">Total Balance</p>
              <h2 className="text-4xl font-black">₹{Number(profile?.walletBalance || 0).toFixed(2)}</h2>
            </div>
            
            <div className="pt-8 flex gap-3">
              <Button variant="secondary" className="flex-1 font-bold gap-2">
                <Plus className="h-4 w-4" />
                Add Money
              </Button>
            </div>
          </CardContent>
          <div className="absolute -right-8 -bottom-8 h-40 w-40 bg-white/10 rounded-full blur-3xl" />
          <Wallet className="absolute -right-4 top-4 h-32 w-32 text-white/5 -rotate-12" />
        </Card>
      </motion.div>

      {/* Payment Methods Section */}
      <motion.div variants={staggerItem} className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Payment Methods</h3>
          <Button variant="ghost" size="sm" className="text-primary text-xs font-bold">Manage</Button>
        </div>
        <Card className="border-border bg-card/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-0.5">
                <p className="font-bold text-sm">•••• 4242</p>
                <p className="text-xs text-muted-foreground">Primary card • Visa</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Transactions Section */}
      <motion.div variants={staggerItem} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Recent Transactions</h3>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {transactions?.length === 0 ? (
            <div className="text-center py-12 bg-muted/20 rounded-2xl border border-dashed">
              <p className="text-muted-foreground text-sm">No transactions yet.</p>
            </div>
          ) : (
            transactions?.map((tx, idx) => (
              <div key={tx.id}>
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                      tx.type === 'topup' ? 'bg-emerald-500/10 text-emerald-500' : 
                      tx.type === 'charge' ? 'bg-blue-500/10 text-blue-500' : 'bg-muted text-muted-foreground'
                    }`}>
                      {tx.type === 'topup' ? <ArrowDownLeft className="h-5 w-5" /> : 
                       tx.type === 'charge' ? <Zap className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-bold text-sm capitalize">{tx.type} Payment</p>
                      <p className="text-[10px] text-muted-foreground">
                        {format(new Date(tx.createdAt), "MMM dd • HH:mm")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-0.5">
                    <p className={`font-black ${tx.type === 'topup' ? 'text-emerald-500' : 'text-foreground'}`}>
                      {tx.type === 'topup' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                    </p>
                    <Badge variant={tx.status === 'completed' ? 'secondary' : 'outline'} className="text-[9px] h-3.5 px-1 font-bold uppercase tracking-tighter">
                      {tx.status}
                    </Badge>
                  </div>
                </div>
                {idx < (transactions?.length || 0) - 1 && <Separator className="bg-border/30 my-1" />}
              </div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
