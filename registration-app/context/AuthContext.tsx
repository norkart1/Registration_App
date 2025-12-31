import React, { createContext, useState, ReactNode } from 'react';
import { hashPassword } from '@/utils/hash';

interface AuthContextType {
  email: string | null;
  passwordHash: string | null;
  pendingEmail: string | null;
  pendingPasswordHash: string | null;
  otp: string | null;
  setCredentials: (email: string, passwordHash: string) => void;
  setPendingCredentials: (email: string, passwordHash: string) => void;
  generateOTP: () => string;
  verifyOTP: (inputOtp: string) => Promise<boolean>;
  clearOTP: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [passwordHash, setPasswordHash] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [pendingPasswordHash, setPendingPasswordHash] = useState<string | null>(null);
  const [otp, setOtp] = useState<string | null>(null);

  const setCredentials = (newEmail: string, newPasswordHash: string) => {
    setEmail(newEmail);
    setPasswordHash(newPasswordHash);
    setPendingEmail(null);
    setPendingPasswordHash(null);
    setOtp(null);
  };

  const setPendingCredentials = (newEmail: string, newPasswordHash: string) => {
    setPendingEmail(newEmail);
    setPendingPasswordHash(newPasswordHash);
  };

  const generateOTP = () => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(generatedOtp);
    return generatedOtp;
  };

  const verifyOTP = async (inputOtp: string) => {
    return otp === inputOtp;
  };

  const clearOTP = () => {
    setOtp(null);
    setPendingEmail(null);
    setPendingPasswordHash(null);
  };

  const logout = () => {
    setEmail(null);
    setPasswordHash(null);
    setOtp(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        email, 
        passwordHash, 
        pendingEmail,
        pendingPasswordHash,
        otp,
        setCredentials, 
        setPendingCredentials,
        generateOTP,
        verifyOTP,
        clearOTP,
        logout 
      }}
    >
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
