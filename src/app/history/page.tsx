"use client";

import { useSessions } from "@/hooks/get/use-sessions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Clock, Calendar, ChevronRight, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function HistoryPage() {
  const router = useRouter();
  const { data: sessions, isLoading } = useSessions();

  if (isLoading) {
    return (
      <div className="py-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
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
        <h1 className="text-2xl font-bold tracking-tight">Charging History</h1>
        <Button variant="ghost" size="icon">
          <Filter className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-3">
        {sessions?.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Zap className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No charging sessions yet.</p>
            <Button onClick={() => router.push("/charging")}>Start Your First session</Button>
          </div>
        ) : (
          sessions?.map((session) => (
            <motion.div key={session.id} variants={staggerItem}>
              <Card
                className="overflow-hidden border-border bg-card/50 hover:bg-accent transition-colors cursor-pointer group"
                onClick={() => router.push(`/history/${session.id}`)}
              >
                <CardContent className="p-0">
                  <div className="flex items-stretch">
                    <div className="w-2 bg-primary/20 group-hover:bg-primary transition-colors" />
                    <div className="flex-1 p-4 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold">{session.station?.name || `Station #${session.stationId.slice(0, 4)}`}</h3>
                          <Badge variant={session.status === "completed" ? "secondary" : "destructive"} className="text-[10px] h-4">
                            {session.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(session.startTime), "MMM dd, yyyy")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {session.durationMinutes} min
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-lg">₹{session.totalCost?.toFixed(2) || "0.00"}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-medium">{session.energyDeliveredKwh.toFixed(2)} kWh</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
