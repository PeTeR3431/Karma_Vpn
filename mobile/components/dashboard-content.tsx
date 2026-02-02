import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSpring,
    withSequence,
    withDelay,
    interpolate,
    interpolateColor,
    FadeIn,
    Easing
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, Zap, Globe, Clock, Settings, Menu, TrendingDown, TrendingUp, ChevronRight } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { NetworkActivityChart } from '@/components/network-activity-chart';
import { useConnection } from '@/lib/connection-context';

export function DashboardContent({ showChart = true }: { showChart?: boolean }) {
    const navigation = useNavigation<any>();
    const { isConnected, selectedServer, connect, disconnect, isConnecting } = useConnection();
    const [connectionTime, setConnectionTime] = useState(0);
    const [downloadSpeed, setDownloadSpeed] = useState(10.55);
    const [uploadSpeed, setUploadSpeed] = useState(6.30);

    // --- Shared Values for Animations ---
    const buttonScale = useSharedValue(1);
    const iconRotation = useSharedValue(0);
    const iconScale = useSharedValue(1);
    const glowValue = useSharedValue(0);
    const idleScale = useSharedValue(1);
    const colorProgress = useSharedValue(isConnected ? 1 : 0);

    // --- Animation Logic ---

    // Sync color progress
    useEffect(() => {
        colorProgress.value = withTiming(isConnected ? 1 : 0, { duration: 500 });
    }, [isConnected]);

    // No pulse scale
    useEffect(() => {
        idleScale.value = withTiming(1);
    }, [isConnected, isConnecting]);

    // No ripples

    // No glow pulse
    useEffect(() => {
        glowValue.value = isConnected ? 1 : 0;
    }, [isConnected]);

    // Connection Sequence Logic
    useEffect(() => {
        if (isConnecting) {
            // Reset rotation and start linear spin
            iconRotation.value = 0;
            iconRotation.value = withRepeat(
                withTiming(360, { duration: 800, easing: Easing.linear }),
                -1,
                false
            );
            iconScale.value = withRepeat(
                withSequence(withTiming(1.2, { duration: 400 }), withTiming(1, { duration: 400 })),
                -1,
                true
            );
        } else {
            // Final "Success Pop" if we just connected
            if (isConnected) {
                iconScale.value = withSequence(
                    withSpring(1.4, { damping: 10, stiffness: 100 }),
                    withSpring(1, { damping: 10, stiffness: 100 })
                );
            } else {
                iconScale.value = withTiming(1, { duration: 300 });
            }
            // Stop rotation smoothly
            iconRotation.value = withTiming(Math.round(iconRotation.value / 360) * 360, { duration: 500 });
        }
    }, [isConnecting, isConnected]); // Added isConnected dependency

    // --- Animated Styles ---
    const animatedButtonStyle = useAnimatedStyle(() => {
        const bgColor = interpolateColor(
            colorProgress.value,
            [0, 1],
            ['#09090b', '#22c55e'] // Using a slightly more vibrant green
        );
        const borderColor = interpolateColor(
            colorProgress.value,
            [0, 1],
            ['#27272a', '#4ade80'] // Brighter border for glow
        );

        // Steady glow effect when connected
        const shadowRadius = isConnected ? 25 : interpolate(colorProgress.value, [0, 1], [0, 15]);

        return {
            backgroundColor: bgColor,
            borderColor: borderColor,
            transform: [
                { scale: buttonScale.value },
                { scale: idleScale.value }
            ],
            shadowColor: '#22c55e',
            shadowOpacity: interpolate(colorProgress.value, [0, 1], [0, 1]),
            shadowRadius: shadowRadius,
            elevation: interpolate(colorProgress.value, [0, 1], [0, 20]),
        };
    });

    const animatedIconStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { rotate: `${iconRotation.value}deg` },
                { scale: iconScale.value }
            ],
        };
    });

    const glowStyle = useAnimatedStyle(() => ({
        opacity: interpolate(glowValue.value, [0, 1], [0, 0.6]),
        transform: [{ scale: interpolate(glowValue.value, [0, 1], [1, 1.1]) }],
    }));

    // Timer for connection duration
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isConnected) {
            interval = setInterval(() => {
                setConnectionTime(prev => prev + 1);
            }, 1000);
        } else {
            setConnectionTime(0);
        }
        return () => clearInterval(interval);
    }, [isConnected]);

    const handleConnect = async () => {
        // Trigger button overshoot
        buttonScale.value = withSequence(
            withSpring(1.1, { damping: 10, stiffness: 100 }),
            withSpring(1, { damping: 10, stiffness: 100 })
        );

        if (isConnected) {
            await disconnect();
        } else {
            await connect();
        }
    };

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hrs).padStart(2, '0')} : ${String(mins).padStart(2, '0')} : ${String(secs).padStart(2, '0')}`;
    };

    // Helper for Zap color
    const zapColor = isConnected ? 'white' : '#71717a';

    return (
        <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 140 }}
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View className="flex-row items-center justify-between mb-6">
                <View className="flex-row items-center gap-4">
                    <View className="w-12 h-12 rounded-xl overflow-hidden items-center justify-center">
                        <Image
                            source={require('../../assets/logo.png')}
                            className="w-full h-full"
                            resizeMode="contain"
                        />
                    </View>
                    <View>
                        <Text className="text-xl font-bold text-foreground">Karma VPN</Text>
                    </View>
                </View>
                <View className="flex-row items-center gap-2">
                    {/* Icons removed as per user request */}
                </View>
            </View>

            {/* Stats */}
            <View className="flex-row gap-3 mb-6">
                <View className="flex-1 rounded-2xl overflow-hidden border border-white/10 bg-white/5 p-4">
                    <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center gap-2">
                            <View className="w-8 h-8 rounded-xl bg-[#4ade80]/10 items-center justify-center">
                                <TrendingDown className="rotate-180" size={16} color="#4ade80" />
                            </View>
                            <Text className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Download</Text>
                        </View>
                    </View>
                    <Text className="text-2xl font-bold text-foreground">
                        {downloadSpeed.toFixed(2)} <Text className="text-xs font-normal text-muted-foreground">Mb/s</Text>
                    </Text>
                </View>

                <View className="flex-1 rounded-2xl overflow-hidden border border-white/10 bg-white/5 p-4">
                    <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center gap-2">
                            <View className="w-8 h-8 rounded-xl bg-[#4ade80]/10 items-center justify-center">
                                <TrendingUp size={16} color="#4ade80" />
                            </View>
                            <Text className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Upload</Text>
                        </View>
                    </View>
                    <Text className="text-2xl font-bold text-foreground">
                        {uploadSpeed.toFixed(2)} <Text className="text-xs font-normal text-muted-foreground">Mb/s</Text>
                    </Text>
                </View>
            </View>

            {/* Network Activity Chart */}
            {showChart && isConnected && (
                <View className="mb-6">
                    <NetworkActivityChart />
                </View>
            )}

            {/* IP Address */}
            <View className="mb-8 self-center rounded-full border border-white/10 bg-white/5 flex-row items-center justify-center gap-2 px-6 py-2">
                <Globe size={14} color="#4ade80" />
                <Text className="text-sm text-foreground font-medium">Your IP:</Text>
                <Text className="text-sm text-muted-foreground font-mono">185.25.12.5</Text>
                {isConnected && (
                    <View className="ml-1 px-2 py-0.5 rounded-full bg-[#4ade80]/10 border border-[#4ade80]/20 items-center justify-center">
                        <Text className="text-[#4ade80] text-[9px] font-bold uppercase tracking-wider">Protected</Text>
                    </View>
                )}
            </View>

            {/* Connection Button */}
            <View className="items-center justify-center mb-12">
                <View className="relative items-center justify-center">
                    {/* Steady Glow background */}
                    {isConnected && (
                        <Animated.View
                            style={[
                                {
                                    position: 'absolute',
                                    width: 160,
                                    height: 160,
                                    borderRadius: 80,
                                    backgroundColor: '#22c55e', // Match new green
                                },
                                glowStyle
                            ]}
                        />
                    )}

                    <TouchableOpacity
                        onPress={handleConnect}
                        disabled={isConnecting}
                        activeOpacity={0.9}
                    >
                        <Animated.View
                            style={[
                                {
                                    width: 144,
                                    height: 144,
                                    borderRadius: 72,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderWidth: 4,
                                },
                                animatedButtonStyle
                            ]}
                        >
                            <Animated.View style={animatedIconStyle}>
                                <Zap
                                    size={56}
                                    color={zapColor}
                                    fill={isConnected ? 'white' : 'transparent'}
                                />
                            </Animated.View>
                        </Animated.View>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Connection Time / Timer */}
            {isConnected && (
                <Animated.View
                    entering={FadeIn.duration(600)}
                    className="mb-8 self-center rounded-full border border-white/10 bg-white/5 flex-row items-center justify-center gap-4 px-6 py-2"
                >
                    <View className="flex-row items-center gap-1.5">
                        <Clock size={14} color="#4ade80" />
                        <View className="flex-row items-center gap-1">
                            <Text className="text-lg font-bold text-foreground">
                                {String(Math.floor(connectionTime / 3600)).padStart(2, '0')}
                            </Text>
                            <Text className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest">H</Text>
                        </View>
                    </View>

                    <Text className="text-base font-bold text-muted-foreground/20" style={{ marginTop: -2 }}>:</Text>

                    <View className="flex-row items-center gap-1">
                        <Text className="text-lg font-bold text-foreground">
                            {String(Math.floor((connectionTime % 3600) / 60)).padStart(2, '0')}
                        </Text>
                        <Text className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest">M</Text>
                    </View>

                    <Text className="text-base font-bold text-muted-foreground/20" style={{ marginTop: -2 }}>:</Text>

                    <View className="flex-row items-center gap-1">
                        <Text className="text-lg font-bold text-[#4ade80]">
                            {String(connectionTime % 60).padStart(2, '0')}
                        </Text>
                        <Text className="text-[8px] text-[#4ade80] uppercase font-bold tracking-widest">S</Text>
                    </View>
                </Animated.View>
            )}

            {/* Selected Server Selector */}
            <TouchableOpacity onPress={() => navigation.navigate('Servers')} activeOpacity={0.9}>
                <View className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 p-4 flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                        <View className="w-12 h-12 rounded-full overflow-hidden bg-white/5 border border-white/10">
                            <Image
                                source={{ uri: selectedServer.flagUrl }}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                        </View>
                        <View>
                            <Text className="font-bold text-foreground text-base">{selectedServer.name}</Text>
                            <Text className="text-xs text-muted-foreground">Tap to change server</Text>
                        </View>
                    </View>
                    <View className="w-10 h-10 rounded-full bg-white/5 items-center justify-center border border-white/10">
                        <ChevronRight size={20} color="#4ade80" />
                    </View>
                </View>
            </TouchableOpacity>
        </ScrollView>
    );
}
