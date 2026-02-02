import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shield } from 'lucide-react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    withDelay,
    interpolate,
    FadeIn,
    Easing
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export function LoadingScreen() {
    const navigation = useNavigation<any>();

    // Animation values
    const logoScale = useSharedValue(0.8);
    const logoOpacity = useSharedValue(0);
    const glowScale = useSharedValue(1);
    const progressWidth = useSharedValue(0);

    useEffect(() => {
        // Entrance animation
        logoScale.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.back(1.5)) });
        logoOpacity.value = withTiming(1, { duration: 800 });

        // Continuous glow pulse
        glowScale.value = withRepeat(
            withTiming(1.4, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
            -1,
            true
        );

        // Progress bar animation
        progressWidth.value = withTiming(1, { duration: 2500, easing: Easing.bezier(0.4, 0, 0.2, 1) });

        // Auto transition
        const timer = setTimeout(() => {
            navigation.replace('Main');
        }, 2800);

        return () => clearTimeout(timer);
    }, []);

    const animatedLogoStyle = useAnimatedStyle(() => ({
        transform: [{ scale: logoScale.value }],
        opacity: logoOpacity.value,
    }));

    const animatedGlowStyle = useAnimatedStyle(() => ({
        transform: [{ scale: glowScale.value }],
        opacity: interpolate(glowScale.value, [1, 1.4], [0.4, 0.1]),
    }));

    const animatedProgressStyle = useAnimatedStyle(() => ({
        width: `${progressWidth.value * 100}%`,
    }));

    return (
        <SafeAreaView className="flex-1 bg-background items-center justify-center">
            <View className="items-center justify-center">
                {/* Branded Logo with Pulsing Glow */}
                <View className="relative items-center justify-center mb-12">
                    <Animated.View
                        style={animatedGlowStyle}
                        className="absolute w-40 h-40 rounded-full bg-primary/30"
                    />

                    <Animated.View
                        style={animatedLogoStyle}
                        className="w-32 h-32 items-center justify-center rounded-[32px] bg-secondary border border-border/50 overflow-hidden"
                    >
                        <Image
                            source={require('../../assets/logo.png')}
                            className="w-24 h-24"
                            resizeMode="contain"
                        />
                    </Animated.View>
                </View>

                {/* Branded Text */}
                <Animated.View
                    entering={FadeIn.delay(400).duration(800)}
                    className="items-center mb-12"
                >
                    <Text className="text-4xl font-bold tracking-tight text-foreground">
                        <Text className="text-[#4ade80]">Karma</Text>
                        <Text className="text-muted-foreground font-normal"> VPN</Text>
                    </Text>
                    <Text className="text-sm text-muted-foreground mt-2 tracking-[4px] uppercase opacity-60">
                        Secure Access
                    </Text>
                </Animated.View>

                {/* Progress Indicator */}
                <View className="w-48 h-1 bg-white/10 rounded-full overflow-hidden border border-white/5">
                    <Animated.View
                        style={animatedProgressStyle}
                        className="h-full bg-[#4ade80]"
                    />
                </View>

                <Animated.Text
                    entering={FadeIn.delay(800).duration(600)}
                    className="text-xs text-muted-foreground mt-4 font-mono uppercase tracking-widest"
                >
                    Initialising...
                </Animated.Text>
            </View>
        </SafeAreaView>
    );
}
