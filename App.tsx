import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ConnectionProvider } from './mobile/lib/connection-context';
import { WelcomeScreen } from './mobile/screens/WelcomeScreen';
import { HomeScreen } from './mobile/screens/HomeScreen';
import { StatsScreen } from './mobile/screens/StatsScreen';
import { ServersScreen } from './mobile/screens/ServersScreen';
import { ProfileScreen } from './mobile/screens/ProfileScreen';
import { StatusBar } from 'expo-status-bar';

// Import global styling

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ConnectionProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            animationDuration: 300,
          }}
          initialRouteName="Welcome"
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Stats" component={StatsScreen} />
          <Stack.Screen name="Servers" component={ServersScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </ConnectionProvider>
  );
}
