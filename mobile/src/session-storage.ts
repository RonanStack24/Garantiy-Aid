import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const SESSION_KEY = 'garantiy-aid.session-token';

export async function getStoredToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return typeof localStorage === 'undefined' ? null : localStorage.getItem(SESSION_KEY);
  }
  return SecureStore.getItemAsync(SESSION_KEY);
}

export async function storeToken(token: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof localStorage === 'undefined') throw new Error('Browser storage is unavailable.');
    localStorage.setItem(SESSION_KEY, token);
    return;
  }
  await SecureStore.setItemAsync(SESSION_KEY, token);
}

export async function clearStoredToken(): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(SESSION_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(SESSION_KEY);
}
