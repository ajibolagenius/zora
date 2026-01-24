import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Star, Clock, Truck, ShieldCheck, MapPin } from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius, Spacing, Shadows } from '../../constants/spacing';
import { FontSize, FontWeight, FontFamily } from '../../constants/typography';

// Updated Vendor interface for mock database
interface Vendor {
  id: string;
  shop_name?: string;
  name?: string;
  description?: string;
  logo_url?: string;
  cover_image_url?: string;
  cover_image?: string;
  address?: string;
  is_verified?: boolean;
  rating: number;
  review_count?: number;
  cultural_specialties?: string[];
  categories?: string[];
  regions?: string[];
  category?: string;
  delivery_time_min?: number;
  delivery_time_max?: number;
  delivery_time?: string;
  delivery_fee?: number;
  minimum_order?: number;
  is_featured?: boolean;
  badge?: string | null;
  tag?: string;
  is_open?: boolean;
  distance?: string;
}

interface VendorCardProps {
  vendor: Vendor;
  onPress?: () => void;
}

export const VendorCard: React.FC<VendorCardProps> = ({ vendor, onPress }) => {
  // Normalize vendor data for both old and new schemas
  const vendorName = vendor.shop_name || vendor.name || 'Unknown Vendor';
  const coverImage = vendor.cover_image_url || vendor.cover_image || '';
  const categories = vendor.categories || (vendor.category ? [vendor.category] : []);
  const specialties = vendor.cultural_specialties || vendor.regions || [];
  const deliveryTime = vendor.delivery_time || 
    (vendor.delivery_time_min && vendor.delivery_time_max 
      ? `${vendor.delivery_time_min}-${vendor.delivery_time_max} min` 
      : '30-45 min');
  const deliveryFee = vendor.delivery_fee ?? 0;
  const isOpen = vendor.is_open !== undefined ? vendor.is_open : true;
  const tag = vendor.badge || vendor.tag;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: coverImage }}
          style={styles.coverImage}
          resizeMode="cover"
        />
        
        {/* Tag Badge */}
        {tag && (
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        )}
        
        {/* Verified Badge */}
        {vendor.is_verified && (
          <View style={styles.verifiedBadge}>
            <ShieldCheck size={16} color={Colors.success} weight="fill" />
          </View>
        )}

        {/* Open/Closed Status */}
        <View style={[
          styles.statusBadge,
          { backgroundColor: isOpen ? Colors.success : Colors.error }
        ]}>
          <Text style={styles.statusText}>
            {isOpen ? 'Open' : 'Closed'}
          </Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.nameContainer}>
            <Text style={styles.name} numberOfLines={1}>
              {vendorName}
            </Text>
            {vendor.is_verified && (
              <ShieldCheck size={14} color={Colors.success} weight="fill" />
            )}
          </View>
          <View style={styles.ratingContainer}>
            <Star size={14} color={Colors.rating} weight="fill" />
            <Text style={styles.rating}>{vendor.rating.toFixed(1)}</Text>
          </View>
        </View>
        
        <Text style={styles.category} numberOfLines={1}>
          {categories.length > 0 ? categories.join(' • ') : 'African Market'}
          {specialties.length > 0 ? ` • ${specialties.slice(0, 2).join(', ')}` : ''}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <Clock size={14} color={Colors.textMuted} weight="duotone" />
            <Text style={styles.footerText}>{deliveryTime}</Text>
          </View>
          <View style={styles.footerItem}>
            <Truck size={14} color={Colors.textMuted} weight="duotone" />
            <Text style={styles.footerText}>
              {deliveryFee === 0 ? 'Free' : `£${deliveryFee.toFixed(2)}`}
            </Text>
          </View>
          {vendor.distance && (
            <View style={styles.footerItem}>
              <MapPin size={14} color={Colors.textMuted} weight="duotone" />
              <Text style={styles.footerText}>{vendor.distance}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.base,
    ...Shadows.card,
  },
  imageContainer: {
    height: 140,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  tagBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  tagText: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.textPrimary,
    fontSize: FontSize.caption,
    textTransform: 'uppercase',
  },
  verifiedBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.cardDark,
    padding: 4,
    borderRadius: BorderRadius.full,
  },
  statusBadge: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.textPrimary,
    fontSize: FontSize.caption,
  },
  content: {
    padding: Spacing.base,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flex: 1,
  },
  name: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.backgroundDark,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  rating: {
    fontSize: FontSize.small,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
  },
  category: {
    fontSize: FontSize.small,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: FontSize.caption,
    color: Colors.textMuted,
  },
});

export default VendorCard;
