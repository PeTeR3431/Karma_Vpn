import React, { useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Home, BarChart2, User } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming
} from 'react-native-reanimated';

export function GlassNavigationBar() {
    const navigation = useNavigation<any>();
    const route = useRoute();
    const { width: windowWidth } = useWindowDimensions();

    const tabs = useMemo(() => [
        { id: 'Home', icon: Home, label: 'Home' },
        { id: 'Stats', icon: BarChart2, label: 'Stats' },
        { id: 'Profile', icon: User, label: 'Profile' },
    ], []);

    const activeTab = route.name;
    const activeIndex = useMemo(() => {
        const index = tabs.findIndex(tab => tab.id === activeTab || (tab.id === 'Home' && activeTab === 'Welcome'));
        return index === -1 ? 0 : index;
    }, [activeTab, tabs]);

    // Reanimated shared value for sliding indicator
    const translateX = useSharedValue(0);
    const containerWidth = Math.min(windowWidth - 40, 400); // Same as styles

    // Calculate tab width (3 tabs, padding included)
    const paddingHorizontal = 10;
    const tabWidth = (containerWidth - (paddingHorizontal * 2)) / tabs.length;

    useEffect(() => {
        translateX.value = withSpring(activeIndex * tabWidth, {
            damping: 20,
            stiffness: 150,
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
                    {/* Sliding Indicator Background */}
                    <Animated.View
                        style={[
                            styles.indicator,
                            animatedIndicatorStyle
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
                                        size={22}
                                        color={isActive ? '#09090b' : '#a1a1aa'}
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
        borderColor: 'rgba(255, 255, 255, 0.1)',
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
        paddingVertical: 8,
        paddingHorizontal: 10,
        position: 'relative',
    },
    indicator: {
        position: 'absolute',
        top: 8,
        bottom: 8,
        left: 10,
        backgroundColor: '#84cc16',
        borderRadius: 24,
        zIndex: -1,
    },
    tab: {
        flex: 1,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    activeLabel: {
        color: '#09090b',
        fontSize: 13,
        fontWeight: '700',
    },
});
