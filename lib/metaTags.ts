/**
 * Meta Tags and Open Graph Utilities
 * Generates dynamic meta tags for SEO and social sharing
 * Following Zora African Market design system
 */

import { Platform } from 'react-native';
import { Colors } from '../constants/colors';

/**
 * Site configuration for meta tags
 */
export const SITE_CONFIG = {
  name: 'Zora African Market',
  description: 'Premium marketplace connecting the African diaspora in the UK with authentic African groceries, products, and vendors.',
  url: Platform.select({
    web: typeof window !== 'undefined' ? window.location.origin : 'https://zora.app',
    default: 'https://zora.app',
  }) || 'https://zora.app',
  twitterHandle: '@ZoraMarket',
  defaultImage: '/assets/images/app-image.png',
  themeColor: Colors.primary, // Zora Red
  backgroundColor: Colors.backgroundDark, // Warm brown
} as const;

/**
 * Meta tag data structure
 */
export interface MetaTagData {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'profile';
  siteName?: string;
  locale?: string;
  price?: {
    amount: string;
    currency: string;
  };
  vendor?: {
    name: string;
    rating?: number;
  };
  product?: {
    name: string;
    price: string;
    currency: string;
    availability?: 'in stock' | 'out of stock';
    condition?: 'new' | 'used' | 'refurbished';
  };
}

/**
 * Generate full URL for meta tags
 */
function getFullUrl(path: string): string {
  const baseUrl = SITE_CONFIG.url;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Generate absolute image URL
 */
function getImageUrl(imagePath?: string): string {
  if (!imagePath) {
    return getFullUrl(SITE_CONFIG.defaultImage);
  }
  
  // If already absolute URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If relative path, make it absolute
  if (imagePath.startsWith('/')) {
    return getFullUrl(imagePath);
  }
  
  // Otherwise, assume it's a full URL from storage
  return imagePath;
}

/**
 * Truncate text to fit meta tag limits
 */
function truncateText(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Generate meta tags for a page
 */
export function generateMetaTags(data: MetaTagData) {
  const {
    title,
    description,
    image,
    url,
    type = 'website',
    siteName = SITE_CONFIG.name,
    locale = 'en_GB',
    price,
    vendor,
    product,
  } = data;

  const fullTitle = title.includes(SITE_CONFIG.name) 
    ? title 
    : `${title} | ${SITE_CONFIG.name}`;
  
  const fullDescription = truncateText(description, 160);
  const imageUrl = getImageUrl(image);
  const pageUrl = url ? getFullUrl(url) : SITE_CONFIG.url;

  const metaTags: Array<{ name?: string; property?: string; content: string }> = [
    // Basic meta tags
    { name: 'description', content: fullDescription },
    { name: 'theme-color', content: SITE_CONFIG.themeColor },
    
    // Open Graph tags
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: fullDescription },
    { property: 'og:image', content: imageUrl },
    { property: 'og:url', content: pageUrl },
    { property: 'og:type', content: type },
    { property: 'og:site_name', content: siteName },
    { property: 'og:locale', content: locale },
    
    // Twitter Card tags
    { name: 'twitter:card', content: product ? 'summary_large_image' : 'summary' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: fullDescription },
    { name: 'twitter:image', content: imageUrl },
    { name: 'twitter:site', content: SITE_CONFIG.twitterHandle },
  ];

  // Add product-specific Open Graph tags
  if (product) {
    metaTags.push(
      { property: 'product:price:amount', content: product.price },
      { property: 'product:price:currency', content: product.currency },
    );
    
    if (product.availability) {
      metaTags.push({ property: 'product:availability', content: product.availability });
    }
    
    if (product.condition) {
      metaTags.push({ property: 'product:condition', content: product.condition });
    }
  }

  // Add price information if available
  if (price) {
    metaTags.push(
      { property: 'og:price:amount', content: price.amount },
      { property: 'og:price:currency', content: price.currency },
    );
  }

  return metaTags;
}

/**
 * Generate meta tags for a product page
 */
export function generateProductMetaTags(
  productName: string,
  productDescription: string,
  productPrice: number,
  productImage?: string,
  productUrl?: string,
  vendorName?: string,
  inStock: boolean = true,
) {
  const currency = 'GBP';
  const priceString = productPrice.toFixed(2);
  
  return generateMetaTags({
    title: productName,
    description: productDescription || `Buy ${productName} from ${vendorName || 'Zora African Market'}. Authentic African products delivered to your door.`,
    image: productImage,
    url: productUrl,
    type: 'product',
    product: {
      name: productName,
      price: priceString,
      currency,
      availability: inStock ? 'in stock' : 'out of stock',
      condition: 'new',
    },
    price: {
      amount: priceString,
      currency,
    },
    vendor: vendorName ? { name: vendorName } : undefined,
  });
}

/**
 * Generate meta tags for a vendor/store page
 */
export function generateVendorMetaTags(
  vendorName: string,
  vendorDescription: string,
  vendorImage?: string,
  vendorUrl?: string,
  vendorRating?: number,
  productCount?: number,
) {
  const description = vendorDescription || 
    `${vendorName} on Zora African Market. ${productCount ? `${productCount}+ products available. ` : ''}${vendorRating ? `Rated ${vendorRating.toFixed(1)}/5. ` : ''}Authentic African groceries and products.`;
  
  return generateMetaTags({
    title: vendorName,
    description: truncateText(description, 160),
    image: vendorImage,
    url: vendorUrl,
    type: 'profile',
    vendor: {
      name: vendorName,
      rating: vendorRating,
    },
  });
}

/**
 * Generate meta tags for a general page
 */
export function generatePageMetaTags(
  pageTitle: string,
  pageDescription: string,
  pageImage?: string,
  pageUrl?: string,
) {
  return generateMetaTags({
    title: pageTitle,
    description: pageDescription,
    image: pageImage,
    url: pageUrl,
    type: 'website',
  });
}
