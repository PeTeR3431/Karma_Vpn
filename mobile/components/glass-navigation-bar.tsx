import React, { useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Home, BarChart2, User, Zap } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';

export function GlassNavigationBar() {
    const navigation = useNavigation<any>();
    const route = useRoute();
    const { width: windowWidth } = useWindowDimensions();

    const tabs = useMemo(() => [
        { id: 'Home', icon: Home, label: 'Home' },
        { id: 'SpeedTest', icon: Zap, label: 'Speed' },
        { id: 'Stats', icon: BarChart2, label: 'Stats' },
        { id: 'Profile', icon: User, label: 'Profile' },
    ], []);

    const activeTab = route.name;
    const activeIndex = useMemo(() => {
        // More robust matching for route names (e.g., Home, HomeScreen, Dashboard)
        const lowerActive = activeTab.toLowerCase();
        const index = tabs.findIndex(tab => {
            const lowerId = tab.id.toLowerCase();
            return lowerActive === lowerId ||
                lowerActive.includes(lowerId) ||
                (tab.id === 'Home' && (lowerActive.includes('dashboard') || lowerActive.includes('welcome')));
        });
        return index === -1 ? 0 : index;
    }, [activeTab, tabs]);

    // Reanimated shared value for sliding indicator
    const translateX = useSharedValue(0);
    const containerWidth = Math.min(windowWidth - 40, 400);

    // Calculate tab width (3 tabs, padding included)
    const paddingHorizontal = 10;
    const tabWidth = (containerWidth - (paddingHorizontal * 2)) / tabs.length;

    useEffect(() => {
        translateX.value = withSpring(activeIndex * tabWidth, {
            damping: 25,
            stiffness: 180,
            mass: 0.5
        });
    }, [activeIndex, tabWidth]);

    const animatedIndicatorStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
        width: tabWidth,
    }));

    return (
        <View style={styles.container}>
            <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
                <View style={styles.content}>
                    {/* Sliding Indicator Background - Solid Lime Pill */}
                    {/* Positioned FIRST in the children list to be at the bottom layer */}
                    <Animated.View
                        style={[
                            styles.indicator,
                            animatedIndicatorStyle,
                            { backgroundColor: '#5c9a3e' }
                        ]}
                    />

                    {tabs.map((tab, index) => {
                        const Icon = tab.icon;
                        const isActive = activeIndex === index;

                        return (
                            <TouchableOpacity
                                key={tab.id}
                                onPress={() => navigation.navigate(tab.id)}
                                style={styles.tab}
                                activeOpacity={0.7}
                            >
                                <View style={styles.iconContainer}>
                                    <Icon
                                        size={20}
                                        color={isActive ? '#000000' : '#71717a'}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                    {isActive && (
                                        <Text style={styles.activeLabel}>
                                            {tab.label}
                                        </Text>
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </BlurView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    blurContainer: {
        borderRadius: 40,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        width: '100%',
        maxWidth: 400,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        position: 'relative',
    },
    indicator: {
        position: 'absolute',
        top: 10,
        bottom: 10,
        left: 10,
        borderRadius: 24,
        overflow: 'hidden',
    },
    tab: {
        flex: 1,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    activeLabel: {
        color: '#000000',
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: -0.2,
    },
});
