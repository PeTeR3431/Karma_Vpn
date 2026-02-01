import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ServersContent } from '@/components/servers-content';
import { AppBackground } from '@/components/app-background';

export function ServersScreen() {
    return (
        <AppBackground className="flex-1">
            <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
                <ServersContent />
            </SafeAreaView>
        </AppBackground>
    );
}
