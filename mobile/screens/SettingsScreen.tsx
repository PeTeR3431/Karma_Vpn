import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronDown, Rocket, Crown } from 'lucide-react-native';
import { AppBackground } from '@/components/app-background';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export function SettingsScreen() {
    const navigation = useNavigation<any>();

    // UI States
    const [locationMode, setLocationMode] = useState<'last' | 'recommended'>('recommended');
    const [autoConnectStart, setAutoConnectStart] = useState(false);
    const [autoConnectLoss, setAutoConnectLoss] = useState(true);
    const [killSwitch, setKillSwitch] = useState(false);
    const [protocol, setProtocol] = useState('StarGuard');

    return (
        <AppBackground className="flex-1">
            <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
                <Animated.View className="flex-1" entering={FadeIn}>

                    {/* Header */}
                    <View className="px-6 py-4 flex-row items-center justify-between">
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            className="w-10 h-10 rounded-full bg-card/50 items-center justify-center border border-border/50"
                        >
                            <ChevronLeft size={24} color="#5c9a3e" />
                        </TouchableOpacity>
                        <Text className="text-xl font-bold text-foreground">Settings</Text>
                        <View className="w-10" />
                    </View>

                    <ScrollView
                        className="flex-1 px-6"
                        contentContainerStyle={{ paddingBottom: 40 }}
                        showsVerticalScrollIndicator={false}
                    >

                        {/* Location Selection Section */}
                        <View className="mt-6 mb-8">
                            <Text className="text-sm font-semibold text-muted-foreground mb-4 px-1">Location selection</Text>
                            <View className="rounded-3xl overflow-hidden border border-border/40">
                                <LinearGradient colors={['#18181b', '#09090b']} className="p-1">
                                    <RadioButton
                                        label="Last selected"
                                        selected={locationMode === 'last'}
                                        onPress={() => setLocationMode('last')}
                                        isFirst
                                    />
                                    <RadioButton
                                        label="Recommended"
                                        selected={locationMode === 'recommended'}
                                        onPress={() => setLocationMode('recommended')}
                                        isLast
                                    />
                                </LinearGradient>
                            </View>
                        </View>

                        {/* Auto-connect Section */}
                        <View className="mb-8">
                            <View className="rounded-3xl overflow-hidden border border-border/40">
                                <LinearGradient colors={['#18181b', '#09090b']} className="px-5 py-6">
                                    <View className="flex-row items-center justify-between mb-4">
                                        <View>
                                            <Text className="text-lg font-bold text-foreground">Auto-connect</Text>
                                            <View className="mt-1 bg-indigo-600 self-start px-2 py-0.5 rounded-full">
                                                <Text className="text-[10px] text-white font-bold uppercase">Premium</Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View className="space-y-6">
                                        <View className="flex-row items-center justify-between">
                                            <Text className="text-sm text-muted-foreground flex-1 pr-4">Auto-connect when application is started</Text>
                                            <Switch
                                                value={autoConnectStart}
                                                onValueChange={setAutoConnectStart}
                                                trackColor={{ false: '#27272a', true: '#5c9a3e' }}
                                                thumbColor="white"
                                            />
                                        </View>

                                        <View className="h-[1px] bg-border/20 my-4" />

                                        <View className="flex-row items-center justify-between">
                                            <View className="flex-1 pr-4">
                                                <Text className="text-sm text-muted-foreground">Autoconnect on connection loss ikev2 (beta)</Text>
                                                <TouchableOpacity><Text className="text-[#5c9a3e] text-xs font-medium mt-1">More</Text></TouchableOpacity>
                                            </View>
                                            <Switch
                                                value={autoConnectLoss}
                                                onValueChange={setAutoConnectLoss}
                                                trackColor={{ false: '#27272a', true: '#5c9a3e' }}
                                                thumbColor="white"
                                            />
                                        </View>
                                    </View>
                                </LinearGradient>
                            </View>
                        </View>

                        {/* Additional Settings Section */}
                        <View className="mb-8">
                            <Text className="text-sm font-semibold text-muted-foreground mb-4 px-1">Additional settings</Text>
                            <View className="rounded-3xl overflow-hidden border border-border/40">
                                <LinearGradient colors={['#18181b', '#09090b']} className="px-5 py-6">
                                    <Text className="text-lg font-bold text-foreground mb-3">Select Protocol</Text>
                                    <TouchableOpacity className="flex-row items-center justify-between bg-zinc-900/100 border border-border/30 rounded-2xl p-4 mb-8">
                                        <Text className="text-primary-foreground font-medium">{protocol}</Text>
                                        <ChevronDown size={20} color="#5c9a3e" />
                                    </TouchableOpacity>

                                    <View className="h-[1px] bg-border/20 mb-6" />

                                    <View className="flex-row items-center justify-between mb-2">
                                        <Text className="text-lg font-bold text-foreground">Killswitch</Text>
                                        <Switch
                                            value={killSwitch}
                                            onValueChange={setKillSwitch}
                                            trackColor={{ false: '#27272a', true: '#5c9a3e' }}
                                            thumbColor="white"
                                        />
                                    </View>
                                    <Text className="text-xs text-muted-foreground leading-5">
                                        If VPN is unavailable, the application automatically brakes down your connection
                                    </Text>
                                </LinearGradient>
                            </View>
                        </View>

                        {/* Restore Purchase Button */}
                        <TouchableOpacity className="mt-4 mb-10 overflow-hidden rounded-2xl">
                            <LinearGradient
                                colors={['#5c9a3e', '#45722f']}
                                className="h-16 items-center justify-center"
                            >
                                <Text className="text-zinc-950 font-bold text-lg">Restore purchase</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                    </ScrollView>
                </Animated.View>
            </SafeAreaView>
        </AppBackground>
    );
}

function RadioButton({ label, selected, onPress, isFirst, isLast }: { label: string, selected: boolean, onPress: () => void, isFirst?: boolean, isLast?: boolean }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`flex-row items-center justify-between p-5 ${!isLast ? 'border-b border-white/5' : ''}`}
        >
            <Text className="text-base text-foreground font-medium">{label}</Text>
            <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${selected ? 'border-[#5c9a3e]' : 'border-zinc-700'}`}>
                {selected && <View className="w-3 h-3 rounded-full bg-[#5c9a3e]" />}
            </View>
        </TouchableOpacity>
    );
}
