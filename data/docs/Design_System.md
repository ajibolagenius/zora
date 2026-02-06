# Zora African Market - Design System

> Comprehensive design principles for visual consistency across web and mobile platforms

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Colors](#colors)
3. [Typography](#typography)
4. [Motion & Animation](#motion--animation)
5. [Layout & Spacing](#layout--spacing)
6. [Responsive Design](#responsive-design)
7. [Navigation Components](#navigation-components)
8. [Hero Sections](#hero-sections)
9. [Cards](#cards)
10. [Buttons](#buttons)
11. [Forms & Inputs](#forms--inputs)
12. [Pills, Tags & Badges](#pills-tags--badges)
13. [Icons](#icons)
14. [States](#states)
15. [Shadows & Elevation](#shadows--elevation)
16. [Component Library](#component-library)

---

## Design Philosophy

### Core Principles

1. **Premium African Aesthetic** - Warm, rich tones that evoke African heritage
2. **Modern Web-First Design** - Gradient backgrounds, flowing layouts, component-based architecture
3. **Mobile-First Responsiveness** - Optimized for all screen sizes with proper breakpoints
4. **Component Consistency** - Shared components across landing, about, and features pages
5. **Subtle Elegance** - Minimal shadows, soft borders, refined spacing
6. **Consistent Motion** - Unified animation timing and easing across all interactions

### Visual Identity

- **Warmth**: Deep warm brown backgrounds (`#221710`) and gradient overlays
- **Accent Colors**: Zora Red (`#CC0000`) for actions, Zora Yellow (`#FFCC00`) for prices/highlights
- **Modern Gradients**: `from-primary to-primary-dark` for hero sections
- **Cultural Subtlety**: African-inspired geometric patterns used sparingly
- **Web Aesthetics**: Blur effects, backdrop filters, and modern UI patterns

---

## Colors

### Primary Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#CC0000` | Buttons, CTAs, active states, links, gradients |
| `primaryDark` | `#A30000` | Hover/pressed states |
| `secondary` | `#FFCC00` | Prices, ratings, accents, highlights, underlines |
| `secondaryDark` | `#E6B800` | Hover/pressed states |

### Background Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `backgroundDark` | `#221710` | Mobile app background |
| `cardDark` | `#342418` | Mobile app cards, elevated surfaces |
| `backgroundLight` | `#F8F7F5` | Web pages, light mode sections |
| `white` | `#FFFFFF` | Web cards, text on dark backgrounds |
| `gray-50` | `#F9FAFB` | Web section backgrounds |

### Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `textPrimary` | `#FFFFFF` | Primary text on dark backgrounds |
| `textSecondary` | `#CBA990` | Labels, placeholders, muted text |
| `textMuted` | `#CBA990` | Captions, hints, disabled |
| `textDark` | `#111827` | Primary text on light backgrounds |
| `textGray` | `#6B7280` | Secondary text on light backgrounds |
| `textLight` | `#9CA3AF` | Muted text on light backgrounds |

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

| Purpose | Font | Weights | Usage |
|---------|------|---------|-------|
| Headlines & Display | **Inter** (web) / **Montserrat** (mobile) | Regular, Medium, SemiBold, Bold, ExtraBold | Hero sections, major headings |
| Body & UI | **Inter** (web) / **Poppins** (mobile) | Regular, Medium, SemiBold, Bold | Body text, UI elements |
| Display Font | **Custom Font Display** | Bold, Black | Special headings, branding |

### Type Scale

| Token | Mobile Size | Web Size | Usage |
|-------|-------------|----------|-------|
| `display` | 56px | 64-96px | Hero sections, splash screens |
| `h1` | 28px | 32-48px | Page titles, hero headings |
| `h2` | 24px | 24-40px | Section headings |
| `h3` | 20px | 20-32px | Card titles, subsections |
| `h4` | 18px | 18-24px | Subsection labels |
| `bodyLarge` | 18px | 18-20px | Lead paragraphs, descriptions |
| `body` | 16px | 16px | Standard content |
| `small` | 14px | 14px | Secondary text, descriptions |
| `caption` | 12px | 12px | Captions, metadata |
| `tiny` | 10px | 10px | Badges, overlines |

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

| Token | Value | Mobile Usage | Web Usage |
|-------|-------|-------------|----------|
| `xs` | 4px | Tight gaps, badge padding | Tight gaps, badge padding |
| `sm` | 8px | Icon gaps, inline spacing | Icon gaps, inline spacing |
| `md` | 12px | Card padding, section gaps | Card padding, section gaps |
| `base` | 16px | Standard padding, margins | Standard padding, margins |
| `lg` | 20px | Section spacing | Section spacing |
| `xl` | 24px | Large gaps, screen padding | Large gaps, screen padding |
| `2xl` | 32px | Major section separators | Major section separators |
| `3xl` | 40px | Hero spacing | Hero spacing |
| `4xl` | 64px | Page sections | Page sections |

### Screen Padding

#### Mobile
- **Horizontal**: 16px (base)
- **Top**: Safe area + 8px
- **Bottom**: Safe area + tab bar height (70px)

#### Web
- **Horizontal**: 16px (mobile), 24px (tablet), 32px+ (desktop)
- **Section Padding**: 64px vertical (mobile), 96px (desktop)
- **Container Max-Width**: 6xl (1024px), 7xl (1280px) for hero sections

---

## Responsive Design

### Breakpoint System

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| `mobile` | 0px | Base styles, mobile-first |
| `sm` | 640px | Small tablets, large phones |
| `md` | 768px | Tablets, small desktops |
| `lg` | 1024px | Desktops, large tablets |
| `xl` | 1280px | Large desktops |
| `2xl` | 1536px | Extra large displays |

### Responsive Typography

```css
/* Mobile-first approach */
.text-responsive {
  font-size: 1rem;     /* 16px - mobile */
  line-height: 1.5rem;
}

@media (min-width: 640px) {
  .text-responsive {
    font-size: 1.125rem; /* 18px - sm */
  }
}

@media (min-width: 1024px) {
  .text-responsive {
    font-size: 1.25rem;  /* 20px - lg */
  }
}
```

### Responsive Grid Patterns

| Pattern | Mobile | Tablet | Desktop |
|---------|--------|---------|----------|
| **Hero Grid** | 1 column | 1 column | 2 columns |
| **Feature Cards** | 1 column | 2 columns | 3 columns |
| **Stats Grid** | 2 columns | 2 columns | 4 columns |
| **Vendor Tools** | 1 column | 2 columns | 4 columns |

### Responsive Component Sizing

| Element | Mobile | Tablet | Desktop |
|---------|--------|---------|----------|
| **Button Height** | 40px | 44px | 48px |
| **Icon Size** | 16-20px | 20-24px | 24-32px |
| **Card Padding** | 16px | 20px | 24px |
| **Section Spacing** | 48px | 64px | 96px |

---

## Navigation Components

### Web Navigation Bar

```typescript
// Shared Navigation Component
{
  position: 'fixed',
  top: 48px, // Account for FreeDeliveryBanner
  left: 0,
  right: 0,
  zIndex: 40,
  backgroundColor: 'transparent',
  transition: 'all 300ms ease',
}

// Scrolled State
{
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(12px)',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
}
```

#### Navigation Elements

| Element | Style | Mobile | Desktop |
|---------|-------|--------|----------|
| **Logo** | ZoraLogo component | 40px | 40px |
| **Nav Links** | Pills in backdrop blur | Mobile menu | Inline flex |
| **CTA Button** | Secondary yellow | Full width | Standard |
| **Mobile Menu** | Slide-down panel | Hamburger | Hidden |

#### Navigation States

- **Default**: Transparent with white text
- **Scrolled**: White background with dark text
- **Mobile Menu**: Full-width panel with backdrop

### Free Delivery Banner

```typescript
{
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 50,
  backgroundColor: '#CC0000',
  padding: '8px 16px',
  textAlign: 'center',
  color: 'white',
  fontSize: '14px',
  fontWeight: '600',
}
```

---

## Hero Sections

### Standard Hero Pattern

```typescript
{
  position: 'relative',
  minHeight: '85vh', // Landing page
  minHeight: '60vh', // About/Features pages
  background: 'linear-gradient(135deg, #CC0000, #A30000)',
  overflow: 'hidden',
}
```

#### Background Elements

- **Blur Circles**: Large, semi-transparent colored circles
- **Positions**: Top-left, bottom-right, center
- **Colors**: Secondary/20, white/10, white/5
- **Effects**: `blur-3xl` for smooth gradients

#### Hero Content Structure

```typescript
{
  position: 'relative',
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '96px 16px', // pt-24 pb-16
}
```

#### Hero Elements

| Element | Mobile | Tablet | Desktop |
|---------|--------|---------|----------|
| **Badge** | xs font, px-3 py-1.5 | sm font, px-4 py-2 | sm font, px-4 py-2 |
| **Heading** | text-4xl | text-5xl | text-6xl-xl |
| **Description** | text-lg | text-xl | text-2xl |
| **Buttons** | Mobile stack | Flex row | Flex row |
| **Trust Indicators** | gap-6 | gap-8 | gap-8 |

#### Landing Page Hero (with App Preview)

```typescript
// Grid Layout
{
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '2rem',
  alignItems: 'center',
}

// Desktop (lg+)
{
  gridTemplateColumns: '1fr 1fr',
  gap: '3rem',
}

// Mobile Order: Content -> App Preview
// Desktop Order: Content -> App Preview
```

#### App Preview Elements

| Element | Mobile | Tablet | Desktop |
|---------|--------|---------|----------|
| **Phone Width** | 200px | 240px | 280px |
| **Phone Height** | 460px | 520px | 560px |
| **Floating Cards** | 120px width | 140px width | 160px width |
| **Card Padding** | 12px | 16px | 16px |

---

## Cards

### Web Feature Cards

```typescript
// Standard Feature Card
{
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  padding: '16px', // Mobile
  padding: '24px', // Desktop
  textAlign: 'center',
  transition: 'all 300ms ease',
  hover: {
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-2px)',
  }
}
```

#### Feature Card Elements

| Element | Mobile | Desktop |
|---------|--------|----------|
| **Icon Container** | 48px | 64px |
| **Icon Size** | 24px | 32px |
| **Title** | text-base | text-lg |
| **Description** | text-sm | text-base |
| **Padding** | p-4 | p-6 |

### Mobile Product Card

```typescript
{
  backgroundColor: '#342418',
  borderRadius: 12,
  borderWidth: 0,
  overflow: 'hidden',
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

### Primary Button (Web)

```typescript
{
  backgroundColor: '#CC0000',
  color: '#111827',
  padding: '12px 24px', // Mobile
  padding: '16px 32px', // Desktop
  borderRadius: '9999px', // Full rounded
  fontWeight: '700',
  fontSize: '16px', // Mobile
  fontSize: '18px', // Desktop
  transition: 'all 300ms ease',
  hover: {
    backgroundColor: '#A30000',
    transform: 'translateY(-1px)',
  }
}
```

### Secondary Button (Web)

```typescript
{
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: '#FFFFFF',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  backdropFilter: 'blur(8px)',
  padding: '12px 24px', // Mobile
  padding: '16px 32px', // Desktop
  borderRadius: '9999px',
  fontWeight: '600',
  fontSize: '16px', // Mobile
  fontSize: '18px', // Desktop
  transition: 'all 300ms ease',
  hover: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  }
}
```

### Button Sizes

| Size | Height | Font Size | Padding | Usage |
|------|--------|-----------|---------|-------|
| `sm` | 40px | 14px | 16px | Small CTAs |
| `md` | 48px | 16px | 20px | Standard |
| `lg` | 56px | 16px | 24px | Hero sections |

### Mobile App Buttons

```typescript
// Primary (Mobile)
{
  height: 48,
  borderRadius: 12,
  backgroundColor: '#CC0000',
  paddingHorizontal: 20,
}

// Secondary/Outline (Mobile)
{
  height: 48,
  borderRadius: 12,
  backgroundColor: 'transparent',
  borderWidth: 1.5,
  borderColor: '#CC0000',
}
```

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

## Component Library

### Shared Components

| Component | Location | Purpose | Props |
|-----------|----------|---------|-------|
| **Navigation** | `@/components/landing/Navigation` | Main site navigation | Scrolled state, mobile menu |
| **HeroSection** | `@/components/landing/HeroSection` | Landing page hero | App preview, screenshots |
| **Footer** | `@/components/landing/Footer` | Site footer | Links, social |
| **ZoraLogo** | `@/components/landing/ZoraLogo` | Brand logo | Size, className |
| **FreeDeliveryBanner** | `@/components/marketing/FreeDeliveryBanner` | Top banner | Fixed positioning |

### Landing Page Components

| Component | Location | Purpose |
|-----------|----------|---------|
| **ValueProposition** | `@/components/landing/ValueProposition` | Main value props |
| **FeaturesGrid** | `@/components/landing/FeaturesGrid` | Feature showcase |
| **HowItWorks** | `@/components/landing/HowItWorks` | Process explanation |
| **Testimonials** | `@/components/landing/Testimonials` | Customer reviews |
| **MobileAppPromo** | `@/components/landing/MobileAppPromo` | App download CTA |

### Marketing Components

| Component | Location | Purpose |
|-----------|----------|---------|
| **ProductCarousel** | `@/components/marketing/ProductCarousel` | Featured products |

### Page Structure

```typescript
// Standard Page Layout
<main className="min-h-screen bg-background-light">
  <FreeDeliveryBanner />
  <Navigation />
  {/* Page Content */}
  <Footer />
</main>

// Hero Section Pattern
<section id="hero-section" className="relative min-h-[60vh] bg-gradient-to-br from-primary to-primary-dark overflow-hidden">
  {/* Background Elements */}
  <div className="absolute inset-0">
    <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl" />
    <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
  </div>
  {/* Content */}
</section>

// Content Section Pattern
<section className="py-12 sm:py-16 px-4 bg-white">
  <div className="container mx-auto max-w-6xl">
    {/* Section Content */}
  </div>
</section>
```

---

## Implementation Checklist

Use this checklist when implementing or reviewing screens:

### Web Pages
- [ ] **Structure**: FreeDeliveryBanner → Navigation → Content → Footer
- [ ] **Hero Section**: Gradient background, blur elements, responsive typography
- [ ] **Navigation**: Shared component with scroll state handling
- [ ] **Responsiveness**: Mobile-first with sm/lg/xl breakpoints
- [ ] **Typography**: Inter font family, responsive sizing
- [ ] **Colors**: Primary red, secondary yellow, proper contrast
- [ ] **Spacing**: Consistent padding/margins using scale
- [ ] **Components**: Use shared components where possible

### Mobile App
- [ ] **Background**: Uses `#221710` (backgroundDark)
- [ ] **Header**: Transparent/backgroundless with proper safe area padding
- [ ] **Bottom Nav**: Floating tab bar with duotone/fill icons
- [ ] **Cards**: 12px radius, `#342418` background, subtle shadow
- [ ] **Buttons**: 12px radius, proper height (48px default)
- [ ] **Inputs**: 8px radius, subtle border, proper focus state
- [ ] **Typography**: Montserrat for headings, Poppins for body
- [ ] **Animation**: Consistent timing (300ms) and easing

---

## File References

### Web Components
| File | Purpose |
|------|---------|
| `apps/web/app/page.tsx` | Landing page |
| `apps/web/app/about/page.tsx` | About page |
| `apps/web/app/features/page.tsx` | Features page |
| `components/landing/Navigation.tsx` | Shared navigation |
| `components/landing/HeroSection.tsx` | Landing hero |
| `components/landing/Footer.tsx` | Shared footer |
| `components/marketing/FreeDeliveryBanner.tsx` | Top banner |

### Mobile Components (Future)
| File | Purpose |
|------|---------|
| `constants/colors.ts` | Color tokens |
| `constants/typography.ts` | Font families, sizes, weights |
| `constants/spacing.ts` | Spacing, border radius, shadows |
| `components/ui/Button.tsx` | Button component |
| `components/ui/Input.tsx` | Input component |
| `components/ui/ProductCard.tsx` | Product card component |
| `components/ui/FloatingTabBar.tsx` | Bottom navigation |

---

*Last updated: February 2026 - Web Implementation*
