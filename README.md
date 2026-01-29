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
git clone https://github.com/<your-username>/zora.git
cd zora
```

> **Note:** Replace `<your-username>` with your GitHub username if you forked the repo, or use the original repository URL if cloning directly.

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

### Domain Structure

The Zora platform uses subdomain-based routing for its applications:

| App | Domain | Description |
|-----|--------|-------------|
| **Web** | `zoraapp.co.uk` | Main landing page, vendor onboarding |
| **Vendor Portal** | `vendor.zoraapp.co.uk` | Vendor management dashboard |
| **Admin Dashboard** | `admin.zoraapp.co.uk` | Platform administration |
| **Mobile App** | iOS App Store / Google Play | Customer shopping experience |

### Vercel Deployment

Each Next.js app is deployed as a separate Vercel project:

1. **Create Vercel Projects:**
   ```bash
   # From each app directory
   cd apps/web && vercel
   cd apps/vendor && vercel
   cd apps/admin && vercel
   ```

2. **Configure Domains in Vercel Dashboard:**
   - `apps/web` → `zoraapp.co.uk`
   - `apps/vendor` → `vendor.zoraapp.co.uk`
   - `apps/admin` → `admin.zoraapp.co.uk`

3. **Set Environment Variables:**
   Add these to each Vercel project:
   ```
   NEXT_PUBLIC_MAIN_DOMAIN=zoraapp.co.uk
   NEXT_PUBLIC_APP_URL=https://zoraapp.co.uk
   NEXT_PUBLIC_VENDOR_URL=https://vendor.zoraapp.co.uk
   NEXT_PUBLIC_ADMIN_URL=https://admin.zoraapp.co.uk
   ```

### Mobile App (EAS)

Build and deploy using Expo Application Services:

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
