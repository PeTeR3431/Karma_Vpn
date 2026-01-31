import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, Shield, Bell } from 'lucide-react-native';
import { GlassNavigationBar } from '@/components/glass-navigation-bar';
import Animated, { FadeIn } from 'react-native-reanimated';

export function ProfileScreen() {
    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
            <Animated.View
                className="flex-1"
                entering={FadeIn.duration(500)}
            >
                <View className="flex-1 px-6 pt-8">
                    <View className="items-center mb-8">
                        <View className="w-24 h-24 rounded-full bg-primary/20 items-center justify-center border border-primary/50 mb-4">
                            <User size={48} color="#84cc16" />
                        </View>
                        <Text className="text-2xl font-bold text-foreground">Karma User</Text>
                        <Text className="text-muted-foreground">Premium Member</Text>
                    </View>

                    <View className="gap-4">
                        <ProfileItem icon={Settings} label="Settings" />
                        <ProfileItem icon={Shield} label="Privacy Policy" />
                        <ProfileItem icon={Bell} label="Notifications" />
                    </View>
                </View>
            </Animated.View>
            <GlassNavigationBar />
        </SafeAreaView>
    );
}

function ProfileItem({ icon: Icon, label }: { icon: any, label: string }) {
    return (
        <View className="flex-row items-center gap-4 p-4 rounded-2xl bg-card border border-border/50">
            <Icon size={20} color="#a1a1aa" />
            <Text className="text-base font-medium text-foreground">{label}</Text>
        </View>
    );
}
