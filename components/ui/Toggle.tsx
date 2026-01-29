import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated, Platform } from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';

interface ToggleProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({ value, onValueChange, disabled = false }) => {
    const translateX = React.useRef(new Animated.Value(value ? 1 : 0)).current;

    React.useEffect(() => {
        Animated.spring(translateX, {
            toValue: value ? 1 : 0,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
        }).start();
    }, [value]);

    const handlePress = () => {
        if (!disabled) {
            onValueChange(!value);
        }
    };

    const thumbTranslateX = translateX.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 22], // Adjust based on track width (48px - thumb width 20px - padding 2px each side)
    });

    return (
        <TouchableOpacity
            style={[
                styles.track,
                value && styles.trackActive,
                disabled && styles.trackDisabled,
            ]}
            onPress={handlePress}
            activeOpacity={0.8}
            disabled={disabled}
        >
            <Animated.View
                style={[
                    styles.thumb,
                    {
                        transform: [{ translateX: thumbTranslateX }],
                    },
                ]}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    track: {
        width: 48,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colors.cardDark,
        borderWidth: 1,
        borderColor: Colors.borderDark,
        justifyContent: 'center',
        padding: 2,
    },
    trackActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    trackDisabled: {
        opacity: 0.5,
    },
    thumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: Colors.textPrimary,
        // Cross-platform shadow
        ...Platform.select({
            web: {
                boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.2)',
            },
            default: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 2,
            },
        }),
    },
});

export default Toggle;
