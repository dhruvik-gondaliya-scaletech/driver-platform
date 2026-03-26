"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Zap, Clock, User, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useConfig } from "@/contexts/ConfigContext";
import { DriverAppConfig } from "@/types";

export function BottomNav() {
  const pathname = usePathname();
  const { config } = useConfig();

  // Define full list of items
  const allItems = [
    {
      label: "Home",
      href: "/dashboard",
      icon: Home,
    },
    {
      label: "Charging",
      href: "/charging",
      icon: Zap,
    },
    {
      label: "History",
      href: "/history",
      icon: Clock,
    },
    {
      label: "Referrals",
      href: "/referrals",
      icon: Gift,
      feature: "referrals",
    },
    {
      label: "Profile",
      href: "/profile",
      icon: User,
    },
  ];

  // Filter based on config features
  const navItems = allItems.filter(item => {
    if (!item.feature) return true;
    const featureName = item.feature as keyof NonNullable<DriverAppConfig['features']>;
    return config?.features?.[featureName] !== false;
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-background/80 px-4 py-2 backdrop-blur-lg border-t border-border sm:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-col items-center gap-1 p-2 transition-colors",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-[10px] font-medium">{item.label}</span>
            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute -top-2 h-1 w-8 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
