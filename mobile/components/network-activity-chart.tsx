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
        <View className="rounded-2xl bg-card p-4 relative overflow-hidden border border-border/50">
            <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-sm font-semibold text-foreground">Network Activity</Text>
                <View className="flex-row items-center gap-2">
                    {/* Note: NativeWind doesn't support 'animate-pulse' well without config, just static for now */}
                    <View className={`w-2 h-2 rounded-full ${isConnected ? 'bg-primary' : 'bg-muted'}`} />
                    <Text className="text-xs text-muted-foreground">{isConnected ? 'Live' : 'Inactive'}</Text>
                </View>
            </View>

            <View style={{ height, width }}>
                <Svg height="100%" width="100%" viewBox={`0 0 ${width} ${height}`}>
                    <Defs>
                        <LinearGradient id="gradientDownload" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor="#84cc16" stopOpacity={0.5} />
                            <Stop offset="1" stopColor="#84cc16" stopOpacity={0.05} />
                        </LinearGradient>
                        <LinearGradient id="gradientUpload" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor="#4ade80" stopOpacity={0.3} />
                            <Stop offset="1" stopColor="#4ade80" stopOpacity={0.05} />
                        </LinearGradient>
                    </Defs>
                    <Path
                        d={createPath('download')}
                        fill="url(#gradientDownload)"
                        stroke="#84cc16"
                        strokeWidth="2"
                    />
                    <Path
                        d={createPath('upload')}
                        fill="url(#gradientUpload)"
                        stroke="#4ade80"
                        strokeWidth="1.5"
                    />
                </Svg>
            </View>

            {!isConnected && (
                <View className="absolute inset-0 items-center justify-center bg-zinc-950/80 rounded-2xl">
                    <View className="items-center p-6">
                        <View className="w-14 h-14 rounded-full bg-primary/10 items-center justify-center mb-3">
                            <Text style={{ fontSize: 24 }}>⚡</Text>
                        </View>
                        <Text className="text-base font-bold text-foreground">Connect to view activity</Text>
                        <Text className="text-xs text-muted-foreground mt-1 text-center">Real-time network monitoring enabled</Text>
                    </View>
                </View>
            )}
        </View>
    );
}
