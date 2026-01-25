import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Phone,
  ChatCircle,
  Storefront,
  House,
  Truck,
  Check,
  DotsThree,
  Crosshair,
  Headset,
  Warning,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';

// Zora Brand Colors
const ZORA_RED = '#C1272D';
const ZORA_CARD = '#3A2A21';
const SURFACE_DARK = '#2D1E18';
const MAP_BG = '#181111';
const ROAD_COLOR = '#2a2222';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface TimelineStep {
  id: string;
  label: string;
  time?: string;
  description?: string;
  status: 'completed' | 'active' | 'pending';
}

const TIMELINE_STEPS: TimelineStep[] = [
  { id: '1', label: 'Order Confirmed', time: '10:45 AM', status: 'completed' },
  { id: '2', label: 'Order Prepared', time: '11:15 AM', status: 'completed' },
  { id: '3', label: 'Picked Up', time: '11:30 AM', status: 'completed' },
  { id: '4', label: 'Out for delivery', description: 'David is heading your way', status: 'active' },
  { id: '5', label: 'Delivered', status: 'pending' },
];

export default function OrderTrackingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderNumber = id || '8821';

  return (
    <View style={styles.container}>
      {/* Map Background */}
      <View style={styles.mapContainer}>
        {/* Abstract Roads */}
        <View style={styles.road1} />
        <View style={styles.road2} />
        <View style={styles.road3} />
        
        {/* Route Line SVG Simulation */}
        <View style={styles.routeLineContainer}>
          <View style={styles.routeLine} />
        </View>
        
        {/* Vendor Pin */}
        <View style={styles.vendorPinContainer}>
          <View style={styles.vendorPin}>
            <Storefront size={20} color={ZORA_RED} weight="fill" />
          </View>
        </View>
        
        {/* Driver Pin */}
        <View style={styles.driverPinContainer}>
          <View style={styles.driverPin}>
            <Truck size={18} color={ZORA_RED} weight="fill" />
          </View>
        </View>
        
        {/* Destination Pin */}
        <View style={styles.destinationPinContainer}>
          <View style={styles.destinationPin}>
            <House size={20} color="#FFFFFF" weight="fill" />
          </View>
        </View>
      </View>

      {/* Top AppBar (Floating) */}
      <SafeAreaView style={styles.topBar} edges={['top']}>
        <TouchableOpacity
          style={styles.topBarButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={22} color="#FFFFFF" weight="bold" />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>TRACK ORDER</Text>
          <Text style={styles.orderNumberText}>#{orderNumber}</Text>
        </View>
        
        <TouchableOpacity style={styles.topBarButton}>
          <DotsThree size={22} color="#FFFFFF" weight="bold" />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Location Button (Floating) */}
      <View style={styles.locationButtonContainer}>
        <TouchableOpacity style={styles.locationButton}>
          <Crosshair size={22} color="#FFFFFF" weight="bold" />
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        {/* Drag Handle */}
        <View style={styles.dragHandle} />
        
        <ScrollView 
          style={styles.sheetContent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sheetContentInner}
        >
          {/* Arrival Time & Progress */}
          <View style={styles.arrivalSection}>
            <View style={styles.arrivalHeader}>
              <Text style={styles.arrivalTitle}>Arriving in ~15 mins</Text>
              <View style={styles.onTimeBadge}>
                <Text style={styles.onTimeText}>On Time</Text>
              </View>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '75%' }]} />
            </View>
          </View>

          {/* Driver Card */}
          <View style={styles.driverCard}>
            <View style={styles.driverPhoto}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' }}
                style={styles.driverImage}
              />
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>★ 4.9</Text>
              </View>
            </View>
            
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>David</Text>
              <Text style={styles.vehicleInfo}>White Toyota Camry</Text>
              <View style={styles.licensePlate}>
                <Text style={styles.licensePlateText}>AB 123 CD</Text>
              </View>
            </View>
            
            <View style={styles.driverActions}>
              <TouchableOpacity style={styles.callButton}>
                <Phone size={20} color="#FFFFFF" weight="fill" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.chatButton}>
                <ChatCircle size={20} color={ZORA_RED} weight="fill" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Timeline */}
          <View style={styles.timelineContainer}>
            {TIMELINE_STEPS.map((step, index) => {
              const isLast = index === TIMELINE_STEPS.length - 1;
              
              return (
                <View key={step.id} style={styles.timelineStep}>
                  {/* Left: Icons and Line */}
                  <View style={styles.timelineLeft}>
                    {/* Step Icon */}
                    {step.status === 'completed' ? (
                      <View style={styles.stepIconCompleted}>
                        <Check size={14} color="#FFFFFF" weight="bold" />
                      </View>
                    ) : step.status === 'active' ? (
                      <View style={styles.stepIconActive}>
                        <View style={styles.stepIconActiveDot} />
                      </View>
                    ) : (
                      <View style={styles.stepIconPending} />
                    )}
                    
                    {/* Line */}
                    {!isLast && (
                      <View style={[
                        styles.timelineLine,
                        step.status === 'completed' && styles.timelineLineCompleted,
                        step.status === 'active' && styles.timelineLineActive,
                      ]} />
                    )}
                  </View>
                  
                  {/* Right: Content */}
                  <View style={[
                    styles.timelineRight,
                    step.status === 'pending' && styles.timelineRightPending,
                  ]}>
                    <Text style={[
                      styles.stepLabel,
                      step.status === 'completed' && styles.stepLabelCompleted,
                      step.status === 'active' && styles.stepLabelActive,
                    ]}>
                      {step.label}
                    </Text>
                    {step.time && step.status === 'completed' && (
                      <Text style={styles.stepTime}>{step.time}</Text>
                    )}
                    {step.description && (
                      <Text style={styles.stepDescription}>{step.description}</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.needHelpButton}
              onPress={() => router.push(`/order-support/${orderNumber}`)}
              activeOpacity={0.8}
            >
              <Headset size={18} color={ZORA_RED} weight="regular" />
              <Text style={styles.needHelpText}>Need Help?</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.reportIssueButton}
              onPress={() => router.push(`/report-issue?orderId=${orderNumber}`)}
              activeOpacity={0.8}
            >
              <Warning size={18} color="#EF4444" weight="fill" />
              <Text style={styles.reportIssueText}>Report Issue</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MAP_BG,
  },
  
  // Map
  mapContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  road1: {
    position: 'absolute',
    top: 0,
    left: '33%',
    width: 16,
    height: '100%',
    backgroundColor: ROAD_COLOR,
    transform: [{ rotate: '12deg' }],
  },
  road2: {
    position: 'absolute',
    top: '25%',
    left: 0,
    width: '100%',
    height: 24,
    backgroundColor: ROAD_COLOR,
    transform: [{ rotate: '-6deg' }],
  },
  road3: {
    position: 'absolute',
    top: '66%',
    right: 0,
    width: '75%',
    height: 20,
    backgroundColor: ROAD_COLOR,
    transform: [{ rotate: '3deg' }],
  },
  routeLineContainer: {
    position: 'absolute',
    top: 120,
    left: 140,
    width: 60,
    height: 330,
  },
  routeLine: {
    position: 'absolute',
    left: 20,
    top: 0,
    width: 6,
    height: '100%',
    backgroundColor: ZORA_RED,
    borderRadius: 3,
    transform: [{ rotate: '5deg' }],
  },
  
  // Pins
  vendorPinContainer: {
    position: 'absolute',
    top: 100,
    left: 120,
    alignItems: 'center',
  },
  vendorPin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ZORA_CARD,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: ZORA_RED,
  },
  driverPinContainer: {
    position: 'absolute',
    top: 280,
    left: 165,
    alignItems: 'center',
  },
  driverPin: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '12deg' }],
  },
  destinationPinContainer: {
    position: 'absolute',
    top: 420,
    left: 160,
    alignItems: 'center',
  },
  destinationPin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ZORA_RED,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Top Bar
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  topBarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(58, 42, 33, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    backgroundColor: 'rgba(58, 42, 33, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  titleText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 1,
  },
  orderNumberText: {
    fontFamily: FontFamily.body,
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
  },
  
  // Location Button
  locationButtonContainer: {
    position: 'absolute',
    bottom: '52%',
    right: 16,
    zIndex: 20,
  },
  locationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(58, 42, 33, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Bottom Sheet
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '58%',
    backgroundColor: ZORA_CARD,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    zIndex: 40,
  },
  dragHandle: {
    width: 48,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  sheetContent: {
    flex: 1,
  },
  sheetContentInner: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 48,
    gap: 20,
  },
  
  // Arrival Section
  arrivalSection: {
    gap: 12,
  },
  arrivalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  arrivalTitle: {
    fontFamily: FontFamily.display,
    fontSize: 24,
    color: Colors.textPrimary,
  },
  onTimeBadge: {
    backgroundColor: 'rgba(193, 39, 45, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  onTimeText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 12,
    color: ZORA_RED,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#543b3b',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: ZORA_RED,
    borderRadius: 3,
  },
  
  // Driver Card
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: SURFACE_DARK,
    padding: 16,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  driverPhoto: {
    position: 'relative',
  },
  driverImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: ZORA_RED,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: ZORA_RED,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  ratingText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 10,
    color: '#FFFFFF',
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.bodyLarge,
    color: Colors.textPrimary,
  },
  vehicleInfo: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  licensePlate: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  licensePlateText: {
    fontFamily: FontFamily.body,
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1,
  },
  driverActions: {
    flexDirection: 'row',
    gap: 8,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ZORA_RED,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(193, 39, 45, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(193, 39, 45, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Timeline
  timelineContainer: {
    paddingLeft: 8,
  },
  timelineStep: {
    flexDirection: 'row',
    gap: 16,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 24,
  },
  stepIconCompleted: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: ZORA_RED,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  stepIconActive: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: ZORA_RED,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    marginTop: 4,
  },
  stepIconActiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  stepIconPending: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    zIndex: 10,
    marginTop: 4,
  },
  timelineLine: {
    width: 2,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 4,
  },
  timelineLineCompleted: {
    backgroundColor: 'rgba(193, 39, 45, 0.3)',
  },
  timelineLineActive: {
    backgroundColor: ZORA_RED,
  },
  timelineRight: {
    flex: 1,
    paddingBottom: 12,
  },
  timelineRightPending: {
    opacity: 0.4,
  },
  stepLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: 'rgba(255,255,255,0.4)',
    textDecorationLine: 'line-through',
  },
  stepLabelCompleted: {
    textDecorationLine: 'line-through',
  },
  stepLabelActive: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    textDecorationLine: 'none',
  },
  stepTime: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.2)',
    marginTop: 2,
  },
  stepDescription: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  
  // Need Help Button
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  needHelpButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: 'rgba(193, 39, 45, 0.1)',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(193, 39, 45, 0.2)',
  },
  needHelpText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: ZORA_RED,
  },
  reportIssueButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  reportIssueText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: '#EF4444',
  },
});
