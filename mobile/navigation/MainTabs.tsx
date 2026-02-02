import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { SpeedTestScreen } from '../screens/SpeedTestScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { GlassNavigationBar } from '../components/glass-navigation-bar';

const Tab = createBottomTabNavigator();

export function MainTabs() {
    return (
        <Tab.Navigator
            tabBar={props => <GlassNavigationBar {...props} />}
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                // Make the tab bar background transparent so our blur view works
                tabBarStyle: { position: 'absolute' },
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="SpeedTest" component={SpeedTestScreen} />
            <Tab.Screen name="Stats" component={StatsScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}
