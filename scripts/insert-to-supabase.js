#!/usr/bin/env node

/**
 * Supabase Data Insertion Script
 * 
 * This script reads the prepared data files and inserts them into Supabase
 * using the Supabase MCP tools.
 * 
 * Usage: node scripts/insert-to-supabase.js
 */

const fs = require('fs');
const path = require('path');

// This script will be called via MCP tools
// For now, it prepares SQL statements that can be executed via MCP

class SupabaseInserter {
  constructor() {
    this.dataDir = path.join(__dirname, '..', 'data');
    this.stats = {
      users: 0,
      vendors: 0,
      products: 0,
      errors: [],
    };
  }

  loadData(filename) {
    const filePath = path.join(this.dataDir, filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filename}`);
      return null;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  }

  generateUserInsertSQL(users, userIds = []) {
    if (!users || users.length === 0) return null;

    const values = users.map((user, index) => {
      // Use provided UUID or generate one
      const id = userIds[index] ? `'${userIds[index]}'` : `'${this.generateUUID()}'`;
      const email = this.escapeSQL(user.email);
      const name = user.name ? this.escapeSQL(user.name) : 'NULL';
      const avatarUrl = user.avatar_url ? this.escapeSQL(user.avatar_url) : 'NULL';
      const phone = user.phone ? this.escapeSQL(user.phone) : 'NULL';
      const membershipTier = this.escapeSQL(user.membership_tier || 'bronze');
      const zoraCredits = user.zora_credits || 0;
      const loyaltyPoints = user.loyalty_points || 0;
      const culturalInterests = user.cultural_interests 
        ? `ARRAY[${user.cultural_interests.map(i => this.escapeSQL(i)).join(', ')}]`
        : 'ARRAY[]::TEXT[]';

      return `(${id}, ${email}, ${name}, ${avatarUrl}, ${phone}, ${membershipTier}, ${zoraCredits}, ${loyaltyPoints}, ${culturalInterests}, NOW(), NOW())`;
    }).join(',\n    ');

    return `
-- Insert Users (Profiles)
-- Note: In production, users should be created via Supabase Auth first
-- This is a simplified version for data population

INSERT INTO public.profiles (
    id, email, full_name, avatar_url, phone, 
    membership_tier, zora_credits, loyalty_points, 
    cultural_interests, created_at, updated_at
) VALUES
    ${values}
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    phone = EXCLUDED.phone,
    membership_tier = EXCLUDED.membership_tier,
    zora_credits = EXCLUDED.zora_credits,
    loyalty_points = EXCLUDED.loyalty_points,
    cultural_interests = EXCLUDED.cultural_interests,
    updated_at = NOW();
`;
  }

  generateVendorInsertSQL(vendors, userIds = [], vendorIds = []) {
    if (!vendors || vendors.length === 0) return { sql: null, vendorIds: [] };

    const values = vendors.map((vendor, index) => {
      // Use provided vendor ID or generate one
      const id = vendorIds[index] || this.generateUUID();
      // Use actual user IDs from the profiles table if available
      const userId = userIds[index] ? `'${userIds[index]}'` : `'${this.generateUUID()}'`;
      const shopName = this.escapeSQL(vendor.shop_name);
      const slug = this.generateSlug(vendor.shop_name);
      const description = vendor.description ? this.escapeSQL(vendor.description.substring(0, 500)) : 'NULL';
      const logoUrl = vendor.logo_url ? this.escapeSQL(vendor.logo_url) : 'NULL';
      const coverImageUrl = vendor.cover_image_url ? this.escapeSQL(vendor.cover_image_url) : 'NULL';
      const address = this.escapeSQL(vendor.address);
      const latitude = vendor.latitude;
      const longitude = vendor.longitude;
      const coverageRadius = vendor.coverage_radius_km || 5.0;
      const isVerified = vendor.is_verified ? 'TRUE' : 'FALSE';
      const rating = vendor.rating || 0;
      const reviewCount = vendor.review_count || 0;
      const culturalSpecialties = vendor.cultural_specialties 
        ? `ARRAY[${vendor.cultural_specialties.map(s => this.escapeSQL(s)).join(', ')}]`
        : 'ARRAY[]::TEXT[]';
      const categories = vendor.categories 
        ? `ARRAY[${vendor.categories.map(c => this.escapeSQL(c)).join(', ')}]`
        : 'ARRAY[]::TEXT[]';
      const deliveryTimeMin = vendor.delivery_time_min || 30;
      const deliveryTimeMax = vendor.delivery_time_max || 45;
      const deliveryFee = vendor.delivery_fee || 2.99;
      const minimumOrder = vendor.minimum_order || 15.00;
      const isFeatured = vendor.is_featured ? 'TRUE' : 'FALSE';
      const badge = vendor.badge ? this.escapeSQL(vendor.badge) : 'NULL';

      return `('${id}', ${userId}, ${shopName}, ${this.escapeSQL(slug)}, ${description}, ${logoUrl}, ${coverImageUrl}, ${address}, ${latitude}, ${longitude}, ${coverageRadius}, ${isVerified}, ${rating}, ${reviewCount}, ${culturalSpecialties}, ${categories}, ${deliveryTimeMin}, ${deliveryTimeMax}, ${deliveryFee}, ${minimumOrder}, ${isFeatured}, ${badge}, NOW(), NOW())`;
    }).join(',\n    ');

    // Extract vendor IDs for use in products
    const generatedVendorIds = vendors.map((vendor, index) => vendorIds[index] || this.generateUUID());

    return {
      sql: `
-- Insert Vendors
INSERT INTO public.vendors (
    id, user_id, shop_name, slug, description, logo_url, cover_image_url,
    address, latitude, longitude, coverage_radius_km, is_verified,
    rating, review_count, cultural_specialties, categories,
    delivery_time_min, delivery_time_max, delivery_fee, minimum_order,
    is_featured, badge, created_at, updated_at
) VALUES
    ${values}
ON CONFLICT (slug) DO UPDATE SET
    shop_name = EXCLUDED.shop_name,
    description = EXCLUDED.description,
    updated_at = NOW();
`,
      vendorIds: generatedVendorIds
    };
  }

  generateProductInsertSQL(products, vendorIds = []) {
    if (!products || products.length === 0) return null;

    // Create a mapping from vendor string IDs (e.g., "vendor-0") to actual UUIDs
    const vendorIdMap = new Map();
    vendorIds.forEach((uuid, index) => {
      vendorIdMap.set(`vendor-${index}`, uuid);
    });

    const values = products.map((product, index) => {
      const id = `'${this.generateUUID()}'`;
      // Use vendor_id from product object if available, otherwise fall back to index-based lookup
      let vendorId;
      if (product.vendor_id && vendorIdMap.has(product.vendor_id)) {
        vendorId = `'${vendorIdMap.get(product.vendor_id)}'`;
      } else if (product.vendor_id) {
        // Try to extract index from vendor_id string (e.g., "vendor-6" -> 6)
        const match = product.vendor_id.match(/vendor-(\d+)/);
        if (match) {
          const vendorIndex = parseInt(match[1], 10);
          vendorId = vendorIds[vendorIndex] ? `'${vendorIds[vendorIndex]}'` : `'${this.generateUUID()}'`;
        } else {
          // Fallback to modulo cycling if vendor_id format is unexpected
          const vendorIndex = index % vendorIds.length;
          vendorId = vendorIds[vendorIndex] ? `'${vendorIds[vendorIndex]}'` : `'${this.generateUUID()}'`;
        }
      } else {
        // Fallback to modulo cycling if no vendor_id provided
        const vendorIndex = index % vendorIds.length;
        vendorId = vendorIds[vendorIndex] ? `'${vendorIds[vendorIndex]}'` : `'${this.generateUUID()}'`;
      }
      const name = this.escapeSQL(product.name);
      const description = product.description ? this.escapeSQL(product.description.substring(0, 1000)) : 'NULL';
      const price = product.price ?? 0;
      const unitPriceLabel = product.unit_price_label ? this.escapeSQL(product.unit_price_label) : 'NULL';
      const stockQuantity = product.stock_quantity ?? 0;
      const category = this.escapeSQL(product.category);
      const culturalRegion = product.cultural_region ? this.escapeSQL(product.cultural_region) : 'NULL';
      const imageUrls = product.image_urls && product.image_urls.length > 0
        ? `ARRAY[${product.image_urls.map(url => this.escapeSQL(url)).join(', ')}]`
        : 'ARRAY[]::TEXT[]';
      const weight = product.weight ? this.escapeSQL(product.weight) : 'NULL';
      const certifications = product.certifications && product.certifications.length > 0
        ? `ARRAY[${product.certifications.map(c => this.escapeSQL(c)).join(', ')}]`
        : 'ARRAY[]::TEXT[]';
      const nutrition = product.nutrition ? this.escapeSQL(JSON.stringify(product.nutrition)) : 'NULL';
      const heritageStory = product.heritage_story ? this.escapeSQL(product.heritage_story.substring(0, 500)) : 'NULL';
      const isActive = product.is_active !== false ? 'TRUE' : 'FALSE';
      const isFeatured = product.is_featured ? 'TRUE' : 'FALSE';
      const badge = product.badge ? this.escapeSQL(product.badge) : 'NULL';
      const rating = product.rating ?? 0;
      const reviewCount = product.review_count ?? 0;

      return `(${id}, ${vendorId}, ${name}, ${description}, ${price}, ${unitPriceLabel}, ${stockQuantity}, ${category}, ${culturalRegion}, ${imageUrls}, ${weight}, ${certifications}, ${nutrition}::JSONB, ${heritageStory}, ${isActive}, ${isFeatured}, ${badge}, ${rating}, ${reviewCount}, NOW(), NOW())`;
    }).join(',\n    ');

    return `
-- Insert Products
INSERT INTO public.products (
    id, vendor_id, name, description, price, unit_price_label,
    stock_quantity, category, cultural_region, image_urls,
    weight, certifications, nutrition, heritage_story,
    is_active, is_featured, badge, rating, review_count,
    created_at, updated_at
) VALUES
    ${values}
ON CONFLICT DO NOTHING;
`;
  }

  generateSlug(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100);
  }

  generateUUID() {
    // Simple UUID v4 generator
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  escapeSQL(str) {
    if (str === null || str === undefined) return 'NULL';
    return `'${String(str).replace(/'/g, "''")}'`;
  }

  async generateSQLFile() {
    console.log('📝 Generating SQL insertion script...\n');

    const users = this.loadData('populated_users.json');
    const vendors = this.loadData('populated_vendors.json');
    const products = this.loadData('populated_products.json');

    let sql = `-- Database Population SQL Script
-- Generated automatically for Zora African Market
-- Execute this script using Supabase MCP execute_sql tool
-- 
-- IMPORTANT: This script assumes the Zora schema has been applied.
-- Run migrations 001-004 first if tables don't exist.

BEGIN;

`;

    // Generate user IDs first
    const userIds = [];
    if (users && users.length > 0) {
      users.forEach(() => {
        userIds.push(this.generateUUID());
      });
      
      const userSQL = this.generateUserInsertSQL(users, userIds);
      if (userSQL) {
        sql += userSQL + '\n\n';
        this.stats.users = users.length;
      }
    }

    let vendorIds = [];
    if (vendors && vendors.length > 0) {
      // Use first N user IDs for vendors
      const vendorUserIds = userIds.slice(0, vendors.length);
      // Generate vendor IDs upfront
      vendorIds = vendors.map(() => this.generateUUID());
      const vendorResult = this.generateVendorInsertSQL(vendors, vendorUserIds, vendorIds);
      if (vendorResult && vendorResult.sql) {
        sql += vendorResult.sql + '\n\n';
        vendorIds = vendorResult.vendorIds; // Use the actual IDs from the SQL
        this.stats.vendors = vendors.length;
      }
    }

    if (products && products.length > 0) {
      // Use the vendor IDs from the vendors we just created
      const productSQL = this.generateProductInsertSQL(products, vendorIds);
      if (productSQL) {
        sql += productSQL + '\n\n';
        this.stats.products = products.length;
      }
    }

    sql += `COMMIT;

-- Summary:
-- Users: ${this.stats.users}
-- Vendors: ${this.stats.vendors}
-- Products: ${this.stats.products}
`;

    const outputPath = path.join(__dirname, '..', 'supabase', 'migrations', '005_populate_data.sql');
    const outputDir = path.dirname(outputPath);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, sql);
    console.log(`✅ SQL script generated: ${outputPath}`);
    console.log(`\n📊 Summary:`);
    console.log(`   Users: ${this.stats.users}`);
    console.log(`   Vendors: ${this.stats.vendors}`);
    console.log(`   Products: ${this.stats.products}`);
    console.log(`\n💡 Next step: Execute this SQL using Supabase MCP execute_sql tool`);
  }
}

// Run the script
if (require.main === module) {
  const inserter = new SupabaseInserter();
  inserter.generateSQLFile().catch(console.error);
}

module.exports = { SupabaseInserter };
