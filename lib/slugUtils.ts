/**
 * Slug Utilities for Zora
 * 
 * Provides two distinct slug systems:
 * 1. Vendors: Semantic slugs (e.g., "tech-gear-city")
 * 2. Products: Base62-encoded UUIDs (e.g., "5jWv9K2")
 */

// Base62 character set (0-9, a-z, A-Z)
const BASE62_CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Converts a UUID string to a BigInt for Base62 encoding
 * UUIDs are 128-bit, so we need BigInt to handle them properly
 */
function uuidToBigInt(uuid: string): bigint {
  // Remove hyphens and convert hex to BigInt
  const hex = uuid.replace(/-/g, '');
  return BigInt('0x' + hex);
}

/**
 * Converts a BigInt back to a UUID string
 */
function bigIntToUuid(bigInt: bigint): string {
  // Convert to hex string (32 chars for 128 bits)
  let hex = bigInt.toString(16).padStart(32, '0');
  
  // Insert hyphens in UUID format: 8-4-4-4-12
  return [
    hex.substring(0, 8),
    hex.substring(8, 12),
    hex.substring(12, 16),
    hex.substring(16, 20),
    hex.substring(20, 32),
  ].join('-');
}

/**
 * Encodes a UUIDv7 string to a Base62 slug
 * @param uuid - UUID string (e.g., "018f1234-5678-7890-abcd-ef1234567890")
 * @returns Base62 encoded string (e.g., "5jWv9K2")
 */
export function encodeProductSlug(uuid: string): string {
  if (!uuid || typeof uuid !== 'string') {
    throw new Error('Invalid UUID: must be a non-empty string');
  }
  
  // Validate UUID format (basic check)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(uuid)) {
    throw new Error(`Invalid UUID format: ${uuid}`);
  }
  
  let num = uuidToBigInt(uuid);
  const base = BigInt(62);
  let result = '';
  
  if (num === BigInt(0)) {
    return BASE62_CHARS[0];
  }
  
  while (num > BigInt(0)) {
    const remainder = Number(num % base);
    result = BASE62_CHARS[remainder] + result;
    num = num / base;
  }
  
  return result;
}

/**
 * Decodes a Base62 slug back to a UUID string
 * @param slug - Base62 encoded string (e.g., "5jWv9K2")
 * @returns UUID string (e.g., "018f1234-5678-7890-abcd-ef1234567890")
 */
export function decodeProductSlug(slug: string): string {
  if (!slug || typeof slug !== 'string' || slug.length === 0) {
    throw new Error('Invalid slug: must be a non-empty string');
  }
  
  const base = BigInt(62);
  let num = BigInt(0);
  
  for (let i = 0; i < slug.length; i++) {
    const char = slug[i];
    const charIndex = BASE62_CHARS.indexOf(char);
    
    if (charIndex === -1) {
      throw new Error(`Invalid character in slug: ${char}`);
    }
    
    num = num * base + BigInt(charIndex);
  }
  
  return bigIntToUuid(num);
}

/**
 * Generates a semantic slug from a store name
 * @param storeName - The store/vendor name (e.g., "Tech Gear City")
 * @returns URL-friendly slug (e.g., "tech-gear-city")
 */
export function generateVendorSlug(storeName: string): string {
  if (!storeName || typeof storeName !== 'string') {
    throw new Error('Invalid store name: must be a non-empty string');
  }
  
  return storeName
    .toLowerCase()
    .trim()
    // Replace spaces and underscores with hyphens
    .replace(/[\s_]+/g, '-')
    // Remove special characters except hyphens
    .replace(/[^a-z0-9-]/g, '')
    // Remove multiple consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Limit length to 100 characters
    .substring(0, 100);
}

/**
 * Generates a unique vendor slug by appending a number if needed
 * This should be used in conjunction with a database uniqueness check
 * @param storeName - The store/vendor name
 * @param existingSlugs - Array of existing slugs to check against
 * @returns A unique slug
 */
export function generateUniqueVendorSlug(
  storeName: string,
  existingSlugs: string[] = []
): string {
  const baseSlug = generateVendorSlug(storeName);
  
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }
  
  // Append a number if slug already exists
  let counter = 1;
  let uniqueSlug = `${baseSlug}-${counter}`;
  
  while (existingSlugs.includes(uniqueSlug)) {
    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;
  }
  
  return uniqueSlug;
}

/**
 * Validates if a vendor slug is in the correct format
 * @param slug - The slug to validate
 * @returns true if valid, false otherwise
 */
export function isValidVendorSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') {
    return false;
  }
  
  // Must be lowercase, alphanumeric with hyphens, 1-100 chars
  const slugRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
  return slugRegex.test(slug) && slug.length >= 1 && slug.length <= 100;
}

/**
 * Validates if a product slug is in the correct Base62 format
 * @param slug - The slug to validate
 * @returns true if valid, false otherwise
 */
export function isValidProductSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string' || slug.length === 0) {
    return false;
  }
  
  // Check if all characters are valid Base62 characters
  return /^[0-9a-zA-Z]+$/.test(slug);
}

/**
 * Validates if a string is a valid UUID format
 * @param uuid - The string to validate
 * @returns true if valid UUID format, false otherwise
 */
export function isValidUUID(uuid: string): boolean {
  if (!uuid || typeof uuid !== 'string') {
    return false;
  }
  
  // UUID format: 8-4-4-4-12 hexadecimal characters
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
