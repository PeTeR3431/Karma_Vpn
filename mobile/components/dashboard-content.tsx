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
    FadeInDown,
    Easing
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, ChevronRight, ArrowDown, ArrowUp, Globe } from 'lucide-react-native';
import { NetworkActivityChart } from '@/components/network-activity-chart';
import { useConnection } from '@/lib/connection-context';
import { GradientText } from './gradient-text';

export function DashboardContent({ showChart = true }: { showChart?: boolean }) {
    const navigation = useNavigation<any>();
    const { isConnected, selectedServer, connect, disconnect, isConnecting, hasUserSelected } = useConnection();
    const [connectionTime, setConnectionTime] = useState(0);
    const [downloadSpeed] = useState(10.55);
    const [uploadSpeed] = useState(6.30);

    // --- Shared Values for Animations ---
    const buttonScale = useSharedValue(1);
    const iconRotation = useSharedValue(0);
    const iconScale = useSharedValue(1);

    // Connection Sequence Logic
    useEffect(() => {
        if (isConnecting) {
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
            iconRotation.value = withTiming(0, { duration: 500 });
            iconScale.value = withTiming(1, { duration: 300 });
        }
    }, [isConnecting]);

    // --- Animated Styles ---
    const animatedButtonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }],
    }));

    const animatedIconStyle = useAnimatedStyle(() => ({
        transform: [
            { rotate: `${iconRotation.value}deg` },
            { scale: iconScale.value }
        ],
    }));

    // Timer Logic
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
        buttonScale.value = withSequence(
            withSpring(1.1, { damping: 10, stiffness: 100 }),
            withSpring(1, { damping: 10, stiffness: 100 })
        );

        if (!hasUserSelected) {
            navigation.navigate('Servers');
            return;
        }

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
        return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <ScrollView
            className="flex-1"
            contentContainerStyle={{
                paddingHorizontal: 24,
                paddingTop: 20,
                paddingBottom: 40,
                flexGrow: 1
            }}
            showsVerticalScrollIndicator={false}
        >
            <View className="flex-1 justify-between">
                {/* Minimalist Header - Now at the Top */}
                <View className="items-center justify-center pt-10">
                    <GradientText
                        colors={['#ffffff', '#60a5fa']}
                        style={{ fontSize: 24, fontWeight: '900', letterSpacing: -0.5 }}
                    >
                        KARMA VPN
                    </GradientText>
                </View>

                {/* Central Functional Core */}
                <View className="items-center justify-center py-10">
                    {/* Connection Button - Focal Point */}
                    <View className="items-center justify-center mb-10">
                        <TouchableOpacity
                            onPress={handleConnect}
                            disabled={isConnecting}
                            activeOpacity={0.8}
                        >
                            <Animated.View style={animatedButtonStyle}>
                                <LinearGradient
                                    colors={isConnected ? ['#3b82f6', '#2563eb'] : ['#1e293b', '#0f172a']}
                                    style={{
                                        width: 140,
                                        height: 140,
                                        borderRadius: 70,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderWidth: 1,
                                        borderColor: isConnected ? '#60a5fa' : '#334155',
                                    }}
                                >
                                    <Animated.View style={animatedIconStyle}>
                                        <Image
                                            source={require('../../assets/stealth-icon.png')}
                                            style={{
                                                width: 150,
                                                height: 150,
                                                tintColor: isConnected ? 'white' : '#94a3b8'
                                            }}
                                            resizeMode="contain"
                                        />
                                    </Animated.View>
                                </LinearGradient>
                            </Animated.View>
                        </TouchableOpacity>
                    </View>

                    {/* Server Selector - Now below Connection Button */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Servers')}
                        style={{ width: '100%' }}
                        className="bg-white/5 border border-white/10 rounded-3xl p-4 flex-row items-center justify-between mb-10"
                    >
                        <View className="flex-row items-center gap-4">
                            <View className="w-12 h-12 rounded-full overflow-hidden bg-white/10 items-center justify-center">
                                {hasUserSelected && selectedServer?.flagUrl ? (
                                    <Image
                                        source={{ uri: selectedServer.flagUrl }}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View className="bg-blue-500/20 p-2 rounded-full">
                                        <Globe size={20} color="#60a5fa" />
                                    </View>
                                )}
                            </View>
                            <View>
                                <Text className="text-white font-bold text-base">
                                    {hasUserSelected ? selectedServer?.name : "Select Server"}
                                </Text>
                                <Text className="text-[10px] text-zinc-500 font-bold uppercase">
                                    {hasUserSelected ? "Change Server" : "Required to connect"}
                                </Text>
                            </View>
                        </View>
                        <ChevronRight size={20} color="#64748b" />
                    </TouchableOpacity>

                    {/* Connection Timer */}
                    {isConnected && (
                        <View className="items-center mb-10">
                            <View className="flex-row items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20">
                                <Clock size={16} color="#60a5fa" />
                                <Text className="text-lg font-bold text-blue-400 mono">{formatTime(connectionTime)}</Text>
                            </View>
                        </View>
                    )}

                    {/* Simple Stats Cards - Shown only when connected */}
                    {isConnected && (
                        <Animated.View entering={FadeInDown.duration(800)} className="flex-row gap-4">
                            <View className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-5">
                                <View className="flex-row items-center gap-2 mb-2">
                                    <ArrowDown size={14} color="#60a5fa" />
                                    <Text className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Download</Text>
                                </View>
                                <Text className="text-2xl font-black text-white">{downloadSpeed.toFixed(2)} <Text className="text-xs text-zinc-500 font-normal">Mb/s</Text></Text>
                            </View>
                            <View className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-5">
                                <View className="flex-row items-center gap-2 mb-2">
                                    <ArrowUp size={14} color="#a855f7" />
                                    <Text className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Upload</Text>
                                </View>
                                <Text className="text-2xl font-black text-white">{uploadSpeed.toFixed(2)} <Text className="text-xs text-zinc-500 font-normal">Mb/s</Text></Text>
                            </View>
                        </Animated.View>
                    )}
                </View>

                {/* Footer Section */}
                <View>
                    {showChart && isConnected && (
                        <View className="mb-8">
                            <NetworkActivityChart />
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );
}
