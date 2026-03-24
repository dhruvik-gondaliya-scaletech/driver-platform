"use client";

import { useState, useEffect } from "react";
import { Search, Zap, Loader2, ArrowLeft, QrCode, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStations, useStation } from "@/hooks/get/use-stations";
import { useStartCharging } from "@/hooks/post/use-start-charging";
import { ChargingStatus } from "@/types";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ChargingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [selectedConnectorId, setSelectedConnectorId] = useState<number | null>(null);

  const { data: stations, isLoading: isStationsLoading } = useStations(
    debouncedSearch ? { name: debouncedSearch } : undefined
  );
  const { data: selectedStation, isLoading: isStationLoading } = useStation(selectedStationId);
  const startCharging = useStartCharging();

  const handleStartCharging = () => {
    if (selectedStationId && selectedConnectorId !== null) {
      startCharging.mutate({
        stationId: selectedStationId,
        connectorId: selectedConnectorId,
      });
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Find Station</h1>
      </div>

      {!selectedStationId ? (
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
          <motion.div variants={staggerItem} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter Station ID or Name..."
              className="pl-10 h-12 bg-card/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>

          {isStationsLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {stations?.map((station) => (
                <motion.div
                  key={station.id}
                  variants={fadeInUp}
                  onClick={() => setSelectedStationId(station.id)}
                  className="cursor-pointer"
                >
                  <Card className="hover:border-primary/50 transition-colors bg-card/50">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-bold">{station.name}</h3>
                        <p className="text-xs text-muted-foreground">{station.serialNumber}</p>
                        <div className="flex gap-2 items-center pt-1">
                          <Badge variant={station.status === ChargingStatus.AVAILABLE ? "default" : "secondary"} className="text-[10px] h-4">
                            {station.status}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">{station.location?.city}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary">{station.maxPower}kW</p>
                        <p className="text-[10px] text-muted-foreground">{station.connectorCount} Connectors</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              
              {stations?.length === 0 && searchQuery && (
                <div className="text-center p-8 text-muted-foreground">
                  No stations found matching "{searchQuery}"
                </div>
              )}
            </div>
          )}

          <motion.div variants={staggerItem} className="pt-4">
            <Button variant="outline" className="w-full h-14 font-bold gap-3 border-dashed" onClick={() => toast.info("QR Scanner coming soon!")}>
              <QrCode className="h-5 w-5 text-primary" />
              Scan QR Code
            </Button>
          </motion.div>
        </motion.div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">{selectedStation?.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedStation?.serialNumber}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => { setSelectedStationId(null); setSelectedConnectorId(null); }}>
                  Change
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Select Connector</h4>
              <div className="grid grid-cols-1 gap-3">
                {selectedStation?.connectors.map((connector) => (
                  <div
                    key={connector.id}
                    onClick={() => connector.status === ChargingStatus.AVAILABLE && setSelectedConnectorId(connector.connectorId)}
                    className={cn(
                      "group relative cursor-pointer rounded-xl border-2 p-4 transition-all",
                      selectedConnectorId === connector.connectorId
                        ? "border-primary bg-primary/5"
                        : connector.status === ChargingStatus.AVAILABLE
                        ? "border-border hover:border-primary/50 bg-card/50"
                        : "border-border/50 bg-muted/50 opacity-60 cursor-not-allowed"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "h-12 w-12 rounded-lg flex items-center justify-center transition-colors",
                          selectedConnectorId === connector.connectorId ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        )}>
                          <Zap className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-bold">Connector #{connector.connectorId}</p>
                          <p className="text-xs text-muted-foreground">{connector.type} • Up to {connector.maxPower}kW</p>
                        </div>
                      </div>
                      <Badge variant={connector.status === ChargingStatus.AVAILABLE ? "default" : "secondary"}>
                        {connector.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              className="w-full h-14 text-lg font-bold gap-2 shadow-xl shadow-primary/20"
              disabled={selectedConnectorId === null || startCharging.isPending}
              onClick={handleStartCharging}
            >
              {startCharging.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5" />
                  Start Charging
                </>
              )}
            </Button>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
