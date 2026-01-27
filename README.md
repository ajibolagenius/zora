# Zora African Market

A premium mobile e-commerce marketplace connecting the African diaspora in the UK with authentic African groceries, products, and vendors.

## Tech Stack

- **Frontend**: React Native with Expo (SDK 52+)
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Styling**: StyleSheet + NativeWind (Tailwind CSS)
- **State Management**: Zustand + TanStack Query
- **Navigation**: Expo Router (file-based routing)
- **Payments**: Stripe, Klarna, Clearpay

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (for testing)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/zora.git
cd zora
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your actual values:
```env
# Supabase (Required)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# Google Maps (Optional)
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

4. Start the development server:
```bash
npx expo start
```

5. Scan the QR code with Expo Go (iOS/Android) or press `w` for web preview.

## Project Structure

```
zora/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main tab navigation
│   ├── onboarding/        # Onboarding flow
│   ├── order/             # Order details
│   ├── product/           # Product details
│   ├── settings/          # Settings screens
│   └── vendor/            # Vendor storefront
├── components/            # Reusable UI components
│   ├── ui/                # Base UI components
│   └── nativewind/        # NativeWind components
├── constants/             # Design tokens & configuration
├── data/                  # Mock data (development)
├── hooks/                 # Custom React hooks
├── lib/                   # Supabase client & utilities
├── providers/             # Context providers
├── services/              # API & business logic
├── stores/                # Zustand state stores
├── supabase/              # Database migrations
├── types/                 # TypeScript definitions
└── docs/                  # Documentation
    └── PRD.md             # Product Requirements Document
```

## Features

### MVP Features
- 🏠 Home screen with hero banners, regions, vendors, and products
- 🔍 Explore screen with category filtering
- 📦 Product details with reviews and vendor info
- 🏪 Vendor storefronts
- 🛒 Multi-vendor shopping cart
- 💳 Checkout with multiple payment options
- 📋 Order management and tracking
- 👤 User profile with membership tiers
- 🔐 Authentication (Google OAuth, Email/Password)
- 📱 Onboarding flow for new users

### Design System
- Primary: #CC0000 (Zora Red)
- Secondary: #FFCC00 (Zora Yellow)
- Dark theme with warm brown tones

## Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)

2. Run the initial migration:
```sql
-- Copy contents from supabase/migrations/001_initial_schema.sql
```

3. Enable Google OAuth in Authentication settings

4. Copy your project URL and anon key to `.env`

## Building for Production

### EAS Build (Recommended)
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for all platforms
eas build --platform all
```

### Local Build
```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support, email support@zoramarket.com or join our Slack channel.
