import React from 'react';
import { View, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { Activity, ArrowUpCircle, ArrowDownCircle } from 'lucide-react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface SpeedStatCardProps {
    icon: 'Activity' | 'ArrowUpCircle' | 'ArrowDownCircle';
    label: string;
    value: string;
    unit: string;
    color: string;
    sparklineData: number[];
}

const IconMap = {
    Activity,
    ArrowUpCircle,
    ArrowDownCircle
};

export function SpeedStatCard({ icon, label, value, unit, color, sparklineData }: SpeedStatCardProps) {
    const Icon = IconMap[icon];

    // Smooth sparkline path generation using Bézier-like approach
    const generatePath = () => {
        if (!sparklineData || !sparklineData.length) return "";
        const width = 200;
        const height = 40;
        const step = width / (sparklineData.length - 1);
        const max = Math.max(...sparklineData, 1);

        let path = `M 0 ${height - (sparklineData[0] / max) * height}`;

        for (let i = 1; i < sparklineData.length; i++) {
            const x = i * step;
            const y = height - (sparklineData[i] / max) * height;
            // Simple line for now, but cleaner spacing
            path += ` L ${x} ${y}`;
        }
        return path;
    };

    return (
        <View className="mb-4 rounded-3xl overflow-hidden border border-white/5 bg-zinc-900/40">
            <BlurView intensity={20} tint="dark" className="p-5">
                <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center gap-4">
                        <View
                            className="w-12 h-12 rounded-2xl items-center justify-center border border-white/10"
                            style={{ backgroundColor: `${color}20` }}
                        >
                            <Icon size={24} color={color} />
                        </View>
                        <View>
                            <Text className="text-xs font-bold text-muted-foreground uppercase tracking-[2px]">{label}</Text>
                            <View className="flex-row items-baseline gap-1 mt-0.5">
                                <Text className="text-2xl font-black text-foreground tracking-tight">{value}</Text>
                                <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{unit}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Minimal status indicator */}
                    <View className="px-3 py-1 rounded-full bg-white/5 border border-white/5">
                        <View className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                    </View>
                </View>

                {/* Sparkline with Gradient */}
                <View className="h-12 w-full mt-2">
                    <Svg height="100%" width="100%" viewBox="0 0 200 40">
                        <Defs>
                            <LinearGradient id={`grad-${label}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                <Stop offset="0%" stopColor={color} stopOpacity="0.4" />
                                <Stop offset="100%" stopColor={color} stopOpacity="0" />
                            </LinearGradient>
                        </Defs>
                        <Path
                            d={generatePath()}
                            fill="none"
                            stroke={color}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <Path
                            d={`${generatePath()} L 200 40 L 0 40 Z`}
                            fill={`url(#grad-${label})`}
                        />
                    </Svg>
                </View>
            </BlurView>
        </View>
    );
}
