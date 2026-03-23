'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Zap,
  User,
  LogOut,
  CreditCard,
  History,
  Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FRONTEND_ROUTES, DRIVER_AUTH_CONFIG } from '@/constants/constants';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AnimatedModal } from './AnimatedModal';
import { useDriverLogout } from '@/hooks/post/useDriverAuthMutations';
import { Driver } from '@/services/driver.service';
import { useConfig } from '@/contexts/ConfigContext';
import { PricingModel } from '@/services/config.service';

export function DriverSidebar() {
  const { config, isLoading } = useConfig();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);
  const [driver, setDriver] = React.useState<Driver | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const logoutMutation = useDriverLogout();

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const driverData = localStorage.getItem(DRIVER_AUTH_CONFIG.userKey);
      if (driverData) {
        try {
          setDriver(JSON.parse(driverData));
        } catch (error) {
          console.error('Failed to parse driver data:', error);
        }
      }
    }
  }, []);

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return 'D';
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    setIsLogoutModalOpen(false);
  };

  // Dynamically build nav items based on config
  const driverNavItems = React.useMemo(() => {
    const items = [
      { href: FRONTEND_ROUTES.DRIVER_DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    ];

    if (!config) return items;

    if (config.allowAppCharging) {
      items.push({ href: FRONTEND_ROUTES.DRIVER_CHARGING, label: 'Charging', icon: Zap });
    }

    if (config.allowAppCharging || config.allowRfidCharging) {
      items.push({ href: FRONTEND_ROUTES.DRIVER_SESSIONS, label: 'Sessions', icon: History });
    }

    if (config.pricingModel !== PricingModel.PAY_PER_USE || config.requirePaymentMethod) {
      items.push({ href: FRONTEND_ROUTES.DRIVER_PAYMENTS, label: 'Payments', icon: CreditCard });
    }

    items.push({ href: FRONTEND_ROUTES.DRIVER_PROFILE, label: 'Profile', icon: User });

    return items;
  }, [config]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-card border-r animate-pulse">
        <div className="p-6 space-y-2">
          <div className="h-8 w-32 bg-accent rounded" />
          <div className="h-4 w-24 bg-accent rounded" />
        </div>
        <Separator />
        <div className="flex-1 p-4 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-full bg-accent rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card border-r">
      <div className="p-6">
        <div className="flex items-center gap-3">
          {config?.logoUrl ? (
            <img src={config.logoUrl} alt={config.appName} className="h-8 w-8 object-contain" />
          ) : (
            <Zap className="h-8 w-8 text-primary" />
          )}
          <div>
            <h1 className="text-2xl font-bold">{config?.appName || 'Driver App'}</h1>
            <p className="text-sm text-muted-foreground">Charging Made Easy</p>
          </div>
        </div>
      </div>

      <Separator />

      <nav className="flex-1 p-4 space-y-2">
        {driverNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <Separator />

      {driver && (
        <div className="p-4 mt-auto">
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-accent transition-colors text-left group">
                <Avatar className="h-10 w-10 border-2 border-primary/20 group-hover:border-primary/40 transition-colors">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {getInitials(driver?.firstName, driver?.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate leading-tight">
                    {driver?.firstName} {driver?.lastName}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Wallet className="h-3 w-3" />
                    <span>${driver?.walletBalance?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2 rounded-2xl" side="right" align="end" sideOffset={12}>
              <div className="space-y-1">
                <Link href={FRONTEND_ROUTES.DRIVER_PROFILE}>
                  <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm font-medium text-left">
                    <User className="h-4 w-4" />
                    View Profile
                  </button>
                </Link>
                <Separator className="my-1" />
                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors text-sm font-medium text-left"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}

      <AnimatedModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Confirm Logout"
        description="Are you sure you want to log out? Your current session will be ended."
        footer={
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => setIsLogoutModalOpen(false)}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="flex-1 sm:flex-none"
            >
              Logout
            </Button>
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <LogOut className="h-10 w-10 text-destructive" />
          </div>
          <p className="text-muted-foreground">
            Thanks for using our charging network. Drive safe!
          </p>
        </div>
      </AnimatedModal>
    </div>
  );
}
