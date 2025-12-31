import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { account, ID } from '@/utils/appwrite';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  email: string | null;
  passwordHash: string | null;
  signUp: (email: string, pass: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  verifyOTP: (otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple OTP storage (in production, this would come from backend)
const otpStorage: { [key: string]: string } = {};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [passwordHash, setPasswordHash] = useState<string | null>(null);
  const [tempEmail, setTempEmail] = useState<string>('');
  const [generatedOTP, setGeneratedOTP] = useState<string>('');

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
      setEmail(currentUser.email);
    } catch (error) {
      setUser(null);
      setEmail(null);
      setPasswordHash(null);
    } finally {
      setLoading(false);
    }
  };

  const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const signUp = async (email: string, pass: string) => {
    setLoading(true);
    try {
      // Create user account
      await account.create(ID.unique(), email, pass);
      
      // Generate and store OTP
      const otp = generateOTP();
      otpStorage[email] = otp;
      setTempEmail(email);
      setGeneratedOTP(otp);
      
      // In a real app, you'd send this OTP via email
      console.log(`OTP for ${email}: ${otp}`);
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
      setEmail(currentUser.email);
      setPasswordHash('User authenticated');
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (otp: string) => {
    try {
      // Check if OTP matches
      const storedOTP = otpStorage[tempEmail];
      if (storedOTP && storedOTP === otp) {
        // OTP is valid, now create session
        // For testing purposes, we'll skip email verification
        // In production, you'd do: await account.createEmailPasswordSession(email, password);
        
        // Simulate login with the OTP
        const currentUser = await account.get();
        setUser(currentUser);
        setEmail(currentUser.email);
        setPasswordHash('User verified');
        delete otpStorage[tempEmail];
        setTempEmail('');
        setGeneratedOTP('');
        return true;
      } else {
        console.error('Invalid OTP');
        return false;
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setEmail(null);
      setPasswordHash(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, email, passwordHash, signUp, login, verifyOTP, logout, checkUser }}>
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
