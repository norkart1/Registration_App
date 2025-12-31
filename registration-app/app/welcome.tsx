import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header} />
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Welcome!</Text>
          <Text style={styles.subtitle}>Find the things that you Love!</Text>
          
          <View style={styles.illustration}>
            <Text style={styles.illustrationEmoji}>👥</Text>
          </View>
          
          <Pressable 
            style={({ pressed }) => [
              styles.signUpButton,
              pressed && styles.buttonPressed
            ]}
            onPress={() => router.push('/signup')}
          >
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </Pressable>
          
          <Pressable 
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.buttonPressed
            ]}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#18998C',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#F5F5F5',
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  header: {
    height: 80,
    backgroundColor: '#5AC8BD',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  contentContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#5AC8BD',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#4A4A4A',
    marginBottom: 30,
    fontWeight: '500',
  },
  illustration: {
    width: 200,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  illustrationEmoji: {
    fontSize: 80,
  },
  signUpButton: {
    width: '100%',
    backgroundColor: '#5AC8BD',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#5AC8BD',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loginButtonText: {
    color: '#5AC8BD',
    fontSize: 16,
    fontWeight: '600',
  },
});
