import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NetworkActivityChart } from '@/components/network-activity-chart';
import { GlassNavigationBar } from '@/components/glass-navigation-bar';
import { Activity, Gauge } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AppBackground } from '@/components/app-background';
import { useConnection } from '@/lib/connection-context';

export function StatsScreen() {
    const { isConnected } = useConnection();

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
                        <View className="flex-row items-center gap-3 mb-8">
                            <View className="w-10 h-10 rounded-xl overflow-hidden items-center justify-center">
                                <Image
                                    source={require('../../assets/logo.png')}
                                    className="w-full h-full"
                                    resizeMode="contain"
                                />
                            </View>
                            <View>
                                <Text className="text-xl font-bold text-foreground">Network Stats</Text>
                                <Text className="text-xs text-muted-foreground">Real-time monitoring</Text>
                            </View>
                        </View>

                        {isConnected ? (
                            <View className="mb-6">
                                <Text className="text-sm font-semibold text-muted-foreground mb-4 px-1 uppercase tracking-wider">Activity Overview</Text>
                                <NetworkActivityChart />
                            </View>
                        ) : (
                            <View className="mb-10 items-center justify-center p-8 rounded-3xl bg-zinc-900/40 border border-border/20">
                                <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center mb-4">
                                    <Activity size={20} color="#5c9a3e" />
                                </View>
                                <Text className="text-lg font-bold text-foreground mb-2 text-center">No Activity Recorded</Text>
                                <Text className="text-sm text-muted-foreground text-center line-height-20">Connect to the VPN to see your real-time network speeds and data usage.</Text>
                            </View>
                        )}

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
        </AppBackground>
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
