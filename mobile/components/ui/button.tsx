import * as React from 'react';
import { Text, Pressable, StyleSheet, ColorValue } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { LinearGradient } from 'expo-linear-gradient';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
    "flex-row items-center justify-center rounded-2xl transition-all active:opacity-90 overflow-hidden",
    {
        variants: {
            variant: {
                default: 'bg-primary',
                destructive: 'bg-destructive',
                outline: 'border border-border/50 bg-background/20',
                secondary: 'bg-secondary',
                ghost: '',
                link: '',
                gradient: '', // Background handled by LinearGradient
            },
            size: {
                default: 'h-12 px-6',
                sm: 'h-9 rounded-xl px-3',
                lg: 'h-14 rounded-2xl px-10',
                icon: 'h-10 w-10 rounded-full',
                'icon-sm': 'h-9 w-9 rounded-full',
                'icon-lg': 'h-11 w-11 rounded-full',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

const buttonTextVariants = cva(
    "text-sm font-bold",
    {
        variants: {
            variant: {
                default: 'text-primary-foreground',
                destructive: 'text-destructive-foreground',
                outline: 'text-foreground',
                secondary: 'text-secondary-foreground',
                ghost: 'text-foreground',
                link: 'text-primary underline',
                gradient: 'text-black',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

interface ButtonProps
    extends Omit<React.ComponentPropsWithoutRef<typeof Pressable>, 'children'>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    children?: React.ReactNode;
}

const Button = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
    ({ className, variant, size, children, ...props }, ref) => {
        const isGradient = variant === 'gradient' || variant === 'default';

        const gradientColors: readonly [ColorValue, ColorValue, ...ColorValue[]] =
            variant === 'gradient'
                ? ['#4ade80', '#22c55e'] // New Vibrant Green Gradient
                : ['#18181b', '#09090b']; // Dark Zinc

        return (
            <Pressable
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            >
                {isGradient && (
                    <LinearGradient
                        colors={gradientColors}
                        style={StyleSheet.absoluteFill}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                    />
                )}
                {typeof children === 'string' ? (
                    <Text className={cn(buttonTextVariants({ variant }))}>
                        {children}
                    </Text>
                ) : (
                    children
                )}
            </Pressable>
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
