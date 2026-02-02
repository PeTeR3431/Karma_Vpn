import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const DEVICE_ID_KEY = 'karma_vpn_device_id';

/**
 * Saves the device ID to secure storage.
 * @param deviceId The UUID to save.
 */
export async function saveDeviceId(deviceId: string): Promise<void> {
    try {
        if (Platform.OS === 'web') {
            localStorage.setItem(DEVICE_ID_KEY, deviceId);
        } else {
            await SecureStore.setItemAsync(DEVICE_ID_KEY, deviceId);
        }
    } catch (error) {
        console.error('Error saving device ID:', error);
        throw error;
    }
}

/**
 * Retrieves the device ID from secure storage.
 * @returns The stored UUID or null if not found.
 */
export async function getDeviceId(): Promise<string | null> {
    try {
        if (Platform.OS === 'web') {
            return localStorage.getItem(DEVICE_ID_KEY);
        } else {
            return await SecureStore.getItemAsync(DEVICE_ID_KEY);
        }
    } catch (error) {
        console.error('Error retrieving device ID:', error);
        return null;
    }
}
