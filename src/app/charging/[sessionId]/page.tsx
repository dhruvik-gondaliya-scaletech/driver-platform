"use client";

import { use, useEffect, useState } from "react";
import { Zap, StopCircle, Clock, Battery, Info, ArrowLeft, RefreshCw, User, Mail, Phone, CreditCard, Shield, LogOut, ChevronRight, Star, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useActiveSession } from "@/hooks/get/use-active-session";
import { useStopCharging } from "@/hooks/post/use-stop-charging";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, scaleIn } from "@/lib/motion";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

export default function ActiveSessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);
  const router = useRouter();
  const { data: session, isLoading, isError, refetch } = useActiveSession();
  const stopCharging = useStopCharging();

  // Redirect if no active session or session ID mismatch
  // In a real app, we might handle 404/redirect better
  useEffect(() => {
    if (!isLoading && !session) {
      // toast.info("No active session found");
      // router.push("/dashboard");
    }
  }, [session, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 space-y-4">
        <RefreshCw className="h-12 w-12 animate-spin text-primary opacity-20" />
        <p className="text-muted-foreground animate-pulse">Loading session details...</p>
      </div>
    );
  }

  if (isError || !session) {
    return (
      <div className="p-8 text-center space-y-4">
        <Info className="h-12 w-12 text-muted-foreground mx-auto" />
        <h2 className="text-xl font-bold">Session Not Found</h2>
        <p className="text-muted-foreground">This session may have ended or doesn't exist.</p>
        <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
      </div>
    );
  }

  // Calculate simulated progress (not very accurate but looks good)
  const progress = Math.min(100, (session.energyDeliveredKwh / ((session.station as any)?.maxPower || 50) * 100));

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Charging</h1>
      </div>

      <motion.div
        variants={scaleIn}
        initial="initial"
        animate="animate"
        className="relative flex flex-col items-center justify-center py-12"
      >
        <div className="relative">
          {/* Animated rings */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-primary/20"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-primary/10"
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          
          <div className="h-48 w-48 rounded-full border-8 border-primary/10 flex flex-col items-center justify-center bg-background relative z-10 shadow-inner">
            <Zap className="h-10 w-10 text-primary mb-2 animate-pulse" />
            <span className="text-4xl font-extrabold tracking-tighter">{session.energyDeliveredKwh.toFixed(2)}</span>
            <span className="text-xs font-bold text-muted-foreground uppercase">kWh Delivered</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Duration</p>
              <p className="font-bold">{session.durationMinutes} min</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
              <Battery className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Cost</p>
              <p className="font-bold">₹{session.totalCost?.toFixed(2) || "0.00"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Station Details</h4>
          <Badge variant="outline" className="animate-pulse border-primary/50 text-primary">
            {session.status}
          </Badge>
        </div>
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Station</span>
              <span className="text-sm font-medium">{session.station?.name || "Loading..."}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Connector</span>
              <span className="text-sm font-medium">#{session.connectorId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Started At</span>
              <span className="text-sm font-medium">{new Date(session.startTime).toLocaleTimeString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="pt-6">
        <Button
          variant="destructive"
          size="lg"
          className="w-full h-14 text-lg font-bold gap-2 shadow-xl shadow-destructive/20"
          disabled={stopCharging.isPending}
          onClick={() => {
            if(confirm("Are you sure you want to stop charging?")) {
              stopCharging.mutate(sessionId);
            }
          }}
        >
          <StopCircle className="h-6 w-6" />
          {stopCharging.isPending ? "Ending Session..." : "Stop Charging"}
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground px-8">
        Charging session will automatically stop when the target battery level is reached or the connector is unplugged.
      </p>
    </div>
  );
}
