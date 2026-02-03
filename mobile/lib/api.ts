import axios from 'axios';
import { Platform } from 'react-native';
import { getDeviceId } from './storage';

// Use LAN IP for best compatibility with simulators and devices
export const API_URL = 'http://192.168.1.6:3000';

console.log('🔌 Active API URL:', API_URL);

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

api.interceptors.request.use(
    async (config) => {
        const deviceId = await getDeviceId();
        if (deviceId) {
            config.headers['x-device-id'] = deviceId;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
