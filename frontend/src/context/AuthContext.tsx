import { createContext, useContext, ReactNode } from 'react';
import { useAuthStore } from '../store/authStore';

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, setUser, setToken, logout: storeLogout } = useAuthStore();

  const login = async (email: string, password: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
      setUser(data.user);
      setToken(data.accessToken);
    } else {
      throw new Error(data.error || 'Login failed');
    }
  };

  const register = async (userData: any) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(userData)
    });

    const data = await response.json();
    if (response.ok) {
      setUser(data.user);
      setToken(data.accessToken);
    } else {
      throw new Error(data.error || 'Registration failed');
    }
  };

  const logout = () => {
    storeLogout();
    fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

