/**
 * NativeWind Demo Screen
 *
 * This screen demonstrates how to use NativeWind (Tailwind CSS)
 * in the Zora African Market app. Use this as a reference for
 * migrating existing screens from StyleSheet to NativeWind.
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Star, Heart, ShoppingCart, Check } from 'phosphor-react-native';
import {
    ZoraButton,
    ZoraCard,
    ZoraText,
    ZoraBadge,
    ZoraRow,
    ZoraColumn,
    ZoraDivider,
    ZoraInput,
} from '../components/nativewind';

export default function NativeWindDemo() {
    const router = useRouter();
    const [liked, setLiked] = useState(false);
    const [quantity, setQuantity] = useState(1);

    return (
        <SafeAreaView className="flex-1 bg-bg-dark" edges={['top']}>
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3">
                <TouchableOpacity
                    className="w-11 h-11 rounded-full bg-card-dark items-center justify-center"
                    onPress={() => {
                        if (router.canGoBack()) {
                            router.back();
                        } else {
                            router.replace('/(tabs)');
                        }
                    }}
                >
                    <ArrowLeft size={24} color="#FFFFFF" weight="bold" />
                </TouchableOpacity>

                <ZoraText variant="h4">NativeWind Demo</ZoraText>

                <TouchableOpacity
                    className="w-11 h-11 rounded-full bg-card-dark items-center justify-center"
                    onPress={() => setLiked(!liked)}
                >
                    <Heart
                        size={24}
                        color={liked ? '#CC0000' : '#FFFFFF'}
                        weight={liked ? 'fill' : 'regular'}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 16, gap: 24 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Product Card - Using className */}
                <View className="rounded-2xl overflow-hidden bg-card-dark">
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600' }}
                        className="w-full h-48"
                        resizeMode="cover"
                    />
                    <View className="p-4 gap-3">
                        <ZoraRow justify="between" align="start">
                            <View className="flex-1">
                                <ZoraText variant="h3">Kente Cloth</ZoraText>
                                <ZoraText variant="sm" color="muted">Hand-woven in Ghana</ZoraText>
                            </View>
                            <ZoraBadge variant="success">In Stock</ZoraBadge>
                        </ZoraRow>

                        <ZoraRow align="center" gap="sm">
                            <Star size={16} color="#FFCC00" weight="fill" />
                            <ZoraText variant="sm" color="yellow" weight="semibold">4.9</ZoraText>
                            <ZoraText variant="caption" color="muted">(128 reviews)</ZoraText>
                        </ZoraRow>

                        <ZoraDivider />

                        <ZoraRow justify="between" align="center">
                            <ZoraText variant="h2" color="red">£85.00</ZoraText>
                            <ZoraRow gap="sm">
                                <TouchableOpacity
                                    className="w-10 h-10 rounded-lg bg-white/10 items-center justify-center"
                                    onPress={() => setQuantity(Math.max(1, quantity - 1))}
                                >
                                    <ZoraText variant="h4">−</ZoraText>
                                </TouchableOpacity>
                                <View className="w-10 h-10 rounded-lg bg-zora-red items-center justify-center">
                                    <ZoraText variant="body" weight="bold">{quantity}</ZoraText>
                                </View>
                                <TouchableOpacity
                                    className="w-10 h-10 rounded-lg bg-white/10 items-center justify-center"
                                    onPress={() => setQuantity(quantity + 1)}
                                >
                                    <ZoraText variant="h4">+</ZoraText>
                                </TouchableOpacity>
                            </ZoraRow>
                        </ZoraRow>
                    </View>
                </View>

                {/* Button Variants */}
                <ZoraCard>
                    <ZoraText variant="h4" className="mb-4">Button Variants</ZoraText>
                    <ZoraColumn gap="sm">
                        <ZoraButton variant="primary">
                            Primary Button
                        </ZoraButton>
                        <ZoraButton variant="secondary">
                            Secondary Button
                        </ZoraButton>
                        <ZoraButton variant="outline">
                            Outline Button
                        </ZoraButton>
                        <ZoraButton variant="ghost">
                            Ghost Button
                        </ZoraButton>
                        <ZoraButton variant="primary" loading>
                            Loading...
                        </ZoraButton>
                    </ZoraColumn>
                </ZoraCard>

                {/* Badge Variants */}
                <ZoraCard>
                    <ZoraText variant="h4" className="mb-4">Badge Variants</ZoraText>
                    <ZoraRow gap="sm" className="flex-wrap">
                        <ZoraBadge>Default</ZoraBadge>
                        <ZoraBadge variant="success">Success</ZoraBadge>
                        <ZoraBadge variant="warning">Warning</ZoraBadge>
                        <ZoraBadge variant="error">Error</ZoraBadge>
                        <ZoraBadge variant="info">Info</ZoraBadge>
                    </ZoraRow>
                </ZoraCard>

                {/* Input Demo */}
                <ZoraCard>
                    <ZoraText variant="h4" className="mb-4">Input Fields</ZoraText>
                    <ZoraColumn gap="md">
                        <ZoraInput
                            label="Email Address"
                            placeholder="you@example.com"
                            keyboardType="email-address"
                        />
                        <ZoraInput
                            label="Password"
                            placeholder="Enter your password"
                            secureTextEntry
                        />
                        <ZoraInput
                            label="With Error"
                            placeholder="Invalid input"
                            error="This field is required"
                        />
                    </ZoraColumn>
                </ZoraCard>

                {/* Typography Demo */}
                <ZoraCard>
                    <ZoraText variant="h4" className="mb-4">Typography</ZoraText>
                    <ZoraColumn gap="sm">
                        <ZoraText variant="h1">Heading 1</ZoraText>
                        <ZoraText variant="h2">Heading 2</ZoraText>
                        <ZoraText variant="h3">Heading 3</ZoraText>
                        <ZoraText variant="h4">Heading 4</ZoraText>
                        <ZoraText variant="bodyLg">Body Large</ZoraText>
                        <ZoraText variant="body">Body Regular</ZoraText>
                        <ZoraText variant="sm">Small Text</ZoraText>
                        <ZoraText variant="caption">Caption Text</ZoraText>
                    </ZoraColumn>
                </ZoraCard>

                {/* Color Demo */}
                <ZoraCard>
                    <ZoraText variant="h4" className="mb-4">Colors</ZoraText>
                    <ZoraColumn gap="sm">
                        <ZoraText color="primary">Primary (White)</ZoraText>
                        <ZoraText color="secondary">Secondary</ZoraText>
                        <ZoraText color="muted">Muted</ZoraText>
                        <ZoraText color="red">Zora Red</ZoraText>
                        <ZoraText color="yellow">Zora Yellow</ZoraText>
                        <ZoraText color="success">Success</ZoraText>
                    </ZoraColumn>
                </ZoraCard>

                {/* Layout Demo */}
                <ZoraCard>
                    <ZoraText variant="h4" className="mb-4">Layout Components</ZoraText>

                    <ZoraText variant="sm" color="muted" className="mb-2">Row with gap</ZoraText>
                    <ZoraRow gap="sm" className="mb-4">
                        <View className="flex-1 h-12 bg-zora-red rounded-lg" />
                        <View className="flex-1 h-12 bg-zora-yellow rounded-lg" />
                        <View className="flex-1 h-12 bg-success rounded-lg" />
                    </ZoraRow>

                    <ZoraText variant="sm" color="muted" className="mb-2">Row justify-between</ZoraText>
                    <ZoraRow justify="between" className="mb-4">
                        <View className="w-16 h-12 bg-zora-red rounded-lg" />
                        <View className="w-16 h-12 bg-zora-yellow rounded-lg" />
                        <View className="w-16 h-12 bg-success rounded-lg" />
                    </ZoraRow>
                </ZoraCard>

                {/* Comparison: StyleSheet vs NativeWind */}
                <ZoraCard variant="outlined">
                    <ZoraText variant="h4" className="mb-4">Migration Guide</ZoraText>

                    <ZoraText variant="sm" color="muted" className="mb-2">Before (StyleSheet):</ZoraText>
                    <View className="bg-black/30 p-3 rounded-lg mb-4">
                        <Text className="text-caption text-zora-yellow font-mono">
                            {`<View style={styles.card}>
  <Text style={styles.title}>Title</Text>
</View>

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#342418',
    borderRadius: 12,
    padding: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});`}
                        </Text>
                    </View>

                    <ZoraText variant="sm" color="muted" className="mb-2">After (NativeWind):</ZoraText>
                    <View className="bg-black/30 p-3 rounded-lg">
                        <Text className="text-caption text-success font-mono">
                            {`<View className="bg-card-dark rounded-xl p-4">
  <Text className="text-white text-h4 font-semibold">
    Title
  </Text>
</View>`}
                        </Text>
                    </View>
                </ZoraCard>

                {/* Bottom CTA */}
                <View className="pb-8">
                    <ZoraButton
                        variant="primary"
                        size="lg"
                        className="w-full"
                        onPress={() => router.push('/(tabs)/cart')}
                    >
                        <ZoraRow gap="sm" align="center">
                            <ShoppingCart size={20} color="#FFFFFF" weight="fill" />
                            <Text className="text-white font-bold text-body-lg">Add to Cart</Text>
                        </ZoraRow>
                    </ZoraButton>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
