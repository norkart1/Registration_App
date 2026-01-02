import { StyleSheet, View, Text, Pressable, TextInput, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useRef } from 'react';
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

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
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
    if (user.length <= 4) return email;
    return `${user.substring(0, 2)}***${user.substring(user.length - 2)}@${domain}`;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#74A2F2', '#4A80E1']}
        style={styles.background}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
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
              <Pressable>
                <Text style={styles.resendLink}>Resend</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
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
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: '#111827',
    backgroundColor: '#FFFFFF',
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
