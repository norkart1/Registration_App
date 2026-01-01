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
const userPasswords: { [key: string]: string } = {};

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
      setPasswordHash('User authenticated');
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
      // Store password for MongoDB (hashing will happen in the API)
      userPasswords[email] = pass;
      
      // Generate and store OTP
      const otp = generateOTP();
      otpStorage[email] = otp;
      setTempEmail(email);
      setGeneratedOTP(otp);
      
      console.log(`═══════════════════════════════════════`);
      console.log(`OTP for ${email}:`);
      console.log(`${otp}`);
      console.log(`═══════════════════════════════════════`);
      
      // Send OTP via email
      try {
        const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://serverregistration.vercel.app';
        console.log('Sending OTP to backend:', backendUrl);
        const response = await fetch(`${backendUrl}/api/auth/send-otp`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ email, otp }),
        });
        
        const responseData = await response.json();
        if (response.ok) {
          console.log('OTP email sent successfully:', responseData);
        } else {
          console.warn('Email sending failed:', responseData);
          // We still show the popup because the OTP is generated locally
        }
      } catch (emailError) {
        console.warn('Email service is not available. OTP shown in console.', emailError);
      }
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
        // OTP is valid - save user data to MongoDB via API
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: tempEmail,
              password: userPasswords[tempEmail],
            }),
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to save user data');
          }
        } catch (apiError) {
          console.warn('MongoDB save warning:', apiError);
        }
        
        // Create Appwrite account for session management
        try {
          await account.create(ID.unique(), tempEmail, userPasswords[tempEmail]);
          await account.createEmailPasswordSession(tempEmail, userPasswords[tempEmail]);
          const currentUser = await account.get();
          setUser(currentUser);
          setEmail(currentUser.email);
          setPasswordHash('User verified');
        } catch (appwriteError) {
          console.warn('Appwrite account creation warning:', appwriteError);
          // Still mark as verified even if Appwrite fails
          setUser({ email: tempEmail });
          setEmail(tempEmail);
          setPasswordHash('User verified');
        }
        
        // Cleanup
        delete otpStorage[tempEmail];
        delete userPasswords[tempEmail];
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
