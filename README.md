# Zora African Market - Monorepo

A comprehensive platform connecting the African diaspora with authentic African groceries, products, and vendors.

## Architecture

This is a monorepo containing:

| App | Description | Port | Stack |
|-----|-------------|------|-------|
| **Mobile** | Customer-facing iOS/Android app | Expo Go | React Native, Expo |
| **Web** | Landing page & vendor onboarding | 3000 | Next.js 15 |
| **Vendor** | Vendor management portal | 3001 | Next.js 15 |
| **Admin** | Platform administration dashboard | 3002 | Next.js 15 |

## Tech Stack

### Mobile App
- React Native with Expo (SDK 54+)
- NativeWind (Tailwind CSS)
- Zustand + TanStack Query
- Expo Router

### Web Apps
- Next.js 15 (App Router)
- Tailwind CSS + shadcn/ui
- Zustand + TanStack Query
- React Hook Form + Zod

### Shared
- Supabase (PostgreSQL, Auth, Storage, Realtime)
- TypeScript
- Turborepo

## Project Structure

```
zora/
├── apps/
│   ├── mobile/          # React Native (Expo) - Customer App
│   ├── web/             # Next.js - Landing Page
│   ├── vendor/          # Next.js - Vendor Portal
│   └── admin/           # Next.js - Admin Dashboard
│
├── packages/
│   ├── types/           # Shared TypeScript types
│   ├── api-client/      # Shared Supabase client & services
│   ├── design-tokens/   # Colors, typography, spacing
│   └── shared/          # Shared utilities
│
├── supabase/            # Database migrations
├── docs/                # Documentation
└── data/                # Mock data & email templates
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+
- Expo CLI (for mobile development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/zora.git
cd zora
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your actual values
```

4. Start development:

```bash
# Start all apps
pnpm dev

# Or start individual apps
pnpm dev:mobile    # Mobile app (Expo)
pnpm dev:web       # Landing page (http://localhost:3000)
pnpm dev:vendor    # Vendor portal (http://localhost:3001)
pnpm dev:admin     # Admin dashboard (http://localhost:3002)
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm dev:mobile` | Start mobile app only |
| `pnpm dev:web` | Start landing page only |
| `pnpm dev:vendor` | Start vendor portal only |
| `pnpm dev:admin` | Start admin dashboard only |
| `pnpm build` | Build all apps |
| `pnpm lint` | Lint all apps |
| `pnpm type-check` | Type check all apps |
| `pnpm clean` | Clean all build artifacts |

## Deployment

### Web Apps (Vercel)

| App | Recommended Domain |
|-----|-------------------|
| Landing Page | zoraapp.co.uk |
| Vendor Portal | vendor.zoraapp.co.uk |
| Admin Dashboard | admin.zoraapp.co.uk |

### Mobile App

Build and deploy using Expo Application Services (EAS):

```bash
cd apps/mobile
eas build --platform all
eas submit --platform all
```

## Documentation

- [Project Requirements Document](docs/PRD.md)
- [Monorepo Execution Plan](docs/MONOREPO_EXECUTION_PLAN.md)
- [Database Schema](supabase/migrations/)

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

Proprietary - All rights reserved.
