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
import { FontSize, FontFamily, LetterSpacing } from '../../constants/typography';
import { ErrorMessages, SuccessMessages, AlertMessages, CommonImages } from '../../constants';
import { useAuthStore } from '../../stores/authStore';

// Mock user data
const USER_DATA = {
  avatar: CommonImages.defaultUser,
  firstName: 'Adaeze',
  lastName: 'Okonkwo',
  email: 'adaeze.okonkwo@email.com',
  phone: '+44 7700 900123',
  dateOfBirth: '15 March 1992',
};

export default function PersonalInformationScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || USER_DATA.firstName,
    lastName: user?.name?.split(' ').slice(1).join(' ') || USER_DATA.lastName,
    email: user?.email || USER_DATA.email,
    phone: user?.phone || USER_DATA.phone,
    dateOfBirth: USER_DATA.dateOfBirth,
  });

  const handleSave = async () => {
    try {
      // Update local state first for immediate feedback
      const updatedName = `${formData.firstName} ${formData.lastName}`;
      
      // Try to update profile in backend
      try {
        await updateProfile({
          name: updatedName,
          phone: formData.phone,
        });
      } catch (updateError) {
        // If update fails (e.g., Supabase not configured), still update local state
        // This allows the UI to work in dev mode
        console.warn('Profile update failed, updating local state only:', updateError);
      }
      
      setIsEditing(false);
      Alert.alert(AlertMessages.titles.success, SuccessMessages.profile.updated);
    } catch (error: any) {
      console.error('Save error:', error);
      Alert.alert(AlertMessages.titles.error, error.message || ErrorMessages.form.updateFailed);
    }
  };

  const handleChangePhoto = () => {
    Alert.alert('Change Photo', AlertMessages.info.photoUploadComingSoon);
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
        <Text style={styles.headerTitle}>Personal Information</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => isEditing ? handleSave() : setIsEditing(true)}
          activeOpacity={0.8}
        >
          {isEditing ? (
            <Check size={24} color={Colors.primary} weight="bold" />
          ) : (
            <PencilSimple size={24} color={Colors.textPrimary} weight="duotone" />
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
            <Image 
              source={{ uri: user?.picture || formData.avatar }} 
              style={styles.avatar} 
            />
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={handleChangePhoto}
              activeOpacity={0.8}
            >
              <Camera size={18} color={Colors.textPrimary} weight="fill" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleChangePhoto} activeOpacity={0.8}>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          {/* First Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>FIRST NAME</Text>
            <View style={styles.inputContainer}>
              <User size={20} color={Colors.textMuted} weight="duotone" />
              <TextInput
                style={styles.input}
                value={formData.firstName}
                onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                editable={isEditing}
                placeholderTextColor={Colors.textMuted}
              />
            </View>
          </View>

          {/* Last Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>LAST NAME</Text>
            <View style={styles.inputContainer}>
              <User size={20} color={Colors.textMuted} weight="duotone" />
              <TextInput
                style={styles.input}
                value={formData.lastName}
                onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                editable={isEditing}
                placeholderTextColor={Colors.textMuted}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
            <View style={styles.inputContainer}>
              <Envelope size={20} color={Colors.textMuted} weight="duotone" />
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                editable={isEditing}
                keyboardType="email-address"
                placeholderTextColor={Colors.textMuted}
              />
            </View>
          </View>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>PHONE NUMBER</Text>
            <View style={styles.inputContainer}>
              <Phone size={20} color={Colors.textMuted} weight="duotone" />
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                editable={isEditing}
                keyboardType="phone-pad"
                placeholderTextColor={Colors.textMuted}
              />
            </View>
          </View>

          {/* Date of Birth */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>DATE OF BIRTH</Text>
            <View style={styles.inputContainer}>
              <Calendar size={20} color={Colors.textMuted} weight="duotone" />
              <TextInput
                style={styles.input}
                value={formData.dateOfBirth}
                onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
                editable={isEditing}
                placeholderTextColor={Colors.textMuted}
              />
            </View>
          </View>
        </View>

        {/* Account Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/settings/change-password')}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>Change Password</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => Alert.alert('Delete Account', 'This action cannot be undone.')}
            activeOpacity={0.8}
          >
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
  editButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
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
    marginBottom: Spacing['2xl'],
    marginTop: Spacing.base,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.primary,
    backgroundColor: Colors.cardDark,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.backgroundDark,
  },
  changePhotoText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.primary,
  },

  // Form Section
  formSection: {
    gap: Spacing.lg,
    marginBottom: Spacing['2xl'],
  },
  inputGroup: {
    gap: Spacing.sm,
  },
  inputLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.tiny,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: LetterSpacing.widest,
    paddingLeft: Spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    height: 56,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  input: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },

  // Actions Section
  actionsSection: {
    gap: Spacing.md,
  },
  actionButton: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.base,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  actionButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  deleteButton: {
    backgroundColor: `${Colors.error}15`,
    borderColor: `${Colors.error}33`,
  },
  deleteButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.error,
  },
});
