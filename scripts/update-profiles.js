#!/usr/bin/env node

/**
 * Update Profiles with Zora-Specific Data
 * 
 * This script updates the automatically-created profiles with additional
 * Zora-specific fields from populated_users.json.
 * 
 * Usage: node scripts/update-profiles.js
 * 
 * Requires:
 * - User creation results from create-users-auth.js
 * - populated_users.json file
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables (gracefully handle if dotenv not installed)
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not installed, use environment variables directly
}

class ProfileUpdater {
  constructor() {
    // Support both EXPO_PUBLIC_ prefixed and non-prefixed variables
    const supabaseUrl = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error(
        'Missing required environment variables:\n' +
        '  - SUPABASE_URL or EXPO_PUBLIC_SUPABASE_URL\n' +
        '  - SUPABASE_SERVICE_ROLE_KEY or EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY'
      );
    }

    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
    this.dataDir = path.join(__dirname, '..', 'data');
    this.results = {
      updated: [],
      failed: []
    };
  }

  loadUsers() {
    const filePath = path.join(this.dataDir, 'populated_users.json');
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
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


  async updateProfile(userId, userData) {
    try {
      const culturalInterests = userData.cultural_interests || [];

      // Use direct Supabase client update
      const { error } = await this.supabase
        .from('profiles')
        .update({
          phone: userData.phone || null,
          membership_tier: userData.membership_tier || 'bronze',
          zora_credits: userData.zora_credits || 0,
          loyalty_points: userData.loyalty_points || 0,
          cultural_interests: culturalInterests,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      this.results.updated.push({
        userId,
        email: userData.email
      });

      return true;
    } catch (error) {
      console.error(`❌ Failed to update profile for ${userData.email}:`, error.message);
      this.results.failed.push({
        userId,
        email: userData.email,
        error: error.message
      });
      return false;
    }
  }

  async updateAllProfiles() {
    const users = this.loadUsers();
    const creationResults = this.loadUserCreationResults();
    const userIds = creationResults.userIds;

    console.log(`\n📝 Updating ${users.length} profiles...\n`);

    const batchSize = 20;
    let updated = 0;

    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      console.log(`📦 Processing batch ${Math.floor(i / batchSize) + 1}...`);

      const batchPromises = batch.map(async (user, batchIndex) => {
        const userId = userIds[i + batchIndex];
        if (!userId) {
          console.log(`⏭️  Skipping ${user.email} (no user ID)`);
          return false;
        }
        return await this.updateProfile(userId, user);
      });

      const batchResults = await Promise.all(batchPromises);
      updated += batchResults.filter(r => r).length;

      // Small delay between batches
      if (i + batchSize < users.length) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    console.log(`\n\n📊 Summary:`);
    console.log(`   ✅ Updated: ${this.results.updated.length}`);
    console.log(`   ❌ Failed: ${this.results.failed.length}`);

    if (this.results.failed.length > 0) {
      console.log(`\n⚠️  Failed updates:`);
      this.results.failed.forEach(f => {
        console.log(`   - ${f.email}: ${f.error}`);
      });
    }

    return this.results;
  }
}

if (require.main === module) {
  const updater = new ProfileUpdater();
  updater.updateAllProfiles()
    .then(() => {
      console.log('\n✅ Profile updates completed!');
      console.log('\n📝 Next step: Run node scripts/create-vendors-products.js');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { ProfileUpdater };
