import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  MapPin,
  Plus,
  PencilSimple,
  Trash,
  CheckCircle,
  House,
  Briefcase,
  Heart,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontFamily, LetterSpacing } from '../../constants/typography';
import { AlertMessages } from '../../constants';

// Available colors from Design System for randomized icons
const DESIGN_SYSTEM_COLORS = [
  Colors.primary,
  Colors.secondary,
  Colors.success,
  Colors.info,
  Colors.badgeEcoFriendly,
];

// Shuffle array function for random color assignment
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

interface Address {
  id: string;
  label: string;
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  postcode: string;
  isDefault: boolean;
  icon: React.ComponentType<any>;
  color: string;
}

const ADDRESSES_BASE: Omit<Address, 'icon' | 'color'>[] = [
  {
    id: '1',
    label: 'Home',
    type: 'home',
    street: '42 Brixton Road',
    city: 'London',
    postcode: 'SW9 8BQ',
    isDefault: true,
  },
  {
    id: '2',
    label: 'Work',
    type: 'work',
    street: '15 Oxford Street',
    city: 'London',
    postcode: 'W1D 2DW',
    isDefault: false,
  },
  {
    id: '3',
    label: "Mum's House",
    type: 'other',
    street: '78 Peckham High Street',
    city: 'London',
    postcode: 'SE15 5DT',
    isDefault: false,
  },
];

const getAddressIcon = (type: string) => {
  switch (type) {
    case 'home':
      return House;
    case 'work':
      return Briefcase;
    default:
      return Heart;
  }
};

export default function SavedAddressesScreen() {
  const router = useRouter();
  const [addresses, setAddresses] = useState(ADDRESSES_BASE);

  // Assign icons and colors to addresses
  const addressesWithIcons = useMemo(() => {
    const shuffledColors = shuffleArray(DESIGN_SYSTEM_COLORS);
    return addresses.map((address, index) => ({
      ...address,
      icon: getAddressIcon(address.type),
      color: shuffledColors[index % shuffledColors.length],
    }));
  }, [addresses]);

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(a => ({
      ...a,
      isDefault: a.id === id,
    })));
  };

  const handleEdit = (id: string) => {
    Alert.alert('Edit Address', AlertMessages.info.addressEditComingSoon);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      AlertMessages.titles.delete,
      AlertMessages.confirm.deleteAddress,
      [
        { text: AlertMessages.titles.cancel, style: 'cancel' },
        {
          text: AlertMessages.titles.delete,
          style: 'destructive',
          onPress: () => setAddresses(addresses.filter(a => a.id !== id)),
        },
      ]
    );
  };

  const handleAddAddress = () => {
    Alert.alert('Add Address', AlertMessages.info.addressAddComingSoon);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <ArrowLeft size={24} color={Colors.textPrimary} weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Addresses</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Addresses List */}
        <View style={styles.addressesList}>
          {addressesWithIcons.map((address) => {
            const IconComponent = address.icon;
            return (
              <View
                key={address.id}
                style={[
                  styles.addressCard,
                  address.isDefault && styles.addressCardDefault,
                ]}
              >
                {/* Header Row */}
                <View style={styles.addressHeader}>
                  <View style={styles.addressLabelRow}>
                    <View style={[styles.addressIconContainer, { backgroundColor: `${address.color}20` }]}>
                      <IconComponent size={20} color={address.color} weight="duotone" />
                    </View>
                    <Text style={styles.addressLabel}>{address.label}</Text>
                    {address.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>Default</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.addressActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleEdit(address.id)}
                      activeOpacity={0.8}
                    >
                      <PencilSimple size={18} color={Colors.textMuted} weight="duotone" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDelete(address.id)}
                      activeOpacity={0.8}
                    >
                      <Trash size={18} color={Colors.error} weight="duotone" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Address Details */}
                <View style={styles.addressDetails}>
                  <Text style={styles.addressStreet}>{address.street}</Text>
                  <Text style={styles.addressCity}>{address.city}, {address.postcode}</Text>
                </View>

                {/* Set Default Button */}
                {!address.isDefault && (
                  <TouchableOpacity
                    style={styles.setDefaultButton}
                    onPress={() => handleSetDefault(address.id)}
                    activeOpacity={0.8}
                  >
                    <CheckCircle size={16} color={Colors.textMuted} weight="duotone" />
                    <Text style={styles.setDefaultText}>Set as Default</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>

        {/* Add Address Button */}
        <TouchableOpacity
          style={styles.addAddressButton}
          onPress={handleAddAddress}
          activeOpacity={0.8}
        >
          <View style={styles.addAddressIcon}>
            <Plus size={24} color={Colors.primary} weight="bold" />
          </View>
          <View style={styles.addAddressContent}>
            <Text style={styles.addAddressTitle}>Add New Address</Text>
            <Text style={styles.addAddressSubtitle}>Save a delivery location</Text>
          </View>
        </TouchableOpacity>

        {/* Delivery Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconContainer}>
            <MapPin size={24} color={Colors.secondary} weight="duotone" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Delivery Areas</Text>
            <Text style={styles.infoDescription}>
              We currently deliver to all London postcodes. Delivery times vary by location.
            </Text>
          </View>
        </View>

        {/* Bottom padding */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  headerTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
  },
  headerRight: {
    width: 44,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
    gap: Spacing.base,
  },

  // Addresses List
  addressesList: {
    gap: Spacing.md,
  },
  addressCard: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  addressCardDefault: {
    borderColor: `${Colors.primary}40`,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  addressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  addressIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressLabel: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  defaultBadge: {
    backgroundColor: `${Colors.primary}20`,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  defaultBadgeText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.tiny,
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: LetterSpacing.wide,
  },
  addressActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressDetails: {
    paddingLeft: 52,
  },
  addressStreet: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  addressCity: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
  },
  setDefaultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.backgroundDark,
    borderRadius: BorderRadius.lg,
  },
  setDefaultText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: Colors.textMuted,
  },

  // Add Address Button
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    backgroundColor: `${Colors.primary}0D`,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: `${Colors.primary}40`,
  },
  addAddressIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${Colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addAddressContent: {
    flex: 1,
  },
  addAddressTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.primary,
  },
  addAddressSubtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
    marginTop: 2,
  },

  // Info Card
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.base,
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginTop: Spacing.sm,
  },
  infoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${Colors.secondary}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.secondary,
    marginBottom: Spacing.xs,
  },
  infoDescription: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
    lineHeight: 20,
  },
});
