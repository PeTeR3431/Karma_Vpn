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
        const width = 100; // Shorter width for horizontal row
        const height = 24;
        const step = width / (sparklineData.length - 1);
        const max = Math.max(...sparklineData, 1);

        let path = `M 0 ${height - (sparklineData[0] / max) * height}`;

        for (let i = 1; i < sparklineData.length; i++) {
            const x = i * step;
            const y = height - (sparklineData[i] / max) * height;
            path += ` L ${x} ${y}`;
        }
        return path;
    };

    return (
        <View className="rounded-2xl overflow-hidden border border-white/5 bg-zinc-900/40">
            <BlurView intensity={20} tint="dark" className="p-3 flex-row items-center gap-3">
                <View
                    className="w-10 h-10 rounded-full items-center justify-center border border-white/10"
                    style={{ backgroundColor: `${color}20` }}
                >
                    <Icon size={20} color={color} />
                </View>

                <View className="flex-1 min-w-[70px]">
                    <Text className="text-[9px] font-bold text-muted-foreground uppercase tracking-[1px]">{label}</Text>
                    <View className="flex-row items-baseline gap-1">
                        <Text className="text-lg font-black text-foreground tracking-tight">{value}</Text>
                        <Text className="text-[8px] font-bold text-muted-foreground uppercase">{unit}</Text>
                    </View>
                </View>

                {/* Sparkline with Gradient - Moved to right side */}
                <View className="h-8 flex-1 ml-2">
                    <Svg height="100%" width="100%" viewBox="0 0 100 24">
                        <Defs>
                            <LinearGradient id={`grad-${label}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                <Stop offset="0%" stopColor={color} stopOpacity="0.3" />
                                <Stop offset="100%" stopColor={color} stopOpacity="0" />
                            </LinearGradient>
                        </Defs>
                        <Path
                            d={generatePath()}
                            fill="none"
                            stroke={color}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <Path
                            d={`${generatePath()} L 100 24 L 0 24 Z`}
                            fill={`url(#grad-${label})`}
                        />
                    </Svg>
                </View>
            </BlurView>
        </View>
    );
}
