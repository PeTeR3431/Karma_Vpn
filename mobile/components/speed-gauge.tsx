import React, { useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { Path, G, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
    useAnimatedProps,
    withTiming,
    useSharedValue,
    useAnimatedStyle,
    withSpring
} from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const { width: windowWidth } = Dimensions.get('window');

interface SpeedGaugeProps {
    value: number; // 0 to 80
    unit: string;
    isTesting: boolean;
}

export function SpeedGauge({ value, unit, isTesting }: SpeedGaugeProps) {
    const size = windowWidth * 0.82;
    const strokeWidth = 20;
    const center = size / 2;
    // Tighter radius to ensure labels don't cut off at screen edges
    const radius = (size - 100) / 2;

    // Shared value for animated speed
    const animatedSpeed = useSharedValue(0);

    useEffect(() => {
        animatedSpeed.value = withTiming(value, { duration: 400 });
    }, [value]);

    const startAngle = 210;
    const totalAngle = 300;

    const animatedProps = useAnimatedProps(() => {
        const cappedValue = Math.min(Math.max(animatedSpeed.value, 0), 80);
        const progress = cappedValue / 80;
        const currentAngle = startAngle + (progress * totalAngle);

        const polarToCartesian = (cX: number, cY: number, rad: number, angleDeg: number) => {
            const angleRad = (angleDeg - 90) * Math.PI / 180.0;
            return {
                x: cX + (rad * Math.cos(angleRad)),
                y: cY + (rad * Math.sin(angleRad))
            };
        };

        const start = polarToCartesian(center, center, radius, startAngle);
        const end = polarToCartesian(center, center, radius, currentAngle);
        const largeArcFlag = progress > 0.6 ? "1" : "0";

        return {
            d: `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`
        };
    });

    const marks = [0, 10, 20, 30, 40, 50, 60, 70, 80];

    const glowStyle = useAnimatedStyle(() => ({
        opacity: withSpring(isTesting ? 0.4 : 0.15),
        transform: [{ scale: withSpring(isTesting ? 1.3 : 1) }],
    }));

    return (
        <View className="items-center justify-center" style={{ width: size, height: size * 0.85 }}>
            {/* Soft Background Glow - Improved to be less "solid" */}
            <Animated.View
                style={[
                    glowStyle,
                    {
                        position: 'absolute',
                        width: radius * 1.8,
                        height: radius * 1.8,
                        borderRadius: size,
                        backgroundColor: '#5c9a3e',
                        opacity: 0.2, // Base opacity
                        // Using a simple blur on a transparent background
                        shadowColor: '#5c9a3e',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 1,
                        shadowRadius: 50,
                        elevation: 20,
                    }
                ]}
            />

            <Svg width={size} height={size * 0.85} viewBox={`0 0 ${size} ${size * 0.85}`}>
                <Defs>
                    <LinearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor="#5c9a3e" stopOpacity="0.4" />
                        <Stop offset="50%" stopColor="#87c86a" stopOpacity="0.8" />
                        <Stop offset="100%" stopColor="#5c9a3e" stopOpacity="1" />
                    </LinearGradient>
                    <LinearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
                        <Stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
                    </LinearGradient>
                </Defs>

                {/* Track - More visible */}
                <Path
                    d={`M ${center + radius * Math.cos((210 - 90) * Math.PI / 180)} ${center + radius * Math.sin((210 - 90) * Math.PI / 180)} 
                       A ${radius} ${radius} 0 1 1 ${center + radius * Math.cos((startAngle + totalAngle - 90) * Math.PI / 180)} ${center + radius * Math.sin((startAngle + totalAngle - 90) * Math.PI / 180)}`}
                    stroke="url(#trackGradient)"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                />

                {/* Animated Progress */}
                <AnimatedPath
                    animatedProps={animatedProps}
                    stroke="url(#gaugeGradient)"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                />

                {/* Ticks & Labels - Repositioned to keep away from edges */}
                {marks.map((mark) => {
                    const angle = 210 + (mark / 80) * 300;
                    const angleRad = (angle - 90) * Math.PI / 180.0;

                    const p1 = {
                        x: center + (radius + 12) * Math.cos(angleRad),
                        y: center + (radius + 12) * Math.sin(angleRad)
                    };
                    const p2 = {
                        x: center + (radius + 18) * Math.cos(angleRad),
                        y: center + (radius + 18) * Math.sin(angleRad)
                    };
                    // Move labels inward/outward more carefully
                    const labelRadius = radius + 32;
                    const textP = {
                        x: center + labelRadius * Math.cos(angleRad),
                        y: center + labelRadius * Math.sin(angleRad)
                    };

                    const isActive = mark <= value;

                    return (
                        <G key={mark}>
                            <Path
                                d={`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`}
                                stroke={isActive ? '#5c9a3e' : '#3f3f46'}
                                strokeWidth={isActive ? 2 : 1.5}
                            />
                            <SvgText
                                x={textP.x}
                                y={textP.y}
                                fill={isActive ? '#87c86a' : '#71717a'}
                                fontSize="11"
                                fontWeight="800"
                                textAnchor="middle"
                                alignmentBaseline="middle"
                                opacity={isActive ? 1 : 0.6}
                            >
                                {mark}
                            </SvgText>
                        </G>
                    );
                })}
            </Svg>

            {/* Value Display - Floating in center */}
            <View className="absolute top-[35%] items-center justify-center">
                <Text className="text-6xl font-black text-foreground tracking-tighter shadow-black shadow-lg">
                    {value.toFixed(2).replace('.', ',')}
                </Text>
                <View className="flex-row items-center gap-2 mt-3 bg-white/5 border border-white/10 px-4 py-1.5 rounded-2xl">
                    <View className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-orange-500 shadow-md" />
                    <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-[3px]">{unit}</Text>
                </View>
            </View>
        </View>
    );
}
