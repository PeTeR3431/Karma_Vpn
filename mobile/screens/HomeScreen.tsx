import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DashboardContent } from '@/components/dashboard-content';
import { GlassNavigationBar } from '@/components/glass-navigation-bar';
import { AppBackground } from '@/components/app-background';
import Animated, { FadeIn } from 'react-native-reanimated';

export function HomeScreen() {
    return (
        <AppBackground className="flex-1">
            <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
                <Animated.View
                    className="flex-1"
                    entering={FadeIn.duration(500)}
                >
                    <DashboardContent showChart={false} />
                </Animated.View>
                <GlassNavigationBar />
            </SafeAreaView>
        </AppBackground>
    );
}
