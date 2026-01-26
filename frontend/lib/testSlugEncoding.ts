/**
 * Test Script for Slug Encoding/Decoding
 * 
 * Run this to test slug encoding/decoding with actual UUIDv7 product IDs
 * Usage: Import and call testSlugEncoding() in your app
 */

import { encodeProductSlug, decodeProductSlug } from './slugUtils';

/**
 * Tests slug encoding/decoding with various UUID formats
 */
export function testSlugEncoding() {
  console.log('=== Testing Product Slug Encoding/Decoding ===\n');

  // Test cases with different UUID formats
  const testCases = [
    {
      name: 'Standard UUIDv4',
      uuid: '550e8400-e29b-41d4-a716-446655440000'
    },
    {
      name: 'UUIDv7-like (time-ordered)',
      uuid: '018f1234-5678-7890-abcd-ef1234567890'
    },
    {
      name: 'Minimal UUID',
      uuid: '00000000-0000-0000-0000-000000000000'
    },
    {
      name: 'Maximum UUID',
      uuid: 'ffffffff-ffff-ffff-ffff-ffffffffffff'
    },
    {
      name: 'Real-world example 1',
      uuid: '018f1a2b-3c4d-7890-abcd-ef1234567890'
    },
    {
      name: 'Real-world example 2',
      uuid: '018f2c3d-4e5f-7890-abcd-ef1234567890'
    }
  ];

  let passed = 0;
  let failed = 0;

  testCases.forEach((testCase, index) => {
    try {
      console.log(`Test ${index + 1}: ${testCase.name}`);
      console.log(`  Original UUID: ${testCase.uuid}`);
      
      // Encode
      const slug = encodeProductSlug(testCase.uuid);
      console.log(`  Encoded Slug: ${slug}`);
      console.log(`  Slug Length: ${slug.length} characters`);
      
      // Decode
      const decoded = decodeProductSlug(slug);
      console.log(`  Decoded UUID: ${decoded}`);
      
      // Verify round-trip
      if (decoded === testCase.uuid) {
        console.log(`  ✅ PASS: Round-trip successful\n`);
        passed++;
      } else {
        console.log(`  ❌ FAIL: UUID mismatch\n`);
        failed++;
      }
    } catch (error) {
      console.log(`  ❌ ERROR: ${error instanceof Error ? error.message : String(error)}\n`);
      failed++;
    }
  });

  // Performance test
  console.log('=== Performance Test ===');
  const perfUuid = '018f1234-5678-7890-abcd-ef1234567890';
  const iterations = 1000;
  
  console.log(`Running ${iterations} encode/decode cycles...`);
  const startTime = Date.now();
  
  for (let i = 0; i < iterations; i++) {
    const slug = encodeProductSlug(perfUuid);
    decodeProductSlug(slug);
  }
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  const avgTime = duration / iterations;
  
  console.log(`Total time: ${duration}ms`);
  console.log(`Average time per cycle: ${avgTime.toFixed(3)}ms`);
  console.log(`Throughput: ${(1000 / avgTime).toFixed(0)} operations/second\n`);

  // Summary
  console.log('=== Test Summary ===');
  console.log(`Total tests: ${testCases.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Success rate: ${((passed / testCases.length) * 100).toFixed(1)}%`);

  return { passed, failed, total: testCases.length };
}

/**
 * Test with actual product IDs from database
 * Call this after fetching products from your database
 */
export async function testWithRealProductIds(productIds: string[]) {
  console.log('=== Testing with Real Product IDs ===\n');
  console.log(`Testing ${productIds.length} product IDs...\n`);

  const results = {
    successful: [] as Array<{ id: string; slug: string }>,
    failed: [] as Array<{ id: string; error: string }>
  };

  productIds.forEach((id, index) => {
    try {
      const slug = encodeProductSlug(id);
      const decoded = decodeProductSlug(slug);
      
      if (decoded === id) {
        results.successful.push({ id, slug });
        console.log(`✅ [${index + 1}/${productIds.length}] ${id} -> ${slug}`);
      } else {
        results.failed.push({ id, error: 'Round-trip failed' });
        console.log(`❌ [${index + 1}/${productIds.length}] ${id} - Round-trip failed`);
      }
    } catch (error) {
      results.failed.push({ 
        id, 
        error: error instanceof Error ? error.message : String(error) 
      });
      console.log(`❌ [${index + 1}/${productIds.length}] ${id} - ${error instanceof Error ? error.message : String(error)}`);
    }
  });

  console.log('\n=== Results Summary ===');
  console.log(`Successful: ${results.successful.length}`);
  console.log(`Failed: ${results.failed.length}`);
  console.log(`Success rate: ${((results.successful.length / productIds.length) * 100).toFixed(1)}%`);

  return results;
}

// Export default test function
export default testSlugEncoding;
