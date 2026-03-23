import driverHttpService from '@/lib/driver-http-service';

export enum PricingModel {
  PAY_PER_USE = 'pay_per_use',
  SUBSCRIPTION = 'subscription',
  HYBRID = 'hybrid',
}

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
  pricingModel: PricingModel;
  features?: {
    reservations?: boolean;
    loyaltyPoints?: boolean;
    referrals?: boolean;
    notifications?: boolean;
  };
  stripePublishableKey?: string;
  termsAndConditions?: {
    url?: string;
    version?: string;
  };
  supportContact?: {
    email?: string;
    phone?: string;
    website?: string;
  };
}

class ConfigService {
  async getConfig(): Promise<DriverAppConfig> {
    // This endpoint is accessible even without a token on the backend
    return driverHttpService.get<DriverAppConfig>('/api/v1/driver-app-config');
  }
}

export const configService = new ConfigService();
