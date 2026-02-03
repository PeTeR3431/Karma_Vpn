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
import { Play, Activity, Gauge } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import { GradientText } from '@/components/gradient-text';
import api from '@/lib/api';
import { AxiosProgressEvent } from 'axios';

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

    const runTest = useCallback(async () => {
        if (isTesting) return;
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

        try {
            // --- PING TEST ---
            // Take average of 5 pings
            let totalPing = 0;
            const pings = [];
            for (let i = 0; i < 5; i++) {
                const start = Date.now();
                await api.get('/speedtest/ping');
                const duration = Date.now() - start;
                pings.push(duration);
                totalPing += duration;

                // Update stats immediately for visual feedback
                const currentAvg = Math.round(totalPing / (i + 1));
                setStats(prev => ({ ...prev, ping: currentAvg }));
                setSparklines(prev => ({ ...prev, ping: [...prev.ping.slice(1), duration] }));
                await new Promise(r => setTimeout(r, 100)); // Short delay between pings
            }
            const avgPing = Math.round(totalPing / 5);


            // --- DOWNLOAD TEST ---
            setTestPhase('download');
            const downloadStart = Date.now();
            // Fetch ~10MB file
            await api.get('/speedtest/download', {
                responseType: 'blob',
                onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
                    if (progressEvent.loaded && progressEvent.total) {
                        const durationSec = (Date.now() - downloadStart) / 1000;
                        if (durationSec > 0) {
                            // Bytes * 8 = bits. Divide by 1,000,000 for Mbps.
                            const mbps = (progressEvent.loaded * 8) / (1000 * 1000) / durationSec;
                            setCurrentSpeed(mbps);
                            setStats(prev => ({ ...prev, download: parseFloat(mbps.toFixed(2)) }));
                            setSparklines(prev => ({
                                ...prev,
                                download: [...prev.download.slice(1), parseFloat(mbps.toFixed(2))]
                            }));
                        }
                    }
                }
            });


            // --- UPLOAD TEST ---
            setTestPhase('upload');
            // Create 2MB dummy payload
            const dummyData = new Array(2 * 1024 * 1024).fill('x').join('');
            const uploadStart = Date.now();

            await api.post('/speedtest/upload', { data: dummyData }, {
                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    if (progressEvent.loaded && progressEvent.total) {
                        const durationSec = (Date.now() - uploadStart) / 1000;
                        if (durationSec > 0) {
                            const mbps = (progressEvent.loaded * 8) / (1000 * 1000) / durationSec;
                            setCurrentSpeed(mbps);
                            setStats(prev => ({ ...prev, upload: parseFloat(mbps.toFixed(2)) }));
                            setSparklines(prev => ({
                                ...prev,
                                upload: [...prev.upload.slice(1), parseFloat(mbps.toFixed(2))]
                            }));
                        }
                    }
                }
            });

            // --- COMPLETE ---
            setTestPhase('complete');
            setCurrentSpeed(0);

        } catch (error) {
            console.error("Speed Test Failed:", error);
            setTestPhase('idle'); // Reset on error
        } finally {
            setIsTesting(false);
        }
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
                            <View style={styles.iconContainer}>
                                <Ionicons name="speedometer" size={32} color="#60a5fa" />
                            </View>
                            <View className="items-center justify-center mb-10">
                                <GradientText
                                    colors={['#ffffff', '#60a5fa']}
                                    style={{ fontSize: 24, fontWeight: '900', letterSpacing: -0.5 }}
                                >
                                    SPEED TEST
                                </GradientText>
                            </View>
                            <Text style={styles.subtitle}>Check your connection speed and latency instantly.</Text>

                            <TouchableOpacity
                                onPress={handleInitialStart}
                                style={styles.mainButton}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['#60a5fa', '#3b82f6']}
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
                        className="flex-1"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={[styles.scrollContent, { flexGrow: 1, justifyContent: 'center' }]}
                    >
                        <Animated.View entering={FadeIn.duration(600)} style={styles.gaugeWrapper}>
                            <SpeedGauge value={currentSpeed} unit="mbps" isTesting={isTesting} />
                        </Animated.View>

                        <View style={styles.statsList}>
                            <Animated.View entering={FadeInDown.delay(100)}>
                                <SpeedStatCard icon="Activity" label="Ping" value={stats.ping.toString()} unit="ms" color="#A855F7" sparklineData={sparklines.ping} />
                            </Animated.View>
                            <Animated.View entering={FadeInDown.delay(200)}>
                                <SpeedStatCard icon="ArrowDownCircle" label="Download" value={stats.download.toFixed(1)} unit="mbps" color="#60a5fa" sparklineData={sparklines.download} />
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
                                                <Activity size={16} color="#60a5fa" />
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
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#18181b',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: '#ffffff',
        letterSpacing: -0.8,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
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
    scrollContent: {
        paddingBottom: 32,
        paddingHorizontal: 24,
    },
    gaugeWrapper: {
        marginTop: 0,
        marginBottom: 24,
        alignItems: 'center',
    },
    statsList: {
        gap: 12,
    },
    actionWrapper: {
        marginTop: 24,
    },
    restartButton: {
        height: 50,
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
