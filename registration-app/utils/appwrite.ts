import { Client, Account, ID } from 'react-native-appwrite';
import { Platform } from 'react-native';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '');

if (Platform.OS === 'web') {
    client.setPlatform('localhost'); // For web development
}

export const account = new Account(client);
export { ID };
