import React, { useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
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
    value: number;
    unit: string;
    isTesting: boolean;
}

export function SpeedGauge({ value, unit, isTesting }: SpeedGaugeProps) {
    const size = windowWidth * 0.82;
    const strokeWidth = 20;
    const center = size / 2;
    const radius = (size - 100) / 2;

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
        opacity: withSpring(isTesting ? 0.3 : 0.1),
        transform: [{ scale: withSpring(isTesting ? 1.2 : 1) }],
    }));

    return (
        <View style={{ width: size, height: size * 0.85, alignItems: 'center', justifyContent: 'center' }}>
            {/* Background Glow */}
            <Animated.View
                style={[
                    glowStyle,
                    {
                        position: 'absolute',
                        width: radius * 2,
                        height: radius * 2,
                        borderRadius: radius,
                        backgroundColor: '#4ade8020',
                    }
                ]}
            />

            <Svg width={size} height={size * 0.85} viewBox={`0 0 ${size} ${size * 0.85}`}>
                <Defs>
                    <LinearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor="#4ade80" stopOpacity="0.5" />
                        <Stop offset="100%" stopColor="#4ade80" stopOpacity="1" />
                    </LinearGradient>
                    <LinearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
                        <Stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
                    </LinearGradient>
                </Defs>

                {/* Track */}
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

                {/* Ticks */}
                {marks.map((mark) => {
                    const angle = 210 + (mark / 80) * 300;
                    const angleRad = (angle - 90) * Math.PI / 180.0;
                    const p1 = { x: center + (radius + 10) * Math.cos(angleRad), y: center + (radius + 10) * Math.sin(angleRad) };
                    const p2 = { x: center + (radius + 16) * Math.cos(angleRad), y: center + (radius + 16) * Math.sin(angleRad) };
                    const textP = { x: center + (radius + 30) * Math.cos(angleRad), y: center + (radius + 30) * Math.sin(angleRad) };
                    const isActive = mark <= value;

                    return (
                        <G key={mark}>
                            <Path d={`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`} stroke={isActive ? '#4ade80' : '#3f3f46'} strokeWidth={1.5} />
                            <SvgText x={textP.x} y={textP.y} fill={isActive ? '#4ade80' : '#71717a'} fontSize="10" fontWeight="bold" textAnchor="middle" alignmentBaseline="middle">
                                {mark}
                            </SvgText>
                        </G>
                    );
                })}
            </Svg>

            <View style={styles.valueContainer}>
                <Text style={styles.valueText}>{value.toFixed(1).replace('.', ',')}</Text>
                <View style={styles.unitContainer}>
                    <View style={styles.activeDot} />
                    <Text style={styles.unitText}>{unit}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    valueContainer: {
        position: 'absolute',
        top: '30%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    valueText: {
        fontSize: 56,
        fontWeight: '900',
        color: '#ffffff',
        letterSpacing: -2,
    },
    unitContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
        paddingHorizontal: 12,
        paddingVertical: 4,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
    },
    activeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#4ade80',
    },
    unitText: {
        fontSize: 10,
        color: '#a1a1aa',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
});
