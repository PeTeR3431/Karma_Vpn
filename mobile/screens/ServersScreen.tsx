import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ServersContent } from '@/components/servers-content';

export function ServersScreen() {
    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
            <ServersContent />
        </SafeAreaView>
    );
}
