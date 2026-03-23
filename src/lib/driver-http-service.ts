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
          
          if (token) {
            if (this.isTokenExpired(token)) {
              this.handleExpiredToken();
              return config;
            }
            
            config.headers.Authorization = `Bearer ${token}`;
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
          if (typeof window !== 'undefined') {
            this.handleUnauthorized();
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      return Date.now() >= expirationTime;
    } catch {
      return true;
    }
  }

  private handleExpiredToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DRIVER_AUTH_CONFIG.tokenKey);
      localStorage.removeItem(DRIVER_AUTH_CONFIG.userKey);
      
      if (window.location.pathname !== '/driver/login') {
        window.location.href = '/driver/login?expired=true';
      }
    }
  }

  private handleUnauthorized(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DRIVER_AUTH_CONFIG.tokenKey);
      localStorage.removeItem(DRIVER_AUTH_CONFIG.userKey);
      
      if (window.location.pathname !== '/driver/login') {
        window.location.href = '/driver/login';
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
