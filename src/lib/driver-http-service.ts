import { API_CONFIG, DRIVER_AUTH_CONFIG } from "@/constants/constants";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

class DriverHttpService {
  private static instance: DriverHttpService;
  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.baseUrl,
      timeout: API_CONFIG.timeout,
      headers: {
        "Content-Type": "application/json",
        "x-api-secret": process.env.NEXT_PUBLIC_API_SECRET || '',
      },
    });

    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem(DRIVER_AUTH_CONFIG.tokenKey);
          const url = config.url || '';
          
          if (token) {
            console.log(`[DriverHttp] Token found for request to: ${url}`);
            if (this.isTokenExpired(token)) {
              console.warn(`[DriverHttp] Token expired for request to: ${url}. Clearing session.`);
              this.handleExpiredToken();
              return config;
            }
            
            // Ensure headers object exists and set Authorization robustly
            if (config.headers) {
              const bearerValue = `Bearer ${token}`;
              if (typeof (config.headers as any).set === 'function') {
                (config.headers as any).set('Authorization', bearerValue);
              } else {
                config.headers.Authorization = bearerValue;
              }
              console.log(`[DriverHttp] Authorization header set for: ${url}`);
            } else {
              console.warn(`[DriverHttp] Config headers missing for: ${url}`);
            }
          } else {
            console.warn(`[DriverHttp] No token found in localStorage for request to: ${url}`);
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => {
        if (response.data && typeof response.data === 'object' && 'data' in response.data) {
          return response.data.data;
        }
        return response.data;
      },
      (error) => {
        if (error.response?.status === 401) {
          const url = error.config?.url || '';
          console.error(`[DriverHttp] 401 Unauthorized for: ${url}. Status text: ${error.response.statusText}`);
          
          // Don't clear session if it's a public route or specific driver config endpoint
          const isPublicRoute = url.includes('/api/v1/driver-app-config') || 
                               url.includes('/driver/v1/auth/');
          
          if (!isPublicRoute && typeof window !== 'undefined') {
            this.handleUnauthorized();
          } else if (isPublicRoute) {
            console.warn(`[DriverHttp] 401 on public route ${url}. Skipping session clear.`);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private isTokenExpired(token: string): boolean {
    if (!token || !token.includes('.')) return false; // Don't clear if not a JWT or missing
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      
      // Add padding if necessary for atob
      const pad = base64.length % 4;
      let paddedBase64 = base64;
      if (pad) {
        if (pad === 2) paddedBase64 += '==';
        else if (pad === 3) paddedBase64 += '=';
      }

      const jsonPayload = decodeURIComponent(
        atob(paddedBase64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      
      if (!payload.exp) return false; // If no exp claim, assume it's not expired yet

      const expirationTime = payload.exp * 1000;
      const isExpired = Date.now() >= expirationTime;
      
      if (isExpired) {
        console.warn('Token exp claim reached:', new Date(expirationTime).toISOString());
      }
      
      return isExpired;
    } catch (error) {
      console.error('Error checking token expiration (suppressed):', error);
      return false; // Better to return false and let the request fail than to clear potentially good session
    }
  }

  private handleExpiredToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DRIVER_AUTH_CONFIG.tokenKey);
      localStorage.removeItem(DRIVER_AUTH_CONFIG.userKey);
      
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?expired=true';
      }
    }
  }

  private handleUnauthorized(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DRIVER_AUTH_CONFIG.tokenKey);
      localStorage.removeItem(DRIVER_AUTH_CONFIG.userKey);
      
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
  }

  public static getInstance(): DriverHttpService {
    if (!DriverHttpService.instance) {
      DriverHttpService.instance = new DriverHttpService();
    }
    return DriverHttpService.instance;
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.get<T>(url, config) as Promise<T>;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.post<T>(url, data, config) as Promise<T>;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.put<T>(url, data, config) as Promise<T>;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.delete<T>(url, config) as Promise<T>;
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.patch<T>(url, data, config) as Promise<T>;
  }
}

export default DriverHttpService.getInstance();
