"use client";

import { useSessions } from "@/hooks/get/use-sessions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Clock, Calendar, ArrowLeft, MapPin, CreditCard, Share2, ReceiptText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: sessions, isLoading } = useSessions();

  const session = sessions?.find((s) => s.id === params.id);

  if (isLoading) {
    return (
      <div className="py-6 space-y-6">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-4 text-center space-y-4 pt-20">
        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto">
          <ReceiptText className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground font-medium">Session not found.</p>
        <Button onClick={() => router.push("/history")}>Back to History</Button>
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
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Session Details</h1>
        <Button variant="ghost" size="icon">
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Hero Stats */}
      <motion.div variants={fadeInUp}>
        <Card className="bg-primary text-primary-foreground border-none overflow-hidden relative shadow-xl">
          <CardContent className="p-6 relative z-10 flex flex-col items-center text-center space-y-4">
            <div className="h-14 w-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-primary-foreground/70 uppercase font-black tracking-widest">Total Energy</p>
              <h2 className="text-4xl font-black">{session.energyDeliveredKwh.toFixed(2)} <span className="text-xl">kWh</span></h2>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white border-none backdrop-blur-md font-bold text-[10px] uppercase">
              {session.status}
            </Badge>
          </CardContent>
          <div className="absolute -left-12 -top-12 h-40 w-40 bg-white/10 rounded-full blur-3xl" />
        </Card>
      </motion.div>

      {/* Grid Stats */}
      <motion.div variants={staggerItem} className="grid grid-cols-2 gap-4">
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <p className="text-[10px] font-bold uppercase tracking-wider">Duration</p>
            </div>
            <p className="text-lg font-black">{session.durationMinutes} <span className="text-xs font-bold text-muted-foreground">min</span></p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap className="h-3 w-3 text-primary" />
              <p className="text-[10px] font-bold uppercase tracking-wider">Total Cost</p>
            </div>
            <p className="text-lg font-black text-primary">₹{session.totalCost?.toFixed(2) || "0.00"}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Location Card */}
      <motion.div variants={staggerItem}>
        <Card className="overflow-hidden bg-card/50 border-border">
          <CardContent className="p-0">
            <div className="p-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 bg-muted rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Location</p>
                  <p className="font-bold">{session.station?.name || `Station #${session.stationId.slice(0, 8)}`}</p>
                  <p className="text-xs text-muted-foreground">Connector #{session.connectorId}</p>
                </div>
              </div>
              
              <Separator className="bg-border/30" />
              
              <div className="flex items-center justify-between text-xs">
                <div className="space-y-1 text-muted-foreground">
                   <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(session.startTime), "MMM dd, yyyy")}
                   </div>
                   <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    {format(new Date(session.startTime), "HH:mm")} - {session.endTime ? format(new Date(session.endTime), "HH:mm") : "Ongoing"}
                   </div>
                </div>
                <div className="text-right">
                   <p className="font-bold text-foreground">Registered Driver</p>
                   <p className="text-muted-foreground">Payment: Wallet</p>
                </div>
              </div>
            </div>
            
            <div className="h-32 bg-muted relative">
               <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-[10px] text-muted-foreground uppercase font-black opacity-30">Map Preview Unavailable</p>
               </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action */}
      <motion.div variants={staggerItem}>
        <Button variant="outline" className="w-full h-12 font-bold gap-2 bg-card/50">
          <ReceiptText className="h-4 w-4" />
          Download Receipt
        </Button>
      </motion.div>
    </motion.div>
  );
}
