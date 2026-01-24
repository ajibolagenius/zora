# Technical Context
* **Architecture:** Monorepo approach (suggested) for shared types and logic.
* **Database:** PostgreSQL (Supabase) with RLS (Row Level Security) enabled.
* **Mobile Styling:** NativeWind (Tailwind CSS for React Native).
* **Web Styling:** Tailwind CSS + shadcn/ui.
* **State Management:** Zustand (Global) + TanStack Query (Server State).
* **Benchmark:** OyaShop's emphasis on "cultural authenticity" and "vendor identity."

# Development Standards
1.  **Component First:** Build modular UI components in shadcn/ui (Web) and NativeWindUI (Mobile).
2.  **Type Safety:** Strict TypeScript usage across all repositories.
3.  **Performance:** - Mobile: Use `FlashList` for heavy product feeds.
    - Web: Implement Server Components (Next.js 14+) for SEO-friendly vendor profiles.
4.  **Security:** All financial transactions must be validated via Supabase Edge Functions.
