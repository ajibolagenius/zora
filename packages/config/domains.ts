/**
 * Zora Domain Configuration
 * 
 * Defines the domain structure for all Zora applications.
 * In production, these resolve to subdomains of zoraapp.co.uk.
 * In development, localhost ports are used.
 */

export const MAIN_DOMAIN = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'zoraapp.co.uk';

export const domains = {
    /** Main website - zoraapp.co.uk */
    web: {
        name: 'Zora',
        subdomain: '',
        production: `https://${MAIN_DOMAIN}`,
        development: 'http://localhost:3000',
        get url() {
            return process.env.NODE_ENV === 'production' ? this.production : this.development;
        },
    },
    
    /** Vendor portal - vendor.zoraapp.co.uk */
    vendor: {
        name: 'Zora Vendor Portal',
        subdomain: 'vendor',
        production: `https://vendor.${MAIN_DOMAIN}`,
        development: 'http://localhost:3001',
        get url() {
            return process.env.NODE_ENV === 'production' ? this.production : this.development;
        },
    },
    
    /** Admin dashboard - admin.zoraapp.co.uk */
    admin: {
        name: 'Zora Admin',
        subdomain: 'admin',
        production: `https://admin.${MAIN_DOMAIN}`,
        development: 'http://localhost:3002',
        get url() {
            return process.env.NODE_ENV === 'production' ? this.production : this.development;
        },
    },
    
    /** API endpoint - api.zoraapp.co.uk (Supabase) */
    api: {
        name: 'Zora API',
        subdomain: 'api',
        production: process.env.NEXT_PUBLIC_SUPABASE_URL || `https://api.${MAIN_DOMAIN}`,
        development: process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
        get url() {
            return process.env.NODE_ENV === 'production' ? this.production : this.development;
        },
    },
} as const;

/**
 * Get the full URL for a specific app
 */
export function getAppUrl(app: keyof typeof domains): string {
    return domains[app].url;
}

/**
 * Get all domains for CORS/security configuration
 */
export function getAllDomains(): string[] {
    return Object.values(domains).flatMap(d => [d.production, d.development]);
}

/**
 * Check if a URL belongs to the Zora platform
 */
export function isZoraDomain(url: string): boolean {
    try {
        const { hostname } = new URL(url);
        return hostname === MAIN_DOMAIN || 
               hostname.endsWith(`.${MAIN_DOMAIN}`) ||
               hostname === 'localhost';
    } catch {
        return false;
    }
}

export type AppName = keyof typeof domains;
