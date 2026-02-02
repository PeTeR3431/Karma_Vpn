import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Home, BarChart2, User, Zap } from 'lucide-react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';

export function GlassNavigationBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const { width: windowWidth } = useWindowDimensions();

    const activeIndex = state.index;

    // Map route names to Icons and Labels
    const getTabInfo = (routeName: string) => {
        switch (routeName) {
            case 'Home': return { icon: Home, label: 'Home' };
            case 'SpeedTest': return { icon: Zap, label: 'Speed' };
            case 'Stats': return { icon: BarChart2, label: 'Stats' };
            case 'Profile': return { icon: User, label: 'Profile' };
            default: return { icon: Home, label: routeName };
        }
    };

    // Reanimated shared value for sliding indicator
    const translateX = useSharedValue(0);
    const containerWidth = Math.min(windowWidth - 40, 400);

    // Calculate tab width
    const paddingHorizontal = 10;
    const tabWidth = (containerWidth - (paddingHorizontal * 2)) / state.routes.length;

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

    // Hide tab bar on specific screens if needed (though typically handled by navigation options)
    // const focusedOptions = descriptors[state.routes[state.index].key].options;
    // if (focusedOptions.tabBarVisible === false) return null;

    return (
        <View style={styles.container}>
            <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
                <View style={styles.content}>
                    {/* Sliding Indicator Background */}
                    <Animated.View
                        style={[
                            styles.indicator,
                            animatedIndicatorStyle,
                            { backgroundColor: '#4ade80' }
                        ]}
                    />

                    {state.routes.map((route, index) => {
                        const { options } = descriptors[route.key];
                        const isFocused = state.index === index;
                        const { icon: Icon, label } = getTabInfo(route.name);

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name, route.params);
                            }
                        };

                        const onLongPress = () => {
                            navigation.emit({
                                type: 'tabLongPress',
                                target: route.key,
                            });
                        };

                        return (
                            <TouchableOpacity
                                key={route.key}
                                accessibilityRole="button"
                                accessibilityState={isFocused ? { selected: true } : {}}
                                accessibilityLabel={options.tabBarAccessibilityLabel}
                                onPress={onPress}
                                onLongPress={onLongPress}
                                style={styles.tab}
                                activeOpacity={0.7}
                            >
                                <View style={styles.iconContainer}>
                                    <Icon
                                        size={20}
                                        color={isFocused ? '#000000' : '#71717a'}
                                        strokeWidth={isFocused ? 2.5 : 2}
                                    />
                                    {isFocused && (
                                        <Text style={styles.activeLabel}>
                                            {label}
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
