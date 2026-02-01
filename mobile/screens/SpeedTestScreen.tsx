import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AppBackground } from '@/components/app-background';
import { SpeedGauge } from '@/components/speed-gauge';
import { SpeedStatCard } from '@/components/speed-stat-card';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
    FadeIn,
    FadeInDown,
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    withSpring,
    Easing
} from 'react-native-reanimated';
import { GlassNavigationBar } from '@/components/glass-navigation-bar';
import { Zap, Play, Cpu } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export function SpeedTestScreen() {
    const navigation = useNavigation();
    const [isTesting, setIsTesting] = useState(false);
    const [testPhase, setTestPhase] = useState<'idle' | 'ping' | 'download' | 'upload' | 'complete'>('idle');
    const [currentSpeed, setCurrentSpeed] = useState(0);

    // Animation Shared Values
    const scanPos = useSharedValue(-100);
    const btnScale = useSharedValue(1);

    // Initialise scanline animation
    useEffect(() => {
        scanPos.value = withRepeat(
            withTiming(width, { duration: 3000, easing: Easing.linear }),
            -1,
            false
        );
    }, []);

    const animatedScanStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: scanPos.value }],
    }));

    const animatedBtnStyle = useAnimatedStyle(() => ({
        transform: [{ scale: btnScale.value }],
    }));

    // Cleanup refs
    const pingIntervalRef = useRef<any>(null);
    const downloadIntervalRef = useRef<any>(null);
    const uploadIntervalRef = useRef<any>(null);
    const timeoutRefs = useRef<any[]>([]);

    const [stats, setStats] = useState({
        ping: 0,
        download: 0,
        upload: 0
    });

    const [sparklines, setSparklines] = useState({
        ping: Array(12).fill(0),
        download: Array(20).fill(0),
        upload: Array(15).fill(0)
    });

    const clearAll = useCallback(() => {
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
        if (downloadIntervalRef.current) clearInterval(downloadIntervalRef.current);
        if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current);
        timeoutRefs.current.forEach(t => clearTimeout(t));
        timeoutRefs.current = [];
    }, []);

    useEffect(() => {
        return () => clearAll();
    }, [clearAll]);

    const runTest = useCallback(() => {
        if (isTesting) return;

        btnScale.value = withSequence(withSpring(0.95), withSpring(1));
        clearAll();
        setIsTesting(true);
        setTestPhase('ping');
        setCurrentSpeed(0);
        setStats({ ping: 0, download: 0, upload: 0 });
        setSparklines({
            ping: Array(12).fill(0),
            download: Array(20).fill(0),
            upload: Array(15).fill(0)
        });

        // Simulation Logic (2s -> 5s -> 4s)
        pingIntervalRef.current = setInterval(() => {
            const newVal = Math.floor(Math.random() * 8) + 14;
            setStats(prev => ({ ...prev, ping: newVal }));
            setSparklines(prev => ({ ...prev, ping: [...prev.ping.slice(1), newVal + Math.random() * 5] }));
        }, 150);

        const t1 = setTimeout(() => {
            if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
            setTestPhase('download');
            let dVal = 0;
            downloadIntervalRef.current = setInterval(() => {
                const target = 62.45;
                dVal = Math.min(target, dVal + (target / 30) + Math.random() * 4);
                setCurrentSpeed(dVal);
                setStats(prev => ({ ...prev, download: dVal }));
                setSparklines(prev => ({ ...prev, download: [...prev.download.slice(1), dVal + Math.random() * 6] }));
            }, 100);

            const t2 = setTimeout(() => {
                if (downloadIntervalRef.current) clearInterval(downloadIntervalRef.current);
                setTestPhase('upload');
                setCurrentSpeed(0);
                let uVal = 0;
                uploadIntervalRef.current = setInterval(() => {
                    const target = 14.20;
                    uVal = Math.min(target, uVal + (target / 25) + Math.random() * 2);
                    setCurrentSpeed(uVal);
                    setStats(prev => ({ ...prev, upload: uVal }));
                    setSparklines(prev => ({ ...prev, upload: [...prev.upload.slice(1), uVal + Math.random() * 3] }));
                }, 120);

                const t3 = setTimeout(() => {
                    if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current);
                    setTestPhase('complete');
                    setIsTesting(false);
                    setCurrentSpeed(0);
                }, 4000);
                timeoutRefs.current.push(t3);
            }, 5000);
            timeoutRefs.current.push(t2);
        }, 2000);
        timeoutRefs.current.push(t1);
    }, [isTesting, clearAll]);

    return (
        <AppBackground className="flex-1">
            <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
                <View className="px-6 py-4 flex-row items-center justify-between z-10">
                    <View className="flex-row items-center gap-3">
                        <View className="w-10 h-10 rounded-2xl bg-[#5c9a3e]/10 border border-[#5c9a3e]/20 items-center justify-center">
                            <Cpu size={20} color="#5c9a3e" />
                        </View>
                        <View>
                            <Text className="text-xl font-black text-foreground tracking-tighter uppercase">Speed Analysis</Text>
                            <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-[3px]">Kernel Optimization Active</Text>
                        </View>
                    </View>
                </View>

                <ScrollView
                    className="flex-1 px-6"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 180 }}
                >
                    {/* Gauge Section */}
                    <Animated.View entering={FadeIn.duration(800)} className="mt-8 mb-12 items-center">
                        <SpeedGauge value={currentSpeed} unit={testPhase === 'upload' ? 'mbps (up)' : 'mbps'} isTesting={isTesting} />
                    </Animated.View>

                    {/* Stats List */}
                    <View className="gap-2">
                        <Animated.View entering={FadeInDown.delay(200).duration(800)}>
                            <SpeedStatCard icon="Activity" label="D-Bus Latency" value={stats.ping.toString()} unit="ms" color="#A855F7" sparklineData={sparklines.ping} />
                        </Animated.View>
                        <Animated.View entering={FadeInDown.delay(400).duration(800)}>
                            <SpeedStatCard icon="ArrowDownCircle" label="Download Link" value={stats.download.toFixed(2).replace('.', ',')} unit="mbps" color="#5c9a3e" sparklineData={sparklines.download} />
                        </Animated.View>
                        <Animated.View entering={FadeInDown.delay(600).duration(800)}>
                            <SpeedStatCard icon="ArrowUpCircle" label="Upload Link" value={stats.upload.toFixed(2).replace('.', ',')} unit="mbps" color="#0ea5e9" sparklineData={sparklines.upload} />
                        </Animated.View>
                    </View>

                    {/* FUTURISTIC GLASS CAPSULE BUTTON */}
                    <Animated.View style={[animatedBtnStyle, { marginTop: 40 }]}>
                        <TouchableOpacity
                            onPress={runTest}
                            disabled={isTesting}
                            activeOpacity={0.9}
                            className="h-24 rounded-[40px] overflow-hidden border border-white/10"
                        >
                            <BlurView intensity={30} tint="dark" className="flex-1 justify-center">
                                {/* Moving Scanline */}
                                <Animated.View
                                    style={[
                                        animatedScanStyle,
                                        {
                                            position: 'absolute',
                                            top: 0, bottom: 0,
                                            width: 100,
                                            backgroundColor: 'rgba(92, 154, 62, 0.15)',
                                            filter: 'blur(20px)',
                                        }
                                    ]}
                                />

                                <View className="flex-row items-center justify-center px-10">
                                    {isTesting ? (
                                        <View className="flex-row items-center gap-4">
                                            <View className="w-1.5 h-1.5 rounded-full bg-[#5c9a3e] shadow-[#5c9a3e] shadow-lg animate-pulse" />
                                            <Text className="text-foreground font-black text-2xl tracking-tighter uppercase italic">
                                                Analyzing {testPhase}...
                                            </Text>
                                        </View>
                                    ) : (
                                        <View className="flex-row items-center gap-5">
                                            <View className="w-12 h-12 rounded-full bg-[#5c9a3e] items-center justify-center shadow-[#5c9a3e] shadow-2xl">
                                                <Play size={20} color="#000" fill="#000" />
                                            </View>
                                            <View>
                                                <Text className="text-foreground font-black text-2xl tracking-tight uppercase">Run Karma Scan</Text>
                                                <Text className="text-[10px] font-bold text-[#5c9a3e] uppercase tracking-[4px]">Initiate Neural Probe</Text>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            </BlurView>
                        </TouchableOpacity>

                        {/* External Glow Dot */}
                        {!isTesting && (
                            <View className="absolute -bottom-1 left-1/2 -ml-4 w-8 h-1 bg-[#5c9a3e]/40 rounded-full blur-[2px]" />
                        )}
                    </Animated.View>

                </ScrollView>
                <GlassNavigationBar />
            </SafeAreaView>
        </AppBackground>
    );
}
