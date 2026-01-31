import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DashboardContent } from '@/components/dashboard-content';
import { GlassNavigationBar } from '@/components/glass-navigation-bar';

export function DashboardScreen() {
    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
            <DashboardContent />
            <GlassNavigationBar />
        </SafeAreaView>
    );
}
