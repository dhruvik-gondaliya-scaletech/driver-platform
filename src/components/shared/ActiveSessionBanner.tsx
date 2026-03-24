"use client";

import { motion } from "framer-motion";
import { Zap, StopCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChargingSession } from "@/services/driver.service";
import { useStopCharging } from "@/hooks/post/use-stop-charging";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

interface ActiveSessionBannerProps {
  session: ChargingSession;
}

export function ActiveSessionBanner({ session }: ActiveSessionBannerProps) {
  const router = useRouter();
  const stopCharging = useStopCharging();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <Card className="border-primary/20 bg-primary/5 dark:bg-primary/10 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Zap className="h-5 w-5 text-primary animate-pulse" />
                <motion.div
                  className="absolute inset-0 bg-primary rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div>
                <h4 className="font-bold text-sm">Active Session</h4>
                <p className="text-[10px] text-muted-foreground uppercase font-medium">
                  Started {formatDistanceToNow(new Date(session.startTime))} ago
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-bold gap-1.5 border-primary/20 hover:bg-primary/10"
              onClick={() => router.push(`/charging/${session.id}`)}
            >
              Details <ArrowRight className="h-3 w-3" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-background/50 rounded-lg p-2.5 border border-border/50">
              <p className="text-[10px] text-muted-foreground uppercase font-medium mb-1">Energy</p>
              <p className="text-lg font-bold leading-none">{session.energyDeliveredKwh.toFixed(2)} <span className="text-[10px] text-muted-foreground">kWh</span></p>
            </div>
            <div className="bg-background/50 rounded-lg p-2.5 border border-border/50">
              <p className="text-[10px] text-muted-foreground uppercase font-medium mb-1">Cost</p>
              <p className="text-lg font-bold leading-none">₹{session.totalCost?.toFixed(2) || "0.00"}</p>
            </div>
          </div>

          <Button
            variant="destructive"
            className="w-full h-10 font-bold gap-2"
            disabled={stopCharging.isPending}
            onClick={() => stopCharging.mutate(session.id)}
          >
            <StopCircle className="h-4 w-4" />
            {stopCharging.isPending ? "Stopping..." : "Stop Charging"}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
