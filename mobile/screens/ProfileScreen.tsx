import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    User,
    Settings,
    Shield,
    Bell,
    ChevronLeft,
    ChevronRight,
    Gem,
    BookOpen,
    Star,
    Share2,
    Info
} from 'lucide-react-native';
import { GlassNavigationBar } from '@/components/glass-navigation-bar';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { AppBackground } from '@/components/app-background';
import { LinearGradient } from 'expo-linear-gradient';

export function ProfileScreen() {
    const navigation = useNavigation<any>();

    return (
        <AppBackground className="flex-1">
            <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
                <Animated.View
                    className="flex-1"
                    entering={FadeIn.duration(500)}
                >
                    <View className="px-6 py-4 flex-row items-center justify-between">
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            className="w-10 h-10 rounded-full bg-card/50 items-center justify-center border border-border/50"
                        >
                            <ChevronLeft size={24} color="#5c9a3e" />
                        </TouchableOpacity>
                        <Text className="text-xl font-bold text-foreground">Menu</Text>
                        <View className="w-10" />
                    </View>

                    <ScrollView
                        className="flex-1 px-6"
                        contentContainerStyle={{ paddingBottom: 140 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View className="mt-6 mb-8">
                            <Text className="text-sm font-semibold text-muted-foreground mb-3 px-1 uppercase tracking-wider">Profile</Text>

                            <View className="rounded-3xl overflow-hidden border border-border/50">
                                <LinearGradient
                                    colors={['#18181b', '#09090b']}
                                    className="flex-1"
                                >
                                    <View className="p-5 flex-row items-center justify-between border-b border-border/30">
                                        <View className="flex-row items-center gap-2">
                                            <Text className="text-base text-foreground">Plan:</Text>
                                            <Text className="text-base text-[#5c9a3e]/80 font-semibold">Free</Text>
                                        </View>
                                        <TouchableOpacity className="flex-row items-center gap-2">
                                            <User size={18} color="#5c9a3e" />
                                            <Text className="text-sm font-bold text-[#5c9a3e]">Sign in</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View className="p-5">
                                        <Text className="text-sm text-muted-foreground mb-3 font-medium">You don't have an active subscription</Text>
                                        <TouchableOpacity className="flex-row items-center gap-2">
                                            <View className="w-8 h-8 rounded-lg bg-[#5c9a3e]/20 items-center justify-center">
                                                <Gem size={16} color="#5c9a3e" />
                                            </View>
                                            <Text className="text-base font-bold text-[#5c9a3e]">Get Premium</Text>
                                        </TouchableOpacity>
                                    </View>
                                </LinearGradient>
                            </View>
                        </View>

                        <View className="mb-8">
                            <Text className="text-sm font-semibold text-muted-foreground mb-3 px-1 uppercase tracking-wider">Application</Text>

                            <View className="rounded-3xl overflow-hidden border border-border/50">
                                <LinearGradient
                                    colors={['#18181b', '#09090b']}
                                    className="flex-1"
                                >
                                    <MenuItem
                                        icon={Settings}
                                        label="Settings"
                                        isFirst
                                        onPress={() => navigation.navigate('Settings')}
                                    />
                                    <MenuItem icon={Gem} label="Subscription plans" />
                                    <MenuItem icon={BookOpen} label="FAQ & Support" />
                                    <MenuItem icon={Star} label="Rate the app" />
                                    <MenuItem icon={Share2} label="Share" />
                                    <MenuItem icon={Info} label="About" isLast />
                                </LinearGradient>
                            </View>
                        </View>
                    </ScrollView>
                </Animated.View>
                <GlassNavigationBar />
            </SafeAreaView>
        </AppBackground>
    );
}

function MenuItem({
    icon: Icon,
    label,
    isFirst,
    isLast,
    onPress
}: {
    icon: any,
    label: string,
    isFirst?: boolean,
    isLast?: boolean,
    onPress?: () => void
}) {
    return (
        <TouchableOpacity
            className={`flex-row items-center justify-between p-5 ${!isLast ? 'border-b border-border/30' : ''}`}
            activeOpacity={0.7}
            onPress={onPress}
        >
            <View className="flex-row items-center gap-4">
                <View className="w-10 h-10 rounded-xl bg-[#5c9a3e]/10 items-center justify-center">
                    <Icon size={20} color="#5c9a3e" />
                </View>
                <Text className="text-base font-medium text-foreground">{label}</Text>
            </View>
            <ChevronRight size={18} color="#a1a1aa" />
        </TouchableOpacity>
    );
}
