import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Loader2 } from 'lucide-react-native';

export function GetStartedCTA() {
    const navigation = useNavigation<any>();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleGetStarted = () => {
        setIsLoading(true);
        // Simulate authentication
        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
            // Navigate to home
            setTimeout(() => {
                navigation.navigate('Home');
            }, 500);
        }, 1500);
    };

    return (
        <View className="mt-12 w-full max-w-xs px-6">
            <Button
                size="lg"
                onPress={handleGetStarted}
                disabled={isLoading}
                className="group relative h-14 w-full rounded-2xl bg-[#60a5fa] flex-row items-center justify-center"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 animate-spin text-primary-foreground" size={20} color="white" />
                        <Text className="text-base font-semibold text-primary-foreground ml-2">Connecting...</Text>
                    </>
                ) : isSuccess ? (
                    <>
                        <Check className="mr-2 text-primary-foreground" size={20} color="white" />
                        <Text className="text-base font-semibold text-primary-foreground ml-2">Welcome!</Text>
                    </>
                ) : (
                    <>
                        <Text className="text-base font-semibold text-primary-foreground mr-2">Get Started</Text>
                        <ArrowRight className="text-primary-foreground" size={20} color="white" />
                    </>
                )}
            </Button>
        </View>
    );
}
