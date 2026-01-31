import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NetworkActivityChart } from '@/components/network-activity-chart';
import { GlassNavigationBar } from '@/components/glass-navigation-bar';
import { Activity } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

export function StatsScreen() {
    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
            <Animated.View
                className="flex-1"
                entering={FadeIn.duration(500)}
            >
                <ScrollView
                    className="flex-1 px-6 pt-4"
                    contentContainerStyle={{ paddingBottom: 140 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex-row items-center gap-3 mb-8">
                        <View className="w-10 h-10 rounded-2xl bg-primary/20 items-center justify-center">
                            <Activity size={20} color="#84cc16" />
                        </View>
                        <View>
                            <Text className="text-xl font-bold text-foreground">Network Stats</Text>
                            <Text className="text-xs text-muted-foreground">Real-time monitoring</Text>
                        </View>
                    </View>

                    <View className="mb-6">
                        <Text className="text-sm font-semibold text-muted-foreground mb-4 px-1 uppercase tracking-wider">Activity Overview</Text>
                        <NetworkActivityChart />
                    </View>

                    {/* Additional Stats Placeholders */}
                    <View className="gap-4">
                        <StatRow label="Session Duration" value="02:14:35" />
                        <StatRow label="Data Usage" value="1.2 GB" />
                        <StatRow label="Avg. Latency" value="24ms" />
                    </View>
                </ScrollView>
            </Animated.View>
            <GlassNavigationBar />
        </SafeAreaView>
    );
}

function StatRow({ label, value }: { label: string, value: string }) {
    return (
        <View className="flex-row items-center justify-between p-4 rounded-2xl bg-card border border-border/50">
            <Text className="text-muted-foreground">{label}</Text>
            <Text className="text-foreground font-bold">{value}</Text>
        </View>
    );
}
