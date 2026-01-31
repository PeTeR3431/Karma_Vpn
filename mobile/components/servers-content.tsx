import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Search, ChevronLeft, Gamepad2, Tv, Zap, Crown } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getCategorizedServers, type CountryServer } from '@/lib/countries-data';
import { useConnection } from '@/lib/connection-context';

export function ServersContent() {
    const navigation = useNavigation<any>();
    const { selectedServer, setSelectedServer, setIsConnected } = useConnection();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<"all" | "fast" | "premium" | "streaming" | "gaming">("all");
    const [tempSelectedServer, setTempSelectedServer] = useState<CountryServer>(selectedServer);

    const categorizedServers = getCategorizedServers();

    const filteredServers = () => {
        let servers = selectedCategory === "all"
            ? [...categorizedServers.fast, ...categorizedServers.premium, ...categorizedServers.streaming, ...categorizedServers.gaming]
            : categorizedServers[selectedCategory];

        if (searchQuery) {
            servers = servers.filter(s =>
                s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.code.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // De-duplicate if needed, but for now just return
        return servers;
    };

    const handleConnect = () => {
        setSelectedServer(tempSelectedServer);
        setIsConnected(true);
        navigation.navigate("Dashboard");
    };

    const categories = [
        { key: "all", label: "All", icon: Zap },
        { key: "fast", label: "Fast", icon: Zap },
        { key: "premium", label: "Premium", icon: Crown },
        { key: "streaming", label: "Streaming", icon: Tv },
        { key: "gaming", label: "Gaming", icon: Gamepad2 },
    ];

    return (
        <View className="flex-1 bg-background pt-4 pb-24">
            {/* Header */}
            <View className="flex-row items-center gap-4 mb-6 px-6">
                <Button
                    onPress={() => navigation.goBack()}
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                >
                    <ChevronLeft size={20} color="white" />
                </Button>
                <View className="flex-1">
                    <Text className="text-xl font-bold text-foreground">Select Server</Text>
                    <Text className="text-xs text-muted-foreground">{filteredServers().length} servers available</Text>
                </View>
            </View>

            {/* Search Bar */}
            <View className="relative mb-6 px-6">
                <View className="absolute left-8 top-3 z-10">
                    <Search size={16} color="#888" />
                </View>
                <Input
                    placeholder="Search countries..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    className="pl-11 h-12 rounded-2xl bg-card border-border/50"
                />
            </View>

            {/* Category Filters */}
            <View className="mb-6">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 8 }}>
                    {categories.map(({ key, label, icon: Icon }) => (
                        <TouchableOpacity
                            key={key}
                            onPress={() => setSelectedCategory(key as any)}
                            className={`flex-row items-center gap-2 px-4 py-2 rounded-full border ${selectedCategory === key
                                ? 'bg-primary border-primary'
                                : 'bg-card border-border/50'
                                }`}
                        >
                            <Icon size={16} color={selectedCategory === key ? 'white' : 'white'} />
                            <Text className={`text-sm font-medium ${selectedCategory === key ? 'text-primary-foreground' : 'text-foreground'}`}>
                                {label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Server List */}
            <View className="flex-1 px-6">
                <FlatList
                    data={filteredServers()}
                    keyExtractor={(item, index) => `${item.code}-${index}`}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    renderItem={({ item: server }) => (
                        <TouchableOpacity
                            onPress={() => setTempSelectedServer(server)}
                            className={`flex-row items-center justify-between p-4 rounded-2xl mb-2 border ${tempSelectedServer?.code === server.code
                                ? 'bg-primary/10 border-primary'
                                : 'bg-card border-border/50'
                                }`}
                        >
                            <View className="flex-row items-center gap-3 flex-1">
                                <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center border border-border/50">
                                    <Text className="text-2xl">{server.flag}</Text>
                                </View>
                                <View className="flex-1">
                                    <View className="flex-row items-center gap-2">
                                        <Text className="font-semibold text-foreground">{server.name}</Text>
                                        {server.category === "premium" && (
                                            <Crown size={12} color="#84cc16" />
                                        )}
                                    </View>
                                    <View className="flex-row items-center gap-3 mt-0.5">
                                        <Text className="text-xs text-muted-foreground">{server.locations} locations • {server.ping}ms</Text>
                                        <Text className={`text-xs font-medium ${server.load < 40 ? 'text-primary' : server.load < 60 ? 'text-yellow-500' : 'text-destructive'
                                            }`}>
                                            • {server.load}% load
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Signal Strength */}
                            <View className="flex-row gap-1 ml-3 items-end h-6">
                                {[...Array(5)].map((_, i) => (
                                    <View
                                        key={i}
                                        className={`w-1 rounded-full ${i < server.signal ? 'bg-primary' : 'bg-muted'
                                            }`}
                                        style={{ height: (i + 1) * 3 + 6 }}
                                    />
                                ))}
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* Bottom Action - Fixed */}
            <View className="absolute bottom-0 left-0 right-0 p-6 bg-background">
                <Button
                    onPress={handleConnect}
                    disabled={!tempSelectedServer}
                    size="lg"
                    className="w-full h-14 rounded-2xl bg-primary"
                >
                    <Text className="text-base font-semibold text-primary-foreground">
                        {tempSelectedServer ? `Connect to ${tempSelectedServer.name}` : 'Select a server'}
                    </Text>
                </Button>
            </View>
        </View>
    );
}
