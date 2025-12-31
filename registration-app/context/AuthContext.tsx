import React, { createContext, useState, ReactNode } from 'react';

interface AuthContextType {
  email: string | null;
  password: string | null;
  pendingEmail: string | null;
  pendingPassword: string | null;
  otp: string | null;
  setCredentials: (email: string, password: string) => void;
  setPendingCredentials: (email: string, password: string) => void;
  generateOTP: () => string;
  verifyOTP: (inputOtp: string) => boolean;
  clearOTP: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [pendingPassword, setPendingPassword] = useState<string | null>(null);
  const [otp, setOtp] = useState<string | null>(null);

  const setCredentials = (newEmail: string, newPassword: string) => {
    setEmail(newEmail);
    setPassword(newPassword);
    setPendingEmail(null);
    setPendingPassword(null);
    setOtp(null);
  };

  const setPendingCredentials = (newEmail: string, newPassword: string) => {
    setPendingEmail(newEmail);
    setPendingPassword(newPassword);
  };

  const generateOTP = () => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(generatedOtp);
    return generatedOtp;
  };

  const verifyOTP = (inputOtp: string) => {
    return otp === inputOtp;
  };

  const clearOTP = () => {
    setOtp(null);
    setPendingEmail(null);
    setPendingPassword(null);
  };

  const logout = () => {
    setEmail(null);
    setPassword(null);
    setOtp(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        email, 
        password, 
        pendingEmail,
        pendingPassword,
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
