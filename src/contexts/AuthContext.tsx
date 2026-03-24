'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { DRIVER_AUTH_CONFIG, FRONTEND_ROUTES } from '@/constants/constants';
import { Driver, driverService } from '@/services/driver.service';
import { toast } from 'sonner';

interface AuthContextType {
  user: Driver | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem(DRIVER_AUTH_CONFIG.tokenKey);
      const storedUser = localStorage.getItem(DRIVER_AUTH_CONFIG.userKey);

      if (token && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          
          // Sync cookies with localStorage for middleware
          document.cookie = `${DRIVER_AUTH_CONFIG.tokenKey}=${token}; path=/; max-age=86400; SameSite=Lax`;
          document.cookie = `${DRIVER_AUTH_CONFIG.userKey}=${encodeURIComponent(storedUser)}; path=/; max-age=86400; SameSite=Lax`;
          
          setUser(userData);
        } catch (error) {
          console.error('Error parsing stored auth data:', error);
          localStorage.removeItem(DRIVER_AUTH_CONFIG.tokenKey);
          localStorage.removeItem(DRIVER_AUTH_CONFIG.userKey);
          document.cookie = `${DRIVER_AUTH_CONFIG.tokenKey}=; path=/; max-age=0`;
          document.cookie = `${DRIVER_AUTH_CONFIG.userKey}=; path=/; max-age=0`;
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { token, driver } = await driverService.login(email, password);

      // Set localStorage for client-side access
      localStorage.setItem(DRIVER_AUTH_CONFIG.tokenKey, token);
      localStorage.setItem(DRIVER_AUTH_CONFIG.userKey, JSON.stringify(driver));

      // Set cookies for middleware access
      document.cookie = `${DRIVER_AUTH_CONFIG.tokenKey}=${token}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `${DRIVER_AUTH_CONFIG.userKey}=${encodeURIComponent(JSON.stringify(driver))}; path=/; max-age=86400; SameSite=Lax`;

      setUser(driver);
      toast.success('Login successful!');
      router.push(FRONTEND_ROUTES.DRIVER_DASHBOARD);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem(DRIVER_AUTH_CONFIG.tokenKey);
    localStorage.removeItem(DRIVER_AUTH_CONFIG.userKey);
    
    // Clear cookies
    document.cookie = `${DRIVER_AUTH_CONFIG.tokenKey}=; path=/; max-age=0`;
    document.cookie = `${DRIVER_AUTH_CONFIG.userKey}=; path=/; max-age=0`;
    
    setUser(null);
    toast.info('You have been logged out.');
    router.push(FRONTEND_ROUTES.DRIVER_LOGIN || '/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
