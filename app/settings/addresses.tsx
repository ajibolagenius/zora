import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
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
import { onboardingService, type Address as OnboardingAddress } from '../../services/onboardingService';
import { useAuthStore } from '../../stores/authStore';
import { isSupabaseConfigured, getSupabaseFrom } from '../../lib/supabase';
import { realtimeService } from '../../services/realtimeService';

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

// Map onboardingService Address to component Address format
const mapOnboardingAddressToAddress = (addr: OnboardingAddress, index: number, colors: string[]): Address => {
  // Infer type from label
  const labelLower = addr.label.toLowerCase();
  let type: 'home' | 'work' | 'other' = 'other';
  if (labelLower.includes('home') || labelLower.includes('house')) {
    type = 'home';
  } else if (labelLower.includes('work') || labelLower.includes('office')) {
    type = 'work';
  }

  return {
    id: addr.id,
    label: addr.label,
    type,
    street: addr.address_line1,
    city: addr.city,
    postcode: addr.postcode,
    isDefault: addr.is_default,
    icon: getAddressIcon(type),
    color: colors[index % colors.length],
  };
};

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
  const { user } = useAuthStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch addresses from database
  const fetchAddresses = async () => {
    if (!user?.user_id) {
      // Fallback to mock data if no user
      setAddresses(ADDRESSES_BASE.map((addr, index) => ({
        ...addr,
        icon: getAddressIcon(addr.type),
        color: shuffleArray(DESIGN_SYSTEM_COLORS)[index % DESIGN_SYSTEM_COLORS.length],
      })));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let addressData: Address[];

      if (isSupabaseConfigured()) {
        const dbAddresses = await onboardingService.getUserAddresses(user.user_id);
        const shuffledColors = shuffleArray(DESIGN_SYSTEM_COLORS);
        addressData = dbAddresses.map((addr, index) =>
          mapOnboardingAddressToAddress(addr, index, shuffledColors)
        );
      } else {
        // Use mock data
        const shuffledColors = shuffleArray(DESIGN_SYSTEM_COLORS);
        addressData = ADDRESSES_BASE.map((addr, index) => ({
          ...addr,
          icon: getAddressIcon(addr.type),
          color: shuffledColors[index % shuffledColors.length],
        }));
      }

      setAddresses(addressData);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      // Fallback to mock data on error
      const shuffledColors = shuffleArray(DESIGN_SYSTEM_COLORS);
      setAddresses(ADDRESSES_BASE.map((addr, index) => ({
        ...addr,
        icon: getAddressIcon(addr.type),
        color: shuffledColors[index % shuffledColors.length],
      })));
    } finally {
      setLoading(false);
    }
  };

  // Real-time subscriptions
  useEffect(() => {
    fetchAddresses();

    if (!isSupabaseConfigured() || !user?.user_id) {
      return;
    }

    const unsubscribers: (() => void)[] = [];

    // Subscribe to addresses updates
    realtimeService.subscribeToTable(
      'addresses',
      '*',
      async () => {
        // Refetch addresses when updated
        const updatedAddresses = await onboardingService.getUserAddresses(user.user_id);
        const shuffledColors = shuffleArray(DESIGN_SYSTEM_COLORS);
        const mappedAddresses = updatedAddresses.map((addr, index) =>
          mapOnboardingAddressToAddress(addr, index, shuffledColors)
        );
        setAddresses(mappedAddresses);
      },
      `user_id=eq.${user.user_id}`
    ).then((unsub) => {
      if (unsub) unsubscribers.push(unsub);
    });

    return () => {
      unsubscribers.forEach((unsub) => {
        if (typeof unsub === 'function') {
          unsub();
        }
      });
    };
  }, [user?.user_id]);

  // Assign icons and colors to addresses (for display)
  const addressesWithIcons = useMemo(() => {
    return addresses;
  }, [addresses]);

  const handleSetDefault = async (id: string) => {
    if (!user?.user_id || !isSupabaseConfigured()) {
      // Optimistic update for mock data
      setAddresses(addresses.map(a => ({
        ...a,
        isDefault: a.id === id,
      })));
      return;
    }

    try {
      // Update in database - the real-time subscription will handle the UI update
      const fromMethod = await getSupabaseFrom();
      if (fromMethod) {
        // First, unset all defaults
        await fromMethod('addresses')
          .update({ is_default: false })
          .eq('user_id', user.user_id);

        // Then set the selected one as default
        await fromMethod('addresses')
          .update({ is_default: true })
          .eq('id', id)
          .eq('user_id', user.user_id);
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      Alert.alert('Error', 'Failed to set default address. Please try again.');
    }
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
          onPress: async () => {
            if (!user?.user_id || !isSupabaseConfigured()) {
              // Optimistic update for mock data
              setAddresses(addresses.filter(a => a.id !== id));
              return;
            }

            try {
              // Delete from database - real-time subscription will handle UI update
              const fromMethod = await getSupabaseFrom();
              if (fromMethod) {
                await fromMethod('addresses')
                  .delete()
                  .eq('id', id)
                  .eq('user_id', user.user_id);
              }
            } catch (error) {
              console.error('Error deleting address:', error);
              Alert.alert('Error', 'Failed to delete address. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleAddAddress = () => {
    Alert.alert('Add Address', AlertMessages.info.addressAddComingSoon);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.8}
          >
            <ArrowLeft size={24} color={Colors.textPrimary} weight="bold" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Saved Addresses</Text>
          <View style={styles.headerRight} />
        </View>
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
          onPress={handleBack}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
