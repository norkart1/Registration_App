import { StyleSheet, View, Text, Pressable, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function VerifyOTPScreen() {
  const router = useRouter();
  const { email: paramEmail } = useLocalSearchParams<{ email: string }>();
  const { verifyOTP, loading: authLoading } = useAuth();
  const [otp, setOtp] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const isLoading = authLoading || localLoading;

  const handleVerify = async () => {
    if (otp.length === 6) {
      setLocalLoading(true);
      try {
        const success = await verifyOTP(otp);
        if (success) {
          Alert.alert('Success', 'Email verified successfully!');
          router.replace('/welcome');
        } else {
          Alert.alert('Error', 'Invalid OTP. Please try again.');
        }
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Verification failed');
      } finally {
        setLocalLoading(false);
      }
    }
  };

  const handleResendOTP = () => {
    Alert.alert('OTP Resent', 'A new OTP has been sent to your email.');
  };

  const isFormValid = otp.length === 6;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <Text style={styles.logo}>NorkCraft</Text>
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>Enter the 6-digit code sent to {paramEmail || 'your email'}</Text>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Verification Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 6-digit code"
              placeholderTextColor="#CCCCCC"
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
              editable={!isLoading}
            />
          </View>
        </View>

        <Pressable 
          style={[
            styles.primaryButton,
            (!isFormValid || isLoading) && styles.disabledButton
          ]}
          onPress={handleVerify}
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.primaryButtonText}>Verify</Text>
          )}
        </Pressable>

        <View style={styles.resendContainer}>
          <Text style={styles.promptText}>Didn't receive the code? </Text>
          <Pressable onPress={handleResendOTP}>
            <Text style={styles.promptLink}>Resend OTP</Text>
          </Pressable>
        </View>

        <Pressable onPress={() => router.push('/signup')}>
          <Text style={styles.backLink}>Back to Sign Up</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8ECFF',
  },
  scrollContent: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    justifyContent: 'center',
    minHeight: '100%',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F3A70',
    letterSpacing: 1,
    marginBottom: 8,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    marginBottom: 32,
    width: '100%',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    letterSpacing: 4,
    color: '#1A1A1A',
    textAlign: 'center',
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#1F3A70',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  promptText: {
    color: '#999999',
    fontSize: 13,
  },
  promptLink: {
    color: '#1F3A70',
    fontSize: 13,
    fontWeight: '600',
  },
  backLink: {
    color: '#1F3A70',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
