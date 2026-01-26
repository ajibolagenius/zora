/**
 * Navigation Helpers for Slug-based Routes
 * 
 * Provides utilities to navigate to vendor and product routes using slugs
 */

import { encodeProductSlug, isValidProductSlug } from './slugUtils';
import { generateVendorSlug } from './slugUtils';

/**
 * Checks if a string is a valid UUID format
 */
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

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
export function getVendorRoute(vendor?: { shop_name?: string; slug?: string; name?: string }, vendorId?: string): string {
  if (vendor) {
    // Use existing slug if available
    if (vendor.slug) {
      return `/store/${vendor.slug}`;
    }
    
    // Generate slug from shop name
    const shopName = vendor.shop_name || vendor.name || '';
    if (shopName) {
      const slug = generateVendorSlug(shopName);
      return `/store/${slug}`;
    }
  }
  
  // Fallback to ID-based route
  if (vendorId) {
    return `/vendor/${vendorId}`;
  }
  
  return '/vendors';
}
