# Zora African Market — Development Specification
## AI-Powered Development Guide for RapidNative, Emergent & Cursor

**Purpose:** Master specification for generating production-ready React Native / Expo code using AI development platforms
**Version:** 1.0
**Last Updated:** January 2026
**Target Platforms:** [RapidNative](https://www.rapidnative.com/), [Emergent](https://app.emergent.sh/home), [Cursor](https://cursor.com/)

---

## 🚀 QUICK START — PASTE THIS FIRST

Copy this context block into your AI coding platform before any development task:

```
PROJECT: Zora African Market
TYPE: React Native / Expo Mobile E-commerce App
TARGET: iOS & Android (UK market focus)

DESCRIPTION:
A premium mobile marketplace connecting the African diaspora in the UK with authentic African groceries, products, and vendors. Features multi-vendor shopping, real-time order tracking, cultural region filtering, and community-focused discovery.

TECH STACK:
- Framework: React Native with Expo (SDK 50+)
- Language: TypeScript (strict mode)
- Styling: NativeWind (Tailwind CSS for React Native) OR StyleSheet
- Navigation: Expo Router (file-based routing)
- State: Zustand for global state, React Query for server state
- Forms: React Hook Form with Zod validation
- Icons: primary: phosphoricons.com (Duotone Phosphor Icons), fallback: @expo/vector-icons (MaterialCommunityIcons)
- Maps: react-native-maps
- Payments: Stripe React Native SDK
- Auth: Supabase Auth

DESIGN TOKENS (USE EXACTLY):
Colors:
  primary: '#CC0000'        // Zora Red - buttons, CTAs, active states
  primaryDark: '#A30000'    // Hover/pressed state
  secondary: '#FFCC00'      // Zora Yellow - prices, accents, ratings
  secondaryDark: '#E6B800'  // Hover/pressed state
  backgroundDark: '#221710' // Dark mode background (warm brown)
  cardDark: '#342418'       // Dark mode cards/surfaces
  backgroundLight: '#F8F7F5'// Light mode background
  textPrimary: '#FFFFFF'    // Dark mode text
  textLight: '#505050'      // Light mode text
  textMuted: '#CBA990'      // Secondary/placeholder text
  success: '#22C55E'
  warning: '#FFCC00'
  error: '#CC0000'
  border: 'rgba(255,255,255,0.05)'

Typography:
  fontDisplay: 'Montserrat'  // Headlines, buttons
  fontBody: 'OpenSans'       // Body text
  Sizes: h1=28, h2=24, h3=20, body=16, small=14, caption=12

Spacing: 4, 8, 12, 16, 20, 24, 32, 40, 48 (in pixels)
BorderRadius: sm=4, md=8, lg=12, xl=16, 2xl=24, full=9999

CODING STANDARDS:
- Use functional components with hooks
- Implement proper TypeScript types/interfaces
- Follow atomic design (atoms → molecules → organisms → screens)
- Use named exports for components
- Include proper error boundaries
- Implement loading and empty states
- Add accessibility labels (accessibilityLabel, accessibilityRole)
- Use React.memo for performance optimization where appropriate
```

---

## 📁 PROJECT STRUCTURE

```
zora-african-market/
├── app/                          # Expo Router screens
│   ├── (auth)/                   # Auth group (login, signup)
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── forgot-password.tsx
│   ├── (tabs)/                   # Main tab navigator
│   │   ├── index.tsx             # Home/Marketplace
│   │   ├── explore.tsx           # Search & Discovery
│   │   ├── orders.tsx            # Order History
│   │   ├── cart.tsx              # Shopping Cart
│   │   └── profile.tsx           # User Profile
│   ├── (onboarding)/             # Onboarding flow
│   │   ├── index.tsx             # Splash
│   │   ├── regions.tsx           # Cultural interest selection
│   │   └── location.tsx          # Delivery location
│   ├── vendor/
│   │   └── [id].tsx              # Vendor storefront
│   ├── product/
│   │   └── [id].tsx              # Product details
│   ├── checkout/
│   │   ├── delivery.tsx
│   │   ├── payment.tsx
│   │   └── success.tsx
│   ├── order/
│   │   └── [id]/
│   │       ├── index.tsx         # Order details
│   │       ├── tracking.tsx      # Live tracking
│   │       └── support.tsx       # Order support chat
│   ├── dispute/
│   │   ├── select-items.tsx
│   │   ├── details.tsx
│   │   └── status.tsx
│   ├── _layout.tsx               # Root layout
│   └── +not-found.tsx
├── components/
│   ├── ui/                       # Atomic UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx
│   │   ├── Icon.tsx
│   │   ├── Skeleton.tsx
│   │   └── Toast.tsx
│   ├── cards/                    # Card components
│   │   ├── ProductCard.tsx
│   │   ├── VendorCard.tsx
│   │   ├── OrderCard.tsx
│   │   └── NotificationCard.tsx
│   ├── forms/                    # Form components
│   │   ├── SearchBar.tsx
│   │   ├── QuantityStepper.tsx
│   │   └── AddressForm.tsx
│   ├── navigation/               # Navigation components
│   │   ├── TabBar.tsx
│   │   ├── Header.tsx
│   │   └── BackButton.tsx
│   └── sections/                 # Screen sections
│       ├── HeroCarousel.tsx
│       ├── RegionSelector.tsx
│       ├── VendorList.tsx
│       └── ProductGrid.tsx
├── constants/
│   ├── colors.ts                 # Color tokens
│   ├── typography.ts             # Font configurations
│   ├── spacing.ts                # Spacing tokens
│   └── config.ts                 # App configuration
├── hooks/
│   ├── useAuth.ts
│   ├── useCart.ts
│   ├── useLocation.ts
│   └── useOrders.ts
├── services/
│   ├── api.ts                    # API client
│   ├── auth.ts                   # Auth service
│   ├── products.ts
│   ├── vendors.ts
│   ├── orders.ts
│   └── payments.ts
├── stores/
│   ├── authStore.ts
│   ├── cartStore.ts
│   └── preferencesStore.ts
├── types/
│   ├── user.ts
│   ├── product.ts
│   ├── vendor.ts
│   ├── order.ts
│   └── navigation.ts
├── utils/
│   ├── formatters.ts
│   ├── validators.ts
│   └── helpers.ts
├── assets/
│   ├── fonts/
│   ├── images/
│   └── icons/
├── app.json
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## 🎨 DESIGN TOKENS — CODE IMPLEMENTATION

### colors.ts

```typescript
// constants/colors.ts
export const colors = {
  // Primary Brand Colors
  primary: '#CC0000',
  primaryDark: '#A30000',
  primaryLight: 'rgba(204, 0, 0, 0.1)',

  // Secondary Brand Colors
  secondary: '#FFCC00',
  secondaryDark: '#E6B800',
  secondaryLight: 'rgba(255, 204, 0, 0.1)',

  // Background Colors
  background: {
    dark: '#221710',
    light: '#F8F7F5',
  },

  // Card/Surface Colors
  card: {
    dark: '#342418',
    light: '#FFFFFF',
  },

  // Text Colors
  text: {
    primary: {
      dark: '#FFFFFF',
      light: '#505050',
    },
    muted: '#CBA990',
    inverse: '#221710',
  },

  // Semantic Colors
  success: '#22C55E',
  warning: '#FFCC00',
  error: '#CC0000',
  info: '#3B82F6',

  // Border Colors
  border: {
    dark: 'rgba(255, 255, 255, 0.05)',
    light: 'rgba(0, 0, 0, 0.05)',
  },

  // Overlay Colors
  overlay: {
    dark: 'rgba(34, 23, 16, 0.8)',
    light: 'rgba(255, 255, 255, 0.9)',
  },
} as const;

export type ColorKey = keyof typeof colors;
```

### typography.ts

```typescript
// constants/typography.ts
export const fonts = {
  display: {
    regular: 'Montserrat_400Regular',
    medium: 'Montserrat_500Medium',
    semiBold: 'Montserrat_600SemiBold',
    bold: 'Montserrat_700Bold',
    extraBold: 'Montserrat_800ExtraBold',
  },
  body: {
    regular: 'OpenSans_400Regular',
    medium: 'OpenSans_500Medium',
    semiBold: 'OpenSans_600SemiBold',
    bold: 'OpenSans_700Bold',
  },
} as const;

export const fontSizes = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 48,
  '6xl': 56,
} as const;

export const lineHeights = {
  tight: 1.1,
  snug: 1.2,
  normal: 1.4,
  relaxed: 1.5,
  loose: 1.6,
} as const;

export const typography = {
  display: {
    fontFamily: fonts.display.extraBold,
    fontSize: fontSizes['5xl'],
    lineHeight: lineHeights.tight,
  },
  h1: {
    fontFamily: fonts.display.bold,
    fontSize: fontSizes['3xl'],
    lineHeight: lineHeights.snug,
  },
  h2: {
    fontFamily: fonts.display.bold,
    fontSize: fontSizes['2xl'],
    lineHeight: lineHeights.snug,
  },
  h3: {
    fontFamily: fonts.display.semiBold,
    fontSize: fontSizes.xl,
    lineHeight: lineHeights.normal,
  },
  h4: {
    fontFamily: fonts.display.semiBold,
    fontSize: fontSizes.lg,
    lineHeight: lineHeights.normal,
  },
  body: {
    fontFamily: fonts.body.regular,
    fontSize: fontSizes.md,
    lineHeight: lineHeights.relaxed,
  },
  bodySmall: {
    fontFamily: fonts.body.regular,
    fontSize: fontSizes.base,
    lineHeight: lineHeights.relaxed,
  },
  caption: {
    fontFamily: fonts.body.regular,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.normal,
  },
  overline: {
    fontFamily: fonts.display.semiBold,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.normal,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.5,
  },
  button: {
    fontFamily: fonts.display.semiBold,
    fontSize: fontSizes.md,
    lineHeight: lineHeights.normal,
  },
  price: {
    fontFamily: fonts.display.bold,
    fontSize: fontSizes.lg,
    lineHeight: lineHeights.normal,
  },
} as const;
```

### spacing.ts

```typescript
// constants/spacing.ts
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const;

export const borderRadius = {
  none: 0,
  sm: 4,
  DEFAULT: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#221710',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  DEFAULT: {
    shadowColor: '#221710',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#221710',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#221710',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#221710',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 16,
  },
} as const;
```

---

## 🧩 COMPONENT LIBRARY — CODE TEMPLATES

### Button Component

```typescript
// components/ui/Button.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { borderRadius, spacing } from '@/constants/spacing';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  rightIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return colors.text.muted;
    switch (variant) {
      case 'primary': return colors.primary;
      case 'secondary': return colors.secondary;
      case 'outline': return 'transparent';
      case 'ghost': return 'transparent';
      default: return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.background.dark;
    switch (variant) {
      case 'primary': return '#FFFFFF';
      case 'secondary': return colors.background.dark;
      case 'outline': return colors.primary;
      case 'ghost': return colors.primary;
      default: return '#FFFFFF';
    }
  };

  const getHeight = () => {
    switch (size) {
      case 'sm': return 40;
      case 'md': return 48;
      case 'lg': return 56;
      default: return 48;
    }
  };

  const iconSize = size === 'sm' ? 18 : size === 'lg' ? 24 : 20;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading }}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          height: getHeight(),
          borderColor: variant === 'outline' ? colors.primary : 'transparent',
          borderWidth: variant === 'outline' ? 2 : 0,
          opacity: disabled ? 0.5 : 1,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {leftIcon && (
            <MaterialCommunityIcons
              name={leftIcon}
              size={iconSize}
              color={getTextColor()}
              style={styles.leftIcon}
            />
          )}
          <Text
            style={[
              styles.text,
              { color: getTextColor() },
              size === 'lg' && styles.textLarge,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon && (
            <MaterialCommunityIcons
              name={rightIcon}
              size={iconSize}
              color={getTextColor()}
              style={styles.rightIcon}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
    borderRadius: borderRadius.md,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    ...typography.button,
  },
  textLarge: {
    fontSize: 18,
  },
  leftIcon: {
    marginRight: spacing[2],
  },
  rightIcon: {
    marginLeft: spacing[2],
  },
});
```

### ProductCard Component

```typescript
// components/cards/ProductCard.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { borderRadius, spacing, shadows } from '@/constants/spacing';
import { Product } from '@/types/product';
import { formatPrice } from '@/utils/formatters';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onAddToCart: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onAddToCart,
  onFavorite,
  isFavorite = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, ${formatPrice(product.price)}`}
      style={styles.container}
    >
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Favorite Button */}
        {onFavorite && (
          <TouchableOpacity
            onPress={onFavorite}
            style={styles.favoriteButton}
            accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <MaterialCommunityIcons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? colors.primary : colors.text.primary.dark}
            />
          </TouchableOpacity>
        )}

        {/* Badge */}
        {product.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        {product.weight && (
          <Text style={styles.weight}>{product.weight}</Text>
        )}

        <View style={styles.footer}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>

          <TouchableOpacity
            onPress={onAddToCart}
            style={styles.addButton}
            accessibilityLabel="Add to cart"
          >
            <MaterialCommunityIcons
              name="plus"
              size={18}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card.dark,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.DEFAULT,
  },
  imageContainer: {
    aspectRatio: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing[2],
    right: spacing[2],
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    bottom: spacing[2],
    left: spacing[2],
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    ...typography.overline,
    color: '#FFFFFF',
    fontSize: 10,
  },
  content: {
    padding: spacing[3],
  },
  name: {
    ...typography.bodySmall,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text.primary.dark,
    marginBottom: spacing[1],
  },
  weight: {
    ...typography.caption,
    color: colors.text.muted,
    marginBottom: spacing[2],
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    ...typography.price,
    color: colors.secondary,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

### VendorCard Component

```typescript
// components/cards/VendorCard.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { borderRadius, spacing, shadows } from '@/constants/spacing';
import { Vendor } from '@/types/vendor';

interface VendorCardProps {
  vendor: Vendor;
  onPress: () => void;
}

export const VendorCard: React.FC<VendorCardProps> = ({ vendor, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel={`${vendor.name}, rated ${vendor.rating} stars`}
      style={styles.container}
    >
      {/* Cover Image with Gradient */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: vendor.coverImage }}
          style={styles.coverImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        />

        {/* Rating Badge */}
        <View style={styles.ratingBadge}>
          <MaterialCommunityIcons
            name="star"
            size={14}
            color={colors.secondary}
          />
          <Text style={styles.ratingText}>{vendor.rating.toFixed(1)}</Text>
        </View>

        {/* Tag */}
        {vendor.tag && (
          <View style={styles.tag}>
            <Text style={styles.tagText}>{vendor.tag}</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {vendor.name}
        </Text>

        <Text style={styles.category} numberOfLines={1}>
          {vendor.category}
        </Text>

        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={14}
              color={colors.text.muted}
            />
            <Text style={styles.metaText}>{vendor.distance}</Text>
          </View>

          <View style={styles.metaItem}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={14}
              color={colors.text.muted}
            />
            <Text style={styles.metaText}>{vendor.deliveryTime}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 260,
    backgroundColor: colors.card.dark,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.DEFAULT,
  },
  imageContainer: {
    height: 144,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  ratingBadge: {
    position: 'absolute',
    top: spacing[2],
    right: spacing[2],
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
    gap: 4,
  },
  ratingText: {
    ...typography.caption,
    fontFamily: 'Montserrat_700Bold',
    color: colors.background.dark,
  },
  tag: {
    position: 'absolute',
    bottom: spacing[2],
    left: spacing[2],
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.sm,
  },
  tagText: {
    ...typography.overline,
    color: '#FFFFFF',
    fontSize: 10,
  },
  content: {
    padding: spacing[3],
  },
  name: {
    ...typography.h4,
    color: colors.text.primary.dark,
  },
  category: {
    ...typography.caption,
    color: colors.text.muted,
    marginTop: spacing[1],
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[2],
    gap: spacing[4],
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  metaText: {
    ...typography.caption,
    color: colors.text.muted,
  },
});
```

### Input Component

```typescript
// components/ui/Input.tsx
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { borderRadius, spacing } from '@/constants/spacing';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  rightIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  onRightIconPress?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const getBorderColor = () => {
    if (error) return colors.error;
    if (isFocused) return colors.primary;
    return colors.border.dark;
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          { borderColor: getBorderColor() },
          isFocused && styles.inputFocused,
        ]}
      >
        {leftIcon && (
          <MaterialCommunityIcons
            name={leftIcon}
            size={20}
            color={colors.text.muted}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          {...props}
          secureTextEntry={isSecure}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={`${colors.text.muted}99`}
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || secureTextEntry) && styles.inputWithRightIcon,
          ]}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsSecure(!isSecure)}
            style={styles.rightIconButton}
          >
            <MaterialCommunityIcons
              name={isSecure ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.text.muted}
            />
          </TouchableOpacity>
        )}

        {rightIcon && !secureTextEntry && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIconButton}
            disabled={!onRightIconPress}
          >
            <MaterialCommunityIcons
              name={rightIcon}
              size={20}
              color={colors.text.muted}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[4],
  },
  label: {
    ...typography.bodySmall,
    fontFamily: 'Montserrat_500Medium',
    color: colors.text.muted,
    marginBottom: spacing[2],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card.dark,
    borderRadius: borderRadius.md, // 8px - consistent with Design System
    borderWidth: 1,
    height: 48,
  },
  inputFocused: {
    borderWidth: 2,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text.primary.dark,
    paddingHorizontal: spacing[4],
    height: '100%',
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  leftIcon: {
    marginLeft: spacing[4],
    marginRight: spacing[2],
  },
  rightIconButton: {
    padding: spacing[3],
  },
  error: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing[1],
  },
});
```

### BottomTabBar Component

```typescript
// components/navigation/TabBar.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';

interface TabItem {
  name: string;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  iconActive: keyof typeof MaterialCommunityIcons.glyphMap;
  badge?: number;
}

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const tabs: TabItem[] = [
  { name: 'index', label: 'Home', icon: 'home-outline', iconActive: 'home' },
  { name: 'explore', label: 'Explore', icon: 'compass-outline', iconActive: 'compass' },
  { name: 'orders', label: 'Orders', icon: 'receipt-outline', iconActive: 'receipt' },
  { name: 'cart', label: 'Cart', icon: 'cart-outline', iconActive: 'cart', badge: 3 },
  { name: 'profile', label: 'Profile', icon: 'account-outline', iconActive: 'account' },
];

export const TabBar: React.FC<TabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <BlurView intensity={95} tint="dark" style={styles.container}>
      <View style={[styles.content, { paddingBottom: insets.bottom || spacing[2] }]}>
        {state.routes.map((route: any, index: number) => {
          const tab = tabs.find(t => t.name === route.name);
          if (!tab) return null;

          const isFocused = state.index === index;
          const { options } = descriptors[route.key];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              accessibilityRole="tab"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={tab.label}
              style={styles.tab}
            >
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name={isFocused ? tab.iconActive : tab.icon}
                  size={26}
                  color={isFocused ? colors.primary : colors.text.muted}
                />
                {tab.badge && tab.badge > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {tab.badge > 9 ? '9+' : tab.badge}
                    </Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.label,
                  { color: isFocused ? colors.primary : colors.text.muted },
                  isFocused && styles.labelActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(31, 22, 16, 0.95)',
    borderTopWidth: 1,
    borderTopColor: colors.border.dark,
  },
  content: {
    flexDirection: 'row',
    height: 70,
    paddingTop: spacing[2],
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: colors.primary,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    ...typography.overline,
    color: '#FFFFFF',
    fontSize: 10,
  },
  label: {
    ...typography.caption,
    marginTop: 2,
  },
  labelActive: {
    fontFamily: 'Montserrat_600SemiBold',
  },
});
```

---

## 📱 SCREEN TEMPLATES — COPY & CUSTOMIZE

### Splash Screen

```typescript
// app/(onboarding)/index.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { useAuth } from '@/hooks/useAuth';

export default function SplashScreen() {
  const { isAuthenticated, isLoading } = useAuth();
  const fadeAnim = new Animated.Value(0);
  const progressAnim = new Animated.Value(0);

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: false,
    }).start();

    // Navigate after animation
    const timer = setTimeout(() => {
      if (isLoading) return;
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(onboarding)/regions');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading]);

  return (
    <View style={styles.container}>
      {/* African Pattern Background (subtle) */}
      <View style={styles.patternOverlay} />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Logo Glow */}
        <View style={styles.logoGlow} />

        {/* Logo Text */}
        <Text style={styles.logoText}>ZORA</Text>

        {/* Loading Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        </View>
      </Animated.View>

      {/* Tagline */}
      <Animated.Text style={[styles.tagline, { opacity: fadeAnim }]}>
        CONNECTING THE DIASPORA
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patternOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.05,
    // Add African pattern as background image
  },
  content: {
    alignItems: 'center',
  },
  logoGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.primary,
    opacity: 0.2,
    // Add blur effect
  },
  logoText: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 72,
    color: colors.secondary,
    letterSpacing: -2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  progressContainer: {
    width: 128,
    marginTop: spacing[10],
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(84, 59, 45, 0.5)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: 3,
  },
  tagline: {
    position: 'absolute',
    bottom: 80,
    ...typography.overline,
    color: colors.text.muted,
    letterSpacing: 3,
  },
});
```

### Marketplace Home Screen

```typescript
// app/(tabs)/index.tsx
import React from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

// Components
import { Header } from '@/components/navigation/Header';
import { SearchBar } from '@/components/forms/SearchBar';
import { HeroCarousel } from '@/components/sections/HeroCarousel';
import { RegionSelector } from '@/components/sections/RegionSelector';
import { VendorList } from '@/components/sections/VendorList';
import { ProductGrid } from '@/components/sections/ProductGrid';
import { SectionHeader } from '@/components/ui/SectionHeader';

// Services
import { getHomeData } from '@/services/home';

export default function MarketplaceHome() {
  const insets = useSafeAreaInsets();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['home'],
    queryFn: getHomeData,
  });

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      <Header
        location="Brixton, London"
        onLocationPress={() => {}}
        onNotificationPress={() => {}}
        hasNotifications
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 100 + insets.bottom },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar
            placeholder="Search for egusi, plantain, jollof..."
            onPress={() => router.push('/explore')}
          />
        </View>

        {/* Hero Carousel */}
        <HeroCarousel
          banners={data?.banners || []}
          isLoading={isLoading}
        />

        {/* Shop by Region */}
        <View style={styles.section}>
          <SectionHeader
            title="Shop by Region"
            actionText="See all"
            onAction={() => {}}
          />
          <RegionSelector
            regions={data?.regions || []}
            onSelect={(region) => router.push(`/explore?region=${region.id}`)}
          />
        </View>

        {/* Featured Vendors */}
        <View style={styles.section}>
          <SectionHeader
            title="Featured Vendors"
            actionText="View map"
            onAction={() => router.push('/vendors/map')}
          />
          <VendorList
            vendors={data?.featuredVendors || []}
            isLoading={isLoading}
          />
        </View>

        {/* Popular Products */}
        <View style={styles.section}>
          <SectionHeader
            title="Popular This Week"
            actionText="See all"
            onAction={() => {}}
          />
          <ProductGrid
            products={data?.popularProducts || []}
            isLoading={isLoading}
            numColumns={2}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  scrollContent: {
    paddingTop: spacing[4],
  },
  searchContainer: {
    paddingHorizontal: spacing[4],
    marginBottom: spacing[4],
  },
  section: {
    marginTop: spacing[6],
  },
});
```

---

## 📊 DATA MODELS — TYPE DEFINITIONS

```typescript
// types/user.ts
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  membershipTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  zoraCredits: number;
  loyaltyPoints: number;
  referralCode: string;
  createdAt: string;
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
  isDefault: boolean;
  instructions?: string;
}

// types/product.ts
export interface Product {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  imageUrl: string;
  images: string[];
  category: string;
  subcategory?: string;
  region: string;
  weight?: string;
  unit?: string;
  badge?: 'HOT' | 'NEW' | 'SALE' | 'ORGANIC';
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  attributes: Record<string, string>;
  nutritionInfo?: NutritionInfo;
  origin?: string;
  certifications: string[];
}

export interface NutritionInfo {
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sodium?: number;
}

// types/vendor.ts
export interface Vendor {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  logoUrl: string;
  category: string;
  regions: string[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  tag?: 'POPULAR' | 'NEW' | 'TOP RATED';
  distance: string;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  address: string;
  openingHours: OpeningHours[];
  isOpen: boolean;
}

export interface OpeningHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

// types/order.ts
export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  vendors: OrderVendor[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discount: number;
  total: number;
  currency: string;
  deliveryAddress: Address;
  deliveryOption: DeliveryOption;
  paymentMethod: PaymentMethod;
  createdAt: string;
  estimatedDelivery: string;
  deliveredAt?: string;
  tracking?: OrderTracking;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface OrderItem {
  id: string;
  productId: string;
  vendorId: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  variant?: string;
}

export interface OrderVendor {
  id: string;
  name: string;
  logoUrl: string;
  status: OrderStatus;
  items: OrderItem[];
}

export interface OrderTracking {
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  driverPhoto?: string;
  vehicleInfo?: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  timeline: TrackingEvent[];
}

export interface TrackingEvent {
  status: OrderStatus;
  timestamp: string;
  description: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

// types/cart.ts
export interface CartItem {
  id: string;
  productId: string;
  vendorId: string;
  product: Product;
  quantity: number;
  variant?: string;
}

export interface Cart {
  items: CartItem[];
  vendors: CartVendor[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discount: number;
  total: number;
  promoCode?: string;
}

export interface CartVendor {
  id: string;
  name: string;
  logoUrl: string;
  deliveryTime: string;
  items: CartItem[];
  subtotal: number;
}
```

---

## 🔌 API SERVICE TEMPLATES

```typescript
// services/api.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/authStore';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.zora.market/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for auth token
    this.client.interceptors.request.use((config) => {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          useAuthStore.getState().logout();
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const api = new ApiClient();

// services/products.ts
import { api } from './api';
import { Product } from '@/types/product';

export const productService = {
  getAll: (params?: { region?: string; category?: string; search?: string }) =>
    api.get<Product[]>('/products', { params }),

  getById: (id: string) =>
    api.get<Product>(`/products/${id}`),

  getByVendor: (vendorId: string) =>
    api.get<Product[]>(`/vendors/${vendorId}/products`),

  search: (query: string) =>
    api.get<Product[]>('/products/search', { params: { q: query } }),

  getPopular: () =>
    api.get<Product[]>('/products/popular'),

  getByRegion: (region: string) =>
    api.get<Product[]>(`/products/region/${region}`),
};

// services/orders.ts
import { api } from './api';
import { Order, OrderStatus } from '@/types/order';

export const orderService = {
  getAll: (status?: OrderStatus) =>
    api.get<Order[]>('/orders', { params: { status } }),

  getById: (id: string) =>
    api.get<Order>(`/orders/${id}`),

  create: (data: CreateOrderInput) =>
    api.post<Order>('/orders', data),

  cancel: (id: string, reason: string) =>
    api.post<Order>(`/orders/${id}/cancel`, { reason }),

  getTracking: (id: string) =>
    api.get<OrderTracking>(`/orders/${id}/tracking`),

  submitDispute: (id: string, data: DisputeInput) =>
    api.post<Dispute>(`/orders/${id}/dispute`, data),
};
```

---

## 🎛️ STATE MANAGEMENT — ZUSTAND STORES

```typescript
// stores/cartStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, Cart, Product } from '@/types';

interface CartState {
  items: CartItem[];
  promoCode: string | null;

  // Actions
  addItem: (product: Product, quantity?: number, variant?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => Promise<boolean>;
  removePromoCode: () => void;

  // Computed
  getSubtotal: () => number;
  getTotalItems: () => number;
  getVendorGroups: () => CartVendor[];
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,

      addItem: (product, quantity = 1, variant) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.productId === product.id && item.variant === variant
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === existingItem.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                id: `${product.id}-${variant || 'default'}-${Date.now()}`,
                productId: product.id,
                vendorId: product.vendorId,
                product,
                quantity,
                variant,
              },
            ],
          };
        });
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], promoCode: null });
      },

      applyPromoCode: async (code) => {
        // Validate promo code with API
        try {
          // const result = await promoService.validate(code);
          set({ promoCode: code });
          return true;
        } catch {
          return false;
        }
      },

      removePromoCode: () => {
        set({ promoCode: null });
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getVendorGroups: () => {
        const { items } = get();
        const vendorMap = new Map<string, CartVendor>();

        items.forEach((item) => {
          const vendorId = item.vendorId;
          if (!vendorMap.has(vendorId)) {
            vendorMap.set(vendorId, {
              id: vendorId,
              name: item.product.vendorName || 'Vendor',
              logoUrl: '',
              deliveryTime: '2-3 days',
              items: [],
              subtotal: 0,
            });
          }

          const vendor = vendorMap.get(vendorId)!;
          vendor.items.push(item);
          vendor.subtotal += item.product.price * item.quantity;
        });

        return Array.from(vendorMap.values());
      },
    }),
    {
      name: 'zora-cart',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// stores/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupInput) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          // const { user, token } = await authService.login(email, password);
          // set({ user, token, isAuthenticated: true });
        } finally {
          set({ isLoading: false });
        }
      },

      signup: async (data) => {
        set({ isLoading: true });
        try {
          // const { user, token } = await authService.signup(data);
          // set({ user, token, isAuthenticated: true });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'zora-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

---

## 🧪 DEVELOPMENT PROMPTS — USE WITH AI PLATFORMS

### RapidNative Prompts

```
// Prompt 1: Generate Marketplace Home
Build a marketplace home screen for Zora African Market using React Native and Expo.

Tech: React Native, Expo Router, TypeScript, NativeWind
Screen: Main marketplace home with scrollable content

Components needed:
1. Sticky header with location pill (#342418 bg) and notification icon
2. Search bar (#342418 bg, 12px radius, "Search for egusi, plantain...")
3. Hero carousel (2:1 aspect ratio, gradient overlay, featured badge)
4. Horizontal scroll region selector (72px circles with region images)
5. Horizontal scroll vendor cards (260px width, cover image, rating badge)
6. 2-column product grid with product cards
7. Bottom tab navigation (70px height, 5 tabs, #CC0000 active)

Colors: primary=#CC0000, secondary=#FFCC00, bg=#221710, cards=#342418
Fonts: Montserrat Bold for headlines, Open Sans for body
Dark mode by default
```

```
// Prompt 2: Generate Product Detail Screen
Build a product detail screen for Zora African Market.

Features:
1. Full-width image carousel with pagination dots
2. Floating action buttons (back, share, favorite) on image
3. Content card overlapping image with rounded top corners (16px)
4. Product name (24px Montserrat Bold), price (#FFCC00)
5. Chips row: rating, organic badge, origin
6. Vendor card (clickable, avatar + name)
7. Tabs: Description | Nutrition | Reviews
8. Sticky footer with quantity stepper and "Add to Basket" button (#CC0000)

Use the Zora design system colors and typography.
```

### Cursor Prompts

```
// Prompt for Cursor Agent
Create a complete vendor storefront screen for Zora African Market.

File: app/vendor/[id].tsx

Requirements:
- Full-width cover image with gradient overlay
- Vendor profile section overlapping cover by 16px
- Avatar (112px) with verified badge, name, rating, bio
- Action buttons: Follow (#CC0000), Message, Share
- Sticky tabs: Products | Reviews | About
- 2-column product grid
- Use existing components from components/ui and components/cards
- Implement with useQuery for data fetching
- Add proper TypeScript types
- Follow the design tokens in constants/colors.ts
```

---

## ✅ QUALITY CHECKLIST

Before submitting code to AI platforms, verify:

```
□ Included tech stack context (React Native, Expo, TypeScript)
□ Specified design tokens (colors, fonts, spacing)
□ Described component structure clearly
□ Listed all interactive states
□ Included accessibility requirements
□ Specified navigation patterns
□ Mentioned state management approach
□ Described API data shapes
□ Listed error and loading states
□ Specified platform (iOS/Android/both)
```

After receiving generated code, check:

```
□ Uses exact color values (#CC0000, #FFCC00, #221710, #342418)
□ Uses Montserrat for headlines, Open Sans for body
□ Proper TypeScript types defined
□ Components are properly exported
□ Accessibility labels added
□ Loading and error states handled
□ No hardcoded strings (use i18n ready)
□ Proper spacing using design tokens
□ Border radius matches spec (8px buttons, 12px cards)
□ Shadows use warm rgba(34, 23, 16, X) values
```

---

## 📚 REFERENCE LINKS

- **Design System:** `docs/Design_System.md`
- **UI Designs:** `stitch_zora_african_market/` folder
- **Icons:** [Phosphor Icons](https://phosphoricons.com/), [Material Community Icons](https://materialdesignicons.com/)
- **Expo Docs:** [docs.expo.dev](https://docs.expo.dev)
- **NativeWind:** [nativewind.dev](https://nativewind.dev)
- **Zustand:** [zustand-demo.pmnd.rs](https://zustand-demo.pmnd.rs)

---

**Document Purpose:** AI-Powered Development (RapidNative, Emergent, Cursor)
**Project:** Zora African Market
**Version:** 1.0
**Last Updated:** January 2026
**Maintained By:** Development Team
