// Zora African Market Design Tokens - Spacing

// Spacing Scale
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
};

// Border Radius
export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

// Shadows
export const Shadows = {
  sm: {
    shadowColor: '#221710',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#221710',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#221710',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#221710',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Icon Sizes
export const IconSize = {
  tiny: 16,
  small: 20,
  medium: 24,
  large: 28,
  xl: 32,
};

// Touch Targets
export const TouchTarget = {
  min: 44, // iOS minimum
  android: 48, // Android minimum
};

// Component Heights
export const Heights = {
  button: 48,
  buttonLarge: 56,
  input: 48,
  tabBar: 70,
  header: 56,
  card: 'auto',
};

export default Spacing;
