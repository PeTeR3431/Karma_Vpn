import React from 'react';
import { View, Text } from 'react-native';
import { Shield } from 'lucide-react-native';

export function WelcomeHero() {
    return (
        <View className="items-center justify-center pt-8">
            {/* Logo with glow effect */}
            <View className="items-center justify-center mb-10 relative">
                {/* Outer glow ring - simulated with view opacity */}
                <View className="absolute inset-0 rounded-full bg-primary/20 scale-150 opacity-50" style={{ width: 150, height: 150 }} />

                {/* Main logo container */}
                <View className="flex h-32 w-32 items-center justify-center rounded-[32px] bg-secondary border border-border/50 overflow-hidden">
                    {/* Gradient Background would go here, simplified to bg-secondary for now */}
                    <View className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/50">
                        <Shield className="text-primary-foreground" size={40} strokeWidth={2.5} color="white" />
                    </View>
                </View>

                {/* Accent dot */}
                <View className="absolute -bottom-1 h-2 w-8 rounded-full bg-primary/60 opacity-50" />
            </View>

            {/* Brand Name */}
            <Text className="mb-4 text-4xl font-bold tracking-tight text-foreground text-center">
                <Text className="text-primary">Karma</Text>
                {"\n"}
                <Text className="ml-2 text-muted-foreground font-normal text-3xl">VPN</Text>
            </Text>

            {/* Tagline */}
            <Text className="text-muted-foreground leading-relaxed text-center px-8">
                Access faster internet securely across more than 90+ global locations.
            </Text>
        </View>
    );
}
