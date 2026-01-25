# Zora African Market - Mobile App

React Native / Expo application for the Zora African Market platform.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npx expo start
```

## Development

### Running on Device
- **Expo Go**: Scan QR code with Expo Go app (iOS/Android)
- **Web**: Press `w` to open web preview
- **iOS Simulator**: Press `i` (macOS only)
- **Android Emulator**: Press `a`

### Environment Setup
1. Copy `.env.example` to `.env`
2. Fill in your Supabase and API keys

## Project Structure

```
frontend/
├── app/                 # Expo Router screens
│   ├── (auth)/         # Authentication screens
│   ├── (tabs)/         # Main tab navigation
│   ├── onboarding/     # Onboarding flow
│   ├── product/        # Product details
│   ├── vendor/         # Vendor storefront
│   └── settings/       # User settings
├── components/         # Reusable UI components
├── constants/          # Design tokens
├── hooks/              # Custom React hooks
├── lib/                # Supabase client
├── services/           # API services
├── stores/             # Zustand state
├── supabase/           # Database migrations
└── types/              # TypeScript types
```

## Learn More

See the main [README.md](../README.md) for complete documentation.
