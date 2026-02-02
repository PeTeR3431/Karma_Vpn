import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ConnectionProvider } from './mobile/lib/connection-context';
import { LoadingScreen } from './mobile/screens/LoadingScreen';
import { ServersScreen } from './mobile/screens/ServersScreen';
import { SettingsScreen } from './mobile/screens/SettingsScreen';
import { AboutScreen } from './mobile/screens/AboutScreen';
import { StatusBar } from 'expo-status-bar';
import { MainTabs } from './mobile/navigation/MainTabs';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { getDeviceId, saveDeviceId } from './mobile/lib/storage';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    const initializeDeviceId = async () => {
      try {
        const id = await getDeviceId();
        if (!id) {
          const newId = uuidv4();
          await saveDeviceId(newId);
          console.log('Initiated new User Device ID:', newId);
        } else {
          console.log('User Device ID loaded:', id);
        }
      } catch (err) {
        console.error('Failed to initialize Device ID', err);
      }
    };
    initializeDeviceId();
  }, []);

  return (
    <ConnectionProvider>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            animationDuration: 300,
          }}
          initialRouteName="Loading"
        >
          <Stack.Screen name="Loading" component={LoadingScreen} />
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="Servers" component={ServersScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ConnectionProvider>
  );
}
