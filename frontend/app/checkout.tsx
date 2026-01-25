import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Sun,
  Moon,
  CloudSun,
} from 'phosphor-react-native';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius } from '../constants/spacing';
import { FontSize, FontFamily } from '../constants/typography';

// Zora Brand Colors
const ZORA_RED = '#C1272D';
const ZORA_CARD = '#3A2A21';

type DeliveryMethod = 'standard' | 'express' | 'collect';
type TimeSlot = 'morning' | 'afternoon' | 'evening';

interface DateOption {
  day: string;
  date: number;
  month: string;
  isToday?: boolean;
}

const DELIVERY_OPTIONS = [
  { id: 'standard', name: 'Standard Delivery', time: '2-3 business days', price: 3.99 },
  { id: 'express', name: 'Express', time: 'Next day delivery', price: 6.99 },
  { id: 'collect', name: 'Click & Collect', time: 'Ready within 2 hours', price: 0 },
];

const TIME_SLOTS = [
  { id: 'morning', name: 'Morning', time: '8am - 12pm', icon: CloudSun },
  { id: 'afternoon', name: 'Afternoon', time: '12pm - 5pm', icon: Sun },
  { id: 'evening', name: 'Evening', time: '5pm - 9pm', icon: Moon },
];

// Generate next 7 days
const generateDates = (): DateOption[] => {
  const dates: DateOption[] = [];
  const today = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      day: i === 0 ? 'Today' : days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()],
      isToday: i === 0,
    });
  }
  return dates;
};

export default function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('standard');
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot>('afternoon');
  const [instructions, setInstructions] = useState('');
  
  const dates = generateDates();

  const handleContinue = () => {
    // Navigate to payment screen
    router.push('/payment');
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
        <Text style={styles.headerTitle}>Delivery Options</Text>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>Step 1/3</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Address Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DELIVERING TO</Text>
          <View style={styles.addressCard}>
            <View style={styles.addressContent}>
              <View style={styles.addressIconContainer}>
                <MapPin size={18} color={ZORA_RED} weight="fill" />
              </View>
              <View style={styles.addressDetails}>
                <Text style={styles.addressLabel}>Home</Text>
                <Text style={styles.addressText}>Jane Doe</Text>
                <Text style={styles.addressText}>123 Zora Lane, Apartment 4B</Text>
                <Text style={styles.addressText}>London, UK, SE1 7PB</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Text style={styles.changeLink}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Delivery Method Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DELIVERY METHOD</Text>
          <View style={styles.optionsContainer}>
            {DELIVERY_OPTIONS.map((option) => {
              const isSelected = deliveryMethod === option.id;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionCard,
                    isSelected && styles.optionCardSelected,
                  ]}
                  onPress={() => setDeliveryMethod(option.id as DeliveryMethod)}
                  activeOpacity={0.8}
                >
                  {/* Radio Button */}
                  <View style={[
                    styles.radioOuter,
                    isSelected && styles.radioOuterSelected,
                  ]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                  
                  {/* Option Details */}
                  <View style={styles.optionContent}>
                    <View style={styles.optionRow}>
                      <Text style={styles.optionName}>{option.name}</Text>
                      <Text style={[
                        styles.optionPrice,
                        option.price === 0 && styles.optionPriceFree,
                      ]}>
                        {option.price === 0 ? 'Free' : `£${option.price.toFixed(2)}`}
                      </Text>
                    </View>
                    <Text style={styles.optionTime}>{option.time}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Preferred Time Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PREFERRED TIME</Text>
          
          {/* Date Picker */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.datesContainer}
          >
            {dates.map((dateOption, index) => {
              const isSelected = selectedDate === index;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateCard,
                    isSelected && styles.dateCardSelected,
                  ]}
                  onPress={() => setSelectedDate(index)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.dateDay,
                    isSelected && styles.dateDaySelected,
                  ]}>
                    {dateOption.day}
                  </Text>
                  <Text style={[
                    styles.dateNumber,
                    isSelected && styles.dateNumberSelected,
                  ]}>
                    {dateOption.date}
                  </Text>
                  <Text style={[
                    styles.dateMonth,
                    isSelected && styles.dateMonthSelected,
                  ]}>
                    {dateOption.month}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Time Slots */}
          <View style={styles.timeSlotsContainer}>
            {TIME_SLOTS.map((slot) => {
              const isSelected = selectedTimeSlot === slot.id;
              const IconComponent = slot.icon;
              return (
                <TouchableOpacity
                  key={slot.id}
                  style={[
                    styles.timeSlotCard,
                    isSelected && styles.timeSlotCardSelected,
                  ]}
                  onPress={() => setSelectedTimeSlot(slot.id as TimeSlot)}
                  activeOpacity={0.8}
                >
                  <IconComponent
                    size={22}
                    color={isSelected ? Colors.textPrimary : Colors.textMuted}
                    weight={isSelected ? 'fill' : 'regular'}
                  />
                  <Text style={[
                    styles.timeSlotName,
                    isSelected && styles.timeSlotNameSelected,
                  ]}>
                    {slot.name}
                  </Text>
                  <Text style={[
                    styles.timeSlotTime,
                    isSelected && styles.timeSlotTimeSelected,
                  ]}>
                    {slot.time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Instructions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>INSTRUCTIONS</Text>
          <View style={styles.instructionsContainer}>
            <TextInput
              style={styles.instructionsInput}
              placeholder="Add delivery notes (e.g. Leave with neighbor, Gate code 1234)..."
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              value={instructions}
              onChangeText={setInstructions}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.9}
        >
          <Text style={styles.continueButtonText}>Continue to Payment</Text>
          <ArrowRight size={20} color={Colors.textPrimary} weight="bold" />
        </TouchableOpacity>
      </View>
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
    paddingVertical: Spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h3,
    color: Colors.textPrimary,
  },
  stepIndicator: {
    backgroundColor: 'rgba(193, 39, 45, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  stepText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.caption,
    color: ZORA_RED,
  },
  
  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
  },
  
  // Sections
  section: {
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 12,
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: Spacing.md,
    marginLeft: 4,
  },
  
  // Address Card
  addressCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  addressContent: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  addressIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(193, 39, 45, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  addressDetails: {
    flex: 1,
  },
  addressLabel: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  addressText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
    lineHeight: 20,
  },
  changeLink: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.small,
    color: ZORA_RED,
  },
  
  // Delivery Options
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    borderColor: ZORA_RED,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: ZORA_RED,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: ZORA_RED,
  },
  optionContent: {
    flex: 1,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionName: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  optionPrice: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  optionPriceFree: {
    color: '#4ADE80',
  },
  optionTime: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
    marginTop: 2,
  },
  
  // Date Picker
  datesContainer: {
    gap: 12,
    paddingBottom: Spacing.base,
  },
  dateCard: {
    width: 72,
    height: 80,
    borderRadius: BorderRadius.lg,
    backgroundColor: ZORA_CARD,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dateCardSelected: {
    backgroundColor: ZORA_RED,
  },
  dateDay: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    color: Colors.textMuted,
  },
  dateDaySelected: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  dateNumber: {
    fontFamily: FontFamily.displayMedium,
    fontSize: FontSize.h3,
    color: Colors.textPrimary,
    marginVertical: 2,
  },
  dateNumberSelected: {
    color: Colors.textPrimary,
  },
  dateMonth: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    color: Colors.textMuted,
  },
  dateMonthSelected: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  
  // Time Slots
  timeSlotsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  timeSlotCard: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    backgroundColor: ZORA_CARD,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  timeSlotCardSelected: {
    borderColor: ZORA_RED,
    backgroundColor: 'rgba(193, 39, 45, 0.1)',
  },
  timeSlotName: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  timeSlotNameSelected: {
    color: Colors.textPrimary,
  },
  timeSlotTime: {
    fontFamily: FontFamily.body,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 2,
  },
  timeSlotTimeSelected: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  
  // Instructions
  instructionsContainer: {
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
  },
  instructionsInput: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
    lineHeight: 22,
    minHeight: 80,
  },
  
  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    backgroundColor: Colors.backgroundDark,
  },
  continueButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: ZORA_RED,
    borderRadius: BorderRadius.full,
    paddingVertical: 16,
  },
  continueButtonText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
});
