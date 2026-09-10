import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'user';

export interface AuthUser {
  id: string;
  role: UserRole;
  loginTime: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (password: string) => boolean;
  logout: () => void;
  isAdmin: () => boolean;
  requireAdmin: () => void; // throws if not admin
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin password - for a production app, this would be handled by a secure backend
// For demo purposes, we use a simple password stored locally
const ADMIN_PASSWORD = 'admin123';
const AUTH_STORAGE_KEY = 'campusfind_auth_v1';
const SESSION_DURATION_MS = 60 * 60 * 1000; // 1 hour

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Check if session is still valid
        const elapsed = Date.now() - parsed.loginTime;
        if (elapsed < SESSION_DURATION_MS) {
          return parsed;
        } else {
          // Session expired
          localStorage.removeItem(AUTH_STORAGE_KEY);
          return null;
        }
      }
    } catch {
      // ignore
    }
    return null;
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, [user]);

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      const newUser: AuthUser = {
        id: `admin-${Date.now()}`,
        role: 'admin',
        loginTime: Date.now()
      };
      setUser(newUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const isAdmin = (): boolean => {
    return user !== null && user.role === 'admin';
  };

  const requireAdmin = () => {
    if (!isAdmin()) {
      throw new Error('Unauthorized: Admin access required');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: user !== null,
        user,
        login,
        logout,
        isAdmin,
        requireAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
