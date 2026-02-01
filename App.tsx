import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ConnectionProvider } from './mobile/lib/connection-context';
import { LoadingScreen } from './mobile/screens/LoadingScreen';
import { HomeScreen } from './mobile/screens/HomeScreen';
import { StatsScreen } from './mobile/screens/StatsScreen';
import { ServersScreen } from './mobile/screens/ServersScreen';
import { ProfileScreen } from './mobile/screens/ProfileScreen';
import { SettingsScreen } from './mobile/screens/SettingsScreen';
import { SpeedTestScreen } from './mobile/screens/SpeedTestScreen';
import { AboutScreen } from './mobile/screens/AboutScreen';
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();

export default function App() {
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
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Stats" component={StatsScreen} />
          <Stack.Screen name="Servers" component={ServersScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="SpeedTest" component={SpeedTestScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ConnectionProvider>
  );
}
