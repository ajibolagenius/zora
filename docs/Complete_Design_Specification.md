# Google Stitch AI Design Prompt
## Zora African Market — Complete Design Specification

**Purpose:** Master prompt for generating consistent, on-brand UI designs in Google Stitch AI
**Version:** 3.0 (Enhanced with Mandatory Design System Compliance)
**Last Updated:** January 2026
**Reference:** Existing screens in `stitch_zora_african_market/` folder (layout concepts only — colors updated)

---

## ⚠️ CRITICAL: MANDATORY DESIGN SYSTEM COMPLIANCE

> **EVERY PROMPT MUST INCLUDE THIS COMPLIANCE BLOCK**
> 
> Copy and paste the following into EVERY screen prompt to ensure the AI follows the brand design system exactly:

```
⚠️ MANDATORY DESIGN SYSTEM REQUIREMENTS — FOLLOW EXACTLY:

1. COLORS (USE EXACT HEX VALUES):
   - Primary actions/CTAs/headlines: #CC0000 (Zora Red) — NOT orange, NOT #f26c0d
   - Prices/accents/highlights: #FFCC00 (Zora Yellow)
   - Dark background: #221710 (warm brown, NOT pure black)
   - Dark cards/surfaces: #342418
   - Dark mode text: #FFFFFF (primary), #CBA990 (muted)
   - Light mode text: #505050 (primary)
   - Success states: #22C55E
   - Active nav/tabs: #CC0000

2. TYPOGRAPHY (USE EXACT FONTS):
   - Headlines/titles/buttons: Montserrat Bold (700)
   - Body/descriptions: Open Sans Regular (400) or Plus Jakarta Sans
   - Prices: Montserrat Bold, #FFCC00

3. SPACING (USE EXACT VALUES):
   - Padding inside cards: 16px
   - Gap between cards: 12-16px
   - Section spacing: 24px
   - Button padding: 12px vertical, 24px horizontal
   - Icon-to-text gap: 8px

4. BORDER RADIUS (USE EXACT VALUES):
   - Buttons: 8px (or 12px for large CTAs)
   - Cards: 12px
   - Modals/sheets: 16px top corners
   - Pills/badges: 9999px
   - Avatars: 9999px (full circle)
   - Input fields: 8px

5. ICONS:
   - Use Material Symbols Outlined
   - Default size: 24px
   - Small: 20px, Tiny: 16px
   - Active icons: #CC0000, Inactive: #505050 or #CBA990

6. SHADOWS (WARM TONES):
   - Cards: 0 2px 4px rgba(34, 23, 16, 0.08)
   - Elevated: 0 4px 8px rgba(34, 23, 16, 0.10)
   - Modals: 0 8px 16px rgba(34, 23, 16, 0.12)

7. INTERACTIVE STATES:
   - Hover: Darken primary by 10% (#A30000)
   - Active/pressed: Scale to 0.98
   - Disabled: 50% opacity
   - Focus: 2px ring in primary color with 2px offset

8. BOTTOM NAVIGATION:
   - Height: 70px (plus safe area)
   - Background: #1f1610 with 95% opacity and backdrop blur
   - Active tab: #CC0000 filled icon + bold label
   - Inactive tabs: #505050 or #CBA990 outlined icon

⚠️ VERIFICATION: After generating, confirm NO orange (#f26c0d) appears — all should be Zora Red (#CC0000).
```

---

## 🎯 MASTER PROMPT — COPY THIS FIRST

```
You are designing a premium e-commerce mobile app called "Zora African Market" — a central hub for Africans in the UK diaspora to access authentic African groceries and products from local vendors.

BRAND ESSENCE:
- Vibrant African marketplace feel — colorful, welcoming, full of discovery
- Warm and authentic, not cold or corporate
- Celebrates African heritage with modern, progressive design
- Community-focused with cultural storytelling
- "Every purchase connects you with African heritage"

DESIGN SYSTEM (FOLLOW EXACTLY — NO DEVIATIONS):

COLORS (Use exact hex codes):
- Primary: Zora Red #CC0000 (headlines, CTAs, primary buttons, active states)
- Primary Hover: #A30000 (10% darker)
- Secondary: Zora Yellow #FFCC00 (accents, highlights, secondary buttons, prices, star ratings)
- Secondary Hover: #E6B800 (10% darker)
- Background Dark: #221710 (dark mode default — warm brown, NOT black)
- Card Dark: #342418 (elevated surfaces in dark mode)
- Text Primary Dark: #FFFFFF
- Text Primary Light: #505050
- Text Muted: #CBA990 (secondary text, placeholders, timestamps)
- Success: #22C55E
- Warning: #FFCC00
- Error: #CC0000
- Border Light: rgba(0, 0, 0, 0.05)
- Border Dark: rgba(255, 255, 255, 0.05)

TYPOGRAPHY (Use exact specifications):
- Font Display: Montserrat (all headlines, titles, buttons, prices)
- Font Body: Open Sans or Plus Jakarta Sans (body text, descriptions)
- H1: 28px Montserrat Bold
- H2: 24px Montserrat Bold
- H3: 20px Montserrat SemiBold
- Body: 16px Open Sans Regular
- Body Small: 14px Open Sans Regular
- Caption: 12px Open Sans Regular
- Overline: 10px Montserrat SemiBold uppercase
- Button Text: 16px Montserrat SemiBold
- Price: 18-24px Montserrat Bold in #FFCC00

SPACING:
- xs: 4px | sm: 8px | md: 16px | lg: 24px | xl: 32px
- Card padding: 16px
- Section gaps: 24px
- Button padding: 12px 24px

VISUAL STYLE:
- Dark mode as default with warm brown undertones
- Border radius: 4px (sm), 8px (buttons/inputs), 12px (cards), 16px (modals), 9999px (pills/avatars)
- Shadows: Warm-toned using rgba(34, 23, 16, X)
- Icons: Material Symbols Outlined, 24px default, 20px small, 16px tiny
- Bottom navigation: 70px height + safe area, blur backdrop
- African geometric patterns: 5-10% opacity as subtle texture
- Images: Warm color grading, authentic African products/people

Generate mobile screens at 390x844 pixels (iPhone 14/15). Every screen MUST use the exact colors above — verify #CC0000 for primary, #FFCC00 for prices/accents.
```

---

## 🧩 COMPONENT SPECIFICATIONS — INCLUDE IN PROMPTS

### Buttons

```
PRIMARY BUTTON:
- Background: #CC0000
- Text: #FFFFFF, Montserrat SemiBold, 16px
- Height: 48-56px
- Padding: 12px 24px
- Border radius: 8px (standard) or 12px (large CTA)
- Shadow: 0 4px 8px rgba(204, 0, 0, 0.25)
- Hover: #A30000
- Active: scale(0.98)
- Disabled: 50% opacity

SECONDARY BUTTON:
- Background: #FFCC00
- Text: #221710, Montserrat SemiBold, 16px
- Same dimensions as primary

OUTLINE BUTTON:
- Background: transparent
- Border: 2px solid #CC0000
- Text: #CC0000

GHOST BUTTON:
- Background: transparent
- Text: #CC0000 (or #FFCC00 for "Skip" links)
- No border
```

### Cards

```
PRODUCT CARD:
- Background: #342418 (dark) / #FFFFFF (light)
- Border radius: 12px
- Shadow: 0 2px 4px rgba(34, 23, 16, 0.08)
- Image: aspect-ratio 1:1 (square), rounded-t-12px
- Padding: 12px (content area)
- Title: 14px Montserrat SemiBold, 2-line clamp
- Subtitle: 12px Open Sans, #CBA990
- Price: 16px Montserrat Bold, #FFCC00
- Add button: 32px circle, #CC0000 background, white + icon

VENDOR CARD:
- Width: 260px (horizontal scroll)
- Image height: 144px with gradient overlay
- Rating badge: white/blur background, top-right
- Tag: #CC0000 background, bottom-left, 10px uppercase
- Padding: 12px
- Title: 16px Montserrat Bold
- Subtitle: 12px, #CBA990
- Metrics: distance + time with icons

INFO CARD:
- Background: #342418
- Border: 1px solid rgba(255, 255, 255, 0.05)
- Border radius: 12px
- Padding: 16px
- Icon: 24px in #CC0000
- Title: 14px Montserrat SemiBold
- Description: 12px Open Sans, #CBA990
```

### Form Elements

```
TEXT INPUT:
- Background: #342418 (dark) / #FFFFFF (light)
- Border: 1px solid rgba(255, 255, 255, 0.1) (dark) / #E5E5E5 (light)
- Border radius: 8px
- Height: 48px
- Padding: 12px 16px
- Placeholder: #CBA990
- Focus: border-color #CC0000, ring 0 0 0 3px rgba(204, 0, 0, 0.1)

SEARCH BAR:
- Background: #342418
- Border radius: 12px
- Height: 48px
- Left icon: search, #CBA990
- Right icon: filter/tune, #CBA990
- Placeholder: "Search for egusi, plantain, jollof..."

CHECKBOX/RADIO:
- Size: 20px
- Border: 2px solid #CBA990 (unchecked)
- Checked: #CC0000 fill with white checkmark
- Border radius: 4px (checkbox), 9999px (radio)

TOGGLE SWITCH:
- Width: 51px, Height: 31px
- Off: #505050 track, white thumb
- On: #CC0000 track, white thumb
```

### Navigation

```
BOTTOM TAB BAR:
- Height: 70px + safe area padding
- Background: #1f1610 with 95% opacity, backdrop-blur
- Border-top: 1px solid rgba(255, 255, 255, 0.05)
- 4-5 tabs equally spaced
- Active: #CC0000 icon (filled), bold label
- Inactive: #505050 icon (outlined), regular label
- Icon size: 26px
- Label: 10px, uppercase optional

TOP APP BAR:
- Height: 56px
- Background: #221710 with 95% opacity, backdrop-blur (sticky)
- Back button: 40px touch target, rounded-full
- Title: 18px Montserrat Bold, centered
- Actions: icon buttons, 40px touch targets

TABS (Horizontal):
- Height: 48px
- Active: #CC0000 text, 2px bottom border in #CC0000
- Inactive: #CBA990 text, no border
- Font: 14px Montserrat SemiBold
```

### Badges & Tags

```
STATUS BADGE:
- Padding: 4px 12px
- Border radius: 8px (or 9999px for pill)
- Font: 10-12px Montserrat SemiBold, uppercase
- Colors by status:
  - Active/Processing: #FFCC00 bg, #221710 text
  - Success/Delivered: #22C55E bg, white text
  - Error/Cancelled: #CC0000 bg, white text
  - Info/Transit: #3B82F6 bg, white text
  - Neutral: #342418 bg, #CBA990 text

PRICE TAG:
- Color: #FFCC00
- Font: Montserrat Bold
- Size: 16-24px based on context

RATING BADGE:
- Background: white with blur (on images) or #FFCC00/10
- Star icon: #FFCC00, filled
- Text: Bold, 12-14px
- Format: "⭐ 4.8 (120)"
```

### Micro-interactions

```
BUTTON PRESS:
- transform: scale(0.98)
- transition: 150ms ease-out

CARD HOVER:
- shadow increase
- optional: image scale to 1.05
- transition: 300ms ease

LOADING STATES:
- Skeleton: #342418 base, shimmer animation
- Spinner: #CC0000 color
- Progress bar: #CC0000 fill, #342418 track

TOAST/SNACKBAR:
- Background: #342418
- Border-left: 4px solid status color
- Border radius: 8px
- Icon + message + optional action
```

---

## 🎨 BRAND COLOR MIGRATION

The existing screen designs use orange (#f26c0d). Update ALL instances to use the new brand colors:

| Old Color | New Color | Usage |
|-----------|-----------|-------|
| `#f26c0d` (orange) | `#CC0000` (Zora Red) | Primary buttons, CTAs, active nav, badges, headlines |
| Orange accents | `#FFCC00` (Zora Yellow) | Prices, highlights, secondary accents, hover states |
| `#221710` | `#221710` (keep) | Dark mode background |
| `#342418` | `#342418` (keep) | Dark mode cards/surfaces |
| `#cba990` | `#CBA990` (keep) | Muted text |
| `#f8f7f5` | `#F8F7F5` (keep) | Light mode background |

---

## 📋 SCREEN DETAIL CHECKLIST — USE FOR EVERY SCREEN

Before generating any screen, ensure the prompt includes:

### Layout Details
- [ ] Screen dimensions specified (390x844px)
- [ ] Safe areas noted (top: 47px, bottom: 34px for iPhone)
- [ ] Sticky/fixed elements identified (header, footer, nav)
- [ ] Scroll behavior defined (vertical, horizontal sections)
- [ ] Z-index layers specified for overlapping elements

### Color Application
- [ ] Background color specified (#221710 for dark mode)
- [ ] Card/surface colors specified (#342418)
- [ ] Text colors for each text type (primary #FFFFFF, muted #CBA990)
- [ ] Accent colors for interactive elements (#CC0000 primary, #FFCC00 secondary)
- [ ] Gradient specifications if used (direction, stops)

### Typography Details
- [ ] Font family for each text element (Montserrat or Open Sans)
- [ ] Font weight specified (400, 600, 700)
- [ ] Font size in pixels for each text element
- [ ] Line height specified (1.2 for headlines, 1.5 for body)
- [ ] Text color specified
- [ ] Truncation rules (line-clamp-2, ellipsis, etc.)

### Spacing & Layout
- [ ] Padding values for containers (in pixels)
- [ ] Margin/gap between elements
- [ ] Alignment specified (left, center, justify-between)
- [ ] Flex/grid layout details

### Component States
- [ ] Default state appearance
- [ ] Hover/focus states
- [ ] Active/pressed states
- [ ] Disabled states
- [ ] Loading states
- [ ] Empty states

### Interactive Elements
- [ ] Touch targets minimum 44x44px
- [ ] Button styles and sizes
- [ ] Icon specifications (name, size, color)
- [ ] Link styles

### Images & Media
- [ ] Aspect ratios specified
- [ ] Border radius for images
- [ ] Overlay/gradient specifications
- [ ] Alt text descriptions for AI image generation

---

## 📱 SCREEN-BY-SCREEN PROMPTS

> **IMPORTANT:** Each screen prompt below should be prefixed with the MANDATORY DESIGN SYSTEM REQUIREMENTS block from the top of this document.

### ONBOARDING FLOW

#### 1. App Splash Screen
*Reference: `stitch_zora_african_market/app_splash_screen/`*

```
⚠️ INCLUDE MANDATORY DESIGN SYSTEM REQUIREMENTS BLOCK ABOVE ⚠️

Design a splash screen for "Zora African Market" mobile app.

SCREEN SPECS:
- Dimensions: 390x844px
- Safe area top: 47px, bottom: 34px
- Orientation: Portrait only
- Mode: Dark mode

BACKGROUND LAYER:
- Base color: #221710 (warm dark brown, NOT pure black)
- Radial gradient overlay: from #CC0000 at 0% opacity center to #221710 at edges
- African geometric mudcloth pattern at 5-10% opacity, subtle texture

CONTENT (Centered vertically and horizontally):
- Logo container: 
  - Glow effect: blur-3xl, #CC0000 at 20% opacity behind logo
  - "ZORA" text: Montserrat ExtraBold (800), 72px, 
  - Apply gold gradient to text: linear-gradient(135deg, #FFCC00 0%, #FFF5CC 50%, #E6B800 100%)
  - Text shadow: 0 4px 10px rgba(0, 0, 0, 0.5)
  - Letter-spacing: tight (-0.02em)

LOADING INDICATOR (below logo, 40px gap):
- Container: 128px width, centered
- Track: 6px height, rounded-full, #543b2d at 50% opacity
- Progress bar: 45% width, rounded-full
- Progress fill: gold gradient matching logo
- Glow: 0 0 10px rgba(253, 185, 49, 0.5)

TAGLINE (bottom of screen, 48px from bottom safe area):
- Text: "Connecting the Diaspora"
- Font: Montserrat Medium (500), 14px
- Color: #baa89c (muted gold)
- Letter-spacing: 0.2em
- Text-transform: uppercase
- Opacity: 80%

INTERACTION:
- Entire screen is tappable to proceed
- Subtle "Tap to continue" text, 12px, #CBA990, pulsing animation

MOOD: Premium, warm, culturally rich, inviting
```

#### 2. Login & Sign Up Screen
*Reference: `stitch_zora_african_market/cultural_interest_selection_1/`*

```
⚠️ INCLUDE MANDATORY DESIGN SYSTEM REQUIREMENTS BLOCK ABOVE ⚠️

Design a login/signup screen for Zora African Market.

SCREEN SPECS:
- Dimensions: 390x844px
- Background: #221710 (dark mode)
- Max content width: 400px, centered with shadow

HEADER (top section, 32px padding):
- Back button: 40x40px, rounded-full, #342418 background, ring-1 ring-white/10
  - Icon: arrow_back, 20px, white
  
- Tab switcher (below back button, 32px margin-top):
  - Container: #342418 background, rounded-full, padding 4px
  - Two tabs: "Sign In" | "Create Account"
  - Active tab: white background (light) or #CC0000 background (dark), rounded-full
  - Active text: #CC0000 (light) or white (dark), 14px Montserrat SemiBold
  - Inactive text: #505050, 14px Montserrat Medium

- Title: "Welcome Back"
  - Font: Montserrat Bold, 32px, white
  - Margin-top: 32px

- Subtitle:
  - Font: Open Sans Regular, 16px, #CBA990
  - Text: "Enter your details to access your personalized marketplace."
  - Margin-top: 8px

FORM SECTION (24px horizontal padding):
- Email field:
  - Label: "Email Address", 14px Montserrat Medium, #CBA990, margin-bottom 6px
  - Input: 48px height, #342418 bg, rounded-xl (12px)
  - Left icon: mail, 20px, #CBA990, padding-left 16px
  - Placeholder: "you@example.com", #CBA990 at 60%
  - Border: 1px solid #4b5563
  - Focus: ring-2 ring-#CC0000

- Password field (16px margin-top):
  - Same styling as email
  - Left icon: lock
  - Right icon: visibility_off (toggleable), #CBA990
  - Placeholder: "••••••••"

- Options row (margin-top 16px):
  - Remember me: checkbox (20px) + label, 14px
  - Forgot Password: #CC0000, 14px Montserrat Medium, right-aligned

- Sign In button (margin-top 24px):
  - Full width, 56px height
  - Background: #CC0000
  - Text: "Sign In", white, 18px Montserrat Bold
  - Border-radius: 12px
  - Shadow: 0 4px 8px rgba(204, 0, 0, 0.25)

SOCIAL LOGIN SECTION:
- Divider: "Or continue with" centered, #CBA990, 14px
  - Line: border-t #342418

- Social buttons grid (2 columns, 16px gap, margin-top 24px):
  - Google button: white bg, 48px height, rounded-xl, Google logo + "Google"
  - Apple button: same style, Apple logo + "Apple"

FOOTER:
- Terms text: 12px Open Sans, #CBA990, centered
- Links "Terms of Service" and "Privacy Policy" in #CC0000

SIZE: 390x844px, dark mode
```

#### 3-4. Cultural Interest Selection (2 Steps)
*Reference: `stitch_zora_african_market/cultural_interest_selection_2/3/`*

```
⚠️ INCLUDE MANDATORY DESIGN SYSTEM REQUIREMENTS BLOCK ABOVE ⚠️

Design a 2-step cultural interest onboarding flow for Zora African Market.

SCREEN SPECS:
- Dimensions: 390x844px each
- Background: #221710
- Fixed footer with CTA button

---

STEP 1 - SELECT REGIONS (cultural_interest_selection_2):

HEADER (24px padding):
- Back button: 40x40px, #342418 bg, rounded-full, ring-1 ring-white/10
- Title: "Discover Your Heritage"
  - Font: Montserrat Bold, 32px, white
  - Line-height: 1.15
- Subtitle:
  - Font: Open Sans Regular, 16px, #CBA990
  - Text: "Connect with the authentic flavors and crafts of home. Tap the regions you want to explore."
  - Margin-top: 12px

REGION CARDS (16px padding, 16px gap):
- 5 full-width cards, stacked vertically
- Each card:
  - Height: 128px
  - Background: gradient overlay on regional image
    - Gradient: linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)
  - Border-radius: 12px
  - Shadow: md
  - Content (left-aligned, 24px padding):
    - Region name: Montserrat Bold, 20px, white
    - Countries: Open Sans Medium, 14px, #E5E5E5 at 90%
  - Selection indicator (right side, vertically centered):
    - Unselected: 28px circle, #000000/40 bg, backdrop-blur, 1px border white/30
    - Selected: #CC0000 bg, white checkmark icon

- Regions:
  1. West Africa — Nigeria, Ghana, Senegal
  2. East Africa — Kenya, Ethiopia, Tanzania
  3. Southern Africa — South Africa, Zimbabwe
  4. Central Africa — Congo, Cameroon, Gabon
  5. North Africa — Morocco, Egypt, Tunisia

SELECTED STATE:
- Outer glow: -inset-0.5 with blur-[2px], #CC0000 at 75%
- Ring: 2px solid #CC0000

FIXED FOOTER:
- Gradient: from-#221710 via-#221710 to-transparent
- Padding: 16px
- Button: "Start Shopping", full width, 56px, #CC0000, 12px radius
  - Right arrow icon, 20px, white

---

STEP 2 - ONBOARDING INFO (cultural_interest_selection_3):

HEADER:
- Progress dots: 3 dots, 6px each, 8px gap
  - Active: #CC0000, Inactive: #342418
- Navigation: Back button (left), "Skip" link (right) → links to marketplace
- Skip: #CC0000, 14px Montserrat SemiBold

HERO IMAGE:
- Centered container, 320px width, square aspect ratio
- Border-radius: 16px
- Image: African textile/fabric pattern or market scene
- Gradient overlay at bottom for fade effect

CONTENT (centered, margin-top 24px):
- Title: "Direct from Local Vendors"
  - Font: Montserrat Bold, 32px
  - "Local Vendors" in #CC0000
  - Rest in white
- Description:
  - Font: Open Sans Regular, 18px, #CBA990
  - Max-width: 300px
  - Text: "Support authentic small businesses. We connect you directly with local African markets and artisans for the freshest goods."

FIXED FOOTER:
- Button: "Next", full width, 56px, #CC0000
  - Right arrow icon

SIZE: 390x844px each, dark mode
```

---

### MAIN MARKETPLACE

#### 5. Marketplace Home
*Reference: `stitch_zora_african_market/marketplace_home/`*

```
Design the main marketplace home screen for Zora African Market.

HEADER (sticky, #221710/95 with blur):
- Location button: "📍 Brixton, London" with dropdown chevron
  - Pill shape, #342418 background, location icon in Zora Red (#CC0000)
- Notification bell icon (top right) with red dot indicator

SEARCH BAR:
- Full width, #342418 background, 12px radius
- Placeholder: "Search for egusi, plantain, jollof..."
- Search icon left, filter icon right

HERO CAROUSEL (snap scroll):
- Featured banner: Full width, 2:1 aspect ratio, rounded-2xl
- Gradient overlay from bottom
- "Featured" badge in Zora Red (#CC0000)
- Headline: "The Perfect Jollof" in white bold
- CTA button: "Shop Collection" in Zora Red with arrow icon

SHOP BY REGION:
- Section title: "Shop by Region" with "See all" link in Zora Red
- Horizontal scroll of circular region avatars (72x72px):
  - West Africa, East Africa, South Africa, North Africa, Daily Essentials
  - Hover/selected: Zora Red border

FEATURED VENDORS:
- Section title: "Featured Vendors" with "View map" link in Zora Red
- Horizontal scroll of vendor cards (260px width):
  - Cover image (h-36) with gradient overlay
  - Rating badge: ⭐ 4.8 (white bg with blur)
  - "POPULAR" tag in Zora Red
  - Vendor name, category, distance, delivery time
  - Card: #342418 background (dark mode), 12px radius

BOTTOM NAVIGATION:
- 5 tabs: Home | Explore | Orders | Cart | Profile
- 70px height, #1f1610/95 background with blur
- Active tab: Zora Red (#CC0000) filled icon
- Inactive: gray icons (#505050)

SIZE: 390x844px, scrollable, dark mode
```

#### 6. Vendor Discovery Map
*Reference: `stitch_zora_african_market/vendor_discovery_map/`*

```
Design a map-based vendor discovery screen.

HEADER:
- Back button, "Find Vendors" title (Montserrat Bold)
- Filter chips (horizontal scroll): "Open Now", "Delivery", "Pickup", "Top Rated"
  - Selected chip: Zora Red background, white text

MAP VIEW:
- Full-width Google Maps style
- Custom vendor markers: Zora Red (#CC0000) pins with shopping bag icon
- User location: pulsing blue dot
- Vendor clusters as numbered red circles

BOTTOM SHEET (draggable):
- Handle bar, "12 vendors nearby" count
- Vendor list cards:
  - Thumbnail (square), vendor name (bold), category pills
  - Distance + delivery time
  - Rating with star in Zora Yellow (#FFCC00)
  - "Open until 8pm" in green

FLOATING BUTTON:
- "List View" toggle (Zora Red background)

SIZE: 390x844px, dark mode
```

#### 7. Vendor Storefront
*Reference: `stitch_zora_african_market/vendor_storefront/`*

```
Design an individual vendor's storefront/mini-shop page.

HEADER IMAGE:
- Full-width cover photo (h-48), vendor's shop/products
- Top nav overlay: back button, search icon, cart icon with Zora Red dot

VENDOR PROFILE (overlapping header by -16):
- Circular avatar (112px) with Zora Red border accent
- Verified badge (blue checkmark)
- Vendor name: "Mama Africa's Spices" in Montserrat Bold, 24px
- Location + "Verified Vendor" in muted text (#CBA990)
- Rating: ⭐ 4.8 (120 reviews) - star in Zora Yellow (#FFCC00)
- Bio text (2 lines max)

ACTION BUTTONS:
- "Follow" primary button (Zora Red)
- Message icon button (#342418)
- Share icon button (#342418)

STICKY TABS:
- Products | Reviews | About
- Active tab: Zora Red border-bottom, red text
- Inactive: muted text

PRODUCT GRID (2 columns):
- Product cards with:
  - Square image with heart favorite button (white/blur overlay)
  - "Hot" badge in Zora Red if featured
  - Product name (bold), size/weight (muted)
  - Price in Zora Yellow (#FFCC00)
  - Add button: Zora Red circle with + icon

SIZE: 390x844px, scrollable, dark mode
```

#### 8. Product Details View
*Reference: `stitch_zora_african_market/product_details_view/`*

```
Design a product detail page.

HERO IMAGE CAROUSEL:
- Full width, 45vh height
- Top overlay: back, share, favorite buttons (white/blur circles)
- Snap-scroll multiple images
- Pagination dots at bottom

CONTENT CARD (overlaps hero by -24px, rounded-t-3xl):
- Product name: Montserrat Bold, 24px, "Premium Aged Basmati Rice (5kg)"
- Price: £12.50 in Zora Yellow (#FFCC00), 24px bold
- Unit price: "£2.50/kg" in muted text

CHIPS ROW:
- Rating: ⭐ 4.8 (120) on yellow-tinted bg
- "Organic" badge on green-tinted bg
- "Origin: Himalayas" on blue-tinted bg

VENDOR CARD:
- Clickable card with vendor avatar, "Sold by" label in Zora Red
- Vendor name, chevron right

TABS:
- Description | Nutrition | Reviews
- Active: Zora Red border-bottom

DESCRIPTION CONTENT:
- Product story text
- "Product Highlights" heading
- Bullet list: Extra Long Grain, Gluten Free, Non-GMO, Sustainably Farmed

DELIVERY INFO GRID (2 columns):
- Delivery: 2-3 Business Days (truck icon in Zora Red)
- Quality: Zora Certified (shield icon in Zora Red)

STICKY FOOTER:
- Quantity stepper: - 1 + (gray background)
- "Add to Basket — £12.50" button (Zora Red, full width)

SIZE: 390x844px, scrollable, dark mode
```

---

### CHECKOUT FLOW

#### 9. Multi-Vendor Shopping Cart
*Reference: `stitch_zora_african_market/multi-vendor_shopping_cart/`*

```
Design a shopping cart with items from multiple vendors.

HEADER:
- Back button, "Your Cart" title, "Clear All" link in Zora Red

VENDOR SECTIONS (grouped):
Each vendor group:
- Vendor header: logo + name + "Delivers in 2-3 days"
- Item rows:
  - Product thumbnail (60px)
  - Product name + variant
  - Quantity stepper (- 1 +)
  - Price in Zora Yellow (#FFCC00)
  - Remove (trash) icon in muted color

PROMO CODE:
- Input with "Apply" button (Zora Red outline)

ORDER SUMMARY:
- Subtotal, Delivery Fee, Service Fee
- Discount line in green (if applicable)
- Total: large, bold, Zora Yellow (#FFCC00)

STICKY FOOTER:
- "Proceed to Checkout" — Zora Red button, full width

SIZE: 390x844px, dark mode
```

#### 10. Delivery & Pickup Options
*Reference: `stitch_zora_african_market/delivery_&_pickup_options/`*

```
Design delivery/pickup selection screen.

HEADER:
- Back, "Delivery Options", Step indicator (1/3) in Zora Red

SAVED ADDRESS CARD:
- Address details with "Change" link in Zora Red

DELIVERY OPTIONS (radio cards):
- Standard (2-3 days) — £3.99
- Express (Next day) — £6.99 ⚡
- Click & Collect (Free)
- Selected: Zora Red border, radio filled

PICKUP MAP (if selected):
- Map with pickup points marked in Zora Red

DELIVERY INSTRUCTIONS:
- Text area with placeholder

TIME SLOTS:
- Date picker (horizontal scroll)
- Time slots: Morning, Afternoon, Evening
- Selected slot: Zora Red background

FOOTER:
- "Continue to Payment" button (Zora Red)

SIZE: 390x844px, dark mode
```

#### 11. Secure Payment Selection
*Reference: `stitch_zora_african_market/secure_payment_selection/`*

```
Design payment method selection screen.

HEADER:
- "Payment" title, Step 2/3, 🔒 "Secure checkout" badge

SAVED CARDS:
- Card showing: Visa •••• 4242
- Radio selector, "Edit" link in Zora Red

PAYMENT OPTIONS (selectable cards):
- Credit/Debit Card (Stripe logo)
- Klarna — "Pay in 3 instalments"
- Clearpay — "Pay in 4"
- Apple Pay (Apple Pay button style)
- Google Pay

ZORA CREDIT (if available):
- "Use Zora Credit: £12.50" with toggle switch
- Toggle accent: Zora Red when on

ORDER SUMMARY (collapsible):
- Expandable with totals

FOOTER:
- "Pay £45.49" button (Zora Red)
- "Secured by Stripe" text with lock

SIZE: 390x844px, dark mode
```

#### 12. Order Success & Confirmation
*Reference: `stitch_zora_african_market/order_success_&_confirmation/`*

```
Design order confirmation success screen.

CONTENT (centered):
- Success animation: Green checkmark circle with confetti
- "Order Confirmed! 🎉" in Montserrat Bold, 28px
- Order number: "#ZAM-2024-1234" in muted
- "Thank you for supporting African vendors!"

ORDER DETAILS CARD:
- Estimated delivery date
- Delivery address (abbreviated)
- Items from X vendors
- Total paid in Zora Yellow (#FFCC00)

ACTION BUTTONS:
- "Track Order" — Zora Red primary
- "Continue Shopping" — outline button (Zora Red border)

RECOMMENDATIONS:
- "You might also like" product cards

SIZE: 390x844px, dark mode
```

---

### ORDER MANAGEMENT

#### 13. Order History Overview
*Reference: `stitch_zora_african_market/order_history_overview/`*

```
Design order history listing screen.

HEADER:
- "My Orders" title
- Filter tabs: Active | Completed | Cancelled
- Active tab: Zora Red underline

ORDER CARDS:
- Order number + date
- Vendor name(s) with small logos
- Status badges:
  - "Preparing" — Zora Yellow background
  - "Out for Delivery" — blue
  - "Delivered" — green
  - "Cancelled" — Zora Red
- Item count, total amount
- Product thumbnails (3 small)
- "Track Order" or "Reorder" button (Zora Red text)

EMPTY STATE:
- Illustration, "No orders yet", "Start Shopping" button

SIZE: 390x844px, dark mode
```

#### 14. Live Delivery Tracking
*Reference: `stitch_zora_african_market/live_delivery_tracking/`*

```
Design real-time order tracking screen.

HEADER:
- Back, "Track Order", order number

MAP VIEW:
- Vendor location (shop pin)
- Driver location (moving indicator)
- Destination (home pin)
- Route line in Zora Red

DRIVER INFO CARD:
- Driver photo (circular)
- "David is on the way"
- Vehicle info
- Call + Message buttons (Zora Red icons)

TRACKING TIMELINE (vertical stepper):
- ✓ Order confirmed (Zora Red checkmark)
- ✓ Preparing
- ✓ Picked up
- ● Out for delivery (pulsing Zora Red)
- ○ Delivered

ESTIMATED ARRIVAL:
- "Arriving in ~15 mins" large text
- Progress bar (Zora Red fill)

SIZE: 390x844px, dark mode
```

#### 15. Order Support Chat
*Reference: `stitch_zora_african_market/order_support_chat/`*

```
Design order support chat screen.

HEADER:
- Back, "Order Support", order reference

CHAT AREA:
- Bot messages: #342418 left-aligned bubbles
- User messages: Zora Red (#CC0000) right-aligned bubbles
- Timestamps between groups
- Typing indicator

QUICK REPLIES (horizontal chips):
- "Where's my order?", "Wrong item", "Request refund", "Speak to human"
- Chip style: #342418 background, white text

MESSAGE INPUT:
- Text field, attachment icon, send button (Zora Red)

SIZE: 390x844px, dark mode
```

---

### ACCOUNT & PROFILE

#### 16. User Profile & Pickup ID
*Reference: `stitch_zora_african_market/user_pickup_id_&_profile/`*

```
Design user profile screen with QR pickup code.

HEADER:
- Settings gear icon, "My Profile" title

PROFILE CARD:
- Large avatar (100px) with edit overlay
- Name: "Adaeze Johnson"
- Email in muted text
- "Gold Member ⭐" badge in Zora Yellow

QR CODE SECTION:
- Large QR code for pickup verification
- "Show this code for order pickup"
- Customer ID below
- "Refresh Code" link in Zora Red

STATS ROW:
- Orders: 24 | Reviews: 12 | Saved: 8
- Numbers in Zora Yellow

MENU OPTIONS:
- Personal Information →
- Payment Methods →
- Saved Addresses →
- Notification Settings →
- Help & Support →
- About Zora →
- Log Out (Zora Red text)

SIZE: 390x844px, dark mode
```

#### 17. Loyalty Points & Credit Detail
*Reference: `stitch_zora_african_market/loyalty_points_&_credit_detail/`*

```
Design loyalty/credit balance screen.

HEADER:
- Back, "Zora Rewards"

BALANCE CARD:
- Large balance: "£12.50" in Zora Yellow (#FFCC00)
- "Zora Credit" label
- Points: "2,450 points"
- Progress bar to next tier (Zora Red fill)

TIER INFO:
- Current: "Gold" badge
- Benefits checklist (checkmarks in Zora Red)
- "550 points to Platinum"

TRANSACTION HISTORY:
- "+£5.00 — Referral bonus" (green)
- "-£3.50 — Used on order" (neutral)
- "+150 points — Order completed" (Zora Yellow)

EARN MORE:
- Ways to earn with point values

SIZE: 390x844px, dark mode
```

#### 18. Referrals & Rewards Hub
*Reference: `stitch_zora_african_market/referrals_&_rewards_hub/`*

```
Design referral program screen.

HERO:
- Illustration of sharing
- "Give £10, Get £10" in Montserrat Bold
- Subtitle text

REFERRAL CODE CARD:
- Code: "ADAEZE10" (large, Zora Yellow)
- "Copy Code" button (Zora Red)
- "Share" button

SHARE ICONS:
- WhatsApp, Facebook, Twitter, Email
- Zora Red icon backgrounds

REFERRAL STATS:
- "5 friends joined • £50 earned"
- List of referred friends with status

HOW IT WORKS:
- 3-step visual guide

SIZE: 390x844px, dark mode
```

---

### SUPPORT & DISPUTES

#### 19. Help Center & FAQs
*Reference: `stitch_zora_african_market/help_center_&_faqs/`*

```
Design help center screen.

HEADER:
- Back, "Help Center"
- Search bar: "How can we help?"

QUICK ACTIONS (icon row):
- 📦 Track Order | 💬 Live Chat | 📞 Call Us | ✉️ Email
- Icons in Zora Red

FAQ CATEGORIES (accordion):
- Orders & Delivery
- Payments & Refunds
- Account & Profile
- Vendors & Products
- Chevron icons, expand on tap

POPULAR QUESTIONS:
- List with chevrons

CONTACT CARD:
- "Still need help?" with "Contact Us" button (Zora Red)

SIZE: 390x844px, dark mode
```

#### 20. Select Dispute Items
*Reference: `stitch_zora_african_market/select_dispute_items/`*

```
Design dispute item selection screen.

HEADER:
- Back, "Report an Issue"

ISSUE TYPE (radio):
- Missing items, Wrong items, Damaged items, Quality issue, Other
- Selected: Zora Red radio fill

ITEM SELECTION:
- Order items with checkboxes
- Checkbox selected: Zora Red fill

FOOTER:
- "Continue" button (Zora Red)

SIZE: 390x844px, dark mode
```

#### 21. Dispute Details & Evidence
*Reference: `stitch_zora_african_market/dispute_details_&_evidence/`*

```
Design dispute submission with photo upload.

HEADER:
- Back, "Describe the Issue"

SELECTED ITEMS SUMMARY:
- Collapsible list

DESCRIPTION:
- Large text area
- Character count

PHOTO UPLOAD:
- "Add Photos" area with + icon
- Uploaded photos with delete option
- Camera/Gallery options

PREFERRED RESOLUTION (radio):
- Full refund, Partial refund, Replacement, Store credit
- Selected: Zora Red

FOOTER:
- "Submit Dispute" button (Zora Red)

SIZE: 390x844px, dark mode
```

#### 22. Dispute Status Tracker
*Reference: `stitch_zora_african_market/dispute_status_tracker/`*

```
Design dispute tracking screen.

DISPUTE SUMMARY:
- Dispute ID, Order ID, Submitted date
- Status: "Under Review" (Zora Yellow badge)

TIMELINE (vertical stepper):
- Steps with Zora Red checkmarks for completed
- Current step pulsing

DETAILS:
- Issue type, affected items, description, photos

RESOLUTION (when complete):
- Outcome card with refund amount

SIZE: 390x844px, dark mode
```

---

### NOTIFICATIONS

#### 23. Notification Center Overview
*Reference: `stitch_zora_african_market/notification_center_overview/`*

```
Design notifications listing screen.

HEADER:
- "Notifications", "Mark all read" in Zora Red

FILTER TABS:
- All | Orders | Promos | Updates
- Active: Zora Red underline

NOTIFICATIONS (grouped by date):
- Icon (color-coded by type)
- Title (bold), preview text
- Timestamp, unread dot (Zora Red)

NOTIFICATION TYPES:
- 📦 Orders (blue icon bg)
- 🎉 Promotions (Zora Yellow bg)
- ⭐ Reviews (green bg)
- 💰 Rewards (purple bg)

SIZE: 390x844px, dark mode
```

#### 24. Notification Preferences
*Reference: `stitch_zora_african_market/notification_preferences/`*

```
Design notification settings screen.

HEADER:
- Back, "Notification Preferences"

PUSH NOTIFICATIONS:
- Master toggle (Zora Red when on)

CATEGORIES (toggle rows):
- Order Updates, Delivery Status, Promotions, Price Drops, etc.
- Toggle accents: Zora Red

EMAIL PREFERENCES:
- Toggle rows for email types

QUIET HOURS:
- Time range picker

SIZE: 390x844px, dark mode
```

---

## 🎨 UPDATED DESIGN TOKENS

```
COLORS (BRAND GUIDE ALIGNED):
- primary: #CC0000 (Zora Red)
- secondary: #FFCC00 (Zora Yellow)
- background-dark: #221710
- card-dark: #342418
- text-primary-dark: #FFFFFF
- text-muted: #CBA990
- background-light: #F8F7F5
- text-primary-light: #505050
- success: #22C55E
- warning: #FFCC00
- error: #CC0000

TYPOGRAPHY:
- Font Display: Montserrat (headlines, buttons)
- Font Body: Plus Jakarta Sans / Open Sans
- H1: 28px Bold
- H2: 24px Bold
- H3: 20px SemiBold
- Body: 16px Regular
- Caption: 12px Regular
- Button: 16px SemiBold

SPACING:
- xs: 4px | sm: 8px | md: 16px | lg: 24px | xl: 32px

RADIUS:
- Button: 8px
- Card: 12px
- Modal: 16px
- Input: 8px
- Pill: 9999px

SHADOWS (warm tone):
- sm: 0 1px 2px rgba(34, 23, 16, 0.05)
- md: 0 4px 8px rgba(34, 23, 16, 0.10)
- lg: 0 8px 16px rgba(34, 23, 16, 0.12)

ICONS:
- Material Symbols Outlined
- Size: 24px default, 20px small, 16px tiny
```

---

## 📋 PROMPT MODIFIERS

**For Light Mode:**
```
Use light mode: Background #F8F7F5, Cards #FFFFFF, Text #505050, keep Zora Red and Yellow accents
```

**For Tablet:**
```
Generate at 820x1180px (iPad). Use 2-column layouts for product grids, wider cards.
```

**For High Fidelity:**
```
Add realistic product photography, micro-interaction states, detailed shadows, authentic African product imagery.
```

**For Wireframe:**
```
Generate as mid-fidelity wireframe: grayscale except Zora Red accents, placeholder images.
```

---

## ✅ BRAND COMPLIANCE CHECKLIST

Before accepting generated designs, verify:

- [ ] Primary actions use Zora Red (#CC0000), NOT orange
- [ ] Prices and highlights use Zora Yellow (#FFCC00)
- [ ] Dark background is #221710 (warm brown, not pure black)
- [ ] Cards use #342418 in dark mode
- [ ] Headlines use Montserrat Bold
- [ ] Buttons have 8-12px radius
- [ ] Cards have 12-16px radius
- [ ] Active nav items are Zora Red
- [ ] Inactive nav items are gray (#505050 or #CBA990)
- [ ] Overall feel is warm and African marketplace-inspired
- [ ] No cold blues or corporate grays dominating
- [ ] African cultural patterns used subtly (not overwhelming)

---

## 🔄 MIGRATION FROM EXISTING SCREENS

When regenerating screens from `stitch_zora_african_market/`:

1. **Keep** the layout structure and component placement
2. **Replace** all `#f26c0d` orange with `#CC0000` Zora Red
3. **Replace** orange price text with `#FFCC00` Zora Yellow
4. **Update** headlines to Montserrat Bold font
5. **Keep** the warm background colors (#221710, #342418)
6. **Keep** Material Symbols icons
7. **Keep** border radius values
8. **Add** Zora Yellow highlights to star ratings

---

## 🔍 DETAILED ELEMENT SPECIFICATIONS

### Icon Specifications

```
ICON LIBRARY: Material Symbols Outlined
(https://fonts.google.com/icons)

COMMON ICONS BY SCREEN:
Navigation:
- home, search, receipt_long, person, shopping_cart, shopping_bag
- arrow_back, arrow_back_ios_new, arrow_forward, chevron_right
- menu, close, more_vert

Actions:
- add, remove, delete, edit, share, favorite, favorite_border
- notifications, settings, tune, filter_list

Status:
- check_circle, error, warning, info, schedule, local_shipping
- verified, star (use filled for ratings)

Commerce:
- storefront, shopping_basket, credit_card, receipt, local_offer
- location_on, distance, near_me

Communication:
- chat, chat_bubble, mail, phone, support_agent

ICON SIZES:
- Navigation icons: 26px
- Action icons: 24px (default)
- Inline icons: 20px
- Small/badge icons: 16px
- Tiny indicators: 14px

ICON COLORS:
- Active/Primary: #CC0000
- Inactive: #505050 (light) or #CBA990 (dark)
- On primary button: #FFFFFF
- Warning: #FFCC00
- Success: #22C55E
- Error: #CC0000
```

### Image Specifications

```
PRODUCT IMAGES:
- Aspect ratio: 1:1 (square)
- Min resolution: 400x400px
- Border radius: match parent card (usually 12px top corners)
- Style: Warm lighting, authentic, not overly processed

VENDOR COVER IMAGES:
- Aspect ratio: 2:1 or 16:9
- Gradient overlay: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)
- Style: Market stalls, products, vibrant colors

AVATAR IMAGES:
- Aspect ratio: 1:1
- Border radius: 9999px (full circle)
- Border: 2-4px solid (brand color for vendors, white for users)
- Sizes: 32px (small), 48px (medium), 72px (large), 112px (profile)

HERO/BANNER IMAGES:
- Aspect ratio: 2:1 or custom for carousels
- Always include gradient overlay for text legibility
- African food, textiles, markets, happy customers

PLACEHOLDER STYLE:
- Base: #342418
- Shimmer animation for loading states
- Icon placeholder: shopping_bag or image icon in #CBA990
```

### Animation & Transition Specs

```
TRANSITIONS:
- Default: 200ms ease-in-out
- Fast (micro-interactions): 150ms ease-out
- Slow (page transitions): 300ms ease-in-out
- Spring (bouncy): cubic-bezier(0.68, -0.55, 0.265, 1.55)

HOVER EFFECTS:
- Buttons: background-color darken 10%
- Cards: shadow increase, optional scale(1.02)
- Images: scale(1.05) with overflow-hidden parent
- Links: color change, optional underline

LOADING ANIMATIONS:
- Skeleton shimmer: left-to-right gradient sweep
- Spinner: rotate 360deg, 1s linear infinite
- Progress bar: width transition 300ms ease

SCROLL ANIMATIONS:
- Parallax: subtle, 10-20% rate difference
- Fade-in: opacity 0→1, translateY 20px→0
- Stagger: 50-100ms delay between items
```

---

## ✅ QUALITY ASSURANCE CHECKLIST

### Pre-Generation Checklist

Before submitting any prompt to Stitch AI, verify:

```
□ Included MANDATORY DESIGN SYSTEM REQUIREMENTS block
□ Specified exact screen dimensions (390x844px)
□ Specified dark or light mode
□ Listed ALL colors with hex codes
□ Specified ALL fonts with weights and sizes
□ Defined ALL spacing values in pixels
□ Described ALL interactive states
□ Included icon names and sizes
□ Specified border-radius for each element type
□ Described image styles and aspect ratios
□ Noted any animations or transitions
```

### Post-Generation Verification

After receiving generated designs, check:

```
COLOR COMPLIANCE:
□ Primary actions use #CC0000 (NOT orange #f26c0d)
□ Prices and highlights use #FFCC00
□ Dark background is #221710 (warm brown, NOT pure black #000000)
□ Cards use #342418 in dark mode
□ Muted text uses #CBA990
□ No unauthorized blues, grays, or cool tones dominating

TYPOGRAPHY COMPLIANCE:
□ Headlines use Montserrat Bold
□ Body text uses Open Sans or Plus Jakarta Sans
□ Font sizes match specifications
□ Line heights are appropriate (1.2-1.5)
□ Text is legible with sufficient contrast

COMPONENT COMPLIANCE:
□ Buttons have correct border-radius (8-12px)
□ Cards have 12px border-radius
□ Pills/badges have 9999px border-radius
□ Touch targets are minimum 44x44px
□ Icons are correct size and color

LAYOUT COMPLIANCE:
□ Spacing is consistent with design tokens
□ Elements are properly aligned
□ Safe areas are respected
□ Scroll areas are clear
□ Fixed/sticky elements are correct

BRAND COMPLIANCE:
□ Overall feel is warm and welcoming
□ African cultural elements are respectful
□ No cold/corporate aesthetic
□ Imagery is authentic and appropriate
```

---

## 📝 PROMPT TEMPLATES

### Quick Prompt Template

Use this template for rapid screen generation:

```
⚠️ MANDATORY: Follow Zora African Market Design System exactly.

SCREEN: [Screen Name]
TYPE: [Onboarding/Main/Detail/Modal/etc.]
MODE: Dark mode, #221710 background
SIZE: 390x844px

HEADER:
- [Describe header elements with exact specs]

CONTENT:
- [Describe main content with exact specs]

FOOTER:
- [Describe footer/navigation with exact specs]

COLORS: Primary #CC0000, Secondary #FFCC00, Cards #342418, Muted text #CBA990
FONTS: Headlines Montserrat Bold, Body Open Sans
ICONS: Material Symbols Outlined, 24px default

STATES: [Describe any interactive states]
IMAGES: [Describe image requirements]
```

### Detailed Prompt Template

Use this for complex screens requiring precision:

```
⚠️ INCLUDE FULL MANDATORY DESIGN SYSTEM REQUIREMENTS BLOCK ⚠️

SCREEN SPECIFICATION: [Screen Name]

1. CANVAS
   - Dimensions: 390x844px
   - Safe areas: top 47px, bottom 34px
   - Background: #221710
   - Mode: Dark

2. LAYOUT STRUCTURE
   - [Describe grid/flex layout]
   - [List sections from top to bottom]

3. HEADER SECTION
   - Height: [X]px
   - Position: [sticky/fixed/static]
   - Background: [color + opacity + blur]
   - Elements:
     a. [Element 1]: [Full specs]
     b. [Element 2]: [Full specs]

4. CONTENT SECTIONS
   Section A: [Name]
   - Container: [padding, margin, background]
   - Title: [font, size, weight, color]
   - Items: [describe each with full specs]
   
   Section B: [Name]
   - [Continue pattern]

5. INTERACTIVE ELEMENTS
   - Buttons: [style, size, states]
   - Inputs: [style, states]
   - Cards: [hover/tap states]

6. FOOTER/NAVIGATION
   - [Full specs]

7. IMAGES
   - [Descriptions for AI generation]

8. ANIMATIONS
   - [Any motion specs]

9. VERIFICATION NOTES
   - Primary color MUST be #CC0000
   - NO orange (#f26c0d) anywhere
   - Prices in #FFCC00
```

---

## 🚨 COMMON MISTAKES TO AVOID

```
❌ WRONG                              ✅ CORRECT
─────────────────────────────────────────────────────────────
#f26c0d (orange)                     #CC0000 (Zora Red)
#000000 (pure black bg)              #221710 (warm dark brown)
Generic sans-serif                    Montserrat / Open Sans
Blue primary color                    Red primary #CC0000
Cold gray tones                       Warm brown tones
Sharp corners everywhere              Rounded corners per spec
Small touch targets                   Minimum 44x44px targets
No hover/active states                Full interaction states
Generic stock photos                  Authentic African imagery
Corporate cold feel                   Warm marketplace feel
Inconsistent spacing                  Token-based spacing
Missing muted text color              Use #CBA990 for secondary
White prices                          Yellow prices #FFCC00
```

---

## 📚 REFERENCE LINKS

- **Design System:** `docs/Design_System.md`
- **Existing Screens:** `stitch_zora_african_market/` folder
- **Brand Guidelines:** Zora African Market Brand Guide v1.0
- **Icon Library:** [Material Symbols](https://fonts.google.com/icons)
- **Font - Montserrat:** [Google Fonts](https://fonts.google.com/specimen/Montserrat)
- **Font - Open Sans:** [Google Fonts](https://fonts.google.com/specimen/Open+Sans)

---

**Document Purpose:** Google Stitch AI Design Generation  
**Project:** Zora African Market  
**Version:** 3.0 (Enhanced with Mandatory Design System Compliance)  
**Brand Guide Version:** 1.0 (2025)  
**Last Updated:** January 2026  
**Maintained By:** Development Team
