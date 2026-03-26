import driverHttpService from '@/lib/driver-http-service';
import { DriverAppConfig } from '@/types';

class ConfigService {
  async getConfig(): Promise<DriverAppConfig> {
    // This endpoint is accessible even without a token on the backend
    return driverHttpService.get<DriverAppConfig>('/api/v1/driver-app-config');
  }
}

export const configService = new ConfigService();
