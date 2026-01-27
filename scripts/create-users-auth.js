#!/usr/bin/env node

/**
 * Create Users via Supabase Auth Admin API
 * 
 * This script creates users in Supabase Auth, which automatically triggers
 * profile creation via the handle_new_user() trigger.
 * 
 * Usage: node scripts/create-users-auth.js
 * 
 * Requires:
 * - SUPABASE_URL environment variable
 * - SUPABASE_SERVICE_ROLE_KEY environment variable (Admin key)
 * - populated_users.json file in data directory
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

// Load environment variables (gracefully handle if dotenv not installed)
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not installed, use environment variables directly
}

class UserCreator {
  constructor() {
    // Support both EXPO_PUBLIC_ prefixed and non-prefixed variables
    const supabaseUrl = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error(
        'Missing required environment variables:\n' +
        '  - SUPABASE_URL or EXPO_PUBLIC_SUPABASE_URL\n' +
        '  - SUPABASE_SERVICE_ROLE_KEY or EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY\n\n' +
        'Please set these in your .env file or environment.\n' +
        `Current values: URL=${supabaseUrl ? '✓' : '✗'}, ServiceKey=${supabaseServiceKey ? '✓' : '✗'}`
      );
    }

    this.supabaseUrl = supabaseUrl;
    this.supabaseServiceKey = supabaseServiceKey;
    
    this.supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Store base URL for direct API calls
    // Supabase Auth Admin API endpoint
    this.apiUrl = supabaseUrl.replace(/\/$/, '') + '/auth/v1';

    this.dataDir = path.join(__dirname, '..', 'data');
    this.results = {
      created: [],
      failed: [],
      skipped: []
    };
  }

  loadUsers() {
    const filePath = path.join(this.dataDir, 'populated_users.json');
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  }

  generatePassword() {
    // Generate a secure random password
    // Users should change this on first login
    const length = 16;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }

  async createUserViaAPI(userData) {
    // Use direct HTTP API call as fallback
    try {
      const response = await axios.post(
        `${this.apiUrl}/admin/users`,
        {
          email: userData.email,
          password: this.generatePassword(),
          email_confirm: true,
          user_metadata: {
            full_name: userData.name,
            avatar_url: userData.avatar_url
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'apikey': this.supabaseServiceKey,
            'Authorization': `Bearer ${this.supabaseServiceKey}`
          }
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data?.error?.message || error.response.data?.message || `HTTP ${error.response.status}`);
      }
      throw error;
    }
  }

  async getUserByEmailViaAPI(email) {
    // Use direct HTTP API call to check if user exists
    // Supabase Admin API: GET /auth/v1/admin/users?email=...
    try {
      const response = await axios.get(
        `${this.apiUrl}/admin/users`,
        {
          params: { email },
          headers: {
            'apikey': this.supabaseServiceKey,
            'Authorization': `Bearer ${this.supabaseServiceKey}`
          }
        }
      );
      // The API returns an object with 'users' array
      const users = response.data?.users || response.data || [];
      const userArray = Array.isArray(users) ? users : [];
      return userArray.find(u => u.email === email) || null;
    } catch (error) {
      // If user not found (404) or other error, return null
      // We'll try to create anyway, and handle "already exists" error
      return null;
    }
  }

  async createUser(userData, index) {
    try {
      // Check if user already exists using direct API
      const existingUser = await this.getUserByEmailViaAPI(userData.email);
      if (existingUser) {
        console.log(`⏭️  User already exists: ${userData.email} (ID: ${existingUser.id})`);
        this.results.skipped.push({
          index,
          email: userData.email,
          id: existingUser.id
        });
        return existingUser.id;
      }

      // Try using Supabase client admin API first (if available)
      if (this.supabase.auth.admin && typeof this.supabase.auth.admin.createUser === 'function') {
        try {
          const { data, error } = await this.supabase.auth.admin.createUser({
            email: userData.email,
            password: this.generatePassword(),
            email_confirm: true,
            user_metadata: {
              full_name: userData.name,
              avatar_url: userData.avatar_url
            }
          });

          if (error) {
            throw error;
          }

          if (data?.user?.id) {
            console.log(`✅ Created user ${index + 1}: ${userData.email} (ID: ${data.user.id})`);
            this.results.created.push({
              index,
              email: userData.email,
              id: data.user.id,
              name: userData.name
            });
            return data.user.id;
          }
        } catch (clientError) {
          // If client method fails, fall through to direct API call
          if (!clientError.message.includes('already registered') && !clientError.message.includes('already exists')) {
            console.log(`ℹ️  Client method failed, using direct API: ${clientError.message}`);
          } else {
            // User exists error from client
            throw clientError;
          }
        }
      }

      // Fallback to direct HTTP API call
      const result = await this.createUserViaAPI(userData);
      
      if (result?.id) {
        console.log(`✅ Created user ${index + 1}: ${userData.email} (ID: ${result.id})`);
        this.results.created.push({
          index,
          email: userData.email,
          id: result.id,
          name: userData.name
        });
        return result.id;
      }

      if (result?.user?.id) {
        console.log(`✅ Created user ${index + 1}: ${userData.email} (ID: ${result.user.id})`);
        this.results.created.push({
          index,
          email: userData.email,
          id: result.user.id,
          name: userData.name
        });
        return result.user.id;
      }

      throw new Error('User creation succeeded but no user ID returned');
    } catch (error) {
      // Check if error is due to user already existing
      const errorMsg = error.message || error.toString();
      if (errorMsg.includes('already registered') || errorMsg.includes('already exists') || errorMsg.includes('User already registered')) {
        console.log(`⏭️  User already exists: ${userData.email}`);
        this.results.skipped.push({
          index,
          email: userData.email,
          error: 'User exists'
        });
        return null;
      }

      console.error(`❌ Failed to create user ${index + 1} (${userData.email}):`, errorMsg);
      this.results.failed.push({
        index,
        email: userData.email,
        error: errorMsg
      });
      return null;
    }
  }

  async createAllUsers() {
    const users = this.loadUsers();
    console.log(`\n📝 Starting user creation for ${users.length} users...\n`);

    const userIds = [];
    const batchSize = 10; // Process in batches to avoid rate limits
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      console.log(`\n📦 Processing batch ${Math.floor(i / batchSize) + 1} (users ${i + 1}-${Math.min(i + batchSize, users.length)})...`);

      const batchPromises = batch.map((user, batchIndex) => 
        this.createUser(user, i + batchIndex)
      );

      const batchResults = await Promise.all(batchPromises);
      userIds.push(...batchResults);

      // Small delay between batches to avoid rate limiting
      if (i + batchSize < users.length) {
        await delay(500);
      }
    }

    // Save results to file for use in next steps
    const resultsPath = path.join(__dirname, '..', 'data', 'user_creation_results.json');
    fs.writeFileSync(resultsPath, JSON.stringify({
      userIds,
      results: this.results,
      timestamp: new Date().toISOString()
    }, null, 2));

    console.log(`\n\n📊 Summary:`);
    console.log(`   ✅ Created: ${this.results.created.length}`);
    console.log(`   ⏭️  Skipped: ${this.results.skipped.length}`);
    console.log(`   ❌ Failed: ${this.results.failed.length}`);
    console.log(`\n💾 Results saved to: ${resultsPath}`);

    if (this.results.failed.length > 0) {
      console.log(`\n⚠️  Failed users:`);
      this.results.failed.forEach(f => {
        console.log(`   - ${f.email}: ${f.error}`);
      });
    }

    return userIds;
  }
}

// Run if called directly
if (require.main === module) {
  const creator = new UserCreator();
  creator.createAllUsers()
    .then(() => {
      console.log('\n✅ User creation completed!');
      console.log('\n📝 Next steps:');
      console.log('   1. Run: node scripts/update-profiles.js');
      console.log('   2. Run: node scripts/create-vendors-products.js');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { UserCreator };
