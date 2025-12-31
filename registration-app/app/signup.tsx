import { StyleSheet, View, Text } from 'react-native';

export default function SignUpScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.subtitle}>Create your account</Text>
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
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#5AC8BD',
  },
  subtitle: {
    fontSize: 16,
    color: '#4A4A4A',
    marginTop: 10,
  },
});
