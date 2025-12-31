import { StyleSheet, View, Text, Pressable, TextInput, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.logo}>cignifi</Text>
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
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              placeholderTextColor="#CCCCCC"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
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
      </View>

      <View style={styles.footer}>
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

        <Text style={styles.dividerText}>Or sign up with</Text>

        <View style={styles.socialButtons}>
          <Pressable style={styles.socialButton}>
            <Text style={styles.socialIcon}>🔵</Text>
          </Pressable>
          <Pressable style={styles.socialButton}>
            <Text style={styles.socialIcon}>📘</Text>
          </Pressable>
          <Pressable style={styles.socialButton}>
            <Text style={styles.socialIcon}>𝕏</Text>
          </Pressable>
        </View>

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
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  backButton: {
    fontSize: 24,
    color: '#1F3A70',
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 24,
  },
  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F3A70',
    letterSpacing: 1,
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 28,
  },
  form: {
    marginBottom: 32,
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
    fontSize: 14,
    color: '#1A1A1A',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 6,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 24,
  },
  primaryButton: {
    backgroundColor: '#1F3A70',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerText: {
    textAlign: 'center',
    color: '#999999',
    fontSize: 13,
    marginBottom: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 24,
  },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    fontSize: 20,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  promptText: {
    color: '#666666',
    fontSize: 13,
  },
  promptLink: {
    color: '#1F3A70',
    fontSize: 13,
    fontWeight: '600',
  },
});
