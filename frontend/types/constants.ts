// Type Definitions for Constants
// Provides TypeScript types for all constant objects

import type { Colors } from '../constants/colors';
import type { Spacing, BorderRadius, Shadows, IconSize, Heights, TouchTarget, Dimensions, BorderWidths, Gaps } from '../constants/spacing';
import type { Typography, FontFamily, FontSize, FontWeight, LineHeight, LetterSpacing } from '../constants/typography';
import type { AnimationDuration, AnimationDelay, AnimationEasing, AnimationValues, Animations } from '../constants/animations';
import type { ApiEndpoints, ApiConfig, HttpStatus, ApiHeaders } from '../constants/api';
import type { ValidationLimits, AppConfig, OrderConfig, PaymentConfig, MembershipConfig, UiConfig } from '../constants/config';
import type { SortOptions, RatingOptions, CategoryOptions, TrendingSearches, QuickReplies, TrackingSteps, OrderStatus, TabTypes, ResolutionOptions } from '../constants/app';
import type { ScoringWeights, DeliveryTimeThresholds, RecencyThresholds, ScoringBonuses, QualityThresholds, PricingConstants, PaymentLimits, DisputeConstants, ReferralConstants } from '../constants/business';
import type { PlaceholderImages, ImageSizes, ImageUrlBuilders, CommonImages } from '../constants/assets';
import type { ErrorMessages, SuccessMessages, Placeholders, AlertMessages, EmptyStateMessages } from '../constants/messages';
import type { TimeConstants, DateFormats, MonthNames, DayNames, RelativeTimeThresholds } from '../constants/datetime';
import type { PasswordRules, ValidationLimits as ValidationLimitsRules, ValidationPatterns, ValidationErrors } from '../constants/validation';

/**
 * Re-export all constant types for convenience
 */
export type {
  Colors,
  Spacing,
  BorderRadius,
  Shadows,
  IconSize,
  Heights,
  TouchTarget,
  Dimensions,
  BorderWidths,
  Gaps,
  Typography,
  FontFamily,
  FontSize,
  FontWeight,
  LineHeight,
  LetterSpacing,
  AnimationDuration,
  AnimationDelay,
  AnimationEasing,
  AnimationValues,
  Animations,
  ApiEndpoints,
  ApiConfig,
  HttpStatus,
  ApiHeaders,
  ValidationLimits,
  AppConfig,
  OrderConfig,
  PaymentConfig,
  MembershipConfig,
  UiConfig,
  SortOptions,
  RatingOptions,
  CategoryOptions,
  TrendingSearches,
  QuickReplies,
  TrackingSteps,
  OrderStatus,
  TabTypes,
  ResolutionOptions,
  ScoringWeights,
  DeliveryTimeThresholds,
  RecencyThresholds,
  ScoringBonuses,
  QualityThresholds,
  PricingConstants,
  PaymentLimits,
  DisputeConstants,
  ReferralConstants,
  PlaceholderImages,
  ImageSizes,
  ImageUrlBuilders,
  CommonImages,
  ErrorMessages,
  SuccessMessages,
  Placeholders,
  AlertMessages,
  EmptyStateMessages,
  TimeConstants,
  DateFormats,
  MonthNames,
  DayNames,
  RelativeTimeThresholds,
  PasswordRules,
  ValidationLimitsRules,
  ValidationPatterns,
  ValidationErrors,
};

/**
 * Helper type to extract values from const objects
 */
export type ValueOf<T> = T[keyof T];

/**
 * Helper type for constant arrays
 */
export type ConstArray<T extends readonly unknown[]> = T[number];

/**
 * Type for sort option
 */
export type SortOption = ConstArray<typeof SortOptions.products>;

/**
 * Type for rating option
 */
export type RatingOption = ConstArray<typeof RatingOptions>;

/**
 * Type for category option
 */
export type CategoryOption = ConstArray<typeof CategoryOptions>;

/**
 * Type for tracking step
 */
export type TrackingStep = ConstArray<typeof TrackingSteps>;

/**
 * Type for resolution option
 */
export type ResolutionOption = ConstArray<typeof ResolutionOptions>;

/**
 * Type for quick reply
 */
export type QuickReply = ConstArray<typeof QuickReplies.vendorChat> | ConstArray<typeof QuickReplies.orderSupport>;

/**
 * Type for order status
 */
export type OrderStatusType = ValueOf<typeof OrderStatus>;

/**
 * Type for tab type
 */
export type TabType = ValueOf<typeof TabTypes>;

/**
 * Type for payment limit
 */
export type PaymentLimit = ValueOf<typeof PaymentLimits>;

/**
 * Type for scoring weight
 */
export type ScoringWeight = ValueOf<typeof ScoringWeights.vendor> | ValueOf<typeof ScoringWeights.product>;

export default {};
