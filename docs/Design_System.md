# Zora African Market — Design System

**Version:** 1.0  
**Status:** Active  
**Last Updated:** January 2026  
**Source:** Zora African Market Brand Guide v1.0

---

## 1. Brand Philosophy & Narrative

### 1.1. Our Mission
To celebrate African culture and commerce by connecting authentic African products with customers worldwide, creating economic opportunity for vendors and enriching our community.

### 1.2. What We Do
Zora African Market is a UK-based online marketplace connecting Africa to the world. We provide authentic African products while empowering vendors to grow sustainable businesses.

### 1.3. The Brand Promise
> Every purchase connects you with African heritage, supports local communities, and makes you part of a movement to celebrate African excellence.

### 1.4. Core Values

| Value | Description |
| --- | --- |
| **Authenticity** | Genuine African products from trusted vendors and communities |
| **Empowerment** | Supporting African entrepreneurs to build sustainable businesses |
| **Diversity** | Celebrating African cultures, crafts, and traditions |
| **Trust** | Maintaining highest standards of quality and transparency |
| **Accessibility** | Making African products easy and affordable for everyone |
| **Sustainability** | Promoting ethical sourcing and environmental consciousness |

---

## 2. Design Philosophy

### 2.1. Brand Personality
Our visual identity reflects who we are:

- **Vibrant & Energetic** — Bold colors and dynamic layouts
- **Authentic & Trustworthy** — Real imagery, genuine stories
- **Welcoming & Inclusive** — Warm tones, accessible design
- **Culturally Aware** — Respectful representation of African heritage
- **Modern & Progressive** — Contemporary design with cultural roots

### 2.2. Design Vision
Create a digital experience that feels like walking through a vibrant African marketplace — colorful, welcoming, and full of discovery. Every interaction should connect users to African heritage while providing a seamless, modern shopping experience.

---

## 3. Design Principles

### 3.1. Core Principles

1. **Celebrate Culture**
   - Design choices should honor and highlight African heritage
   - Use authentic patterns, colors, and imagery that tell stories
   - Avoid stereotypical or superficial cultural representations

2. **Warmth First**
   - Every touchpoint should feel welcoming and personal
   - Prefer warm tones and friendly interactions over cold, corporate aesthetics
   - Design for connection, not just conversion

3. **Clarity Through Simplicity**
   - Complex features should feel simple to use
   - Information hierarchy guides users naturally
   - Remove friction from the shopping experience

4. **Authentic Storytelling**
   - Products have stories — design should showcase them
   - Vendor stories build trust and connection
   - Context enriches the shopping experience

5. **Inclusive by Design**
   - Accessible to users of all abilities
   - Works across devices and connection speeds
   - Respects diverse cultural backgrounds within the diaspora

---

## 4. Color System

### 4.1. Primary Colors
Use these colors as the foundation of all designs.

| Color | Name | Hex Code | RGB | Usage |
| --- | --- | --- | --- | --- |
| 🔴 | **Zora Red** | `#CC0000` | `rgb(204, 0, 0)` | Primary headlines, CTAs, primary buttons, brand emphasis |
| 🟡 | **Zora Yellow** | `#FFCC00` | `rgb(255, 204, 0)` | Accents, highlights, secondary buttons, hover states |

### 4.2. Supporting Colors
Use for balance and readability.

| Color | Name | Hex Code | RGB | Usage |
| --- | --- | --- | --- | --- |
| ⚪ | **Pure White** | `#FFFFFF` | `rgb(255, 255, 255)` | Backgrounds, cards, contrast areas |
| ⚫ | **Neutral Gray** | `#505050` | `rgb(80, 80, 80)` | Body text, secondary content |

### 4.3. Extended Palette (Derived)
For UI elements and states.

| Color | Name | Hex Code | Usage |
| --- | --- | --- | --- |
| 🟤 | **Background Dark** | `#221710` | Dark mode backgrounds |
| 🟫 | **Card Dark** | `#342418` | Dark mode cards |
| 🟫 | **Tab Bar Dark** | `#1f1610` | Bottom navigation (95% opacity with blur) |
| 🫘 | **Background Light** | `#F8F7F5` | Light mode backgrounds |
| 🥮 | **Text Muted** | `#CBA990` | Muted text, placeholders |
| 🔵 | **Info** | `#3B82F6` | Informational states, links |

### 4.4. Color Usage Rules

```
Headlines:        Always use Zora Red (#CC0000)
Primary Buttons:  Zora Red (#CC0000) with white text
Secondary Buttons: Zora Yellow (#FFCC00) with dark text
Accents:          Yellow highlights on red backgrounds
Body Text:        Neutral Gray (#505050) for readability
Links:            Zora Red, underlined on hover
Success:          Green (#22C55E)
Warning:          Zora Yellow (#FFCC00)
Error:            Zora Red (#CC0000)
```

### 4.5. Print Colors (CMYK)

| Color | CMYK Values |
| --- | --- |
| Zora Red | C: 0%, M: 100%, Y: 100%, K: 20% |
| Zora Yellow | C: 0%, M: 20%, Y: 100%, K: 0% |

---

## 5. Design Tokens

### 5.1. Spacing Scale
Consistent spacing creates visual harmony.

```javascript
spacing: {
  '0':   '0px',
  '1':   '4px',
  '2':   '8px',
  '3':   '12px',
  '4':   '16px',
  '5':   '20px',
  '6':   '24px',
  '8':   '32px',
  '10':  '40px',
  '12':  '48px',
  '16':  '64px',
  '20':  '80px',
  '24':  '96px',
}
```

### 5.2. Border Radius
Rounded elements reflect organic African art influences.

```javascript
borderRadius: {
  'none':   '0px',
  'sm':     '4px',      // Subtle rounding
  'DEFAULT': '6px',     // Standard rounding
  'md':     '8px',      // Medium rounding
  'lg':     '12px',     // Large rounding
  'xl':     '16px',     // Extra large
  '2xl':    '24px',     // Cards, modals
  'full':   '9999px',   // Pills, avatars
}
```

### 5.3. Shadows
Warm, subtle shadows that don't feel harsh.

```javascript
shadows: {
  'sm':     '0 1px 2px rgba(34, 23, 16, 0.05)',
  'DEFAULT': '0 2px 4px rgba(34, 23, 16, 0.08)',
  'md':     '0 4px 8px rgba(34, 23, 16, 0.10)',
  'lg':     '0 8px 16px rgba(34, 23, 16, 0.12)',
  'xl':     '0 16px 32px rgba(34, 23, 16, 0.15)',
}
```

### 5.4. Z-Index Scale

```javascript
zIndex: {
  'base':      0,
  'dropdown':  1000,
  'sticky':    1100,
  'fixed':     1200,
  'modal':     1300,
  'popover':   1400,
  'toast':     1500,
}
```

### 5.5. Transitions

```javascript
transitions: {
  'fast':     '150ms ease-in-out',
  'DEFAULT':  '200ms ease-in-out',
  'slow':     '300ms ease-in-out',
  'slower':   '500ms ease-in-out',
}
```

---

## 6. Typography

### 6.1. Font Families

| Font | Weight | Purpose |
| --- | --- | --- |
| **Montserrat** | Bold (700) | Headlines, titles, buttons, emphasis |
| **Open Sans** | Regular (400) | Body text, descriptions, UI elements |
| **Lato** | Regular (400) | Alternative body font |
| **Plus Jakarta Sans** | 400-800 | Mobile app UI (from screen designs) |

### 6.2. Type Scale

| Level | Size | Weight | Line Height | Usage |
| --- | --- | --- | --- | --- |
| **Display** | 56px | ExtraBold (800) | 1.1 | Hero sections, splash screens |
| **Heading 1** | 28px | Bold (700) | 1.2 | Main section titles |
| **Heading 2** | 24px | Bold (700) | 1.3 | Subsection titles |
| **Heading 3** | 20px | SemiBold (600) | 1.4 | Card titles, small sections |
| **Heading 4** | 18px | SemiBold (600) | 1.4 | Labels, emphasis |
| **Body Large** | 18px | Regular | 1.6 | Lead paragraphs |
| **Body** | 16px | Regular | 1.6 | Standard content |
| **Body Small** | 14px | Regular | 1.5 | Secondary content |
| **Caption** | 12px | Regular | 1.4 | Captions, footnotes, metadata |
| **Overline** | 10px | SemiBold | 1.3 | Labels, categories (uppercase) |

### 6.3. Typography Rules

**Do:**
- Use Montserrat for ALL headlines
- Pair with Open Sans for body text
- Maintain 1.5 line spacing for body content
- Use bold (700) for emphasis
- Keep adequate contrast (4.5:1 minimum)

**Don't:**
- Mix multiple decorative fonts
- Use light weights for body text on mobile
- Stretch or compress type
- Use all caps for long text

---

## 7. Components

### 7.1. Buttons

**Primary Button**
```css
background: #CC0000;
color: #FFFFFF;
padding: 12px 24px;
border-radius: 8px;
font-family: 'Montserrat', sans-serif;
font-weight: 600;
font-size: 16px;
```

**Secondary Button**
```css
background: #FFCC00;
color: #221710;
padding: 12px 24px;
border-radius: 8px;
font-family: 'Montserrat', sans-serif;
font-weight: 600;
font-size: 16px;
```

**Outline Button**
```css
background: transparent;
border: 2px solid #CC0000;
color: #CC0000;
padding: 12px 24px;
border-radius: 8px;
```

**Button States:**
- Hover: Darken by 10%
- Active: Darken by 15%
- Disabled: Opacity 50%
- Focus: 2px offset ring in primary color

### 7.2. Cards

**Product Card**
```css
background: #342418; /* dark mode */
border-radius: 12px;
box-shadow: 0 2px 4px rgba(34, 23, 16, 0.08);
overflow: hidden;
/* Light mode: background #FFFFFF */
```

**Vendor Card**
```css
background: #342418; /* dark mode */
border-radius: 12px;
border: 1px solid rgba(255, 255, 255, 0.05);
padding: 12px;
/* Light mode: background #FFFFFF, border rgba(0, 0, 0, 0.05) */
```

### 7.3. Form Elements

**Input Field**
```css
background: #342418; /* dark mode */
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 8px;
padding: 12px 16px;
height: 48px;
font-size: 16px;
/* Light mode: background #FFFFFF, border #E5E5E5 */
/* Focus state */
border-color: #CC0000;
box-shadow: 0 0 0 3px rgba(204, 0, 0, 0.1);
```

**Labels**
```css
font-family: 'Open Sans', sans-serif;
font-size: 14px;
font-weight: 600;
color: #505050;
margin-bottom: 8px;
```

### 7.4. Navigation

**Bottom Tab Bar (Mobile)**
- Height: 70px + safe area
- Background: White (light) / #1f1610 with 95% opacity and backdrop blur (dark)
- Active icon: Zora Red (#CC0000) filled
- Inactive icon: #505050 (light) / #CBA990 (dark) outlined

**Header**
- Height: 56px
- Background: White with subtle shadow
- Title: Montserrat Bold, 18px

### 7.5. Badges & Tags

**Category Badge**
```css
background: rgba(204, 0, 0, 0.1);
color: #CC0000;
padding: 4px 12px;
border-radius: 9999px;
font-size: 12px;
font-weight: 600;
```

**Trust Badge**
```css
background: #22C55E;
color: #FFFFFF;
padding: 4px 8px;
border-radius: 4px;
font-size: 10px;
font-weight: 700;
text-transform: uppercase;
```

---

## 8. Visual Style

### 8.1. Photography Guidelines

| Principle | Description |
| --- | --- |
| **Authentic** | Real artisans and products in natural settings |
| **Warm Lighting** | Natural light highlighting details and colors |
| **Detail-Focused** | Close-ups emphasizing craftsmanship |
| **Diverse** | Products and stories from across Africa |
| **Vibrant** | Bold, rich colors reflecting African aesthetics |
| **Contextual** | Show products being used or in cultural context |

**Image Treatment:**
- ✓ Boost color saturation slightly for impact
- ✓ Apply warm filter for cohesive feel
- ✓ Use natural, authentic-looking edits
- ✗ Avoid overly artificial or filtered looks
- ✗ Don't use stereotypical imagery
- ✗ Avoid generic stock photos

### 8.2. Iconography

**Style:**
- Line weight: 1.5-2px
- Rounded corners
- Consistent sizing (24px default)
- African-inspired where appropriate

**Icon Categories:**
- Shopping & commerce
- Markets & vendors
- Crafts & products
- Maps & location
- Cultural symbols

### 8.3. Patterns & Textures

**African Patterns:**
- Geometric patterns inspired by African textiles
- Use as subtle backgrounds or dividers
- Don't overwhelm content — use sparingly
- Examples: Kente, Ankara, Mudcloth-inspired geometrics

**Organic Shapes:**
- Circles and rounded elements from African art
- Use for decorative accents
- Frame important content

**Geometric Borders:**
- Frames and dividers using African motifs
- Use to section content
- Keep minimal and purposeful

### 8.4. Illustrations

**Style:**
- Warm, inclusive imagery
- Diverse representation of people
- Flat design with subtle depth
- Consistent color palette (brand colors)
- African-inspired but not stereotypical

---

## 9. Logo Guidelines

### 9.1. Logo Description
The Zora logo combines a shopping bag with the African continent, filled with vibrant African symbols (fruits, products, crafts) in bold red and yellow. It represents both commerce and cultural richness.

### 9.2. Logo Specifications

| Specification | Value |
| --- | --- |
| **Minimum Size (Digital)** | 100px width |
| **Minimum Size (Print)** | 0.5 inches |
| **Clear Space** | 20px minimum on all sides |
| **Orientation** | Always horizontal, never rotated |
| **Primary Use** | Full color on white/light backgrounds |

### 9.3. Logo Don'ts

- ❌ Rotating or skewing the logo
- ❌ Changing colors or proportions
- ❌ Using on cluttered backgrounds
- ❌ Making it smaller than 100px
- ❌ Adding effects like shadows or gradients
- ❌ Stretching or distorting

---

## 10. Tone of Voice

### 10.1. Voice Characteristics

| Trait | Description |
| --- | --- |
| **Warm** | Friendly and welcoming |
| **Authentic** | Genuine and honest |
| **Educational** | Share stories and context |
| **Inclusive** | Welcome all backgrounds |
| **Empowering** | Inspire confidence |

### 10.2. Writing Examples

**Product Descriptions:**
- ❌ Instead of: "Hand-woven basket"
- ✅ Say: "Beautifully hand-woven basket by Kenyan artisans using traditions passed down through generations"

**Call-to-Actions:**
- ❌ Instead of: "Buy now"
- ✅ Say: "Discover this treasure" or "Support African craftsmanship"

**General Tone:**
Warm, knowledgeable, and celebratory. We're a trusted friend from your community, not a faceless corporation.

---

## 11. Implementation Reference

### 11.1. Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': '#CC0000',
        'primary-dark': '#A30000',
        'secondary': '#FFCC00',
        'secondary-dark': '#E6B800',
        'info': '#3B82F6',
        'background-light': '#F8F7F5',
        'background-dark': '#221710',
        'card-dark': '#342418',
        'text-primary': '#505050',
        'text-muted': '#CBA990',
      },
      fontFamily: {
        'display': ['Montserrat', 'sans-serif'],
        'body': ['Open Sans', 'sans-serif'],
        'jakarta': ['Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        'DEFAULT': '6px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
      },
    },
  },
}
```

### 11.2. CSS Custom Properties

```css
:root {
  /* Colors */
  --color-primary: #CC0000;
  --color-secondary: #FFCC00;
  --color-info: #3B82F6;
  --color-background: #F8F7F5;
  --color-text: #505050;
  --color-text-muted: #CBA990;
  
  /* Typography */
  --font-display: 'Montserrat', sans-serif;
  --font-body: 'Open Sans', sans-serif;
  
  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
}

[data-theme="dark"] {
  --color-background: #221710;
  --color-card: #342418;
  --color-text: #FFFFFF;
}
```

---

## 12. Quick Reference

### Do's ✅
- Use complete logo with proper spacing
- Use Montserrat for all headlines
- Maintain red and yellow consistency
- Use authentic, vibrant imagery
- Be warm and celebratory
- Tell African stories with respect

### Don'ts ❌
- Rotate, resize, or modify the logo
- Mix multiple decorative fonts
- Add unauthorized brand colors
- Use generic stock photos
- Be corporate or impersonal
- Use stereotypical imagery

---

**Document Maintained By:** Development Team  
**Source:** Zora African Market Brand Guidelines v1.0 (2025)
