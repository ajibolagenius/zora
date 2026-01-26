// Zora African Market Design Tokens - Animations
import { Easing } from 'react-native';

/**
 * Animation Durations
 * Standard durations for consistent animations across the app
 */
export const AnimationDuration = {
  // Quick transitions
  fast: 250,
  // Standard transitions
  normal: 300,
  // Default transitions
  default: 400,
  // Slower transitions
  slow: 500,
  // Extended animations
  extended: 1000,
  // Long animations (splash, loading)
  long: 1200,
  // Very long animations
  veryLong: 2000,
} as const;

/**
 * Animation Delays
 * Standard delays for staggered animations
 */
export const AnimationDelay = {
  none: 0,
  short: 50,
  medium: 100,
  long: 200,
} as const;

/**
 * Animation Easing Functions
 * Pre-configured easing functions for consistent motion
 */
export const AnimationEasing = {
  // Standard easing
  standard: Easing.out(Easing.cubic),
  // Smooth easing
  smooth: Easing.inOut(Easing.ease),
  // Bounce easing
  bounce: Easing.bounce,
  // Elastic easing
  elastic: Easing.elastic(1),
} as const;

/**
 * Animation Values
 * Common animation value configurations
 */
export const AnimationValues = {
  // Opacity
  opacity: {
    hidden: 0,
    visible: 1,
  },
  // Scale
  scale: {
    small: 0.8,
    normal: 1,
    large: 1.2,
  },
  // Translation
  translation: {
    small: 10,
    medium: 30,
    large: 50,
  },
} as const;

/**
 * Animation Configurations
 * Pre-configured animation objects ready to use
 */
export const Animations = {
  // Fade in
  fadeIn: {
    duration: AnimationDuration.default,
    easing: AnimationEasing.standard,
    toValue: AnimationValues.opacity.visible,
  },
  // Fade out
  fadeOut: {
    duration: AnimationDuration.default,
    easing: AnimationEasing.standard,
    toValue: AnimationValues.opacity.hidden,
  },
  // Slide up
  slideUp: {
    duration: AnimationDuration.default,
    easing: AnimationEasing.standard,
    toValue: 0,
  },
  // Scale in
  scaleIn: {
    duration: AnimationDuration.default,
    easing: AnimationEasing.standard,
    toValue: AnimationValues.scale.normal,
  },
  // Pulse
  pulse: {
    duration: AnimationDuration.extended,
    easing: AnimationEasing.smooth,
    toValue: AnimationValues.scale.large,
  },
} as const;

export default Animations;
