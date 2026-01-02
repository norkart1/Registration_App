import { StyleSheet, View, Text, Pressable, TextInput, ScrollView, Alert, ActivityIndicator, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function VerifyOTPScreen() {
  const router = useRouter();
  const { email: paramEmail } = useLocalSearchParams<{ email: string }>();
  const { verifyOTP, loading: authLoading } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [localLoading, setLocalLoading] = useState(false);
  const inputs = useRef<Array<TextInput | null>>([]);

  const isLoading = authLoading || localLoading;

  useEffect(() => {
    // Auto-focus first input on mount
    setTimeout(() => {
      inputs.current[0]?.focus();
    }, 500);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    // Only allow numbers
    const cleanValue = value.replace(/[^0-9]/g, '');
    if (cleanValue.length > 1) {
      // Handle paste if needed, but for now just take the last char
      const lastChar = cleanValue.charAt(cleanValue.length - 1);
      const newOtp = [...otp];
      newOtp[index] = lastChar;
      setOtp(newOtp);
      if (index < 5) inputs.current[index + 1]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = cleanValue;
    setOtp(newOtp);

    // Auto-focus next input
    if (cleanValue && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      setLocalLoading(true);
      try {
        const success = await verifyOTP(otpString);
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

  const maskEmail = (email: string) => {
    if (!email) return 'your email';
    const [user, domain] = email.split('@');
    if (!user || !domain) return email;
    if (user.length <= 4) return email;
    return `${user.substring(0, 2)}***${user.substring(user.length - 2)}@${domain}`;
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={['#74A2F2', '#4A80E1']}
        style={styles.background}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.glassContainer}>
          <View style={styles.card}>
            <View style={styles.iconContainer}>
              <View style={styles.blueCircle}>
                <Image 
                  source={{ uri: 'https://img.icons8.com/ios-filled/100/ffffff/checked-shield.png' }} 
                  style={styles.shieldIcon}
                />
              </View>
            </View>

            <Text style={styles.title}>Verify your code</Text>
            <Text style={styles.subtitle}>
              We have sent a code to your email{'\n'}
              <Text style={styles.emailText}>{maskEmail(paramEmail || '')}</Text>
            </Text>

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => { inputs.current[index] = ref; }}
                  style={[styles.otpInput, digit ? styles.otpInputActive : null]}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  autoComplete="one-time-code"
                />
              ))}
            </View>

            <Pressable 
              style={[styles.verifyButton, (otp.join('').length < 6 || isLoading) && styles.disabledButton]}
              onPress={handleVerify}
              disabled={otp.join('').length < 6 || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.verifyButtonText}>Verify</Text>
              )}
            </Pressable>

            <View style={styles.resendContainer}>
              <Text style={styles.promptText}>Didn't receive code? </Text>
              <Pressable onPress={() => Alert.alert('OTP Resent', 'A new code has been sent.')}>
                <Text style={styles.resendLink}>Resend</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  glassContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    marginBottom: 24,
  },
  blueCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shieldIcon: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  emailText: {
    fontWeight: '600',
    color: '#374151',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
  },
  otpInput: {
    width: 42,
    height: 52,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  otpInputActive: {
    borderColor: '#3B82F6',
    borderWidth: 2,
  },
  verifyButton: {
    width: '100%',
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  disabledButton: {
    backgroundColor: '#93C5FD',
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promptText: {
    fontSize: 14,
    color: '#6B7280',
  },
  resendLink: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
});
