import { Client, Account, ID } from 'react-native-appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Replace with your endpoint if self-hosted
    .setProject(process.env.APPWRITE_PROJECT_ID || ''); // Your project ID

export const account = new Account(client);
export { ID };
