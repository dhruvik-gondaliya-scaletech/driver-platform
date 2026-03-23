import httpService from '@/lib/http-service';
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
      console.log('Fetching driver app config from /api/v1/driver-app-config');
      const config = await httpService.get<DriverAppConfig>('/api/v1/driver-app-config');
      console.log('Driver app config response:', config);
      return config;
    } catch (error: any) {
      console.error('Driver app config fetch error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });
      throw error;
    }
  }

  async updateConfig(data: UpdateDriverAppConfigData): Promise<DriverAppConfig> {
    try {
      console.log('Updating driver app config:', data);
      const config = await httpService.put<DriverAppConfig>('/api/v1/driver-app-config', data);
      console.log('Driver app config update response:', config);
      return config;
    } catch (error: any) {
      console.error('Driver app config update error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  }
}

export const driverAppConfigService = new DriverAppConfigService();
