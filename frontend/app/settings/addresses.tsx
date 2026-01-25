import React, { useState } from 'react';
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
import { FontSize, FontFamily } from '../../constants/typography';

// Zora Brand Colors
const ZORA_RED = '#CC0000';
const ZORA_YELLOW = '#FFCC00';
const ZORA_CARD = '#342418';
const BACKGROUND_DARK = '#221710';
const MUTED_TEXT = '#bc9a9a';

interface Address {
  id: string;
  label: string;
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  postcode: string;
  isDefault: boolean;
}

const ADDRESSES: Address[] = [
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
  const [addresses, setAddresses] = useState(ADDRESSES);

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(a => ({
      ...a,
      isDefault: a.id === id,
    })));
  };

  const handleEdit = (id: string) => {
    Alert.alert('Edit Address', 'Address editing feature coming soon!');
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setAddresses(addresses.filter(a => a.id !== id)),
        },
      ]
    );
  };

  const handleAddAddress = () => {
    Alert.alert('Add Address', 'Address addition feature coming soon!');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
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
          {addresses.map((address) => {
            const IconComponent = getAddressIcon(address.type);
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
                    <View style={styles.addressIconContainer}>
                      <IconComponent size={20} color={ZORA_RED} weight="fill" />
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
                    >
                      <PencilSimple size={18} color={MUTED_TEXT} weight="regular" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDelete(address.id)}
                    >
                      <Trash size={18} color="#EF4444" weight="regular" />
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
                  >
                    <CheckCircle size={16} color={MUTED_TEXT} weight="regular" />
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
            <Plus size={24} color={ZORA_RED} weight="bold" />
          </View>
          <View style={styles.addAddressContent}>
            <Text style={styles.addAddressTitle}>Add New Address</Text>
            <Text style={styles.addAddressSubtitle}>Save a delivery location</Text>
          </View>
        </TouchableOpacity>

        {/* Delivery Info */}
        <View style={styles.infoCard}>
          <MapPin size={24} color={ZORA_YELLOW} weight="fill" />
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
    backgroundColor: BACKGROUND_DARK,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: `${BACKGROUND_DARK}F2`,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },
  headerTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
    letterSpacing: -0.3,
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
    gap: 16,
  },

  // Addresses List
  addressesList: {
    gap: 12,
  },
  addressCard: {
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  addressCardDefault: {
    borderColor: `${ZORA_RED}40`,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addressIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(204, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressLabel: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  defaultBadge: {
    backgroundColor: 'rgba(204, 0, 0, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  defaultBadgeText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 10,
    color: ZORA_RED,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addressActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressDetails: {
    paddingLeft: 46,
  },
  addressStreet: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  addressCity: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: MUTED_TEXT,
  },
  setDefaultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: BorderRadius.lg,
  },
  setDefaultText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: MUTED_TEXT,
  },

  // Add Address Button
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'rgba(204, 0, 0, 0.05)',
    borderRadius: BorderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: `${ZORA_RED}40`,
  },
  addAddressIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(204, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addAddressContent: {
    flex: 1,
  },
  addAddressTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: ZORA_RED,
  },
  addAddressSubtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: MUTED_TEXT,
    marginTop: 2,
  },

  // Info Card
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.xl,
    padding: 16,
    marginTop: 8,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: ZORA_YELLOW,
    marginBottom: 4,
  },
  infoDescription: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: MUTED_TEXT,
    lineHeight: 20,
  },
});
