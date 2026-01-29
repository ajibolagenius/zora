import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { Image, ImageProps } from 'expo-image';
import { Colors } from '../../constants/colors';
import { PlaceholderImages, PlaceholderBlurhash } from '../../constants/assets';

interface LazyImageProps extends Omit<ImageProps, 'source'> {
    source: string | { uri: string } | null | undefined;
    placeholder?: string;
    fallback?: string;
    showLoader?: boolean;
    blurhash?: string;
    /**
     * Loading strategy: 'eager' for above-the-fold content (headers, hero images),
     * 'lazy' for below-the-fold content. Maps to expo-image priority prop.
     */
    loading?: 'eager' | 'lazy';
}

/**
 * LazyImage Component
 * Optimized image component with lazy loading, placeholder, and error handling
 * Uses expo-image for better performance and caching
 *
 * Caching Strategy:
 * - memory-disk: Caches images in both memory and disk for optimal performance
 * - Automatic cache management by expo-image
 * - Images persist across app restarts (disk cache)
 */
export const LazyImage: React.FC<LazyImageProps> = ({
    source,
    placeholder,
    fallback,
    showLoader = true,
    blurhash,
    loading,
    style,
    ...props
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Normalize source to string or object
    const imageUri = typeof source === 'string'
        ? source
        : source?.uri || null;

    // Determine placeholder (blurhash) and fallback (actual image URL)
    // Blurhash is rendered natively without network requests - much faster than image URLs
    const defaultBlurhash = PlaceholderBlurhash.default;
    const fallbackUri = fallback || PlaceholderImages.image;

    // Handle require() for local images and normalize source
    const getImageSource = (uri: string | null | undefined) => {
        if (!uri) return fallbackUri;
        return uri;
    };

    useEffect(() => {
        if (imageUri && !hasError) {
            setIsLoading(true);
            setHasError(false);
        }
    }, [imageUri, hasError]);

    const handleLoadEnd = () => {
        setIsLoading(false);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    const finalImageUri = imageUri || fallbackUri;
    // Prefer blurhash for instant placeholder (no network request needed)
    // Falls back to provided placeholder prop, then default blurhash
    const finalPlaceholder = blurhash || placeholder || defaultBlurhash;
    const finalFallback = fallbackUri;

    // Enhanced caching: memory-disk provides best performance
    // - Memory cache: Fast access for recently viewed images
    // - Disk cache: Persists across app restarts, larger capacity
    const cachePolicy = props.cachePolicy || 'memory-disk';

    // Optimize image loading based on priority
    // Map loading prop to expo-image priority: eager -> high, lazy -> low, default -> normal
    const imagePriority = props.priority ||
        (loading === 'eager' ? 'high' : loading === 'lazy' ? 'low' : 'normal');

    return (
        <View style={[styles.container, style]}>
            <Image
                source={finalImageUri}
                style={StyleSheet.absoluteFill}
                contentFit={props.contentFit || 'cover'}
                placeholder={finalPlaceholder}
                transition={200}
                cachePolicy={cachePolicy}
                priority={imagePriority}
                onLoadEnd={handleLoadEnd}
                onError={handleError}
                recyclingKey={imageUri || undefined}
                {...props}
            />

            {/* Loading Indicator */}
            {isLoading && showLoader && (
                <View style={[styles.loaderContainer, StyleSheet.absoluteFill]}>
                    <ActivityIndicator size="small" color={Colors.primary} />
                </View>
            )}

            {/* Error Fallback */}
            {hasError && finalImageUri !== finalFallback && (
                <Image
                    source={finalFallback}
                    style={StyleSheet.absoluteFill}
                    contentFit={props.contentFit || 'cover'}
                    cachePolicy={cachePolicy}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    },
    loaderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.backgroundDark,
    },
});
