/**
 * Tests for Slug Utilities
 * Tests Base62 encoding/decoding with UUIDv7 and semantic slug generation
 */

import { 
  encodeProductSlug, 
  decodeProductSlug, 
  generateVendorSlug,
  generateUniqueVendorSlug,
  isValidVendorSlug,
  isValidProductSlug
} from '../slugUtils';

describe('Product Slug Encoding/Decoding (Base62)', () => {
  // Sample UUIDv7 format (time-ordered UUIDs)
  const testCases = [
    {
      uuid: '018f1234-5678-7890-abcd-ef1234567890',
      description: 'Standard UUIDv7 format'
    },
    {
      uuid: '018f0000-0000-7000-8000-000000000000',
      description: 'UUIDv7 with minimal values'
    },
    {
      uuid: '018fffff-ffff-7fff-8fff-ffffffffffff',
      description: 'UUIDv7 with maximum values'
    },
    {
      uuid: '018f1234-5678-7890-abcd-ef1234567890',
      description: 'Realistic UUIDv7'
    }
  ];

  test('encodes UUID to Base62 slug', () => {
    const uuid = '018f1234-5678-7890-abcd-ef1234567890';
    const slug = encodeProductSlug(uuid);
    
    expect(slug).toBeTruthy();
    expect(typeof slug).toBe('string');
    expect(slug.length).toBeGreaterThan(0);
    // Base62 should only contain alphanumeric characters
    expect(slug).toMatch(/^[0-9a-zA-Z]+$/);
  });

  test('decodes Base62 slug back to UUID', () => {
    const uuid = '018f1234-5678-7890-abcd-ef1234567890';
    const slug = encodeProductSlug(uuid);
    const decoded = decodeProductSlug(slug);
    
    expect(decoded).toBe(uuid);
  });

  test('round-trip encoding/decoding works for all test cases', () => {
    testCases.forEach(({ uuid, description }) => {
      const slug = encodeProductSlug(uuid);
      const decoded = decodeProductSlug(slug);
      
      expect(decoded).toBe(uuid);
    });
  });

  test('handles BigInt correctly for 128-bit UUIDs', () => {
    // Test with a UUID that would overflow JavaScript's Number.MAX_SAFE_INTEGER
    const largeUuid = 'ffffffff-ffff-7fff-8fff-ffffffffffff';
    const slug = encodeProductSlug(largeUuid);
    const decoded = decodeProductSlug(slug);
    
    expect(decoded).toBe(largeUuid);
  });

  test('throws error for invalid UUID format', () => {
    expect(() => encodeProductSlug('invalid-uuid')).toThrow();
    expect(() => encodeProductSlug('')).toThrow();
    expect(() => encodeProductSlug('123')).toThrow();
  });

  test('throws error for invalid slug format', () => {
    expect(() => decodeProductSlug('')).toThrow();
    expect(() => decodeProductSlug('invalid-slug!@#')).toThrow();
  });

  test('produces different slugs for different UUIDs', () => {
    const uuid1 = '018f1234-5678-7890-abcd-ef1234567890';
    const uuid2 = '018f1234-5678-7890-abcd-ef1234567891';
    
    const slug1 = encodeProductSlug(uuid1);
    const slug2 = encodeProductSlug(uuid2);
    
    expect(slug1).not.toBe(slug2);
  });

  test('slug length is reasonable (not too long)', () => {
    const uuid = '018f1234-5678-7890-abcd-ef1234567890';
    const slug = encodeProductSlug(uuid);
    
    // Base62 encoding of 128-bit number should be around 22 characters
    expect(slug.length).toBeLessThanOrEqual(25);
  });
});

describe('Vendor Slug Generation (Semantic)', () => {
  test('generates slug from shop name', () => {
    const shopName = 'Tech Gear City';
    const slug = generateVendorSlug(shopName);
    
    expect(slug).toBe('tech-gear-city');
  });

  test('handles special characters', () => {
    expect(generateVendorSlug('Tech & Gear!')).toBe('tech-gear');
    expect(generateVendorSlug('Tech@Gear#City')).toBe('techgearcity');
  });

  test('handles multiple spaces', () => {
    expect(generateVendorSlug('Tech    Gear   City')).toBe('tech-gear-city');
  });

  test('handles leading/trailing spaces', () => {
    expect(generateVendorSlug('  Tech Gear City  ')).toBe('tech-gear-city');
  });

  test('handles uppercase/lowercase', () => {
    expect(generateVendorSlug('TECH GEAR CITY')).toBe('tech-gear-city');
    expect(generateVendorSlug('Tech Gear City')).toBe('tech-gear-city');
  });

  test('limits length to 100 characters', () => {
    const longName = 'A'.repeat(200) + ' Shop';
    const slug = generateVendorSlug(longName);
    
    expect(slug.length).toBeLessThanOrEqual(100);
  });

  test('generates unique slug when base slug exists', () => {
    const shopName = 'Tech Gear';
    const existingSlugs = ['tech-gear'];
    
    const uniqueSlug = generateUniqueVendorSlug(shopName, existingSlugs);
    
    expect(uniqueSlug).toBe('tech-gear-1');
  });

  test('increments counter for multiple conflicts', () => {
    const shopName = 'Tech Gear';
    const existingSlugs = ['tech-gear', 'tech-gear-1', 'tech-gear-2'];
    
    const uniqueSlug = generateUniqueVendorSlug(shopName, existingSlugs);
    
    expect(uniqueSlug).toBe('tech-gear-3');
  });

  test('returns base slug if no conflicts', () => {
    const shopName = 'Tech Gear';
    const existingSlugs = ['other-shop'];
    
    const uniqueSlug = generateUniqueVendorSlug(shopName, existingSlugs);
    
    expect(uniqueSlug).toBe('tech-gear');
  });
});

describe('Slug Validation', () => {
  test('validates vendor slugs correctly', () => {
    expect(isValidVendorSlug('tech-gear-city')).toBe(true);
    expect(isValidVendorSlug('tech-gear-123')).toBe(true);
    expect(isValidVendorSlug('tech')).toBe(true);
    
    expect(isValidVendorSlug('Tech-Gear')).toBe(false); // uppercase
    expect(isValidVendorSlug('tech-gear!')).toBe(false); // special chars
    expect(isValidVendorSlug('-tech-gear')).toBe(false); // leading hyphen
    expect(isValidVendorSlug('tech-gear-')).toBe(false); // trailing hyphen
    expect(isValidVendorSlug('')).toBe(false); // empty
  });

  test('validates product slugs correctly', () => {
    expect(isValidProductSlug('5jWv9K2')).toBe(true);
    expect(isValidProductSlug('abc123XYZ')).toBe(true);
    expect(isValidProductSlug('0')).toBe(true);
    
    expect(isValidProductSlug('5jWv-9K2')).toBe(false); // hyphen
    expect(isValidProductSlug('5jWv 9K2')).toBe(false); // space
    expect(isValidProductSlug('5jWv@9K2')).toBe(false); // special char
    expect(isValidProductSlug('')).toBe(false); // empty
  });
});

describe('Real-world UUIDv7 Examples', () => {
  // These are examples of what UUIDv7 might look like
  // UUIDv7 format: timestamp (48 bits) + version (4 bits = 0x7) + variant (2 bits = 0x8) + random (74 bits)
  const realWorldExamples = [
    '018f1a2b-3c4d-7890-abcd-ef1234567890', // Example timestamp-based
    '018f2c3d-4e5f-7890-abcd-ef1234567890', // Different timestamp
  ];

  test('handles real-world UUIDv7 examples', () => {
    realWorldExamples.forEach((uuid) => {
      const slug = encodeProductSlug(uuid);
      const decoded = decodeProductSlug(slug);
      
      expect(decoded).toBe(uuid);
      expect(isValidProductSlug(slug)).toBe(true);
    });
  });
});
