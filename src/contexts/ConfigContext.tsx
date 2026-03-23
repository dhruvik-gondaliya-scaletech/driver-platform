'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { DriverAppConfig, configService } from '@/services/config.service';

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
      // Assuming primaryColor is a hex/hsl string
      root.style.setProperty('--primary', data.primaryColor);
      // We might need to handle foreground colors too if primary is too dark/light
    }
    if (data.accentColor) {
      root.style.setProperty('--accent', data.accentColor);
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
