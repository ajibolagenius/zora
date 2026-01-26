/**
 * Navigation Helpers for Slug-based Routes
 * 
 * Provides utilities to navigate to vendor and product routes using slugs
 */

import { encodeProductSlug } from './slugUtils';
import { generateVendorSlug } from './slugUtils';

/**
 * Gets the product route URL using slug
 * @param productId - Product UUID
 * @returns Route path with Base62-encoded slug
 */
export function getProductRoute(productId: string): string {
  try {
    const slug = encodeProductSlug(productId);
    return `/product/${slug}`;
  } catch (error) {
    console.error('Error encoding product slug:', error);
    // Fallback to ID-based route for backward compatibility
    return `/product/${productId}`;
  }
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
