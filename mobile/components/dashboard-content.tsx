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
    Easing
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, Zap, Globe, Settings, Menu, TrendingDown, TrendingUp, ChevronRight } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { NetworkActivityChart } from '@/components/network-activity-chart';
import { useConnection } from '@/lib/connection-context';

export function DashboardContent({ showChart = true }: { showChart?: boolean }) {
    const navigation = useNavigation<any>();
    const { isConnected, setIsConnected, selectedServer } = useConnection();
    const [isConnecting, setIsConnecting] = useState(false);
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

    // Triple rings
    const ring1 = useSharedValue(0);
    const ring2 = useSharedValue(0);
    const ring3 = useSharedValue(0);

    // --- Animation Logic ---

    // Sync color progress
    useEffect(() => {
        colorProgress.value = withTiming(isConnected ? 1 : 0, { duration: 500 });
    }, [isConnected]);

    // Idle Pulse
    useEffect(() => {
        if (!isConnected && !isConnecting) {
            idleScale.value = withRepeat(
                withTiming(1.02, { duration: 1500 }),
                -1,
                true
            );
        } else {
            idleScale.value = withTiming(1);
        }
    }, [isConnected, isConnecting]);

    // Ripple Logic
    useEffect(() => {
        if (isConnected || isConnecting) {
            // Start staggered ripples
            ring1.value = withRepeat(withTiming(1, { duration: 800 }), -1, false);
            ring2.value = withDelay(400, withRepeat(withTiming(1, { duration: 1200 }), -1, false));
            ring3.value = withDelay(800, withRepeat(withTiming(1, { duration: 1600 }), -1, false));
        } else {
            ring1.value = withTiming(0);
            ring2.value = withTiming(0);
            ring3.value = withTiming(0);
        }
    }, [isConnected, isConnecting]);

    // Connected Glow Logic
    useEffect(() => {
        if (isConnected) {
            glowValue.value = withRepeat(
                withTiming(1, { duration: 2000 }),
                -1,
                true
            );
        } else {
            glowValue.value = withTiming(0);
        }
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
    }, [isConnecting]);

    // --- Animated Styles ---
    const animatedButtonStyle = useAnimatedStyle(() => {
        const bgColor = interpolateColor(
            colorProgress.value,
            [0, 1],
            ['#09090b', '#84cc16']
        );
        const borderColor = interpolateColor(
            colorProgress.value,
            [0, 1],
            ['#27272a', '#84cc16']
        );

        return {
            backgroundColor: bgColor,
            borderColor: borderColor,
            transform: [
                { scale: buttonScale.value },
                { scale: idleScale.value }
            ],
            shadowColor: '#84cc16',
            shadowOpacity: interpolate(colorProgress.value, [0, 1], [0, 0.5]),
            shadowRadius: 20,
            elevation: interpolate(colorProgress.value, [0, 1], [0, 10]),
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

    const createRingStyle = (sharedValue: any) => {
        return useAnimatedStyle(() => ({
            transform: [{ scale: interpolate(sharedValue.value, [0, 1], [1, 1.8]) }],
            opacity: interpolate(sharedValue.value, [0, 0.5, 1], [0, 0.4, 0]),
        }));
    };

    const ring1Style = createRingStyle(ring1);
    const ring2Style = createRingStyle(ring2);
    const ring3Style = createRingStyle(ring3);

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

    const handleConnect = () => {
        // Trigger button overshoot
        buttonScale.value = withSequence(
            withSpring(1.1, { damping: 10, stiffness: 100 }),
            withSpring(1, { damping: 10, stiffness: 100 })
        );

        setIsConnecting(true);
        setTimeout(() => {
            setIsConnected(!isConnected);
            setIsConnecting(false);
        }, 1500);
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
                <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-xl overflow-hidden items-center justify-center">
                        <Image
                            source={require('../../assets/logo.png')}
                            className="w-full h-full"
                            resizeMode="contain"
                        />
                    </View>
                    <View>
                        <Text className="text-lg font-bold text-foreground">Karma VPN</Text>
                        <Text className="text-xs text-muted-foreground">Premium Active</Text>
                    </View>
                </View>
                <View className="flex-row items-center gap-2">
                    {/* Icons removed as per user request */}
                </View>
            </View>

            {/* Stats */}
            <View className="flex-row gap-3 mb-6">
                <View className="flex-1 rounded-2xl overflow-hidden border border-border/30">
                    <LinearGradient
                        colors={['#18181b', '#09090b']}
                        className="p-4 flex-1"
                    >
                        <View className="flex-row items-center justify-between mb-2">
                            <View className="flex-row items-center gap-2">
                                <View className="w-8 h-8 rounded-xl bg-[#5c9a3e]/10 items-center justify-center">
                                    <TrendingDown className="rotate-180" size={16} color="#5c9a3e" />
                                </View>
                                <Text className="text-xs text-muted-foreground font-medium">Download</Text>
                            </View>
                        </View>
                        <Text className="text-2xl font-bold text-foreground">
                            {downloadSpeed.toFixed(2)} <Text className="text-sm font-normal text-muted-foreground">Mb/s</Text>
                        </Text>
                    </LinearGradient>
                </View>

                <View className="flex-1 rounded-2xl overflow-hidden border border-border/30">
                    <LinearGradient
                        colors={['#18181b', '#09090b']}
                        className="p-4 flex-1"
                    >
                        <View className="flex-row items-center justify-between mb-2">
                            <View className="flex-row items-center gap-2">
                                <View className="w-8 h-8 rounded-xl bg-[#5c9a3e]/10 items-center justify-center">
                                    <TrendingUp size={16} color="#5c9a3e" />
                                </View>
                                <Text className="text-xs text-muted-foreground font-medium">Upload</Text>
                            </View>
                        </View>
                        <Text className="text-2xl font-bold text-foreground">
                            {uploadSpeed.toFixed(2)} <Text className="text-sm font-normal text-muted-foreground">Mb/s</Text>
                        </Text>
                    </LinearGradient>
                </View>
            </View>

            {/* Network Activity Chart */}
            {showChart && isConnected && (
                <View className="mb-6">
                    <NetworkActivityChart />
                </View>
            )}

            {/* IP Address */}
            <View className="mb-8 rounded-2xl overflow-hidden border border-border/30">
                <LinearGradient
                    colors={['#18181b', '#09090b']}
                    className="flex-row items-center justify-center gap-2 p-4"
                >
                    <Globe size={16} color="#7db366" />
                    <Text className="text-sm text-foreground font-medium">Your IP:</Text>
                    <Text className="text-sm text-muted-foreground font-mono">185.25.12.5</Text>
                    {isConnected && (
                        <View className="ml-2 px-2 py-0.5 rounded-full bg-primary/10">
                            <Text className="text-primary text-xs font-medium">Protected</Text>
                        </View>
                    )}
                </LinearGradient>
            </View>

            {/* Connection Button */}
            <View className="items-center justify-center mb-10">
                <View className="relative mb-6 items-center justify-center">
                    {/* Animated Connected Glow */}
                    {isConnected && (
                        <Animated.View
                            style={[
                                {
                                    position: 'absolute',
                                    width: 160,
                                    height: 160,
                                    borderRadius: 80,
                                    backgroundColor: '#5c9a3e',
                                },
                                glowStyle
                            ]}
                        />
                    )}

                    {/* Staggered Ripples */}
                    {(isConnected || isConnecting) && (
                        <>
                            <Animated.View
                                style={[
                                    {
                                        position: 'absolute',
                                        width: 144,
                                        height: 144,
                                        borderRadius: 72,
                                        backgroundColor: '#5c9a3e',
                                    },
                                    ring1Style
                                ]}
                            />
                            <Animated.View
                                style={[
                                    {
                                        position: 'absolute',
                                        width: 144,
                                        height: 144,
                                        borderRadius: 72,
                                        backgroundColor: '#5c9a3e',
                                    },
                                    ring2Style
                                ]}
                            />
                            <Animated.View
                                style={[
                                    {
                                        position: 'absolute',
                                        width: 144,
                                        height: 144,
                                        borderRadius: 72,
                                        backgroundColor: '#5c9a3e',
                                    },
                                    ring3Style
                                ]}
                            />
                        </>
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

                <View className="items-center">
                    <Text className={`text-sm font-medium mb-1 ${isConnected ? 'text-[#5c9a3e]' : 'text-muted-foreground'}`}>
                        {isConnecting ? 'Establishing...' : isConnected ? 'Connected' : 'Disconnected'}
                    </Text>
                    {isConnected && (
                        <Text className="text-3xl font-bold text-foreground font-mono tracking-tight">
                            {formatTime(connectionTime)}
                        </Text>
                    )}
                </View>
            </View>

            {/* Selected Server Selector */}
            <TouchableOpacity onPress={() => navigation.navigate('Servers')} activeOpacity={0.9}>
                <View className="w-full h-18 rounded-3xl overflow-hidden border border-border/30">
                    <LinearGradient
                        colors={['#18181b', '#09090b']}
                        className="flex-row items-center justify-between px-5 py-4 flex-1"
                    >
                        <View className="flex-row items-center gap-3">
                            <View className="w-12 h-12 rounded-full overflow-hidden bg-[#5c9a3e]/10 border border-border/20">
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
                        <View className="w-10 h-10 rounded-full bg-zinc-800 items-center justify-center">
                            <ChevronRight size={20} color="#7db366" />
                        </View>
                    </LinearGradient>
                </View>
            </TouchableOpacity>
        </ScrollView>
    );
}
