import { Client, Account, ID } from 'react-native-appwrite';
import { Platform } from 'react-native';

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '');

if (Platform.OS === 'web') {
    // Get the current domain for web development
    const domain = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    client.setPlatform(`http://${domain}:5000`);
}

export const account = new Account(client);
export { ID };
