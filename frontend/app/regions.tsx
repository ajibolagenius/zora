import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Storefront, Package } from 'phosphor-react-native';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius, Heights } from '../constants/spacing';
import { FontSize, FontFamily } from '../constants/typography';
import { regionService, type Region } from '../services/mockDataService';

export default function RegionsScreen() {
  const router = useRouter();
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const data = regionService.getAll();
    setRegions(data);
    setLoading(false);
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRegionPress = (region: Region) => {
    setSelectedRegion(region.id);
    // Navigate to products filtered by region
    router.push(`/products?region=${region.slug}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <ArrowLeft size={22} color={Colors.textPrimary} weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shop by Region</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {/* Intro Text */}
          <Text style={styles.introText}>
            Discover authentic products from across the African continent. Each region offers unique flavors, ingredients, and cultural treasures.
          </Text>

          {/* Regions Grid */}
          <View style={styles.regionsGrid}>
            {regions.map((region) => (
              <TouchableOpacity
                key={region.id}
                style={styles.regionCard}
                onPress={() => handleRegionPress(region)}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: region.image_url }}
                  style={styles.regionImage}
                  resizeMode="cover"
                />
                <View style={styles.regionOverlay} />
                <View style={styles.regionContent}>
                  <Text style={styles.regionName}>{region.name}</Text>
                  <Text style={styles.regionCountries} numberOfLines={1}>
                    {region.countries.slice(0, 3).join(', ')}
                    {region.countries.length > 3 ? '...' : ''}
                  </Text>
                  <View style={styles.regionStats}>
                    <View style={styles.statItem}>
                      <Storefront size={14} color={Colors.primary} weight="fill" />
                      <Text style={styles.statText}>{region.vendor_count} Vendors</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Package size={14} color={Colors.primary} weight="fill" />
                      <Text style={styles.statText}>{region.product_count} Products</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.black40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
  },
  introText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  regionsGrid: {
    gap: Spacing.md,
  },
  regionCard: {
    height: 140,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  regionImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  regionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.black50, // Close to 0.45
  },
  regionContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: Spacing.base,
  },
  regionName: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h3,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  regionCountries: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  regionStats: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.caption,
    color: Colors.textPrimary,
  },
});
