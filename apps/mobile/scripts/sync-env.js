#!/usr/bin/env node
/**
 * Sync Environment Variables Script
 *
 * This script copies the root .env file to the mobile app directory so that
 * Expo's Metro bundler can read EXPO_PUBLIC_* variables at build time.
 *
 * Metro only looks for .env files in the project root, not in parent directories.
 * Using dotenv-cli only injects vars into process.env, but Metro needs to
 * statically inline EXPO_PUBLIC_* variables during the build.
 */

const fs = require('fs');
const path = require('path');

const ROOT_ENV_PATH = path.resolve(__dirname, '../../../.env');
const LOCAL_ENV_PATH = path.resolve(__dirname, '../.env');

function syncEnv() {
    // Check if root .env exists
    if (!fs.existsSync(ROOT_ENV_PATH)) {
        console.log('⚠️  No .env file found at project root.');
        console.log('   Create one from .env.example: cp .env.example .env');

        // Check if local .env already exists (from previous run or manual creation)
        if (fs.existsSync(LOCAL_ENV_PATH)) {
            console.log('✓  Using existing local .env file');
            return;
        }

        // Create a minimal .env file for development
        console.log('   Creating minimal .env for development...');
        const minimalEnv = `# Auto-generated minimal .env for development
# Copy actual values from root .env.example

EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=
`;
        fs.writeFileSync(LOCAL_ENV_PATH, minimalEnv);
        console.log('✓  Created minimal .env - please add your values');
        return;
    }

    try {
        // Read root .env
        const rootEnvContent = fs.readFileSync(ROOT_ENV_PATH, 'utf-8');

        // Filter to only include EXPO_PUBLIC_* variables for mobile
        // This keeps the mobile .env clean and focused
        const lines = rootEnvContent.split('\n');
        const mobileEnvLines = [];
        let inRelevantSection = false;

        mobileEnvLines.push('# Auto-synced from root .env');
        mobileEnvLines.push('# Do not edit directly - run `npm run env:link` to refresh');
        mobileEnvLines.push(`# Last synced: ${new Date().toISOString()}`);
        mobileEnvLines.push('');

        for (const line of lines) {
            const trimmedLine = line.trim();

            // Include EXPO_PUBLIC_* variables
            if (trimmedLine.startsWith('EXPO_PUBLIC_')) {
                mobileEnvLines.push(line);
            }
            // Also include comments that might be relevant
            else if (trimmedLine.startsWith('#') &&
                (trimmedLine.toLowerCase().includes('expo') ||
                    trimmedLine.toLowerCase().includes('mobile'))) {
                mobileEnvLines.push(line);
            }
        }

        // Write to local .env
        const mobileEnvContent = mobileEnvLines.join('\n') + '\n';

        // Check if content has changed to avoid unnecessary writes
        if (fs.existsSync(LOCAL_ENV_PATH)) {
            const existingContent = fs.readFileSync(LOCAL_ENV_PATH, 'utf-8');
            // Compare without the timestamp line
            const existingWithoutTimestamp = existingContent.replace(/# Last synced:.*\n/, '');
            const newWithoutTimestamp = mobileEnvContent.replace(/# Last synced:.*\n/, '');

            if (existingWithoutTimestamp === newWithoutTimestamp) {
                console.log('✓  Environment variables already in sync');
                return;
            }
        }

        fs.writeFileSync(LOCAL_ENV_PATH, mobileEnvContent);
        console.log('✓  Synced EXPO_PUBLIC_* variables from root .env');

        // Count variables synced
        const varCount = mobileEnvLines.filter(l => l.startsWith('EXPO_PUBLIC_')).length;
        console.log(`   ${varCount} environment variable(s) synced`);

    } catch (error) {
        console.error('❌ Error syncing environment variables:', error.message);
        process.exit(1);
    }
}

// Run the sync
syncEnv();
