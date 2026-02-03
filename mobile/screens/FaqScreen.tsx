import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronDown, Mail, ExternalLink, HelpCircle, Shield, Zap, Globe } from 'lucide-react-native';
import { AppBackground } from '@/components/app-background';
import { useNavigation } from '@react-navigation/native';
import Animated, {
    FadeIn,
    FadeInDown,
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    interpolate,
    Extrapolate
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const FAQ_DATA = [
    {
        id: '1',
        question: 'What is Karma VPN?',
        answer: 'Karma VPN is a high-performance, secure VPN service designed for maximum privacy and speed. We use state-of-the-art encryption to keep your data safe and invisible to third parties.',
        icon: Shield
    },
    {
        id: '2',
        question: 'Is it really free?',
        answer: 'Yes! Karma VPN offers a generous free tier with access to multiple high-speed servers. We also offer a Premium plan for users who need even faster speeds, more locations, and extra features.',
        icon: Zap
    },
    {
        id: '3',
        question: 'Does Karma VPN log my data?',
        answer: 'No. We have a strict no-logs policy. Your browsing activity, IP address, and connection timestamps are never recorded or stored on our servers.',
        icon: HelpCircle
    },
    {
        id: '4',
        question: 'How many servers are available?',
        answer: 'We have a growing network of over 100+ servers across 20+ countries, including locations in the US, UK, Europe, and Asia.',
        icon: Globe
    },
    {
        id: '5',
        question: 'Can I use it on multiple devices?',
        answer: 'Absolutely. With a Karma VPN account, you can connect up to 5 devices simultaneously, including your phone, tablet, and laptop.',
        icon: Zap
    }
];

function FaqItem({ item, index, isExpanded, onToggle }: { item: any, index: number, isExpanded: boolean, onToggle: () => void }) {
    const animation = useSharedValue(0);

    React.useEffect(() => {
        animation.value = withSpring(isExpanded ? 1 : 0, {
            damping: 20,
            stiffness: 100
        });
    }, [isExpanded]);

    const contentStyle = useAnimatedStyle(() => {
        return {
            height: interpolate(animation.value, [0, 1], [0, 100], Extrapolate.CLAMP), // Approximate height, or use layout callback
            opacity: interpolate(animation.value, [0.5, 1], [0, 1]),
            marginTop: interpolate(animation.value, [0, 1], [0, 16]),
        };
    });

    const chevronStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${interpolate(animation.value, [0, 1], [0, 180])}deg` }]
        };
    });

    const iconBgStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: isExpanded ? 'rgba(96, 165, 250, 0.2)' : 'rgba(96, 165, 250, 0.1)',
            transform: [{ scale: withSpring(isExpanded ? 1.1 : 1) }]
        };
    });

    return (
        <Animated.View entering={FadeInDown.delay(index * 100)}>
            <TouchableOpacity
                onPress={onToggle}
                activeOpacity={0.8}
                className={`rounded-[28px] border border-white/10 bg-zinc-900/40 overflow-hidden mb-3 ${isExpanded ? 'border-[#60a5fa]/40 shadow-lg shadow-blue-500/20' : ''}`}
            >
                <BlurView intensity={5} tint="dark" className="p-5">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1 pr-4">
                            <Animated.View style={iconBgStyle} className="w-10 h-10 rounded-full items-center justify-center mr-4">
                                <item.icon size={20} color="#60a5fa" />
                            </Animated.View>
                            <Text className="text-[15px] font-bold text-foreground flex-1">{item.question}</Text>
                        </View>
                        <Animated.View style={chevronStyle}>
                            <ChevronDown size={20} color={isExpanded ? "#60a5fa" : "#71717a"} />
                        </Animated.View>
                    </View>

                    {isExpanded && (
                        <Animated.View style={contentStyle}>
                            <View className="h-[1px] bg-white/5 w-full mb-4" />
                            <Text className="text-sm text-muted-foreground leading-6">
                                {item.answer}
                            </Text>
                        </Animated.View>
                    )}
                </BlurView>
            </TouchableOpacity>
        </Animated.View>
    );
}

export function FaqScreen() {
    const navigation = useNavigation();
    const [expandedId, setExpandedId] = useState<string | null>(null);

    return (
        <AppBackground className="flex-1">
            <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
                <Animated.View className="flex-1" entering={FadeIn}>

                    {/* Header */}
                    <View className="px-6 py-4 flex-row items-center justify-between">
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            className="w-10 h-10 rounded-full bg-white/5 items-center justify-center border border-white/10"
                        >
                            <ChevronLeft size={24} color="#60a5fa" />
                        </TouchableOpacity>
                        <Text className="text-xl font-bold text-white tracking-tight">FAQ & Support</Text>
                        <View className="w-10" />
                    </View>

                    <ScrollView
                        className="flex-1 px-6"
                        contentContainerStyle={{ paddingBottom: 140 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View className="mt-8 mb-10">
                            <Text className="text-[11px] font-black text-muted-foreground mb-5 px-1 uppercase tracking-[2px]">Core Questions</Text>

                            <View>
                                {FAQ_DATA.map((item, index) => (
                                    <FaqItem
                                        key={item.id}
                                        item={item}
                                        index={index}
                                        isExpanded={expandedId === item.id}
                                        onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
                                    />
                                ))}
                            </View>
                        </View>

                        {/* Support Section */}
                        <View className="mb-10">
                            <Text className="text-sm font-semibold text-muted-foreground mb-4 px-1 uppercase tracking-wider">Need more help?</Text>

                            <LinearGradient
                                colors={['rgba(96, 165, 250, 0.1)', 'rgba(37, 99, 235, 0.05)']}
                                className="rounded-[32px] border border-[#60a5fa]/20 p-6 items-center"
                            >
                                <View className="w-16 h-16 rounded-full bg-[#60a5fa]/20 items-center justify-center mb-4">
                                    <Mail size={32} color="#60a5fa" />
                                </View>
                                <Text className="text-xl font-bold text-foreground mb-2">Contact Support</Text>
                                <Text className="text-sm text-muted-foreground text-center mb-6 px-4">
                                    Our technical team is available 24/7 to assist you with any questions or issues.
                                </Text>

                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    className="w-full h-14 rounded-2xl overflow-hidden"
                                >
                                    <LinearGradient
                                        colors={['#60a5fa', '#3b82f6']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        className="flex-1 flex-row items-center justify-center gap-2"
                                    >
                                        <Mail size={20} color="#000" />
                                        <Text className="text-[#000] font-bold text-base uppercase tracking-wider">Send us an Email</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                                <View className="mt-4 flex-row items-center gap-4">
                                    <TouchableOpacity className="flex-row items-center gap-1">
                                        <Text className="text-xs text-[#60a5fa] font-medium">Terms of Service</Text>
                                        <ExternalLink size={10} color="#60a5fa" />
                                    </TouchableOpacity>
                                    <View className="w-1 h-1 rounded-full bg-white/20" />
                                    <TouchableOpacity className="flex-row items-center gap-1">
                                        <Text className="text-xs text-[#60a5fa] font-medium">Privacy Policy</Text>
                                        <ExternalLink size={10} color="#60a5fa" />
                                    </TouchableOpacity>
                                </View>
                            </LinearGradient>
                        </View>

                    </ScrollView>
                </Animated.View>
            </SafeAreaView>
        </AppBackground>
    );
}
