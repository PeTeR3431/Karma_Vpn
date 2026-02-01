import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AppBackgroundProps {
    children: React.ReactNode;
    className?: string;
}

export function AppBackground({ children, className }: AppBackgroundProps) {
    return (
        <View className={`flex-1 ${className}`}>
            <LinearGradient
                // Charcoal to Black gradient (Original Palette)
                colors={['#181818', '#09090b']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            />
            {children}
        </View>
    );
}
