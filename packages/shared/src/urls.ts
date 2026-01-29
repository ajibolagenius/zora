/**
 * Cross-app URL utilities for Zora platform
 *
 * These utilities help manage URLs across the different apps
 * (web, vendor, admin) in both development and production.
 */

/**
 * Get the base URL for each app
 */
export const appUrls = {
    web: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    vendor: process.env.NEXT_PUBLIC_VENDOR_URL || 'http://localhost:3001',
    admin: process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3002',
} as const;

export type AppType = keyof typeof appUrls;

/**
 * Get the URL for a specific app
 */
export function getAppUrl(app: AppType): string {
    return appUrls[app];
}

/**
 * Build a full URL for a path in a specific app
 */
export function buildAppUrl(app: AppType, path: string = '/'): string {
    const baseUrl = getAppUrl(app);
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${normalizedPath}`;
}

/**
 * Get the vendor portal login URL
 */
export function getVendorLoginUrl(): string {
    return buildAppUrl('vendor', '/login');
}

/**
 * Get the admin dashboard login URL
 */
export function getAdminLoginUrl(): string {
    return buildAppUrl('admin', '/login');
}

/**
 * Get the vendor onboarding URL (on main web app)
 */
export function getVendorOnboardingUrl(): string {
    return buildAppUrl('web', '/vendor-onboarding');
}

/**
 * Check if the current environment is production
 */
export function isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
}

/**
 * Get the main domain (without subdomain)
 */
export function getMainDomain(): string {
    return process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'zoraapp.co.uk';
}
