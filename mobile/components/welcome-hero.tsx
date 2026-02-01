import React from 'react';
import { View, Text, Image } from 'react-native';

export function WelcomeHero() {
    return (
        <View className="items-center justify-center pt-8">
            {/* Logo with glow effect */}
            <View className="items-center justify-center mb-10 relative">
                {/* Outer glow ring */}
                <View
                    className="absolute inset-0 rounded-full bg-[#5c9a3e]/20 scale-150 opacity-40"
                    style={{ width: 150, height: 150 }}
                />

                {/* Main logo container */}
                <View className="flex h-32 w-32 items-center justify-center rounded-[32px] bg-secondary border border-border/50 overflow-hidden shadow-2xl">
                    <Image
                        source={require('../../assets/logo.png')}
                        className="w-24 h-24"
                        resizeMode="contain"
                    />
                </View>

                {/* Accent dot */}
                <View className="absolute -bottom-1 h-2 w-8 rounded-full bg-[#5c9a3e]/60 opacity-50" />
            </View>

            {/* Brand Name */}
            <Text className="mb-4 text-4xl font-bold tracking-tight text-foreground text-center">
                <Text className="text-[#5c9a3e]">Karma</Text>
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
