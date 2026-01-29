/**
 * Verify Realtime Setup Script
 * Tests that Supabase realtime is properly configured
 *
 * Usage: pnpm dotenv -e .env -- node scripts/verify-realtime.js
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyRealtimeSetup() {
    console.log('🔍 Verifying Supabase Realtime Setup...\n');
    console.log(`   URL: ${supabaseUrl}\n`);

    // Tables that should have realtime enabled
    const realtimeTables = [
        'orders',
        'products',
        'vendors',
        'cart_items',
        'notifications',
        'reviews',
        'profiles',
        'vendor_applications',
        'email_threads',
        'conversations',
        'messages',
    ];

    console.log('📋 Checking tables exist...\n');

    for (const table of realtimeTables) {
        try {
            const { count, error } = await supabase
                .from(table)
                .select('*', { count: 'exact', head: true });

            if (error) {
                console.log(`   ❌ ${table}: ${error.message}`);
            } else {
                console.log(`   ✅ ${table}: ${count ?? 0} records`);
            }
        } catch (err) {
            console.log(`   ❌ ${table}: ${err.message}`);
        }
    }

    console.log('\n📡 Testing realtime subscription...\n');

    // Test a simple realtime subscription
    const channel = supabase
        .channel('test-channel')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'notifications' },
            (payload) => {
                console.log('   📨 Received realtime event:', payload.eventType);
            }
        )
        .subscribe((status) => {
            console.log(`   Channel status: ${status}`);

            if (status === 'SUBSCRIBED') {
                console.log('\n✅ Realtime subscription working!\n');

                // Cleanup after 2 seconds
                setTimeout(() => {
                    channel.unsubscribe();
                    console.log('🧹 Cleaned up test subscription');
                    console.log('\n' + '='.repeat(50));
                    console.log('✅ Realtime verification complete!');
                    console.log('='.repeat(50) + '\n');
                    process.exit(0);
                }, 2000);
            }
        });

    // Timeout after 10 seconds
    setTimeout(() => {
        console.log('\n⚠️  Subscription timed out');
        channel.unsubscribe();
        process.exit(1);
    }, 10000);
}

// Test user authentication
async function verifyTestUsers() {
    console.log('\n👤 Verifying test users...\n');

    const testEmails = [
        'vendor@test.zoraapp.co.uk',
        'admin@test.zoraapp.co.uk',
        'superadmin@test.zoraapp.co.uk',
    ];

    for (const email of testEmails) {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, role, email')
            .eq('email', email)
            .single();

        if (error) {
            console.log(`   ❌ ${email}: Not found`);
        } else {
            console.log(`   ✅ ${email}: ${data.full_name} (${data.role})`);
        }
    }
}

async function main() {
    await verifyTestUsers();
    await verifyRealtimeSetup();
}

main().catch(console.error);
