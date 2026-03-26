"use client";

import { use, useEffect, useState } from "react";
import { Zap, StopCircle, Clock, Info, ArrowLeft, RefreshCw, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useActiveSession } from "@/hooks/get/use-active-session";
import { useStopCharging } from "@/hooks/post/use-stop-charging";
import { useRealTimeEvent } from "@/hooks/useRealTime";
import { MeterValuesEvent, TransactionEvent } from "@/lib/realtime.service";
import { motion } from "framer-motion";
import { scaleIn } from "@/lib/motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { OcppMeterValue } from "@/services/driver.service";

interface LiveMetrics {
  soc: number | null;
  power: number | null;
  voltage: number | null;
  current: number | null;
  energy: number | null;
}

export default function ActiveSessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);
  const router = useRouter();
  const { data: session, isLoading, isError } = useActiveSession();
  const stopCharging = useStopCharging();
  
  const [metrics, setMetrics] = useState<LiveMetrics>({
    soc: null,
    power: null,
    voltage: null,
    current: null,
    energy: null,
  });
  const [realTimeCost, setRealTimeCost] = useState<number | null>(null);

  // Helper to extract the latest value for a measurand from different structures
  const extractLatestValue = (
    meterValues: any[] | undefined, 
    measurand: string,
    isOcppNested: boolean = false
  ): number | null => {
    if (!meterValues || meterValues.length === 0) return null;

    if (isOcppNested) {
      // Logic for OcppMeterValue[] (nested sampledValue)
      // Get the last meter value entry
      const latestEntry = [...meterValues].reverse().find(mv => 
        mv.sampledValue?.some((sv: any) => sv.measurand === measurand || (!sv.measurand && measurand === 'Energy.Active.Import.Register'))
      );
      
      if (!latestEntry) return null;
      
      const sampled = latestEntry.sampledValue.find((sv: any) => 
        sv.measurand === measurand || (!sv.measurand && measurand === 'Energy.Active.Import.Register')
      );
      return sampled ? parseFloat(sampled.value) : null;
    } else {
      // Logic for MeterValue[] (flattened)
      const sampled = [...meterValues].reverse().find(v => 
        v.measurand === measurand || (!v.measurand && measurand === 'Energy.Active.Import.Register')
      );
      return sampled ? (typeof sampled.value === 'string' ? parseFloat(sampled.value) : sampled.value) : null;
    }
  };

  // Sync state with polled session data
  useEffect(() => {
    if (session?.meterValues) {
      const energy = extractLatestValue(session.meterValues, 'Energy.Active.Import.Register', true);
      const soc = extractLatestValue(session.meterValues, 'SoC', true);
      const power = extractLatestValue(session.meterValues, 'Power.Active.Import', true);
      const voltage = extractLatestValue(session.meterValues, 'Voltage', true);
      const current = extractLatestValue(session.meterValues, 'Current.Import', true);

      setMetrics(prev => ({
        ...prev,
        energy: energy !== null ? energy : prev.energy,
        soc: soc !== null ? soc : prev.soc,
        power: power !== null ? power : prev.power,
        voltage: voltage !== null ? voltage : prev.voltage,
        current: current !== null ? current : prev.current,
      }));

      if (energy !== null) {
        const startMeter = session?.startMeterValue || 0;
        const deliveredKwh = (energy - startMeter) / 1000;
        const energyRate = 0.30;
        setRealTimeCost(Math.max(0, deliveredKwh * energyRate));
      }
    }
  }, [session]);

  // Listen for real-time meter values
  useRealTimeEvent<MeterValuesEvent>("meter-values", (data) => {
    if (data.transactionId === sessionId || data.transactionId === session?.transactionId?.toString()) {
      const energy = extractLatestValue(data.meterValues, 'Energy.Active.Import.Register');
      const soc = extractLatestValue(data.meterValues, 'SoC');
      const power = extractLatestValue(data.meterValues, 'Power.Active.Import');
      const voltage = extractLatestValue(data.meterValues, 'Voltage');
      const current = extractLatestValue(data.meterValues, 'Current.Import');

      setMetrics(prev => ({
        ...prev,
        energy: energy !== null ? energy : prev.energy,
        soc: soc !== null ? soc : prev.soc,
        power: power !== null ? power : prev.power,
        voltage: voltage !== null ? voltage : prev.voltage,
        current: current !== null ? current : prev.current,
      }));
      
      if (energy !== null) {
        const startMeter = session?.startMeterValue || 0;
        const deliveredKwh = (energy - startMeter) / 1000;
        const energyRate = 0.30;
        setRealTimeCost(Math.max(0, deliveredKwh * energyRate));
      }
    }
  }, [session, sessionId]);

  // Listen for transaction stop
  useRealTimeEvent<TransactionEvent>("transaction-stop", (data) => {
    if (data.id === sessionId || data.id === session?.transactionId?.toString()) {
      toast.success("Charging session ended");
      router.push("/dashboard");
    }
  }, [session, sessionId]);

  // Redirect if no active session or session ID mismatch
  useEffect(() => {
    if (sessionId === 'undefined') {
      toast.error("Invalid session ID");
      router.push("/dashboard");
      return;
    }
    if (!isLoading && !session) {
      toast.info("No active session found");
      router.push("/dashboard");
    }
  }, [session, isLoading, router, sessionId]);

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
        <p className="text-muted-foreground">This session may have ended or doesn&apos;t exist.</p>
        <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
      </div>
    );
  }


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
        className="relative flex flex-col items-center justify-center py-8"
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
          
          <div className="h-44 w-44 rounded-full border-8 border-primary/10 flex flex-col items-center justify-center bg-background relative z-10 shadow-inner">
            <Zap className="h-8 w-8 text-primary mb-1 animate-pulse" />
            <span className="text-4xl font-black tracking-tighter">
              {Number(((metrics.energy !== null ? metrics.energy : null) ? (metrics.energy! - (session?.startMeterValue || 0)) / 1000 : session.energyDeliveredKwh) || 0).toFixed(2)}
            </span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">kWh Delivered</span>
          </div>
        </div>
      </motion.div>

      {/* Live Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Charging Speed */}
        <Card className="bg-card/50 border-border overflow-hidden relative">
          <div className="absolute top-0 right-0 p-1">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          </div>
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Speed</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black">
                {metrics.power !== null ? (metrics.power / 1000).toFixed(1) : (session.station?.maxPower || 0)}
              </span>
              <span className="text-xs font-bold text-muted-foreground">kW</span>
            </div>
          </CardContent>
        </Card>

        {/* Battery Level */}
        <Card className="bg-card/50 border-border overflow-hidden relative">
          {metrics.soc !== null && (
            <div className="absolute top-0 right-0 p-1">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          )}
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <div className="h-4 w-4 rounded-sm border-2 border-muted-foreground relative flex items-center justify-start p-[1px]">
                  <div 
                    className="h-full bg-green-500 rounded-px" 
                    style={{ width: `${metrics.soc || 0}%` }} 
                  />
                  <div className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[2px] h-2 bg-muted-foreground rounded-r-sm" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider">Battery</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-green-500">{metrics.soc !== null ? metrics.soc : "--"}</span>
              <span className="text-xs font-bold text-muted-foreground">%</span>
            </div>
          </CardContent>
        </Card>

        {/* Duration */}
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Duration</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black">{session.durationMinutes}</span>
              <span className="text-xs font-bold text-muted-foreground">min</span>
            </div>
          </CardContent>
        </Card>

        {/* Estimated Cost */}
        <Card className="bg-card/50 border-border overflow-hidden relative">
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Wallet className="h-4 w-4 text-emerald-500" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Est. Cost</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-emerald-600">₹{Number(realTimeCost ?? session.totalCost ?? 0).toFixed(1)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Voltage & Current */}
        <Card className="bg-card/50 border-border col-span-2">
          <CardContent className="p-3 flex items-center justify-around">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Voltage</span>
              <span className="font-black text-blue-600 decoration-blue-500/30 decoration-2 underline-offset-4">{metrics.voltage !== null ? metrics.voltage.toFixed(0) : "---"} V</span>
            </div>
            <div className="h-8 w-[1px] bg-border" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Current</span>
              <span className="font-black text-orange-600 decoration-orange-500/30 decoration-2 underline-offset-4">{metrics.current !== null ? metrics.current.toFixed(1) : "---"} A</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground font-black">Station Details</h4>
          <Badge variant="outline" className="animate-pulse border-primary/50 text-primary capitalize px-3 py-1">
            {session.status}
          </Badge>
        </div>
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground font-bold uppercase">Station</span>
              <span className="text-sm font-black">{session.station?.name || "Loading..."}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground font-bold uppercase">Connector</span>
              <span className="text-sm font-black text-primary">#{session.connectorId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground font-bold uppercase">Started At</span>
              <span className="text-sm font-medium">{new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="pt-2">
        <Button
          variant="destructive"
          size="lg"
          className="w-full h-14 text-lg font-black gap-2 shadow-xl shadow-destructive/20 rounded-2xl"
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

      <p className="text-center text-[10px] text-muted-foreground px-8 leading-relaxed font-medium">
        Charging session will automatically stop when the target battery level is reached or the connector is unplugged.
      </p>
    </div>
  );
}
