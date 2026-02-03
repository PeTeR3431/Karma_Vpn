import React from 'react';
import { View, Text, Image } from 'react-native';

export function WelcomeHero() {
    return (
        <View className="items-center justify-center pt-8">
            {/* Logo with glow effect */}
            <View className="items-center justify-center mb-2 relative">
                {/* Outer glow ring */}
                <View
                    className="absolute rounded-full bg-[#60a5fa]/10"
                    style={{ width: 230, height: 230 }}
                />

                {/* Main logo container */}
                <View className="flex h-45 w-45 items-center justify-center">
                    <Image
                        source={require('../../assets/logo.png')}
                        className="w-45 h-45"
                        resizeMode="contain"
                    />
                </View>

                {/* Accent dot */}
                <View className="absolute -bottom-1 h-2 w-8 rounded-full bg-[#60a5fa]/40 opacity-50" />
            </View>

            {/* Brand Name */}
            <Text className="mb-4 text-4xl font-bold tracking-tight text-foreground text-center">
                <Text className="text-[#60a5fa]">Karma</Text>
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
