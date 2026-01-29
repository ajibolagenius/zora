/**
 * Create Test Users Script
 * Creates test vendor and admin users in Supabase for development/testing
 *
 * Usage: node scripts/create-test-users.js
 *
 * Requires: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Get Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials.');
    console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env');
    process.exit(1);
}

// Create admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

// Test users configuration
const testUsers = {
    vendor: {
        email: 'vendor@test.zoraapp.co.uk',
        password: 'VendorTest123!',
        profile: {
            full_name: 'Test Vendor',
            phone: '+44 7700 900001',
            role: 'vendor',
        },
        vendor: {
            shop_name: 'Test African Kitchen',
            slug: 'test-african-kitchen',
            description: 'Authentic African cuisine for testing',
            address: '123 Test Street, London, E1 1AA',
            latitude: 51.5074,
            longitude: -0.1278,
            categories: ['african', 'nigerian'],
            cultural_specialties: ['west_africa'],
            is_verified: true,
            delivery_fee: 3.99,
            delivery_time_min: 30,
            delivery_time_max: 45,
        },
    },
    admin: {
        email: 'admin@test.zoraapp.co.uk',
        password: 'AdminTest123!',
        profile: {
            full_name: 'Test Admin',
            phone: '+44 7700 900002',
            role: 'admin',
        },
    },
    superAdmin: {
        email: 'superadmin@test.zoraapp.co.uk',
        password: 'SuperAdmin123!',
        profile: {
            full_name: 'Test Super Admin',
            phone: '+44 7700 900003',
            role: 'super_admin',
        },
    },
};

async function createUser(userConfig, userType) {
    console.log(`\n📝 Creating ${userType} user: ${userConfig.email}`);

    try {
        // Check if user already exists
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const existingUser = existingUsers?.users?.find(u => u.email === userConfig.email);

        let userId;

        if (existingUser) {
            console.log(`   ⚠️  User already exists, updating...`);
            userId = existingUser.id;

            // Update password
            const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
                password: userConfig.password,
                email_confirm: true,
            });

            if (updateError) {
                console.error(`   ❌ Failed to update user:`, updateError.message);
                return null;
            }
        } else {
            // Create new user
            const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                email: userConfig.email,
                password: userConfig.password,
                email_confirm: true,
            });

            if (authError) {
                console.error(`   ❌ Failed to create auth user:`, authError.message);
                return null;
            }

            userId = authData.user.id;
            console.log(`   ✅ Auth user created: ${userId}`);
        }

        // Update or insert profile
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                email: userConfig.email,
                ...userConfig.profile,
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'id',
            });

        if (profileError) {
            console.error(`   ❌ Failed to create/update profile:`, profileError.message);
        } else {
            console.log(`   ✅ Profile created/updated`);
        }

        return userId;
    } catch (error) {
        console.error(`   ❌ Error creating ${userType}:`, error.message);
        return null;
    }
}

async function createVendor(userId, vendorConfig) {
    console.log(`   📦 Creating vendor record...`);

    try {
        // Check if vendor already exists for this user
        const { data: existingVendor } = await supabase
            .from('vendors')
            .select('id')
            .eq('user_id', userId)
            .single();

        if (existingVendor) {
            console.log(`   ⚠️  Vendor already exists, updating...`);
            const { error } = await supabase
                .from('vendors')
                .update({
                    ...vendorConfig,
                    updated_at: new Date().toISOString(),
                })
                .eq('user_id', userId);

            if (error) {
                console.error(`   ❌ Failed to update vendor:`, error.message);
                return;
            }
        } else {
            const { error } = await supabase
                .from('vendors')
                .insert({
                    user_id: userId,
                    ...vendorConfig,
                });

            if (error) {
                console.error(`   ❌ Failed to create vendor:`, error.message);
                return;
            }
        }

        console.log(`   ✅ Vendor record created/updated`);
    } catch (error) {
        console.error(`   ❌ Error creating vendor:`, error.message);
    }
}

async function main() {
    console.log('🚀 Creating test users for Zora...');
    console.log(`   Supabase URL: ${supabaseUrl}`);
    console.log('');

    // Create vendor user
    const vendorUserId = await createUser(testUsers.vendor, 'vendor');
    if (vendorUserId) {
        await createVendor(vendorUserId, testUsers.vendor.vendor);
    }

    // Create admin user
    await createUser(testUsers.admin, 'admin');

    // Create super admin user
    await createUser(testUsers.superAdmin, 'super_admin');

    console.log('\n' + '='.repeat(50));
    console.log('✅ Test users created successfully!\n');
    console.log('📋 Login Credentials:');
    console.log('');
    console.log('   VENDOR PORTAL (localhost:3001):');
    console.log(`   Email: ${testUsers.vendor.email}`);
    console.log(`   Password: ${testUsers.vendor.password}`);
    console.log('');
    console.log('   ADMIN DASHBOARD (localhost:3002):');
    console.log(`   Email: ${testUsers.admin.email}`);
    console.log(`   Password: ${testUsers.admin.password}`);
    console.log('');
    console.log('   SUPER ADMIN:');
    console.log(`   Email: ${testUsers.superAdmin.email}`);
    console.log(`   Password: ${testUsers.superAdmin.password}`);
    console.log('');
    console.log('='.repeat(50));
}

main().catch(console.error);
