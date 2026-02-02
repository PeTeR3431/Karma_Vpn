import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, StyleSheet } from 'react-native';
import api from '@/lib/api';
import { useNavigation } from '@react-navigation/native';
import { Search, ChevronLeft, Crown, Star, Zap, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { countryServers, type CountryServer } from '@/lib/countries-data';
import { useConnection } from '@/lib/connection-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

export function ServersContent() {
    const navigation = useNavigation<any>();
    const { selectedServer, setSelectedServer, setIsConnected } = useConnection();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("Countries");
    const [servers, setServers] = useState<CountryServer[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const tabs = ["All", "Gaming", "Streaming"];

    useEffect(() => {
        const fetchServers = async () => {
            try {
                // Hardcode fallbacks for now if API fails or empty, OR map API data
                // For this task, we want to integration API. 
                // Let's try to fetch real data.
                const response = await api.get('/servers');
                const backendServers = response.data;

                // Map backend data to CountryServer type
                const mappedServers: CountryServer[] = backendServers.map((s: any) => ({
                    id: s.id,
                    name: s.name,
                    city: s.city || 'Unknown',
                    flag: s.countryCode === 'UK' ? '🇬🇧' : '🇺🇸', // Simplified flag logic for now
                    flagUrl: `https://flagcdn.com/w160/${s.countryCode.toLowerCase()}.png`,
                    code: s.countryCode,
                    locations: 1,
                    ping: Math.floor(Math.random() * 100) + 20, // Fake ping for now
                    load: s.capacity,
                    signal: 5,
                    category: 'fast',
                    isFree: true, // Assuming all fetched are available for now
                    ipAddress: s.ipAddress,
                    publicKey: s.publicKey
                }));
                setServers(mappedServers);
            } catch (error) {
                console.error("Failed to fetch servers", error);
                // Fallback to static data if fetch fails
                setServers(countryServers);
            } finally {
                setIsLoading(false);
            }
        };

        fetchServers();
    }, []);

    const sourceServers = servers.length > 0 ? servers : countryServers;

    const filteredServers = sourceServers.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.city.toLowerCase().includes(searchQuery.toLowerCase());

        if (activeTab === "Gaming") return matchesSearch && s.category === "gaming";
        if (activeTab === "Streaming") return matchesSearch && s.category === "streaming";
        return matchesSearch;
    });

    const handleSelect = (server: CountryServer) => {
        setSelectedServer(server);
        setIsConnected(true);
        navigation.navigate("Home");
    };

    const handleSelectFastest = () => {
        // Find server with highest signal and lowest ping
        const fastest = [...sourceServers].sort((a, b) => b.signal - a.signal || a.ping - b.ping)[0];
        if (fastest) handleSelect(fastest);
    };

    return (
        <View className="flex-1">
            {/* Header */}
            <View className="px-6 py-4 flex-row items-center justify-between">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="w-10 h-10 rounded-full bg-white/5 items-center justify-center border border-white/10"
                >
                    <ChevronLeft size={20} color="#4ade80" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-foreground">Servers</Text>
                <View className="w-10" />
            </View>

            <ScrollView
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 140 }}
            >
                {/* Search Bar */}
                <View className="mt-2 mb-6 flex-row items-center px-4 h-14 bg-white/5 rounded-[28px] border border-white/10 overflow-hidden">
                    <Search size={20} color="#71717a" />
                    <TextInput
                        className="flex-1 ml-3 text-foreground text-base"
                        placeholder="Search..."
                        placeholderTextColor="#71717a"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Tab Switcher */}
                <View className="flex-row items-center justify-between mb-8 px-1">
                    {tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-full ${activeTab === tab ? 'bg-[#4ade80]' : 'transparent'}`}
                        >
                            <Text className={`text-sm font-bold ${activeTab === tab ? 'text-black' : 'text-muted-foreground'}`}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Fastest Server Option */}
                <View className="mb-8">
                    <Text className="text-base text-muted-foreground mb-4 px-1">Quick Connect</Text>
                    <TouchableOpacity
                        onPress={handleSelectFastest}
                        activeOpacity={0.9}
                        className="rounded-[32px] overflow-hidden border border-[#4ade80] bg-white/5 flex-row items-center p-5"
                    >
                        <View className="w-12 h-12 rounded-full bg-[#4ade80]/20 items-center justify-center mr-4 border border-[#4ade80]/30">
                            <Zap size={24} color="#4ade80" fill="#4ade80" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-lg font-bold text-foreground">Fastest Server</Text>
                            <Text className="text-xs text-[#4ade80] font-medium uppercase tracking-wider">Optimal location</Text>
                        </View>
                        <ChevronRight size={20} color="#4ade80" />
                    </TouchableOpacity>
                </View>

                {/* Servers List */}
                <View>
                    <Text className="text-base text-muted-foreground mb-4 px-1">Available Locations</Text>
                    <View>
                        {filteredServers.map((server, index) => (
                            <ServerItem
                                key={server.code}
                                server={server}
                                index={index}
                                onPress={() => handleSelect(server)}
                                isSelected={selectedServer.code === server.code}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

function ServerItem({
    server,
    index,
    onPress,
    isSelected
}: {
    server: CountryServer,
    index: number,
    onPress: () => void,
    isSelected: boolean
}) {
    return (
        <Animated.View
            entering={FadeInDown.delay(index * 50).duration(400)}
            className="mb-4"
        >
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.9}
                className={`flex-row items-center p-4 rounded-[32px] border ${isSelected ? 'border-[#4ade80] bg-[#4ade80]/5' : 'border-white/10 bg-white/5'}`}
            >
                {/* Circular Flag Image */}
                <View className="w-12 h-12 rounded-full overflow-hidden mr-4 border border-white/10">
                    <Image
                        source={{ uri: server.flagUrl }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                </View>

                {/* Server Info */}
                <View className="flex-1">
                    <Text className="text-lg font-bold text-foreground">{server.name}</Text>
                    <Text className="text-xs text-muted-foreground">{server.city}</Text>
                </View>

                {/* Status Icons */}
                <View className="flex-row items-center gap-3">
                    <View className="flex-row items-end gap-0.5 h-4">
                        {[...Array(4)].map((_, i) => (
                            <View
                                key={i}
                                className={`w-1 rounded-full ${i < server.signal - 1 ? 'bg-[#4ade80]' : 'bg-zinc-800'}`}
                                style={{ height: (i + 1) * 3 + 4 }}
                            />
                        ))}
                    </View>

                    {server.isFree ? (
                        <Star size={18} color="#4ade80" fill={isSelected ? "#4ade80" : "transparent"} />
                    ) : (
                        <Crown size={18} color="#facc15" fill="#facc15" />
                    )}
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}
