import { decodeProductSlug, encodeProductSlug, isValidUUID } from './slugUtils';

/**
 * Navigation Helper Functions
 * Utilities for generating routes and handling navigation
 */

/**
 * Gets the product route URL using slug
 * @param productId - Product UUID or legacy ID
 * @returns Route path with Base62-encoded slug (for UUIDs) or legacy ID (for non-UUIDs)
 */
export function getProductRoute(productId: string): string {
  // Only encode if it's a valid UUID
  if (isValidUUID(productId)) {
    try {
      const slug = encodeProductSlug(productId);
      return `/product/${slug}`;
    } catch (error) {
      console.error('Error encoding product slug:', error);
      // Fallback to ID-based route
      return `/product/${productId}`;
    }
  }
  
  // For non-UUID IDs (like "prd_011"), use the ID directly
  // The product route will handle both UUID slugs and legacy IDs
  return `/product/${productId}`;
}

/**
 * Gets the vendor/store route URL using slug
 * @param vendor - Vendor object with shop_name or slug
 * @param vendorId - Optional vendor ID as fallback
 * @returns Route path with semantic slug
 */
export function getVendorRoute(vendor?: { slug?: string; shop_name?: string; name?: string }, vendorId?: string): string {
  // Prefer slug if available
  if (vendor?.slug) {
    return `/store/${vendor.slug}`;
  }
  
  // Generate slug from shop_name or name
  if (vendor?.shop_name || vendor?.name) {
    const shopName = vendor.shop_name || vendor.name || '';
    const slug = shopName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    if (slug) {
      return `/store/${slug}`;
    }
  }
  
  // Fallback to ID-based route if no slug available
  if (vendorId) {
    return `/vendor/${vendorId}`;
  }
  
  // Ultimate fallback
  return '/vendors';
}

/**
 * Handles redirect for invalid or not found resources
 * @param router - Expo Router instance
 * @param type - Type of resource (product, vendor, order, etc.)
 * @param fallbackRoute - Route to redirect to if back navigation isn't available
 */
export function handleNotFoundRedirect(
  router: any,
  type: 'product' | 'vendor' | 'store' | 'order' | 'page',
  fallbackRoute?: string
): void {
  const routes: Record<string, string> = {
    product: '/(tabs)/explore',
    vendor: '/vendors',
    store: '/vendors',
    order: '/(tabs)/orders',
    page: '/(tabs)',
  };

  const defaultRoute = fallbackRoute || routes[type] || '/(tabs)';

  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace(defaultRoute);
  }
}

/**
 * Validates if a route parameter is valid
 * @param param - Route parameter value
 * @param type - Type of parameter (uuid, slug, id)
 * @returns true if valid, false otherwise
 */
export function isValidRouteParam(param: string | undefined, type: 'uuid' | 'slug' | 'id' = 'id'): boolean {
  if (!param || typeof param !== 'string') return false;

  switch (type) {
    case 'uuid':
      return isValidUUID(param);
    case 'slug':
      // Basic slug validation: alphanumeric, hyphens, underscores
      return /^[a-z0-9_-]+$/i.test(param) && param.length > 0 && param.length <= 100;
    case 'id':
      // Basic ID validation: non-empty string
      return param.length > 0 && param.length <= 255;
    default:
      return false;
  }
}
