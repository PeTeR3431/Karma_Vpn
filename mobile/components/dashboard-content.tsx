import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSpring,
    withSequence,
    withDelay,
    interpolate
} from 'react-native-reanimated';
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

    // Triple rings
    const ring1 = useSharedValue(0);
    const ring2 = useSharedValue(0);
    const ring3 = useSharedValue(0);

    // --- Animation Logic ---

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
            iconRotation.value = withRepeat(
                withTiming(360, { duration: 800 }),
                -1,
                false
            );
            iconScale.value = withRepeat(
                withSequence(withTiming(1.2, { duration: 400 }), withTiming(1, { duration: 400 })),
                -1,
                true
            );
        } else {
            iconRotation.value = withTiming(0);
            iconScale.value = withTiming(1, { duration: 300 });
        }
    }, [isConnecting]);

    // --- Animated Styles ---
    const animatedButtonStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: buttonScale.value },
            { scale: idleScale.value }
        ],
    }));

    const animatedIconStyle = useAnimatedStyle(() => ({
        transform: [
            { rotate: `${iconRotation.value}deg` },
            { scale: iconScale.value }
        ],
    }));

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

    return (
        <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 140 }}
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View className="flex-row items-center justify-between mb-6">
                <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-2xl bg-primary/20 items-center justify-center">
                        <Shield size={20} color="#84cc16" />
                    </View>
                    <View>
                        <Text className="text-lg font-bold text-foreground">Karma VPN</Text>
                        <Text className="text-xs text-muted-foreground">Premium Active</Text>
                    </View>
                </View>
                <View className="flex-row items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                        <Settings size={20} color="white" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                        <Menu size={20} color="white" />
                    </Button>
                </View>
            </View>

            {/* Stats */}
            <View className="flex-row gap-3 mb-6">
                <View className="flex-1 rounded-2xl bg-card p-4 border border-border/50">
                    <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center gap-2">
                            <View className="w-8 h-8 rounded-xl bg-primary/10 items-center justify-center">
                                <TrendingDown className="rotate-180" size={16} color="#84cc16" />
                            </View>
                            <Text className="text-xs text-muted-foreground font-medium">Download</Text>
                        </View>
                    </View>
                    <Text className="text-2xl font-bold text-foreground">
                        {downloadSpeed.toFixed(2)} <Text className="text-sm font-normal text-muted-foreground">Mb/s</Text>
                    </Text>
                </View>
                <View className="flex-1 rounded-2xl bg-card p-4 border border-border/50">
                    <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center gap-2">
                            <View className="w-8 h-8 rounded-xl bg-primary/10 items-center justify-center">
                                <TrendingUp size={16} color="#84cc16" />
                            </View>
                            <Text className="text-xs text-muted-foreground font-medium">Upload</Text>
                        </View>
                    </View>
                    <Text className="text-2xl font-bold text-foreground">
                        {uploadSpeed.toFixed(2)} <Text className="text-sm font-normal text-muted-foreground">Mb/s</Text>
                    </Text>
                </View>
            </View>

            {/* Network Activity Chart */}
            {showChart && (
                <View className="mb-6">
                    <NetworkActivityChart />
                </View>
            )}

            {/* IP Address */}
            <View className="flex-row items-center justify-center gap-2 mb-8 p-4 rounded-2xl bg-card border border-border/50">
                <Globe size={16} color="#84cc16" />
                <Text className="text-sm text-foreground font-medium">Your IP:</Text>
                <Text className="text-sm text-muted-foreground font-mono">185.25.12.5</Text>
                {isConnected && (
                    <View className="ml-2 px-2 py-0.5 rounded-full bg-primary/10">
                        <Text className="text-primary text-xs font-medium">Protected</Text>
                    </View>
                )}
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
                                    backgroundColor: '#84cc16',
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
                                        backgroundColor: '#84cc16',
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
                                        backgroundColor: '#84cc16',
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
                                        backgroundColor: '#84cc16',
                                    },
                                    ring3Style
                                ]}
                            />
                        </>
                    )}

                    <Animated.View style={animatedButtonStyle}>
                        <TouchableOpacity
                            onPress={handleConnect}
                            disabled={isConnecting}
                            activeOpacity={0.9}
                            style={{
                                width: 144,
                                height: 144,
                                borderRadius: 72,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 4,
                                borderColor: isConnected ? '#84cc16' : '#27272a',
                                backgroundColor: isConnected ? '#84cc16' : '#09090b',
                                shadowColor: isConnected ? '#84cc16' : '#000',
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: isConnected ? 0.5 : 0,
                                shadowRadius: 20,
                                elevation: isConnected ? 10 : 0,
                            }}
                        >
                            <Animated.View style={animatedIconStyle}>
                                <Zap
                                    size={56}
                                    color={isConnected ? 'white' : '#71717a'}
                                    fill={isConnected ? 'white' : 'transparent'}
                                />
                            </Animated.View>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                <View className="items-center">
                    <Text className={`text-sm font-medium mb-1 ${isConnected ? 'text-primary' : 'text-muted-foreground'}`}>
                        {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Disconnected'}
                    </Text>
                    {isConnected && (
                        <Text className="text-3xl font-bold text-foreground font-mono tracking-tight">
                            {formatTime(connectionTime)}
                        </Text>
                    )}
                </View>
            </View>

            {/* Selected Server */}
            <TouchableOpacity onPress={() => navigation.navigate('Servers')}>
                <View className="w-full h-18 rounded-2xl bg-card flex-row items-center justify-between px-4 py-4 border border-border/50">
                    <View className="flex-row items-center gap-3">
                        <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center border border-border/50">
                            <Text className="text-2xl">{selectedServer.flag}</Text>
                        </View>
                        <View>
                            <Text className="font-semibold text-foreground">{selectedServer.name}</Text>
                            <Text className="text-xs text-muted-foreground">Tap to change server</Text>
                        </View>
                    </View>
                    <View className="flex-row items-center gap-2">
                        <View className="flex-row gap-0.5 items-end h-5">
                            {[...Array(5)].map((_, i) => (
                                <View
                                    key={i}
                                    className={`w-1 rounded-full ${i < selectedServer.signal ? 'bg-primary' : 'bg-muted'}`}
                                    style={{ height: (i + 1) * 3 + 3 }}
                                />
                            ))}
                        </View>
                        <ChevronRight size={20} color="white" />
                    </View>
                </View>
            </TouchableOpacity>
        </ScrollView>
    );
}
