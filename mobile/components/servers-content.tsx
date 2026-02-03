import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import api from '@/lib/api';
import { useNavigation } from '@react-navigation/native';
import { Search, ChevronLeft, Crown, Star, Zap, ChevronRight } from 'lucide-react-native';
import { countryServers, type CountryServer } from '@/lib/countries-data';
import { useConnection } from '@/lib/connection-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

export function ServersContent() {
    const navigation = useNavigation<any>();
    const { selectedServer, setSelectedServer, connect } = useConnection();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("All");
    const [servers, setServers] = useState<CountryServer[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const tabs = ["All", "Gaming", "Streaming"];

    useEffect(() => {
        const fetchServers = async () => {
            try {
                const response = await api.get('/servers');
                const backendServers = response.data;

                if (backendServers && Array.isArray(backendServers)) {
                    const mappedServers: CountryServer[] = backendServers.map((s: any) => ({
                        id: s.id,
                        name: s.name,
                        city: s.city || 'Unknown',
                        flag: s.countryCode === 'UK' ? '🇬🇧' : '🇺🇸',
                        flagUrl: `https://flagcdn.com/w160/${s.countryCode.toLowerCase()}.png`,
                        code: s.countryCode,
                        locations: 1,
                        ping: Math.floor(Math.random() * 100) + 20,
                        load: s.capacity,
                        signal: 5,
                        category: s.category || 'fast',
                        isFree: s.isFree !== undefined ? s.isFree : true,
                        ipAddress: s.ipAddress,
                        publicKey: s.publicKey
                    }));
                    setServers(mappedServers);
                }
            } catch (error) {
                console.error("Failed to fetch servers", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchServers();
    }, []);

    const sourceServers = useMemo(() => {
        const apiIds = new Set(servers.map(s => s.id).filter(id => id));
        return [...servers, ...countryServers.filter(s => !s.id || !apiIds.has(s.id))];
    }, [servers]);

    const filteredServers = useMemo(() => {
        return sourceServers.filter(s => {
            const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.city.toLowerCase().includes(searchQuery.toLowerCase());

            if (activeTab === "Gaming") return matchesSearch && s.category === "gaming";
            if (activeTab === "Streaming") return matchesSearch && s.category === "streaming";
            return matchesSearch;
        });
    }, [sourceServers, searchQuery, activeTab]);

    const handleSelect = (server: CountryServer) => {
        setSelectedServer(server);
        connect();
        navigation.navigate("Main", { screen: "Home" });
    };

    const handleSelectFastest = () => {
        const fastest = [...sourceServers].sort((a, b) => b.signal - a.signal || a.ping - b.ping)[0];
        if (fastest) handleSelect(fastest);
    };

    return (
        <View className="flex-1">
            <View className="px-6 py-4 flex-row items-center justify-between">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="w-10 h-10 rounded-full bg-white/5 items-center justify-center border border-white/10"
                >
                    <ChevronLeft size={20} color="#60a5fa" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-foreground">Servers</Text>
                <View className="w-10" />
            </View>

            <ScrollView
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 140 }}
            >
                <View
                    style={{ height: 56, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                    className="mt-2 mb-6 flex-row items-center px-4 rounded-[28px] border border-white/10 overflow-hidden"
                >
                    <Search size={20} color="#94a3b8" />
                    <TextInput
                        className="flex-1 ml-3 text-white text-base"
                        placeholder="Search locations..."
                        placeholderTextColor="#64748b"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <View style={{ height: 48 }} className="flex-row items-center justify-between mb-8 px-1">
                    {tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            style={{ height: 40, minWidth: 80, justifyContent: 'center', alignItems: 'center' }}
                            className={`px-4 rounded-full ${activeTab === tab ? 'bg-[#60a5fa]' : 'bg-white/5'}`}
                        >
                            <Text className={`text-sm font-bold ${activeTab === tab ? 'text-black' : 'text-slate-400'}`}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View className="mb-8">
                    <Text className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 px-1">Quick Connect</Text>
                    <TouchableOpacity
                        onPress={handleSelectFastest}
                        activeOpacity={0.9}
                        className="rounded-[32px] overflow-hidden border border-[#60a5fa]/30 bg-white/5 flex-row items-center p-5"
                    >
                        <View className="w-12 h-12 rounded-full bg-[#60a5fa]/10 items-center justify-center mr-4 border border-[#60a5fa]/20">
                            <Zap size={24} color="#60a5fa" fill="#60a5fa" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-lg font-bold text-white">Fastest Server</Text>
                            <Text className="text-xs text-[#60a5fa] font-medium uppercase tracking-wider">Low Latency</Text>
                        </View>
                        <ChevronRight size={20} color="#60a5fa" />
                    </TouchableOpacity>
                </View>

                <View>
                    <Text className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 px-1">Available Locations</Text>
                    <View>
                        {filteredServers.map((server, index) => (
                            <ServerItem
                                key={server.id || `${server.code}-${server.city}`}
                                server={server}
                                index={index}
                                isSelected={selectedServer?.id === server.id || (selectedServer?.code === server.code && selectedServer?.city === server.city)}
                                onPress={() => handleSelect(server)}
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
    isSelected,
    onPress
}: {
    server: CountryServer,
    index: number,
    isSelected: boolean,
    onPress: () => void
}) {
    return (
        <Animated.View style={{ marginBottom: 16 }} entering={FadeInDown.delay(index * 50)}>
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.9}
                className={`flex-row items-center p-4 rounded-[32px] border ${isSelected ? 'border-[#60a5fa] bg-[#60a5fa]/5' : 'border-white/10 bg-white/5'}`}
            >
                <View className="w-12 h-12 rounded-full overflow-hidden mr-4 border border-white/10">
                    <Image source={{ uri: server.flagUrl }} className="w-full h-full" resizeMode="cover" />
                </View>

                <View className="flex-1">
                    <Text className="text-lg font-bold text-white">{server.name}</Text>
                    <Text className="text-xs text-slate-400">{server.city}</Text>
                </View>

                <View className="flex-row items-center gap-3">
                    {!server.isFree && <Crown size={18} color="#facc15" fill="#facc15" />}
                    {server.isFree && <Star size={18} color="#60a5fa" fill={isSelected ? "#60a5fa" : "transparent"} />}
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}
