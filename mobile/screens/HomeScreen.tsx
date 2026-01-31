import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DashboardContent } from '@/components/dashboard-content';
import { GlassNavigationBar } from '@/components/glass-navigation-bar';


import Animated, { FadeIn } from 'react-native-reanimated';

export function HomeScreen() {
    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
            <Animated.View
                className="flex-1"
                entering={FadeIn.duration(500)}
            >
                <DashboardContent showChart={false} />
            </Animated.View>
            <GlassNavigationBar />
        </SafeAreaView>
    );
}
