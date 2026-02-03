import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
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
            case 'Home': return { lib: Ionicons, name: 'home', label: 'Home' };
            case 'SpeedTest': return { lib: Ionicons, name: 'speedometer', label: 'Speed' };
            case 'Stats': return { lib: Ionicons, name: 'pie-chart', label: 'Stats' };
            case 'Profile': return { lib: Ionicons, name: 'person-circle', label: 'Profile' };
            default: return { lib: Ionicons, name: 'home', label: routeName };
        }
    };

    // Reanimated shared value for sliding indicator
    const translateX = useSharedValue(0);
    const containerWidth = Math.min(windowWidth - 40, 400);

    // Calculate tab width accurately
    const paddingHorizontal = 10;
    const tabWidth = (containerWidth - (paddingHorizontal * 2)) / state.routes.length;

    useEffect(() => {
        translateX.value = withSpring(activeIndex * tabWidth, {
            damping: 30,
            stiffness: 200,
            mass: 0.8
        });
    }, [activeIndex, tabWidth]);

    const animatedIndicatorStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value + 2 }],
        width: tabWidth - 4,
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
                            { backgroundColor: '#262626' }
                        ]}
                    />

                    {state.routes.map((route, index) => {
                        const { options } = descriptors[route.key];
                        const isFocused = state.index === index;
                        const { lib: Lib, name, label } = getTabInfo(route.name);

                        const onPress = () => {
                            if (!isFocused) {
                                Haptics.selectionAsync();
                            }

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
                                <View style={styles.tabContent}>
                                    <Lib
                                        name={name}
                                        size={24}
                                        color={isFocused ? '#60a5fa' : '#ffffff'}
                                    />
                                    <Text style={[
                                        styles.label,
                                        { color: isFocused ? '#60a5fa' : '#ffffff' }
                                    ]}>
                                        {label}
                                    </Text>
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
        top: 2,
        bottom: 2,
        left: 10, // Matches paddingHorizontal
        borderRadius: 30,
    },
    tab: {
        flex: 1,
        height: 64,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabContent: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    label: {
        fontSize: 13,
        fontWeight: '900',
        letterSpacing: -0.2,
    },
});
