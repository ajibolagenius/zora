import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius, Spacing, Shadows } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { Vendor } from '../../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
        {vendor.tag && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{vendor.tag}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {vendor.name}
          </Text>
          <View style={styles.ratingContainer}>
            <MaterialCommunityIcons name="star" size={14} color={Colors.rating} />
            <Text style={styles.rating}>{vendor.rating.toFixed(1)}</Text>
          </View>
        </View>
        
        <Text style={styles.category} numberOfLines={1}>
          {vendor.category} • {vendor.regions.join(', ')}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <MaterialCommunityIcons name="clock-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.footerText}>{vendor.delivery_time}</Text>
          </View>
          <View style={styles.footerItem}>
            <MaterialCommunityIcons name="truck-delivery-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.footerText}>£{vendor.delivery_fee.toFixed(2)}</Text>
          </View>
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
  badge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primary,
  },
  badgeText: {
    color: Colors.textPrimary,
    fontSize: FontSize.tiny,
    fontWeight: FontWeight.bold,
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
  },
  rating: {
    color: Colors.rating,
    fontSize: FontSize.caption,
    fontWeight: FontWeight.semiBold,
    marginLeft: 2,
  },
  category: {
    color: Colors.textMuted,
    fontSize: FontSize.caption,
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
    gap: Spacing.xs,
  },
  footerText: {
    color: Colors.textMuted,
    fontSize: FontSize.caption,
  },
});

export default VendorCard;
