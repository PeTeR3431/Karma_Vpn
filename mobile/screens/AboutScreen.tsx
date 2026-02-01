import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Info, Shield, FileText, ChevronRight, Share2, Star } from 'lucide-react-native';
import { AppBackground } from '@/components/app-background';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

type AboutView = 'menu' | 'privacy' | 'terms';

export function AboutScreen() {
    const navigation = useNavigation<any>();
    const [view, setView] = useState<AboutView>('menu');

    const renderMenu = () => (
        <Animated.View entering={FadeInDown.duration(400)}>
            <View style={styles.card}>
                <LinearGradient colors={['#18181b', '#09090b']} style={styles.cardInner}>
                    <AboutMenuItem
                        icon={Shield}
                        label="Privacy Policy"
                        onPress={() => setView('privacy')}
                    />
                    <AboutMenuItem
                        icon={FileText}
                        label="Terms of Use"
                        onPress={() => setView('terms')}
                        isLast
                    />
                </LinearGradient>
            </View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Application</Text>
            </View>

            <View style={styles.card}>
                <LinearGradient colors={['#18181b', '#09090b']} style={styles.cardInner}>
                    <AboutMenuItem icon={Star} label="Rate the app" />
                    <AboutMenuItem icon={Share2} label="Share with friends" isLast />
                </LinearGradient>
            </View>

            <View style={styles.footer}>
                <Text style={styles.versionText}>Karma VPN v1.0.0</Text>
                <Text style={styles.copyrightText}>© 2026 Karma VPN. All rights reserved.</Text>
            </View>
        </Animated.View>
    );

    const renderPrivacy = () => (
        <Animated.View entering={FadeIn} style={styles.contentScroll}>
            <Text style={styles.contentTitle}>Privacy Policy</Text>
            <Text style={styles.contentText}>
                Last updated: October 2026{"\n\n"}
                Your privacy is our top priority. Karma VPN operates under a strict no-logs policy. This means we do not track, collect, or share your private data.{"\n\n"}
                <Text style={styles.boldText}>1. Data We Do NOT Collect:</Text>{"\n"}
                - We do not log your IP address.{"\n"}
                - We do not log your browsing history.{"\n"}
                - We do not log your DNS queries.{"\n"}
                - We do not log any traffic data.{"\n\n"}
                <Text style={styles.boldText}>2. Information We Collect:</Text>{"\n"}
                We only collect minimal technical information to ensure service quality, such as:{"\n"}
                - Aggregated app crash reports.{"\n"}
                - Connection success rates.{"\n\n"}
                <Text style={styles.boldText}>3. Security:</Text>{"\n"}
                We use AES-256-GCM encryption to protect your data during transit. Your connection is secured using industry-leading protocols.
            </Text>
        </Animated.View>
    );

    const renderTerms = () => (
        <Animated.View entering={FadeIn} style={styles.contentScroll}>
            <Text style={styles.contentTitle}>Terms of Use</Text>
            <Text style={styles.contentText}>
                Last updated: October 2026{"\n\n"}
                By using Karma VPN, you agree to the following terms:{"\n\n"}
                <Text style={styles.boldText}>1. Usage License:</Text>{"\n"}
                Karma VPN grants you a non-exclusive, non-transferable license to use the service for personal, non-commercial purposes.{"\n\n"}
                <Text style={styles.boldText}>2. Prohibited Activities:</Text>{"\n"}
                You agree NOT to use the service for:{"\n"}
                - Any illegal activities.{"\n"}
                - Spamming or distributing malware.{"\n"}
                - Hacking or attempting to breach our servers.{"\n"}
                - Violating intellectual property rights.{"\n\n"}
                <Text style={styles.boldText}>3. Termination:</Text>{"\n"}
                We reserve the right to suspend or terminate access to our service for users who violate these terms.{"\n\n"}
                <Text style={styles.boldText}>4. Disclaimer:</Text>{"\n"}
                The service is provided "as is" without warranties of any kind.
            </Text>
        </Animated.View>
    );

    const handleBack = () => {
        if (view === 'menu') {
            navigation.goBack();
        } else {
            setView('menu');
        }
    };

    return (
        <AppBackground className="flex-1">
            <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <ChevronLeft size={24} color="#5c9a3e" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>
                        {view === 'menu' ? 'About' : view === 'privacy' ? 'Privacy' : 'Terms'}
                    </Text>
                    <View style={styles.headerSpacer} />
                </View>

                <ScrollView
                    style={styles.container}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {view === 'menu' && (
                        <View style={styles.logoSection}>
                            <View style={styles.logoContainer}>
                                <Info size={40} color="#5c9a3e" />
                            </View>
                            <Text style={styles.appName}>Karma VPN</Text>
                            <Text style={styles.tagline}>Secure • Private • fast</Text>
                        </View>
                    )}

                    {view === 'menu' ? renderMenu() : view === 'privacy' ? renderPrivacy() : renderTerms()}
                </ScrollView>
            </SafeAreaView>
        </AppBackground>
    );
}

function AboutMenuItem({ icon: Icon, label, onPress, isLast }: { icon: any, label: string, onPress?: () => void, isLast?: boolean }) {
    return (
        <TouchableOpacity
            style={[styles.menuItem, !isLast && styles.menuItemBorder]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.menuItemLeft}>
                <View style={styles.iconWrapper}>
                    <Icon size={18} color="#5c9a3e" />
                </View>
                <Text style={styles.menuItemLabel}>{label}</Text>
            </View>
            <ChevronRight size={18} color="#52525b" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    headerSpacer: {
        width: 40,
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    logoSection: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: '#18181b',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(92, 154, 62, 0.2)',
        marginBottom: 16,
    },
    appName: {
        fontSize: 24,
        fontWeight: '900',
        color: '#ffffff',
        letterSpacing: -0.5,
    },
    tagline: {
        fontSize: 12,
        color: '#5c9a3e',
        textTransform: 'uppercase',
        letterSpacing: 3,
        marginTop: 4,
        fontWeight: 'bold',
    },
    card: {
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        marginBottom: 24,
    },
    cardInner: {
        padding: 4,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    menuItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(92, 154, 62, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuItemLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: '#e4e4e7',
    },
    sectionHeader: {
        paddingHorizontal: 4,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#71717a',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    footer: {
        alignItems: 'center',
        marginTop: 20,
    },
    versionText: {
        fontSize: 12,
        color: '#3f3f46',
        fontWeight: '600',
    },
    copyrightText: {
        fontSize: 10,
        color: '#27272a',
        marginTop: 4,
    },
    contentScroll: {
        marginTop: 10,
    },
    contentTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#ffffff',
        marginBottom: 20,
    },
    contentText: {
        fontSize: 14,
        color: '#a1a1aa',
        lineHeight: 22,
    },
    boldText: {
        color: '#e4e4e7',
        fontWeight: 'bold',
    },
});
