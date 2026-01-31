import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WelcomeHero } from '@/components/welcome-hero';
import { GetStartedCTA } from '@/components/get-started-cta';

export function WelcomeScreen() {
    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
            <View className="flex-1 items-center justify-center pb-24">
                <WelcomeHero />
                <GetStartedCTA />
            </View>
        </SafeAreaView>
    );
}
