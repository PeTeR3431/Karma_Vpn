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
import { Ionicons, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
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
                            <ChevronLeft size={24} color="#60a5fa" />
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
                            <Text className="text-[11px] font-black text-muted-foreground mb-4 px-1 uppercase tracking-[2px]">Your Profile</Text>

                            <View className="rounded-[32px] overflow-hidden border border-white/10 bg-zinc-900/60 shadow-xl">
                                <LinearGradient
                                    colors={['rgba(96, 165, 250, 0.1)', 'rgba(37, 99, 235, 0.03)']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    className="p-6"
                                >
                                    <View className="flex-row items-center justify-between mb-5">
                                        <View className="flex-row items-center gap-4">
                                            <View className="w-12 h-12 rounded-2xl bg-[#60a5fa]/15 items-center justify-center border border-[#60a5fa]/20 shadow-md shadow-blue-500/10">
                                                <User size={24} color="#60a5fa" />
                                            </View>
                                            <View>
                                                <Text className="text-lg font-black text-white">Ghost User</Text>
                                                <View className="flex-row items-center gap-1 mt-0.5">
                                                    <Shield size={10} color="#60a5fa" />
                                                    <Text className="text-[9px] text-[#60a5fa] font-black uppercase tracking-tighter">Secured Identity</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View className="bg-white/5 rounded-xl px-3 py-1.5 border border-white/5">
                                            <Text className="text-[9px] text-muted-foreground uppercase font-black tracking-widest text-center">Status</Text>
                                            <Text className="text-[10px] font-black text-[#60a5fa] uppercase tracking-tighter text-center">Active</Text>
                                        </View>
                                    </View>

                                    <View className="h-[1px] bg-white/5 w-full mb-5" />

                                    <View>
                                        <Text className="text-[13px] text-muted-foreground mb-5 font-medium leading-5">Global high-speed servers and unlimited bandwidth for maximum performance.</Text>

                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            className="overflow-hidden rounded-xl"
                                        >
                                            <LinearGradient
                                                colors={['#60a5fa', '#2563eb']}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 0 }}
                                                className="h-12 items-center justify-center flex-row gap-2 px-6"
                                            >
                                                <MaterialCommunityIcons name="crown" size={18} color="#000" />
                                                <Text className="text-[#000] font-black text-xs uppercase tracking-widest">Upgrade to Premium</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </View>
                                </LinearGradient>
                            </View>
                        </View>

                        <View className="mb-8">
                            <Text className="text-sm font-semibold text-muted-foreground mb-3 px-1 uppercase tracking-wider">Application</Text>

                            <View className="rounded-[32px] overflow-hidden border border-white/10 bg-white/5">
                                <MenuItem
                                    icon={(props) => <Ionicons name="settings" {...props} />}
                                    label="Settings"
                                    isFirst
                                    onPress={() => navigation.navigate('Settings')}
                                />
                                <MenuItem
                                    icon={(props) => <MaterialCommunityIcons name="crown" {...props} />}
                                    label="Premium"
                                />
                                <MenuItem
                                    icon={(props) => <Ionicons name="help-circle" {...props} />}
                                    label="FAQ & Support"
                                    onPress={() => navigation.navigate('Faq')}
                                />
                                <MenuItem
                                    icon={(props) => <Ionicons name="star" {...props} />}
                                    label="Rate the app"
                                />
                                <MenuItem
                                    icon={(props) => <FontAwesome6 name="share" {...props} />}
                                    label="Share"
                                />
                                <MenuItem
                                    icon={(props) => <Ionicons name="information-circle" {...props} />}
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
    icon: React.ComponentType<any>,
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
                <View className="w-10 h-10 rounded-full bg-[#60a5fa]/10 items-center justify-center">
                    <Icon size={20} color="#60a5fa" />
                </View>
                <Text className="text-base font-medium text-foreground">{label}</Text>
            </View>
            <ChevronRight size={18} color="#71717a" />
        </TouchableOpacity>
    );
}
