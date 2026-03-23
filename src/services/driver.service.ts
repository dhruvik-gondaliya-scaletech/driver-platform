import driverHttpService from '@/lib/driver-http-service';
import { API_CONFIG } from '@/constants/constants';

export interface Driver {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  walletBalance: number;
  loyaltyPoints: number;
  isEmailVerified: boolean;
  driverType: 'registered' | 'guest' | 'rfid_only';
  createdAt: string;
}

export interface DriverLoginResponse {
  driver: Driver;
  token: string;
}

export interface DriverRegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface DriverRfidCard {
  id: string;
  idTag: string;
  visualNumber?: string;
  isActive: boolean;
  expiryDate?: string;
  createdAt: string;
}

export interface DriverPaymentMethod {
  id: string;
  type: 'card' | 'wallet' | 'upi' | 'bank_account';
  stripePaymentMethodId?: string;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface DriverTransaction {
  id: string;
  driverId: string;
  sessionId?: string;
  type: 'charge' | 'topup' | 'refund' | 'subscription';
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  stripePaymentIntentId?: string;
  metadata?: any;
  createdAt: string;
}

export interface ChargingSession {
  id: string;
  stationId: string;
  driverId: string;
  connectorId: number;
  startTime: string;
  endTime?: string;
  energyDeliveredKwh: number;
  durationMinutes: number;
  totalCost?: number;
  energyCost?: number;
  timeCost?: number;
  status: 'in-progress' | 'completed' | 'failed';
  paymentStatus?: 'pending' | 'authorized' | 'paid' | 'failed' | 'refunded';
  station?: {
    id: string;
    name: string;
    serialNumber: string;
  };
}

export interface StartChargingData {
  stationId: string;
  connectorId: number;
}

class DriverService {
  async login(email: string, password: string): Promise<DriverLoginResponse> {
    return driverHttpService.post<DriverLoginResponse>(
      API_CONFIG.endpoints.driver.auth.login,
      { email, password }
    );
  }

  async register(data: DriverRegisterData): Promise<DriverLoginResponse> {
    return driverHttpService.post<DriverLoginResponse>(
      API_CONFIG.endpoints.driver.auth.register,
      data
    );
  }

  async createGuest(email: string, firstName?: string): Promise<DriverLoginResponse> {
    return driverHttpService.post<DriverLoginResponse>(
      API_CONFIG.endpoints.driver.auth.guest,
      { email, firstName }
    );
  }

  async getProfile(): Promise<Driver> {
    return driverHttpService.get<Driver>(API_CONFIG.endpoints.driver.profile.base);
  }

  async updateProfile(data: Partial<Driver>): Promise<Driver> {
    return driverHttpService.put<Driver>(API_CONFIG.endpoints.driver.profile.base, data);
  }

  async getRfidCards(): Promise<DriverRfidCard[]> {
    return driverHttpService.get<DriverRfidCard[]>(API_CONFIG.endpoints.driver.profile.rfidCards);
  }

  async addRfidCard(idTag: string, visualNumber?: string): Promise<DriverRfidCard> {
    return driverHttpService.post<DriverRfidCard>(
      API_CONFIG.endpoints.driver.profile.rfidCards,
      { idTag, visualNumber }
    );
  }

  async removeRfidCard(cardId: string): Promise<void> {
    return driverHttpService.delete<void>(API_CONFIG.endpoints.driver.profile.removeRfidCard(cardId));
  }

  async getPaymentMethods(): Promise<DriverPaymentMethod[]> {
    return driverHttpService.get<DriverPaymentMethod[]>(
      API_CONFIG.endpoints.driver.profile.paymentMethods
    );
  }

  async getTransactions(): Promise<DriverTransaction[]> {
    return driverHttpService.get<DriverTransaction[]>(
      API_CONFIG.endpoints.driver.profile.transactions
    );
  }

  async startCharging(data: StartChargingData): Promise<ChargingSession> {
    return driverHttpService.post<ChargingSession>(
      API_CONFIG.endpoints.driver.charging.start,
      data
    );
  }

  async stopCharging(sessionId: string): Promise<ChargingSession> {
    return driverHttpService.post<ChargingSession>(
      API_CONFIG.endpoints.driver.charging.stop(sessionId)
    );
  }

  async getSessions(): Promise<ChargingSession[]> {
    return driverHttpService.get<ChargingSession[]>(
      API_CONFIG.endpoints.driver.charging.sessions
    );
  }

  async getActiveSession(): Promise<ChargingSession | null> {
    return driverHttpService.get<ChargingSession | null>(
      API_CONFIG.endpoints.driver.charging.activeSession
    );
  }

  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('driver_auth_token');
      localStorage.removeItem('driver_user');
      
      // Clear cookies
      document.cookie = 'driver_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'driver_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }
}

export const driverService = new DriverService();
