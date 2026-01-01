import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function HomeScreen() {
  const router = useRouter();
  const { email, passwordHash, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/signup');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <Text style={styles.logo}>NorkCraft</Text>
        <Text style={styles.title}>Welcome Back!</Text>

        <View style={styles.detailsContainer}>
          <View style={styles.detailGroup}>
            <Text style={styles.detailLabel}>Email Address</Text>
            <View style={styles.detailBox}>
              <Text style={styles.detailValue}>{email || 'Not available'}</Text>
            </View>
          </View>

          <View style={styles.detailGroup}>
            <Text style={styles.detailLabel}>Password Hash</Text>
            <View style={styles.detailBox}>
              <Text style={styles.detailValue}>{passwordHash || 'Not available'}</Text>
            </View>
          </View>
        </View>

        <Pressable 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
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
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
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
  detailsContainer: {
    width: '100%',
    marginBottom: 32,
  },
  detailGroup: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  detailBox: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#F9F9F9',
  },
  detailValue: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  logoutButton: {
    width: '100%',
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
