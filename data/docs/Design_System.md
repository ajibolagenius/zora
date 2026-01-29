# Zora African Market - Design System

> Comprehensive design principles for visual consistency across all screens

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Colors](#colors)
3. [Typography](#typography)
4. [Motion & Animation](#motion--animation)
5. [Layout & Spacing](#layout--spacing)
6. [Headers](#headers)
7. [Bottom Navigation](#bottom-navigation)
8. [Cards](#cards)
9. [Buttons](#buttons)
10. [Inputs & Forms](#inputs--forms)
11. [Pills, Tags & Badges](#pills-tags--badges)
12. [Icons](#icons)
13. [States](#states)
14. [Shadows & Elevation](#shadows--elevation)

---

## Design Philosophy

### Core Principles

1. **Premium African Aesthetic** - Warm, rich tones that evoke African heritage
2. **Dark Mode First** - Primary interface is dark with warm brown undertones
3. **Outline Over Fill** - Pills, tags, and secondary elements prefer outlined styles
4. **Subtle Elegance** - Minimal shadows, soft borders, refined spacing
5. **Consistent Motion** - Unified animation timing and easing across all interactions

### Visual Identity

- **Warmth**: Deep warm brown backgrounds (`#221710`) instead of cold blacks
- **Accent Colors**: Zora Red (`#CC0000`) for actions, Zora Yellow (`#FFCC00`) for prices/highlights
- **Cultural Subtlety**: African-inspired geometric patterns used sparingly

---

## Colors

### Primary Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#CC0000` | Buttons, CTAs, active states, links |
| `primaryDark` | `#A30000` | Hover/pressed states |
| `secondary` | `#FFCC00` | Prices, ratings, accents, highlights |
| `secondaryDark` | `#E6B800` | Hover/pressed states |

### Background Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `backgroundDark` | `#221710` | Main app background |
| `cardDark` | `#342418` | Cards, elevated surfaces |
| `backgroundLight` | `#F8F7F5` | Light mode (future) |

### Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `textPrimary` | `#FFFFFF` | Primary text, headings |
| `textSecondary` | `#CBA990` | Labels, placeholders |
| `textMuted` | `#CBA990` | Captions, hints, disabled |

### Status Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#22C55E` | Success states, organic badges |
| `warning` | `#FFCC00` | Warning states |
| `error` | `#CC0000` | Error states, destructive actions |
| `info` | `#3B82F6` | Informational states |

### Border Colors

| Token | Value | Usage |
|-------|-------|-------|
| `borderDark` | `rgba(255, 255, 255, 0.05)` | Subtle borders on dark surfaces |
| `borderOutline` | `rgba(255, 255, 255, 0.15)` | Outlined pills/tags |

---

## Typography

### Font Families

| Purpose | Font | Weights |
|---------|------|---------|
| Headlines & Display | **Montserrat** | Regular, Medium, SemiBold, Bold, ExtraBold |
| Body & UI | **Poppins** | Regular, Medium, SemiBold, Bold |

### Type Scale

| Token | Size | Usage |
|-------|------|-------|
| `display` | 56px | Splash screens, hero sections |
| `h1` | 28px | Screen titles |
| `h2` | 24px | Section headings |
| `h3` | 20px | Card titles |
| `h4` | 18px | Subsection labels |
| `bodyLarge` | 18px | Lead paragraphs |
| `body` | 16px | Standard content |
| `small` | 14px | Secondary text, descriptions |
| `caption` | 12px | Captions, metadata |
| `tiny` | 10px | Badges, overlines |

### Letter Spacing

| Context | Value |
|---------|-------|
| Display text | `-0.5px` (tight) |
| Headings | `0px` (normal) |
| Body text | `0px` (normal) |
| Buttons/Labels | `0.5px` (wide) |
| Overlines/Badges | `1.5px` (widest) |

---

## Motion & Animation

### Timing

| Type | Duration | Usage |
|------|----------|-------|
| **Micro** | 150-200ms | Button press, icon state change |
| **Standard** | 250-350ms | Modal open, element appear |
| **Complex** | 400-500ms | Screen transitions, cascades |
| **Emphasis** | 500-700ms | Splash animations, celebrations |

### Easing Functions

| Name | Curve | Usage |
|------|-------|-------|
| `easeOut` | `Easing.out(Easing.cubic)` | Elements entering view |
| `easeIn` | `Easing.in(Easing.cubic)` | Elements exiting view |
| `easeInOut` | `Easing.inOut(Easing.ease)` | Looping animations, morphing |
| `spring` | `friction: 8, tension: 50` | Bouncy entrances, scale effects |

### Animation Patterns

```typescript
// Standard fade-in
Animated.timing(opacity, {
  toValue: 1,
  duration: 300,
  easing: Easing.out(Easing.cubic),
  useNativeDriver: true,
})

// Spring scale
Animated.spring(scale, {
  toValue: 1,
  friction: 8,
  tension: 50,
  useNativeDriver: true,
})

// Staggered loader dots (150ms offset)
const createBounce = (value, delay) => Animated.loop(
  Animated.sequence([
    Animated.delay(delay),
    Animated.timing(value, { toValue: -8, duration: 300 }),
    Animated.timing(value, { toValue: 0, duration: 300 }),
  ])
);
```

### Screen Transitions

- **Enter**: Fade in (300ms) + slight slide up (10-15px)
- **Exit**: Fade out (200ms)
- **Tab Switch**: Cross-fade (200ms)

---

## Layout & Spacing

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Tight gaps, badge padding |
| `sm` | 8px | Icon gaps, inline spacing |
| `md` | 12px | Card padding, section gaps |
| `base` | 16px | Standard padding, margins |
| `lg` | 20px | Section spacing |
| `xl` | 24px | Large gaps, screen padding |
| `2xl` | 32px | Major section separators |
| `3xl` | 40px | Hero spacing |

### Screen Padding

- **Horizontal**: 16px (base)
- **Top**: Safe area + 8px
- **Bottom**: Safe area + tab bar height (70px)

---

## Headers

### Transparent Header (Default)

Used on most screens - no background, content scrolls beneath.

```typescript
// Style specification
{
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 10,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 16,
  paddingTop: safeAreaTop + 8,
  backgroundColor: 'transparent', // KEY: No background
}
```

### Header Components

| Element | Style |
|---------|-------|
| **Back Button** | 44×44px, rounded full, `rgba(0,0,0,0.4)` background |
| **Title** | Montserrat Bold, 20px, white, centered or left-aligned |
| **Action Icons** | 44×44px touch target, 24px icon, `duotone` weight |

### Header with Actions (e.g., Vendor Storefront)

```
[←]                                    [🔍] [🛒]
```

---

## Bottom Navigation

### Floating Tab Bar

```typescript
{
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(31, 22, 16, 0.95)', // Semi-transparent warm brown
  paddingTop: 8,
  paddingBottom: safeAreaBottom || 8,
}
```

### Tab Items

| State | Icon Weight | Color | Label |
|-------|-------------|-------|-------|
| **Inactive** | `duotone` | `#505050` | Same color |
| **Active** | `fill` | `#CC0000` | Same color |

### Tab Layout

- 5 tabs: Home, Explore, Orders, Cart, Profile
- Icon: 26px
- Label: 12px (caption), Poppins Medium
- Badge (cart): 18px circle, primary red, positioned top-right of icon

---

## Cards

### Product Card

```typescript
{
  backgroundColor: '#342418',
  borderRadius: 12,              // BorderRadius.lg
  borderWidth: 0,                // No border by default
  overflow: 'hidden',
  // Shadow
  shadowColor: '#221710',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 2,
}
```

| Property | Value |
|----------|-------|
| **Width** | Flexible (grid: 50% - gap), minimum 140px |
| **Image Height** | 130px (standard), 110px (compact) |
| **Content Padding** | 8px (sm) |
| **Border Radius** | 12px |

#### Product Card Anatomy

```
┌─────────────────────────┐
│ [BADGE]            [♡] │  <- Image area
│                        │
│       Product Image    │
│                    [✓] │  <- Trust badge
├────────────────────────┤
│ WEST AFRICA            │  <- Region tag (primary, tiny, uppercase)
│ Product Name           │  <- SemiBold, 14px, 2 lines max
│ 500g                   │  <- Weight (muted, 12px)
│ ★ 4.8 (120)            │  <- Rating
│ £12.50  ~~£15.00~~  [+]│  <- Price + Add button
└────────────────────────┘
```

### Vendor Card

```typescript
{
  backgroundColor: '#342418',
  borderRadius: 12,
  overflow: 'hidden',
  borderWidth: 0,
}
```

| Property | Value |
|----------|-------|
| **Width** | 180px (carousel), full (list) |
| **Image Height** | 120px |
| **Avatar** | 48px, positioned bottom-left of image |

---

## Buttons

### Primary Button

```typescript
{
  height: 48,
  borderRadius: 12,
  backgroundColor: '#CC0000',
  paddingHorizontal: 20,
}
```

### Secondary/Outline Button

```typescript
{
  height: 48,
  borderRadius: 12,
  backgroundColor: 'transparent',
  borderWidth: 1.5,              // Thin outline
  borderColor: '#CC0000',
}
```

### Button Sizes

| Size | Height | Font Size | Padding |
|------|--------|-----------|---------|
| `sm` | 36px | 14px | 16px |
| `md` | 48px | 16px | 20px |
| `lg` | 56px | 16px | 24px |

### Icon Button

```typescript
{
  width: 44,
  height: 44,
  borderRadius: 22,              // Full circle
  backgroundColor: 'rgba(0, 0, 0, 0.4)', // Transparent header
  // OR
  backgroundColor: '#342418',     // Solid on cards
}
```

### Social Auth Buttons (Google, Apple)

```typescript
{
  height: 48,
  borderRadius: 12,
  backgroundColor: '#FFFFFF',    // White background
  borderWidth: 0,
  flexDirection: 'row',
  gap: 8,
}
// Text: Dark (#221710), Poppins Medium
```

---

## Inputs & Forms

### Text Input

```typescript
{
  height: 48,
  borderRadius: 8,
  backgroundColor: '#342418',
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.05)', // Subtle border
  paddingHorizontal: 16,
}
```

### Input States

| State | Border Color | Icon Color |
|-------|--------------|------------|
| **Default** | `rgba(255, 255, 255, 0.05)` | `#CBA990` |
| **Focused** | `#CC0000` | `#CC0000` |
| **Error** | `#CC0000` | `#CC0000` |
| **Disabled** | Same as default | `rgba(203, 169, 144, 0.5)` |

### Input with Icon

```
┌──────────────────────────────┐
│ [📧]  Email Address      [👁]│
└──────────────────────────────┘
```

- Left icon: 22px, muted color
- Right icon: Touchable, 22px

### Checkbox

```typescript
// Unchecked (outline style)
{
  width: 20,
  height: 20,
  borderRadius: 4,
  borderWidth: 1.5,
  borderColor: 'rgba(255, 255, 255, 0.3)',
  backgroundColor: 'transparent',
}

// Checked
{
  backgroundColor: '#CC0000',
  borderColor: '#CC0000',
  // Checkmark icon: white, 14px
}
```

### Radio Button

```typescript
// Unselected (outline style)
{
  width: 20,
  height: 20,
  borderRadius: 10,
  borderWidth: 1.5,
  borderColor: 'rgba(255, 255, 255, 0.3)',
  backgroundColor: 'transparent',
}

// Selected
{
  borderColor: '#CC0000',
  // Inner dot: 10px, #CC0000
}
```

---

## Pills, Tags & Badges

> **Principle**: Prefer **outline styles** for pills and tags. Use filled badges sparingly for high-priority information.

### Filter Pills (Tabs)

```typescript
// Inactive (outline)
{
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 20,              // Full rounded
  backgroundColor: 'transparent',
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.15)',
}

// Active (filled)
{
  backgroundColor: '#CC0000',
  borderColor: '#CC0000',
}
```

### Certification Tags (Organic, Top Rated, Eco-Friendly)

```typescript
// OUTLINE STYLE (preferred)
{
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 16,
  backgroundColor: 'transparent',
  borderWidth: 1,
  borderColor: '#22C55E',        // Color matches tag type
}
// Text: Same color as border, 12px, SemiBold

// Icon: 14px, duotone, same color
```

| Tag | Border/Text Color | Icon |
|-----|-------------------|------|
| Organic | `#22C55E` | Leaf |
| Top Rated | `#FFCC00` | Star |
| Eco-Friendly | `#14B8A6` | Recycle |
| Verified | `#3B82F6` | ShieldCheck |

### Status Badges (HOT, NEW, POPULAR)

```typescript
// Filled style (for image overlays)
{
  paddingHorizontal: 8,
  paddingVertical: 2,
  borderRadius: 4,
  backgroundColor: '#CC0000',    // Or appropriate status color
}
// Text: White, 10px, Bold, UPPERCASE
```

### Membership Badge

```typescript
{
  paddingHorizontal: 12,
  paddingVertical: 4,
  borderRadius: 12,
  backgroundColor: 'rgba(255, 204, 0, 0.15)', // Tinted background
  borderWidth: 1,
  borderColor: '#FFCC00',
}
// Text: #FFCC00, 10px, Bold, UPPERCASE
// Icon: Star, 12px, fill
```

---

## Icons

### Icon Library

**Phosphor Icons** - Duotone style as default

```bash
npm install phosphor-react-native
```

### Icon Weights by Context

| Context | Weight | Example |
|---------|--------|---------|
| **Navigation (inactive)** | `duotone` | Tab bar icons |
| **Navigation (active)** | `fill` | Active tab |
| **Actions** | `bold` | Button icons |
| **Decorative** | `duotone` | Card icons, illustrations |
| **Status** | `fill` | Checkmarks, warnings |

### Icon Sizes

| Token | Size | Usage |
|-------|------|-------|
| `tiny` | 16px | Inline with small text |
| `small` | 20px | Button icons, list items |
| `medium` | 24px | Standard UI icons |
| `large` | 28px | Tab bar, headers |
| `xl` | 32px | Empty states, highlights |

### Common Icons

| Action | Icon Name |
|--------|-----------|
| Back | `ArrowLeft` |
| Close | `X` |
| Search | `MagnifyingGlass` |
| Filter | `Sliders` |
| Cart | `ShoppingCart` |
| Heart/Save | `Heart` |
| Share | `ShareNetwork` |
| Settings | `Gear` |
| Add | `Plus` |
| Remove | `Minus` |
| Delete | `Trash` |
| Edit | `PencilSimple` |
| Location | `MapPin` |
| Star | `Star` |
| Check | `Check` |
| Info | `Info` |
| Warning | `Warning` |

---

## States

### Interactive States

| State | Opacity/Transform | Duration |
|-------|-------------------|----------|
| **Default** | `opacity: 1` | - |
| **Pressed** | `opacity: 0.8` | Immediate |
| **Disabled** | `opacity: 0.5` | - |
| **Loading** | Show ActivityIndicator | - |

### Button Press Feedback

```typescript
<TouchableOpacity activeOpacity={0.8}>
```

### Focus States (Inputs)

- Border color changes to `primary` (#CC0000)
- Left icon color changes to `primary`
- Transition: 150ms

### Skeleton Loading

```typescript
{
  backgroundColor: '#342418',
  borderRadius: 8,
  // Shimmer animation: gradient sweep left-to-right, 1.5s loop
}
```

---

## Shadows & Elevation

### Shadow Scale

| Level | Usage | Values |
|-------|-------|--------|
| `sm` | Subtle cards | `offset: (0, 1), opacity: 0.05, radius: 2` |
| `md` | Standard cards | `offset: (0, 2), opacity: 0.08, radius: 4` |
| `lg` | Floating elements | `offset: (0, 4), opacity: 0.10, radius: 8` |
| `xl` | Modals, bottom sheets | `offset: (0, 8), opacity: 0.12, radius: 16` |

### Shadow Color

Always use `#221710` (backgroundDark) as shadow color for cohesive warm appearance.

---

## Component Checklist

Use this checklist when implementing or reviewing screens:

- [ ] **Background**: Uses `#221710` (backgroundDark)
- [ ] **Header**: Transparent/backgroundless with proper safe area padding
- [ ] **Bottom Nav**: Floating tab bar with duotone/fill icons
- [ ] **Cards**: 12px radius, `#342418` background, subtle shadow
- [ ] **Buttons**: 12px radius, proper height (48px default)
- [ ] **Inputs**: 8px radius, subtle border, proper focus state
- [ ] **Pills/Tags**: Outline style preferred, filled only for badges
- [ ] **Icons**: Phosphor Duotone, correct sizes
- [ ] **States**: Proper press feedback (0.8 opacity)
- [ ] **Typography**: Montserrat for headings, Poppins for body
- [ ] **Animation**: Consistent timing (300ms) and easing
- [ ] **Spacing**: Using design tokens, not arbitrary values

---

## File References

| File | Purpose |
|------|---------|
| `constants/colors.ts` | Color tokens |
| `constants/typography.ts` | Font families, sizes, weights |
| `constants/spacing.ts` | Spacing, border radius, shadows |
| `constants/componentStyles.ts` | Pre-built component styles |
| `components/ui/Button.tsx` | Button component |
| `components/ui/Input.tsx` | Input component |
| `components/ui/Badge.tsx` | Badge component |
| `components/ui/ProductCard.tsx` | Product card component |
| `components/ui/FloatingTabBar.tsx` | Bottom navigation |

---

*Last updated: January 2026*
