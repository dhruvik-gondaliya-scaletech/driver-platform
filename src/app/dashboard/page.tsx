"use client";

import { Wallet, Star, Zap, MapPin, History, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/shared/StatCard";
import { ActiveSessionBanner } from "@/components/shared/ActiveSessionBanner";
import { useProfile } from "@/hooks/get/use-profile";
import { useActiveSession } from "@/hooks/get/use-active-session";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const { data: activeSession, isLoading: isActiveSessionLoading } = useActiveSession();

  const isLoading = isProfileLoading || isActiveSessionLoading;

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="p-4 space-y-6"
    >
      <motion.div variants={staggerItem} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome, {profile?.firstName}!</h1>
          <p className="text-sm text-muted-foreground">Ready to charge your vehicle today?</p>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div variants={staggerItem} className="grid grid-cols-2 gap-4">
        <StatCard
          label="Wallet Balance"
          value={`₹${Number(profile?.walletBalance || 0).toFixed(2)}`}
          icon={Wallet}
        />
        <StatCard
          label="Loyalty Points"
          value={profile?.loyaltyPoints || 0}
          icon={Star}
          iconClassName="bg-yellow-500/10 text-yellow-500"
        />
      </motion.div>

      {/* Active Session Notification */}
      {activeSession && (
        <motion.div variants={staggerItem}>
          <ActiveSessionBanner session={activeSession} />
        </motion.div>
      )}

      {/* Quick Actions / Hero */}
      <motion.div variants={staggerItem} className="relative overflow-hidden rounded-2xl bg-primary px-6 py-8 text-primary-foreground shadow-xl">
        <div className="relative z-10 space-y-4">
          <h2 className="text-2xl font-bold">Start Charging</h2>
          <p className="text-primary-foreground/80 max-w-[200px]">
            Ready to power up? Scan a station or enter ID manually.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="font-bold gap-2 shadow-lg"
            onClick={() => router.push("/charging")}
          >
            <Zap className="h-5 w-5" />
            Power Up Now
          </Button>
        </div>
        <div className="absolute top-0 right-0 h-full w-1/2 overflow-hidden pointer-events-none opacity-20">
          <Zap className="h-48 w-48 -mr-16 -mt-8 rotate-12" />
        </div>
      </motion.div>

      {/* Explore Sections */}
      <motion.div variants={staggerItem} className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Explore</h3>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <Link href="/history" className="group">
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50 hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <History className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold">Session History</p>
                  <p className="text-xs text-muted-foreground">View your past charging activity</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>

          <Link href="/charging" className="group">
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50 hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold">Nearby Stations</p>
                  <p className="text-xs text-muted-foreground">Find the nearest charging point</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
