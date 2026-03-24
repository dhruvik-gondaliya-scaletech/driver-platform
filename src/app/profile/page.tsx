"use client";

import { useProfile } from "@/hooks/get/use-profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, CreditCard, Shield, LogOut, ChevronRight, Star, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { driverService } from "@/services/driver.service";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const router = useRouter();
  const { data: profile, isLoading } = useProfile();

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      await driverService.logout();
      router.push("/login");
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-6">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  const menuItems = [
    { label: "RFID Cards", icon: Star, href: "/profile/rfid", color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { label: "Wallet & Payments", icon: Wallet, href: "/profile/wallet", color: "text-green-500", bgColor: "bg-green-500/10" },
    { label: "Security", icon: Shield, href: "/profile/security", color: "text-purple-500", bgColor: "bg-purple-500/10" },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="p-4 space-y-6"
    >
      <h1 className="text-2xl font-bold tracking-tight">Account</h1>

      {/* Profile Header */}
      <motion.div variants={staggerItem}>
        <Card className="border-none bg-primary text-primary-foreground overflow-hidden shadow-xl">
          <CardContent className="p-6 relative">
            <div className="flex items-center gap-4 relative z-10">
              <Avatar className="h-20 w-20 border-4 border-primary-foreground/20">
                <AvatarImage src="" />
                <AvatarFallback className="bg-background text-primary text-2xl font-bold">
                  {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h2 className="text-xl font-bold">{profile?.firstName} {profile?.lastName}</h2>
                <div className="flex items-center gap-2 text-primary-foreground/70 text-sm">
                  <Mail className="h-3 w-3" />
                  {profile?.email}
                </div>
                {profile?.phoneNumber && (
                  <div className="flex items-center gap-2 text-primary-foreground/70 text-sm">
                    <Phone className="h-3 w-3" />
                    {profile.phoneNumber}
                  </div>
                )}
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 h-32 w-32 bg-background/10 rounded-full blur-2xl" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Quick View */}
      <motion.div variants={staggerItem} className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card/50 space-y-1 text-center">
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Wallet</p>
            <p className="text-lg font-extrabold text-primary">₹{profile?.walletBalance.toFixed(2)}</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card/50 space-y-1 text-center">
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Points</p>
            <p className="text-lg font-extrabold text-yellow-500">{profile?.loyaltyPoints}</p>
        </div>
      </motion.div>

      {/* Menu Sections */}
      <motion.div variants={staggerItem} className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Settings</h3>
        <Card className="border-border bg-card/50">
          <CardContent className="p-0">
            {menuItems.map((item, index) => (
              <div key={item.label}>
                <button
                  onClick={() => router.push(item.href)}
                  className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`${item.bgColor} ${item.color} h-9 w-9 rounded-lg flex items-center justify-center`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="font-bold">{item.label}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                </button>
                {index < menuItems.length - 1 && <Separator className="bg-border/50" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Button
          variant="ghost"
          className="w-full h-14 justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/5 font-bold px-4"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Logout Account
        </Button>
      </motion.div>

      <div className="pt-4 text-center">
        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Charlie Charging v1.0.0</p>
      </div>
    </motion.div>
  );
}
