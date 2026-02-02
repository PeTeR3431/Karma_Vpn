import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
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
import { Zap, Play, Activity } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export function SpeedTestScreen() {
    const navigation = useNavigation();
    const [hasStarted, setHasStarted] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [testPhase, setTestPhase] = useState<'idle' | 'ping' | 'download' | 'upload' | 'complete'>('idle');
    const [currentSpeed, setCurrentSpeed] = useState(0);

    // Cleanup refs
    const pingIntervalRef = useRef<any>(null);
    const downloadIntervalRef = useRef<any>(null);
    const uploadIntervalRef = useRef<any>(null);
    const timeoutRefs = useRef<any[]>([]);

    const [stats, setStats] = useState({ ping: 0, download: 0, upload: 0 });
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
        clearAll();
        setIsTesting(true);
        setTestPhase('ping');
        setCurrentSpeed(0);
        setStats({ ping: 0, download: 0, upload: 0 });

        pingIntervalRef.current = setInterval(() => {
            const newVal = Math.floor(Math.random() * 8) + 12;
            setStats(prev => ({ ...prev, ping: newVal }));
            setSparklines(prev => ({ ...prev, ping: [...prev.ping.slice(1), newVal + Math.random() * 5] }));
        }, 150);

        const t1 = setTimeout(() => {
            if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
            setTestPhase('download');
            let dVal = 0;
            downloadIntervalRef.current = setInterval(() => {
                const target = 54.80;
                dVal = Math.min(target, dVal + (target / 30) + Math.random() * 3);
                setCurrentSpeed(dVal);
                setStats(prev => ({ ...prev, download: dVal }));
                setSparklines(prev => ({ ...prev, download: [...prev.download.slice(1), dVal + Math.random() * 5] }));
            }, 100);

            const t2 = setTimeout(() => {
                if (downloadIntervalRef.current) clearInterval(downloadIntervalRef.current);
                setTestPhase('upload');
                setCurrentSpeed(0);
                let uVal = 0;
                uploadIntervalRef.current = setInterval(() => {
                    const target = 18.20;
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

    const handleInitialStart = () => {
        setHasStarted(true);
        setTimeout(() => runTest(), 200);
    };

    return (
        <AppBackground className="flex-1">
            <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
                {!hasStarted ? (
                    <View style={styles.centerContainer}>
                        <Animated.View entering={FadeInDown.duration(800)} style={styles.contentWrapper}>
                            <View className="w-20 h-20 rounded-3xl bg-white/5 items-center justify-center mb-6 border border-white/10">
                                <Zap size={32} color="#4ade80" fill="#4ade80" />
                            </View>
                            <Text style={styles.title}>Speed Test</Text>
                            <Text style={styles.subtitle}>Check your connection speed and latency instantly.</Text>

                            <TouchableOpacity
                                onPress={handleInitialStart}
                                style={styles.mainButton}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['#4ade80', '#22c55e']}
                                    style={styles.gradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <Text style={styles.buttonText}>Start Test</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                ) : (
                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        <Animated.View entering={FadeIn.duration(600)} style={styles.gaugeWrapper}>
                            <SpeedGauge value={currentSpeed} unit="mbps" isTesting={isTesting} />
                        </Animated.View>

                        <View style={styles.statsList}>
                            <Animated.View entering={FadeInDown.delay(100)}>
                                <SpeedStatCard icon="Activity" label="Ping" value={stats.ping.toString()} unit="ms" color="#A855F7" sparklineData={sparklines.ping} />
                            </Animated.View>
                            <Animated.View entering={FadeInDown.delay(200)}>
                                <SpeedStatCard icon="ArrowDownCircle" label="Download" value={stats.download.toFixed(1)} unit="mbps" color="#4ade80" sparklineData={sparklines.download} />
                            </Animated.View>
                            <Animated.View entering={FadeInDown.delay(300)}>
                                <SpeedStatCard icon="ArrowUpCircle" label="Upload" value={stats.upload.toFixed(1)} unit="mbps" color="#38bdf8" sparklineData={sparklines.upload} />
                            </Animated.View>
                        </View>

                        <Animated.View entering={FadeInDown.delay(400)} style={styles.actionWrapper}>
                            <TouchableOpacity
                                onPress={runTest}
                                disabled={isTesting}
                                activeOpacity={0.8}
                                style={styles.restartButton}
                            >
                                <BlurView intensity={10} tint="dark" style={styles.blurButton}>
                                    <View style={styles.buttonInner}>
                                        {isTesting ? (
                                            <View style={styles.testingContainer}>
                                                <Activity size={16} color="#4ade80" />
                                                <Text style={styles.testingText}>{testPhase}...</Text>
                                            </View>
                                        ) : (
                                            <Text style={styles.testingText}>Restart Test</Text>
                                        )}
                                    </View>
                                </BlurView>
                            </TouchableOpacity>
                        </Animated.View>
                    </ScrollView>
                )}
            </SafeAreaView>
        </AppBackground>
    );
}

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    contentWrapper: {
        alignItems: 'center',
        width: '100%',
    },
    zapContainer: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: '#18181b',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#71717a',
        textAlign: 'center',
        marginBottom: 40,
        paddingHorizontal: 24,
    },
    mainButton: {
        width: 240,
        height: 56,
        borderRadius: 16,
        overflow: 'hidden',
    },
    gradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: 16,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 24,
    },
    scrollContent: {
        paddingBottom: 160,
    },
    gaugeWrapper: {
        marginTop: 16,
        marginBottom: 32,
        alignItems: 'center',
    },
    statsList: {
        gap: 12,
    },
    actionWrapper: {
        marginTop: 32,
    },
    restartButton: {
        height: 64,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    blurButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonInner: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    testingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    testingText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
});
