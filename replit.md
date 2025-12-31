# NorkCraft Registration App

## Overview

NorkCraft is a React Native mobile application built with Expo that provides user authentication functionality including signup, login, email verification via OTP, and a home dashboard. The app supports iOS, Android, and web platforms through Expo's cross-platform capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React Native with Expo SDK 54
- Uses Expo Router for file-based navigation
- Implements React Navigation for bottom tabs and stack navigation
- Supports automatic dark/light theme switching via `useColorScheme`

**Navigation Structure**:
- Stack-based navigation at root level with screens: login, signup, verify-otp, welcome, modal
- Tab navigation inside authenticated area with Home and Explore tabs (tabs are hidden in current implementation)
- Authentication flow: login → (tabs) or signup → OTP verification → (tabs)

**State Management**:
- React Context API via `AuthContext` for authentication state
- Stores email, password hash, pending credentials during signup, and OTP
- No external state management library

**UI Components**:
- Custom themed components (`ThemedText`, `ThemedView`) for consistent styling
- Platform-specific icon handling (SF Symbols on iOS, Material Icons on Android/web)
- Haptic feedback on tab interactions (iOS only)
- OTP popup modal for email verification

### Email OTP Configuration (Non-Integration)
- Service: Gmail SMTP (`smtp.gmail.com`)
- Port: 587 (STARTTLS)
- From Address: `examples@gmail.com`
- Credentials: Used `EMAIL_SERVICE_PASS` secret for authentication.

Note: This setup bypasses the Replit Integration system as requested by the user.

**Current Limitations**:
- No persistent storage - credentials lost on app restart
- No backend integration - all auth is client-side only
- OTP is generated locally, not sent via email service

### Theming System

- Centralized color constants in `constants/theme.ts`
- Platform-specific font configurations
- Light and dark mode support with automatic system preference detection

## External Dependencies

### Core Framework
- **Expo SDK 54**: Cross-platform React Native framework
- **React 19.1.0**: UI library
- **React Native 0.81.5**: Native platform bridge

### Navigation
- **expo-router 6.0**: File-based routing
- **@react-navigation/native**: Navigation core
- **@react-navigation/bottom-tabs**: Tab navigation

### Security
- **bcryptjs 3.0.3**: Password hashing (client-side)

### UI/UX
- **expo-haptics**: Haptic feedback
- **expo-symbols**: SF Symbols support (iOS)
- **@expo/vector-icons**: Cross-platform icons
- **react-native-reanimated**: Animations
- **expo-image**: Optimized image component

### Database (Not Yet Integrated)
- **mongoose 9.1.1**: MongoDB ODM (installed at root level but not connected)

### Development
- **TypeScript 5.9**: Type safety
- **ESLint with expo config**: Code linting

### Missing Backend Requirements
The app currently lacks:
- Backend API server
- Database connection (MongoDB via Mongoose is installed but unused)
- Email service for OTP delivery
- Session/token management
- Persistent user storage