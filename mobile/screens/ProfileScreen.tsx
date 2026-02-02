import React, { useEffect, useState } from 'react';
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
import api from '@/lib/api';

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
                            className="w-10 h-10 rounded-full bg-white/5 items-center justify-center border border-white/10"
                        >
                            <ChevronLeft size={24} color="#4ade80" />
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

                            <View className="rounded-[32px] overflow-hidden border border-white/10 bg-white/5">
                                <View className="p-5 flex-row items-center justify-between border-b border-white/10">
                                    <View className="flex-1">
                                        <Text className="text-xs text-muted-foreground mb-1">Identity</Text>
                                        <View className="flex-row items-center gap-2">
                                            <Shield size={14} color="#4ade80" />
                                            <Text className="text-sm text-foreground font-bold uppercase tracking-wide">
                                                Protected
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="items-end">
                                        <Text className="text-xs text-muted-foreground mb-1">Plan</Text>
                                        <Text className="text-sm font-bold text-[#4ade80]">Anonymous</Text>
                                    </View>
                                </View>

                                <View className="p-5">
                                    <Text className="text-sm text-muted-foreground mb-3 font-medium">You don't have an active subscription</Text>
                                    <TouchableOpacity className="flex-row items-center gap-2">
                                        <View className="w-8 h-8 rounded-lg bg-[#4ade80]/10 items-center justify-center">
                                            <Gem size={16} color="#4ade80" />
                                        </View>
                                        <Text className="text-base font-bold text-[#4ade80]">Get Premium</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View className="mb-8">
                            <Text className="text-sm font-semibold text-muted-foreground mb-3 px-1 uppercase tracking-wider">Application</Text>

                            <View className="rounded-[32px] overflow-hidden border border-white/10 bg-white/5">
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
                                <MenuItem
                                    icon={Info}
                                    label="About"
                                    isLast
                                    onPress={() => navigation.navigate('About')}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </Animated.View>
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
            className={`flex-row items-center justify-between p-5 ${!isLast ? 'border-b border-white/10' : ''}`}
            activeOpacity={0.7}
            onPress={onPress}
        >
            <View className="flex-row items-center gap-4">
                <View className="w-10 h-10 rounded-xl bg-[#4ade80]/10 items-center justify-center">
                    <Icon size={20} color="#4ade80" />
                </View>
                <Text className="text-base font-medium text-foreground">{label}</Text>
            </View>
            <ChevronRight size={18} color="#71717a" />
        </TouchableOpacity>
    );
}
