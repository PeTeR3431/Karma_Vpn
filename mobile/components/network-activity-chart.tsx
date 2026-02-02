import React, { useEffect, useState } from "react";
import { View, Text, Dimensions } from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { useConnection } from "@/lib/connection-context";

interface DataPoint {
    time: number
    download: number
    upload: number
}

export function NetworkActivityChart() {
    const { isConnected } = useConnection();
    const [data, setData] = useState<DataPoint[]>([]);
    const width = Dimensions.get('window').width - 48; // padding
    const height = 128;

    useEffect(() => {
        // Generate initial realistic data
        const initialData: DataPoint[] = Array.from({ length: 30 }, (_, i) => ({
            time: i,
            download: 60 + Math.random() * 40 + Math.sin(i / 3) * 20,
            upload: 30 + Math.random() * 20 + Math.cos(i / 4) * 10,
        }));
        setData(initialData);

        if (isConnected) {
            let counter = 30;
            const interval = setInterval(() => {
                setData(prevData => {
                    const newData = [...prevData.slice(1)];
                    const isBurst = Math.random() > 0.85;
                    newData.push({
                        time: counter++,
                        download: isBurst ? 120 + Math.random() * 30 : 60 + Math.random() * 40,
                        upload: isBurst ? 60 + Math.random() * 20 : 30 + Math.random() * 20,
                    });
                    return newData;
                });
            }, 800);

            return () => clearInterval(interval);
        }
    }, [isConnected]);

    // Simple path generator
    const createPath = (key: 'download' | 'upload') => {
        if (data.length === 0) return "";
        const maxValue = 150;
        const stepX = width / (data.length - 1);

        const points = data.map((d, i) => {
            const x = i * stepX;
            const y = height - (d[key] / maxValue) * height;
            return `${x},${y}`;
        });

        return `M0,${height} L${points.join(" L")} L${width},${height} Z`;
    };

    return (
        <View className="rounded-2xl bg-white/5 p-4 relative overflow-hidden border border-white/10">
            <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-sm font-semibold text-foreground">Network Activity</Text>
                <View className="flex-row items-center gap-2">
                    {/* Note: NativeWind doesn't support 'animate-pulse' well without config, just static for now */}
                    <View className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#4ade80]' : 'bg-muted'}`} />
                    <Text className="text-xs text-muted-foreground">{isConnected ? 'Live' : 'Inactive'}</Text>
                </View>
            </View>

            {isConnected ? (
                <View style={{ height, width }}>
                    <Svg height="100%" width="100%" viewBox={`0 0 ${width} ${height}`}>
                        <Defs>
                            <LinearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                <Stop offset="0%" stopColor="#4ade80" stopOpacity="0.3" />
                                <Stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
                            </LinearGradient>
                            <LinearGradient id="gradientUpload" x1="0" y1="0" x2="0" y2="1">
                                <Stop offset="0" stopColor="#4ade80" stopOpacity={0.15} />
                                <Stop offset="1" stopColor="#4ade80" stopOpacity={0} />
                            </LinearGradient>
                        </Defs>
                        <Path
                            d={createPath('download')}
                            fill="url(#gradient)"
                            stroke="#4ade80"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <Path
                            d={createPath('upload')}
                            fill="none"
                            stroke="#22c55e"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </Svg>
                </View>
            ) : (
                <View style={{ height, width }} className="items-center justify-center bg-teal-950/20 rounded-xl">
                    <Text style={{ fontSize: 32 }}>⚡</Text>
                    <Text className="text-base font-bold text-foreground mt-4">Connect to View Activity</Text>
                    <Text className="text-xs text-muted-foreground mt-1 text-center">Real-time monitoring will start automatically</Text>
                </View>
            )}
        </View>
    );
}
