import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NetworkActivityChart } from '@/components/network-activity-chart';
import { GlassNavigationBar } from '@/components/glass-navigation-bar';
import { Activity, Gauge } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AppBackground } from '@/components/app-background';
import { useConnection } from '@/lib/connection-context';
import { useFocusEffect } from '@react-navigation/native';
import api from '@/lib/api';

export function StatsScreen() {
    const { isConnected } = useConnection();
    const [stats, setStats] = useState({
        totalConnections: 0,
        totalBytes: 0,
        totalDuration: 0 // minutes
    });

    useFocusEffect(
        useCallback(() => {
            api.get('/sessions/stats')
                .then(res => setStats(res.data))
                .catch(err => console.error('Failed to fetch stats:', err));
        }, [])
    );

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDuration = (minutes: number) => {
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hrs}h ${mins}m`;
    };

    return (
        <AppBackground className="flex-1">
            <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
                <Animated.View
                    className="flex-1"
                    entering={FadeIn.duration(500)}
                >
                    <ScrollView
                        className="flex-1 px-6 pt-4"
                        contentContainerStyle={{ paddingBottom: 140 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View className="flex-row items-center gap-3 mb-6 px-1">
                            <View className="w-10 h-10 rounded-xl bg-white/5 items-center justify-center border border-white/10">
                                <Activity size={20} color="#4ade80" />
                            </View>
                            <View>
                                <Text className="text-xl font-bold text-foreground">Usage Stats</Text>
                                <Text className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Historical Data</Text>
                            </View>
                        </View>

                        {/* Stats Card */}
                        <View className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden mb-6">
                            <StatRow label="Total Sessions" value={stats.totalConnections.toString()} icon={Gauge} />
                            <View className="h-[1px] bg-white/5 mx-4" />
                            <StatRow label="Total Duration" value={formatDuration(stats.totalDuration)} icon={Activity} />
                            <View className="h-[1px] bg-white/5 mx-4" />
                            <StatRow label="Data Usage" value={formatBytes(stats.totalBytes)} icon={Activity} isLast />
                        </View>

                        {isConnected ? (
                            <View className="mb-6">
                                <Text className="text-sm font-semibold text-muted-foreground mb-4 px-1 uppercase tracking-wider">Live Activity</Text>
                                <NetworkActivityChart />
                            </View>
                        ) : (
                            <View className="mb-10 items-center justify-center py-10 px-6 rounded-2xl bg-white/5 border border-white/10">
                                <View className="w-12 h-12 rounded-2xl bg-[#4ade80]/10 items-center justify-center mb-4">
                                    <Activity size={24} color="#4ade80" />
                                </View>
                                <Text className="text-lg font-bold text-foreground mb-1 text-center">No Live Activity</Text>
                                <Text className="text-sm text-muted-foreground text-center">Connect to VPN to see real-time chart.</Text>
                            </View>
                        )}
                    </ScrollView>
                </Animated.View>
            </SafeAreaView>
        </AppBackground>
    );
}

function StatRow({ label, value, icon: Icon, isLast }: { label: string, value: string, icon: any, isLast?: boolean }) {
    return (
        <View className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center gap-3">
                <View className="w-8 h-8 rounded-lg bg-white/5 items-center justify-center border border-white/10">
                    <Icon size={14} color="#4ade80" />
                </View>
                <Text className="text-muted-foreground font-medium">{label}</Text>
            </View>
            <Text className="text-foreground font-bold">{value}</Text>
        </View>
    );
}
