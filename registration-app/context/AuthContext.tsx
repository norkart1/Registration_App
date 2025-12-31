import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { account, ID } from '@/utils/appwrite';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signUp: (email: string, pass: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  verifyOTP: (otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await account.create(ID.unique(), email, pass);
      await account.createEmailPasswordSession(email, pass);
      // Create verification email token
      await account.createVerification('https://localhost:5000/verify'); 
    } catch (error: any) {
      console.error('SignUp error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await account.createEmailPasswordSession(email, pass);
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (otp: string) => {
    try {
      const currentUser = await account.get();
      await account.updateVerification(currentUser.$id, otp);
      setUser({ ...currentUser, emailVerification: true });
      return true;
    } catch (error) {
      console.error('OTP verification failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, login, verifyOTP, logout, checkUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
