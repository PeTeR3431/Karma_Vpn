import React from 'react';
import { View, Text, Image } from 'react-native';

export function WelcomeHero() {
    return (
        <View className="items-center justify-center pt-8">
            {/* Logo with glow effect */}
            <View className="items-center justify-center mb-6 relative">
                {/* Outer glow ring */}
                <View
                    className="absolute rounded-full bg-[#4ade80]/10"
                    style={{ width: 160, height: 160 }}
                />

                {/* Main logo container */}
                <View className="flex h-32 w-32 items-center justify-center">
                    <Image
                        source={require('../../assets/logo.png')}
                        className="w-32 h-32"
                        resizeMode="contain"
                    />
                </View>

                {/* Accent dot */}
                <View className="absolute -bottom-1 h-2 w-8 rounded-full bg-[#4ade80]/40 opacity-50" />
            </View>

            {/* Brand Name */}
            <Text className="mb-4 text-4xl font-bold tracking-tight text-foreground text-center">
                <Text className="text-[#4ade80]">Karma</Text>
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
