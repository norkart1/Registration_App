import { StyleSheet, View, Text, Pressable, TextInput, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let pass = '';
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
    setConfirmPassword(pass);
  };

  const handleSignUp = async () => {
    if (email && password && confirmPassword && password === confirmPassword) {
      setLoading(true);
      setTimeout(() => {
        Alert.alert('Success', 'Account created successfully!');
        router.push('/(tabs)');
        setLoading(false);
      }, 1000);
    }
  };

  const isFormValid = email && password && confirmPassword && password === confirmPassword;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <Text style={styles.logo}>NorkCraft</Text>
        <Text style={styles.title}>Create your Account</Text>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#CCCCCC"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formGroup}>
            <View style={styles.passwordHeader}>
              <Text style={styles.label}>Password</Text>
              <Pressable onPress={generatePassword}>
                <Text style={styles.suggestLink}>Suggest</Text>
              </Pressable>
            </View>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter password"
                placeholderTextColor="#CCCCCC"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              placeholderTextColor="#CCCCCC"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            {confirmPassword && password !== confirmPassword && (
              <Text style={styles.errorText}>Passwords don't match</Text>
            )}
          </View>
        </View>

        <Pressable 
          style={[
            styles.primaryButton,
            (!isFormValid || loading) && styles.disabledButton
          ]}
          onPress={handleSignUp}
          disabled={!isFormValid || loading}
        >
          <Text style={styles.primaryButtonText}>{loading ? 'Creating...' : 'Sign up'}</Text>
        </Pressable>

        <View style={styles.loginPrompt}>
          <Text style={styles.promptText}>Already have an account? </Text>
          <Pressable onPress={() => router.push('/login')}>
            <Text style={styles.promptLink}>Sign in</Text>
          </Pressable>
        </View>
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
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  suggestLink: {
    color: '#1F3A70',
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#1A1A1A',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 14,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1A1A1A',
  },
  eyeIcon: {
    fontSize: 18,
    padding: 4,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 6,
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
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
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
});
