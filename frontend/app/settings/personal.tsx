import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Camera,
  User,
  Envelope,
  Phone,
  Calendar,
  PencilSimple,
  Check,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';

// Zora Brand Colors
const ZORA_RED = '#CC0000';
const ZORA_YELLOW = '#FFCC00';
const ZORA_CARD = '#342418';
const BACKGROUND_DARK = '#221710';
const SURFACE_DARK = '#2D1E18';
const MUTED_TEXT = '#bc9a9a';
const INPUT_BG = '#2A1D17';

// Mock user data
const USER_DATA = {
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
  firstName: 'Adaeze',
  lastName: 'Okonkwo',
  email: 'adaeze.okonkwo@email.com',
  phone: '+44 7700 900123',
  dateOfBirth: '15 March 1992',
};

export default function PersonalInformationScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(USER_DATA);

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert('Success', 'Your profile has been updated.');
  };

  const handleChangePhoto = () => {
    Alert.alert('Change Photo', 'Photo upload feature coming soon!');
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
        <Text style={styles.headerTitle}>Personal Information</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          {isEditing ? (
            <Check size={24} color={ZORA_RED} weight="bold" />
          ) : (
            <PencilSimple size={24} color={Colors.textPrimary} weight="regular" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Photo Section */}
        <View style={styles.photoSection}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: formData.avatar }} style={styles.avatar} />
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={handleChangePhoto}
            >
              <Camera size={18} color={Colors.textPrimary} weight="fill" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleChangePhoto}>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          {/* First Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>FIRST NAME</Text>
            <View style={styles.inputContainer}>
              <User size={20} color={MUTED_TEXT} weight="regular" />
              <TextInput
                style={styles.input}
                value={formData.firstName}
                onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                editable={isEditing}
                placeholderTextColor={MUTED_TEXT}
              />
            </View>
          </View>

          {/* Last Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>LAST NAME</Text>
            <View style={styles.inputContainer}>
              <User size={20} color={MUTED_TEXT} weight="regular" />
              <TextInput
                style={styles.input}
                value={formData.lastName}
                onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                editable={isEditing}
                placeholderTextColor={MUTED_TEXT}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
            <View style={styles.inputContainer}>
              <Envelope size={20} color={MUTED_TEXT} weight="regular" />
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                editable={isEditing}
                keyboardType="email-address"
                placeholderTextColor={MUTED_TEXT}
              />
            </View>
          </View>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>PHONE NUMBER</Text>
            <View style={styles.inputContainer}>
              <Phone size={20} color={MUTED_TEXT} weight="regular" />
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                editable={isEditing}
                keyboardType="phone-pad"
                placeholderTextColor={MUTED_TEXT}
              />
            </View>
          </View>

          {/* Date of Birth */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>DATE OF BIRTH</Text>
            <View style={styles.inputContainer}>
              <Calendar size={20} color={MUTED_TEXT} weight="regular" />
              <TextInput
                style={styles.input}
                value={formData.dateOfBirth}
                onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
                editable={isEditing}
                placeholderTextColor={MUTED_TEXT}
              />
            </View>
          </View>
        </View>

        {/* Account Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Change Password</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.deleteButton]}>
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          </TouchableOpacity>
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
  editButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
  },

  // Photo Section
  photoSection: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: ZORA_RED,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ZORA_RED,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: BACKGROUND_DARK,
  },
  changePhotoText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: ZORA_RED,
  },

  // Form Section
  formSection: {
    gap: 20,
    marginBottom: 32,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 10,
    color: MUTED_TEXT,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    paddingLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: INPUT_BG,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  input: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },

  // Actions Section
  actionsSection: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.lg,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  actionButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  deleteButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  deleteButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: '#EF4444',
  },
});
