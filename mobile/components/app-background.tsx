import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AppBackgroundProps {
    children: React.ReactNode;
    className?: string;
}

export function AppBackground({ children, className }: AppBackgroundProps) {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#0f1219', '#020617']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            />
            <View className={`flex-1 ${className}`}>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
    }
});
