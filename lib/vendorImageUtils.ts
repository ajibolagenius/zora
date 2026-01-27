/**
 * Vendor Image Utilities
 * 
 * Generates vendor storefront headers (cover images) and profile pictures (logos)
 * using free API services. Provides consistent, deterministic image generation
 * based on vendor ID/name for caching and consistency.
 */

/**
 * Free API Services for Vendor Images:
 * 
 * 1. Unsplash Source API (Free, no key required for basic usage)
 *    - High-quality photos
 *    - Food, market, storefront themes
 *    - Direct image URLs
 * 
 * 2. DiceBear Avatars (Free, no key required)
 *    - SVG avatars/logos
 *    - Deterministic based on seed
 *    - Multiple styles available
 * 
 * 3. Picsum (Lorem Picsum) - Free, no key required
 *    - Random placeholder images
 *    - Simple API
 * 
 * 4. Placeholder.com - Free, no key required
 *    - Simple placeholder images
 *    - Customizable size and text
 */

// Unsplash photo IDs for different vendor themes
// These are curated food/market/storefront images from Unsplash
const UNSPLASH_PHOTOS = {
  // Food & Market themes
  foodMarket: [
    '1504674900247-0877df9cc836', // Food market
    '1596040033229-a9821ebd058d', // African food
    '1542838132-92c53300491e',    // Spices
    '1474979266404-7eaacbcd87c5', // Grains
    '1608571423902-eed4a5ad8108', // Natural products
    '1532336414038-cf19250c5757', // Spices and herbs
    '1590001155093-a3c66ab0c3ff', // Market scene
    '1489392191049-fc10c97e64b6', // Food display
    '1539635278303-d4002c07eae3', // Market stall
    '1484318571209-661cf29a69c3', // Fresh produce
  ],
  // Storefront/Shop themes
  storefront: [
    '1523805009345-7448845a9e53', // Shop interior
    '1604329760661-e71dc83f8f26', // Storefront
    '1513475382585-d06e58bcb0e0', // Shop window
    '1507003211169-0a1dd7228f2d', // Business
    '1531746020798-e6953c6e8e04', // Professional
  ],
  // African market themes
  africanMarket: [
    '1590001155093-a3c66ab0c3ff', // West African market
    '1489392191049-fc10c97e64b6', // Market scene
    '1539635278303-d4002c07eae3', // Market stall
    '1484318571209-661cf29a69c3', // Fresh produce
    '1523805009345-7448845a9e53', // Market interior
  ],
};

/**
 * Generate a deterministic Unsplash photo ID based on vendor seed
 * Ensures the same vendor always gets the same cover image
 */
function getUnsplashPhotoId(seed: string, theme: 'foodMarket' | 'storefront' | 'africanMarket' = 'foodMarket'): string {
  // Generate hash from seed
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  
  const photos = UNSPLASH_PHOTOS[theme];
  const index = Math.abs(hash) % photos.length;
  return photos[index];
}

/**
 * Generate vendor cover image (storefront header) URL
 * Uses Unsplash for high-quality food/market/storefront images
 * 
 * @param vendorId - Vendor ID for deterministic image selection
 * @param vendorName - Vendor name (optional, used as fallback seed)
 * @param width - Image width (default: 800)
 * @param theme - Image theme (default: 'foodMarket')
 * @returns Unsplash image URL
 */
export function generateVendorCoverImage(
  vendorId: string,
  vendorName?: string,
  width: number = 800,
  theme: 'foodMarket' | 'storefront' | 'africanMarket' = 'foodMarket'
): string {
  const seed = vendorId || vendorName || 'default';
  const photoId = getUnsplashPhotoId(seed, theme);
  
  // Unsplash Source API - free, no key required
  // Format: https://images.unsplash.com/photo-{photoId}?w={width}
  return `https://images.unsplash.com/photo-${photoId}?w=${width}&auto=format&fit=crop`;
}

/**
 * Generate vendor logo/profile picture URL
 * Uses DiceBear for consistent, deterministic avatars/logos
 * 
 * @param vendorId - Vendor ID for deterministic logo generation
 * @param vendorName - Vendor name (optional, used as seed)
 * @param style - DiceBear style (default: 'identicon' for logos)
 * @param size - Logo size (default: 200)
 * @returns DiceBear avatar URL
 */
export function generateVendorLogo(
  vendorId: string,
  vendorName?: string,
  style: 'identicon' | 'avataaars' | 'bottts' | 'initials' = 'identicon',
  size: number = 200
): string {
  const seed = vendorId || vendorName || 'default';
  
  // DiceBear API - free, no key required
  // Format: https://api.dicebear.com/7.x/{style}/svg?seed={seed}&size={size}
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&size=${size}`;
}

/**
 * Generate vendor logo using initials style (more professional for businesses)
 * 
 * @param vendorName - Vendor name for initials
 * @param vendorId - Vendor ID for color consistency
 * @param size - Logo size (default: 200)
 * @returns DiceBear initials avatar URL
 */
export function generateVendorLogoWithInitials(
  vendorName: string,
  vendorId?: string,
  size: number = 200
): string {
  const seed = vendorId || vendorName || 'default';
  
  // DiceBear initials style - creates logo with vendor initials
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(vendorName)}&size=${size}`;
}

/**
 * Generate random placeholder image (fallback)
 * Uses Picsum for simple random images
 * 
 * @param width - Image width (default: 800)
 * @param height - Image height (default: 400)
 * @param seed - Optional seed for deterministic random image
 * @returns Picsum image URL
 */
export function generatePlaceholderImage(
  width: number = 800,
  height: number = 400,
  seed?: string
): string {
  if (seed) {
    // Picsum with seed for deterministic images
    return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
  }
  // Random Picsum image
  return `https://picsum.photos/${width}/${height}`;
}

/**
 * Generate vendor images (both cover and logo) in one call
 * 
 * @param vendorId - Vendor ID
 * @param vendorName - Vendor name
 * @param options - Optional configuration
 * @returns Object with coverImageUrl and logoUrl
 */
export function generateVendorImages(
  vendorId: string,
  vendorName?: string,
  options?: {
    coverWidth?: number;
    coverTheme?: 'foodMarket' | 'storefront' | 'africanMarket';
    logoStyle?: 'identicon' | 'avataaars' | 'bottts' | 'initials';
    logoSize?: number;
    useInitialsForLogo?: boolean;
  }
): {
  coverImageUrl: string;
  logoUrl: string;
} {
  const {
    coverWidth = 800,
    coverTheme = 'foodMarket',
    logoStyle = 'identicon',
    logoSize = 200,
    useInitialsForLogo = false,
  } = options || {};

  const coverImageUrl = generateVendorCoverImage(vendorId, vendorName, coverWidth, coverTheme);
  
  const logoUrl = useInitialsForLogo && vendorName
    ? generateVendorLogoWithInitials(vendorName, vendorId, logoSize)
    : generateVendorLogo(vendorId, vendorName, logoStyle, logoSize);

  return {
    coverImageUrl,
    logoUrl,
  };
}

/**
 * Get vendor image URLs with fallback chain
 * Tries primary source, falls back to placeholder if needed
 * 
 * @param vendorId - Vendor ID
 * @param vendorName - Vendor name
 * @param existingCoverUrl - Existing cover URL (if any)
 * @param existingLogoUrl - Existing logo URL (if any)
 * @returns Object with coverImageUrl and logoUrl (with fallbacks)
 */
export function getVendorImagesWithFallback(
  vendorId: string,
  vendorName?: string,
  existingCoverUrl?: string | null,
  existingLogoUrl?: string | null
): {
  coverImageUrl: string;
  logoUrl: string;
} {
  return {
    coverImageUrl: existingCoverUrl || generateVendorCoverImage(vendorId, vendorName),
    logoUrl: existingLogoUrl || generateVendorLogo(vendorId, vendorName),
  };
}
