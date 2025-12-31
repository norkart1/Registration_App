import React, { createContext, useState, ReactNode } from 'react';

interface AuthContextType {
  email: string | null;
  password: string | null;
  setCredentials: (email: string, password: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  const setCredentials = (newEmail: string, newPassword: string) => {
    setEmail(newEmail);
    setPassword(newPassword);
  };

  const logout = () => {
    setEmail(null);
    setPassword(null);
  };

  return (
    <AuthContext.Provider value={{ email, password, setCredentials, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
