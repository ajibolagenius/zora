import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
    Dimensions,
    Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Warning, CheckCircle, Info, XCircle } from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
    message: string;
    type?: ToastType;
    duration?: number;
    onClose?: () => void;
    action?: {
        label: string;
        onPress: () => void;
    };
}

const TOAST_DURATION = 4000; // 4 seconds default

export function Toast({
    message,
    type = 'info',
    duration = TOAST_DURATION,
    onClose,
    action,
}: ToastProps) {
    // Start from bottom (positive value) and slide up to 0
    const slideAnim = useRef(new Animated.Value(100)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const insets = useSafeAreaInsets();

    useEffect(() => {
        // Slide in animation from bottom
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();

        // Auto dismiss after duration
        const timer = setTimeout(() => {
            dismiss();
        }, duration);

        return () => clearTimeout(timer);
    }, []);

    const dismiss = () => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 100, // Slide down
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onClose?.();
        });
    };

    const getIcon = () => {
        const iconSize = 20;
        const iconColor = Colors.textPrimary;

        switch (type) {
            case 'success':
                return <CheckCircle size={iconSize} color={iconColor} weight="fill" />;
            case 'error':
                return <XCircle size={iconSize} color={iconColor} weight="fill" />;
            case 'warning':
                return <Warning size={iconSize} color={iconColor} weight="fill" />;
            case 'info':
            default:
                return <Info size={iconSize} color={iconColor} weight="fill" />;
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return '#22C55E'; // success color from design system
            case 'error':
                return Colors.error; // #CC0000
            case 'warning':
                return Colors.warning; // #FFCC00
            case 'info':
            default:
                return Colors.info; // #3B82F6
        }
    };

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ translateY: slideAnim }],
                    opacity: opacityAnim,
                    paddingBottom: Math.max(insets.bottom, Spacing.base),
                },
            ]}
        >
            <View style={[styles.toast, { backgroundColor: getBackgroundColor() }]}>
                <View style={styles.content}>
                    {getIcon()}
                    <Text style={styles.message} numberOfLines={3}>
                        {message}
                    </Text>
                </View>
                <View style={styles.actions}>
                    {action && (
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => {
                                action.onPress();
                                dismiss();
                            }}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.actionText}>{action.label}</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={dismiss}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        activeOpacity={0.8}
                    >
                        <X size={18} color={Colors.textPrimary} weight="bold" />
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        paddingHorizontal: Spacing.xl,
    },
    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: BorderRadius.lg,
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.md,
        minHeight: 56,
        // Cross-platform shadow
        ...Platform.select({
            web: {
                boxShadow: '0px 4px 8px rgba(34, 23, 16, 0.2)',
            },
            default: {
                shadowColor: Colors.backgroundDark,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 8,
            },
        }),
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        marginRight: Spacing.sm,
    },
    message: {
        flex: 1,
        fontFamily: FontFamily.body,
        fontSize: FontSize.small,
        color: Colors.textPrimary,
        lineHeight: 20,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    actionButton: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.md,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    actionText: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.small,
        color: Colors.textPrimary,
    },
    closeButton: {
        padding: Spacing.xs,
    },
});
