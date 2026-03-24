import driverHttpService from '@/lib/driver-http-service';
import { API_CONFIG } from '@/constants/constants';

export interface DriverAppConfig {
  id: string;
  appName: string;
  logoUrl?: string;
  primaryColor?: string;
  accentColor?: string;
  allowGuestCharging: boolean;
  allowRfidCharging: boolean;
  allowAppCharging: boolean;
  requirePaymentMethod: boolean;
  pricingModel: 'pay_per_use' | 'subscription' | 'hybrid';
  customDomain?: string;
  features?: {
    reservations?: boolean;
    loyaltyPoints?: boolean;
    referrals?: boolean;
    notifications?: boolean;
  };
  stripePublishableKey?: string;
  stripeSecretKey?: string;
  stripeWebhookSecret?: string;
  termsAndConditions?: {
    url?: string;
    version?: string;
    lastUpdated?: Date;
  };
  privacyPolicy?: {
    url?: string;
    version?: string;
    lastUpdated?: Date;
  };
  supportContact?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateDriverAppConfigData {
  appName?: string;
  logoUrl?: string;
  primaryColor?: string;
  accentColor?: string;
  allowGuestCharging?: boolean;
  allowRfidCharging?: boolean;
  allowAppCharging?: boolean;
  requirePaymentMethod?: boolean;
  pricingModel?: 'pay_per_use' | 'subscription' | 'hybrid';
  customDomain?: string;
  features?: {
    reservations?: boolean;
    loyaltyPoints?: boolean;
    referrals?: boolean;
    notifications?: boolean;
  };
  stripePublishableKey?: string;
  stripeSecretKey?: string;
  stripeWebhookSecret?: string;
  termsAndConditions?: {
    url?: string;
    version?: string;
    lastUpdated?: Date;
  };
  privacyPolicy?: {
    url?: string;
    version?: string;
    lastUpdated?: Date;
  };
  supportContact?: {
    email?: string;
    phone?: string;
    website?: string;
  };
}

class DriverAppConfigService {
  async getConfig(): Promise<DriverAppConfig> {
    try {
      console.log('Fetching driver app config');
      const config = await driverHttpService.get<DriverAppConfig>(API_CONFIG.endpoints.driverAppConfig.base);
      console.log('Driver app config response:', config);
      return config;
    } catch (error: any) {
      console.error('Driver app config fetch error:', error);
      throw error;
    }
  }

  async updateConfig(data: UpdateDriverAppConfigData): Promise<DriverAppConfig> {
    try {
      console.log('Updating driver app config:', data);
      const config = await driverHttpService.put<DriverAppConfig>(API_CONFIG.endpoints.driverAppConfig.base, data);
      console.log('Driver app config update response:', config);
      return config;
    } catch (error: any) {
      console.error('Driver app config update error:', error);
      throw error;
    }
  }
}

export const driverAppConfigService = new DriverAppConfigService();
