'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { configService } from '@/services/config.service';
import { DriverAppConfig } from '@/types';

interface ConfigContextType {
  config: DriverAppConfig | null;
  isLoading: boolean;
  error: Error | null;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<DriverAppConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await configService.getConfig();
        setConfig(data);
        applyBranding(data);
      } catch (err) {
        console.error('Failed to fetch config:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch config'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const applyBranding = (data: DriverAppConfig) => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    if (data.primaryColor) {
      // Set the raw hex/color value
      root.style.setProperty('--primary', data.primaryColor);
      
      // Also update shadcn/tailwind variables if they are used
      // For Tailwind v4/oklch, we might need to be careful, 
      // but setting the base variable usually works if it's referenced.
    }
    if (data.accentColor) {
      root.style.setProperty('--accent', data.accentColor);
    }
    
    // Set App Name in title if not already set specifically by pages
    if (data.appName && !document.title.includes(data.appName)) {
      document.title = `${data.appName} - Driver Platform`;
    }
  };

  return (
    <ConfigContext.Provider value={{ config, isLoading, error }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
