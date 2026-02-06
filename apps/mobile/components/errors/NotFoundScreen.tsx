import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  MagnifyingGlass,
  House,
  ArrowLeft,
  Compass,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontFamily, FontWeight, LetterSpacing } from '../../constants/typography';

interface NotFoundScreenProps {
  title?: string;
  message?: string;
  showBackButton?: boolean;
  backButtonText?: string;
  onBack?: () => void;
}

/**
 * 404 Not Found Screen Component
 * Displays when a resource or page is not found
 */
export default function NotFoundScreen({
  title = 'Page Not Found',
  message = "We couldn't find what you're looking for. The page may have been moved or doesn't exist.",
  showBackButton = true,
  backButtonText = 'Go Back',
  onBack,
}: NotFoundScreenProps) {
  const router = useRouter();

  const handleGoBack = () => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleGoHome = () => {
    router.replace('/(tabs)');
  };

  const handleExplore = () => {
    router.push('/(tabs)/explore');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <MagnifyingGlass size={64} color={Colors.textMuted} weight="duotone" />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Error Code */}
        <View style={styles.errorCodeContainer}>
          <Text style={styles.errorCode}>404</Text>
        </View>

        {/* Message */}
        <Text style={styles.message}>{message}</Text>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {showBackButton && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleGoBack}
              activeOpacity={0.8}
            >
              <ArrowLeft size={20} color={Colors.textPrimary} weight="bold" />
              <Text style={styles.backButtonText}>{backButtonText}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleGoHome}
            activeOpacity={0.8}
          >
            <House size={20} color={Colors.textPrimary} weight="bold" />
            <Text style={styles.primaryButtonText}>Go Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleExplore}
            activeOpacity={0.8}
          >
            <Compass size={20} color={Colors.primary} weight="bold" />
            <Text style={styles.secondaryButtonText}>Explore</Text>
          </TouchableOpacity>
        </View>

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>
            If you believe this is an error, please contact support or try searching for what you&apos;re looking for.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.cardDark,
    borderWidth: 2,
    borderColor: Colors.borderDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h2,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
    letterSpacing: LetterSpacing.tight,
  },
  errorCodeContainer: {
    marginBottom: Spacing.lg,
  },
  errorCode: {
    fontFamily: FontFamily.displayExtraBold,
    fontSize: 72,
    color: Colors.primary,
    textAlign: 'center',
    letterSpacing: LetterSpacing.tight,
  },
  message: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.base,
  },
  actionsContainer: {
    width: '100%',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.base,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    gap: Spacing.sm,
  },
  backButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  primaryButtonText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.primary,
    gap: Spacing.sm,
  },
  secondaryButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.primary,
  },
  helpContainer: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.base,
  },
  helpText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
