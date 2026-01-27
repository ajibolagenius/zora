#!/usr/bin/env node

/**
 * Create Vendors and Products
 * 
 * This script creates vendors and products using the existing SQL generation
 * logic, but skips profiles (since they're already created via Auth).
 * 
 * Usage: node scripts/create-vendors-products.js
 */

const fs = require('fs');
const path = require('path');
const { SupabaseInserter } = require('./insert-to-supabase');

class VendorsProductsCreator {
  constructor() {
    this.dataDir = path.join(__dirname, '..', 'data');
    this.inserter = new SupabaseInserter();
  }

  loadUserCreationResults() {
    const filePath = path.join(this.dataDir, 'user_creation_results.json');
    if (!fs.existsSync(filePath)) {
      throw new Error(
        `User creation results not found: ${filePath}\n` +
        'Please run create-users-auth.js first.'
      );
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }

  generateSQL() {
    const creationResults = this.loadUserCreationResults();
    const userIds = creationResults.userIds.filter(id => id !== null);

    // Load data
    const vendors = this.inserter.loadData('populated_vendors.json');
    const products = this.inserter.loadData('populated_products.json');

    if (!vendors || vendors.length === 0) {
      throw new Error('No vendors found in populated_vendors.json');
    }

    if (!products || products.length === 0) {
      throw new Error('No products found in populated_products.json');
    }

    // Map vendor user_id references (e.g., "user-0") to actual UUIDs
    const vendorUserIds = vendors.map((vendor, index) => {
      const userRef = vendor.user_id; // e.g., "user-0"
      const match = userRef.match(/user-(\d+)/);
      if (match) {
        const userIndex = parseInt(match[1], 10);
        return userIds[userIndex] || null;
      }
      return userIds[index] || null;
    }).filter(id => id !== null);

    if (vendorUserIds.length === 0) {
      throw new Error('No valid user IDs found for vendors');
    }

    // Generate vendor SQL
    const vendorResult = this.inserter.generateVendorInsertSQL(vendors, vendorUserIds);
    
    // Extract vendor IDs from the result (it returns an object with sql and vendorIds)
    const vendorIds = vendorResult?.vendorIds || [];
    const vendorSQL = vendorResult?.sql || null;
    
    // Generate product SQL
    const productSQL = this.inserter.generateProductInsertSQL(products, vendorIds);

    // Combine SQL
    let sql = `-- Vendors and Products Population SQL Script
-- Generated automatically for Zora African Market
-- Execute this script using Supabase MCP execute_sql tool
-- 
-- IMPORTANT: This script assumes users and profiles have been created via Auth.
-- Run create-users-auth.js and update-profiles.js first.

BEGIN;

`;

    if (vendorSQL) {
      sql += vendorSQL + '\n\n';
    }

    if (productSQL) {
      sql += productSQL + '\n\n';
    }

    sql += `COMMIT;

-- Summary:
-- Vendors: ${vendorUserIds.length}
-- Products: ${products.length}
`;

    return sql;
  }


  saveSQL(sql) {
    const outputPath = path.join(__dirname, '..', 'supabase', 'migrations', '006_populate_vendors_products.sql');
    fs.writeFileSync(outputPath, sql, 'utf8');
    console.log(`\n💾 SQL saved to: ${outputPath}`);
    return outputPath;
  }
}

if (require.main === module) {
  const creator = new VendorsProductsCreator();
  
  try {
    console.log('\n📝 Generating vendors and products SQL...\n');
    const sql = creator.generateSQL();
    const outputPath = creator.saveSQL(sql);
    
    console.log(`\n✅ SQL generation completed!`);
    console.log(`\n📝 Next step: Execute ${outputPath} using Supabase MCP execute_sql tool`);
    console.log(`\n   Or run: node scripts/execute-final-sql.js`);
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

module.exports = { VendorsProductsCreator };
