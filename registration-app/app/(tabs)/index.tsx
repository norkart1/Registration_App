import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function HomeScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login');
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>NorkCraft</Text>
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerText}>Welcome to NorkCraft</Text>
        <Text style={styles.bannerSubtext}>Your creative space awaits</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardIcon}>🎨</Text>
          <Text style={styles.cardTitle}>Create</Text>
          <Text style={styles.cardDesc}>Build amazing projects with our tools</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardIcon}>🚀</Text>
          <Text style={styles.cardTitle}>Develop</Text>
          <Text style={styles.cardDesc}>Develop your ideas from concept to reality</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardIcon}>⭐</Text>
          <Text style={styles.cardTitle}>Share</Text>
          <Text style={styles.cardDesc}>Share your creations with the community</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable 
          style={styles.primaryButton}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </Pressable>

        <View style={styles.divider} />

        <Text style={styles.footerText}>© 2025 NorkCraft. All rights reserved.</Text>
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
    paddingTop: 24,
    paddingBottom: 32,
    backgroundColor: '#1F3A70',
  },
  logo: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  banner: {
    backgroundColor: '#E8F0F8',
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F3A70',
    marginBottom: 8,
  },
  bannerSubtext: {
    fontSize: 14,
    color: '#666666',
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 16,
  },
  card: {
    backgroundColor: '#F8FAFB',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F3A70',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#1F3A70',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#999999',
  },
});
