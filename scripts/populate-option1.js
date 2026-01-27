#!/usr/bin/env node

/**
 * Master Script for Option 1: Complete Database Population
 * 
 * This script orchestrates the complete database population process:
 * 1. Create users via Supabase Auth
 * 2. Update profiles with Zora-specific data
 * 3. Generate and execute SQL for vendors and products
 * 
 * Usage: node scripts/populate-option1.js [--skip-users] [--skip-profiles] [--skip-vendors]
 */

const { UserCreator } = require('./create-users-auth');
const { ProfileUpdater } = require('./update-profiles');
const { VendorsProductsCreator } = require('./create-vendors-products');

const args = process.argv.slice(2);
const skipUsers = args.includes('--skip-users');
const skipProfiles = args.includes('--skip-profiles');
const skipVendors = args.includes('--skip-vendors');

async function main() {
  console.log('\n🚀 Starting Option 1: Complete Database Population\n');
  console.log('═'.repeat(60));

  try {
    // Step 1: Create users
    if (!skipUsers) {
      console.log('\n📝 Step 1: Creating users via Supabase Auth...');
      console.log('─'.repeat(60));
      const creator = new UserCreator();
      await creator.createAllUsers();
    } else {
      console.log('\n⏭️  Skipping user creation (--skip-users flag)');
    }

    // Step 2: Update profiles
    if (!skipProfiles) {
      console.log('\n📝 Step 2: Updating profiles with Zora-specific data...');
      console.log('─'.repeat(60));
      const updater = new ProfileUpdater();
      await updater.updateAllProfiles();
    } else {
      console.log('\n⏭️  Skipping profile updates (--skip-profiles flag)');
    }

    // Step 3: Generate vendors/products SQL
    if (!skipVendors) {
      console.log('\n📝 Step 3: Generating vendors and products SQL...');
      console.log('─'.repeat(60));
      const vendorsCreator = new VendorsProductsCreator();
      const sql = vendorsCreator.generateSQL();
      const outputPath = vendorsCreator.saveSQL(sql);
      
      console.log(`\n✅ SQL generated successfully!`);
      console.log(`\n📝 Next: Execute ${outputPath} using Supabase MCP execute_sql tool`);
      console.log(`\n   Or run: node scripts/execute-final-sql.js`);
    } else {
      console.log('\n⏭️  Skipping vendors/products generation (--skip-vendors flag)');
    }

    console.log('\n\n✅ All steps completed successfully!');
    console.log('═'.repeat(60));
    console.log('\n📊 Database population summary:');
    console.log('   ✅ Users created via Auth');
    console.log('   ✅ Profiles updated');
    console.log('   ✅ Vendors/products SQL generated');
    console.log('\n💡 Final step: Execute the SQL file using Supabase MCP execute_sql tool\n');

  } catch (error) {
    console.error('\n❌ Error during population:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
