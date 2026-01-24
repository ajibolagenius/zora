import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Star, Clock, Truck, ShieldCheck, MapPin } from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius, Spacing, Shadows } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { Vendor } from '../../types';

interface VendorCardProps {
  vendor: Vendor;
  onPress?: () => void;
}

export const VendorCard: React.FC<VendorCardProps> = ({ vendor, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: vendor.cover_image }}
          style={styles.coverImage}
          resizeMode="cover"
        />
        
        {/* Tag Badge */}
        {vendor.tag && (
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>{vendor.tag}</Text>
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
          { backgroundColor: vendor.is_open ? Colors.success : Colors.error }
        ]}>
          <Text style={styles.statusText}>
            {vendor.is_open ? 'Open' : 'Closed'}
          </Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.nameContainer}>
            <Text style={styles.name} numberOfLines={1}>
              {vendor.name}
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
          {vendor.category} • {vendor.regions.join(', ')}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <Clock size={14} color={Colors.textMuted} weight="duotone" />
            <Text style={styles.footerText}>{vendor.delivery_time}</Text>
          </View>
          <View style={styles.footerItem}>
            <Truck size={14} color={Colors.textMuted} weight="duotone" />
            <Text style={styles.footerText}>
              {vendor.delivery_fee === 0 ? 'Free' : `£${vendor.delivery_fee.toFixed(2)}`}
            </Text>
          </View>
          {vendor.distance && (
            <View style={styles.footerItem}>
              <MapPin size={14} color={Colors.textMuted} weight="duotone" />
              <Text style={styles.footerText}>{vendor.distance}</Text>
            </View>
          )}
        </View>

        {/* Trust Indicators */}
        <View style={styles.trustIndicators}>
          {vendor.min_order > 0 && (
            <View style={styles.trustBadge}>
              <Text style={styles.trustText}>Min £{vendor.min_order}</Text>
            </View>
          )}
          {vendor.is_verified && (
            <View style={[styles.trustBadge, styles.verifiedTrustBadge]}>
              <Text style={[styles.trustText, styles.verifiedTrustText]}>Verified</Text>
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
    width: 260,
    ...Shadows.md,
  },
  imageContainer: {
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: 120,
    backgroundColor: Colors.backgroundDark,
  },
  tagBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primary,
  },
  tagText: {
    color: Colors.textPrimary,
    fontSize: FontSize.tiny,
    fontWeight: FontWeight.bold,
    textTransform: 'uppercase',
  },
  verifiedBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    color: Colors.textPrimary,
    fontSize: FontSize.tiny,
    fontWeight: FontWeight.semiBold,
  },
  content: {
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.xs,
  },
  name: {
    color: Colors.textPrimary,
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 204, 0, 0.1)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginLeft: Spacing.sm,
    gap: 2,
  },
  rating: {
    color: Colors.rating,
    fontSize: FontSize.caption,
    fontWeight: FontWeight.semiBold,
  },
  category: {
    color: Colors.textMuted,
    fontSize: FontSize.caption,
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  footerText: {
    color: Colors.textMuted,
    fontSize: FontSize.caption,
  },
  trustIndicators: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  trustBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  verifiedTrustBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  trustText: {
    color: Colors.textMuted,
    fontSize: FontSize.tiny,
    fontWeight: FontWeight.medium,
  },
  verifiedTrustText: {
    color: Colors.success,
  },
});

export default VendorCard;
