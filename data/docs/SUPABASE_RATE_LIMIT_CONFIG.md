# Supabase Rate Limit Configuration Guide

## Overview

Supabase has built-in rate limiting to prevent abuse and protect your application. The rate limits apply to authentication endpoints (signup, signin, password reset, etc.) and are typically **IP-based** or **device-based**, not email-based.

## How to Modify Rate Limits in Supabase Dashboard

### Step 1: Access Your Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your project (e.g., `zora`)

### Step 2: Navigate to Authentication Settings

1. In the left sidebar, click on **"Authentication"**
2. Click on **"Settings"** (or look for "Rate Limits" or "Configuration")
3. Scroll down to find **"Rate Limits"** section

### Step 3: Modify Email Rate Limits

Look for the following settings:

#### Email Rate Limits

- **Signup Rate Limit**: Controls how many signup requests can be made
  - Default: Usually 3-5 requests per hour per IP
  - Recommended: Increase to 10-20 for better UX during development/testing
  
- **Password Reset Rate Limit**: Controls password reset requests
  - Default: Usually 3 requests per hour per IP
  - Recommended: 5-10 requests per hour

- **Email Verification Rate Limit**: Controls verification email resends
  - Default: Usually 3-5 requests per hour per IP
  - Recommended: 5-10 requests per hour

#### Configuration Options

You may see options like:

1. **"Reset counter if window expired"**
   - ✅ **Enabled (Recommended)**: Counter resets when time window expires
   - ❌ **Disabled**: Counter accumulates until manually reset
   
2. **Rate Limit Window**
   - Time period for rate limiting (e.g., 1 hour, 15 minutes)
   - Default: Usually 1 hour
   - You can adjust this based on your needs

3. **Maximum Requests per Window**
   - Number of requests allowed in the time window
   - Default: Usually 3-5
   - Increase for development/testing environments

### Step 4: Save Changes

1. After modifying the settings, click **"Save"** or **"Update"**
2. Changes take effect immediately (no restart required)

## Alternative: Using Supabase CLI

If you prefer using the CLI:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Check current rate limit settings
supabase projects api-keys list

# Note: Rate limits are typically configured via Dashboard only
```

## Recommended Settings for Development

For **development/testing** environments:

- **Signup Rate Limit**: 20 requests per hour
- **Password Reset**: 10 requests per hour  
- **Email Verification**: 10 requests per hour
- **Window**: 1 hour
- **Reset counter if window expired**: ✅ Enabled

For **production** environments:

- **Signup Rate Limit**: 5-10 requests per hour (balance security vs UX)
- **Password Reset**: 5 requests per hour
- **Email Verification**: 5 requests per hour
- **Window**: 1 hour
- **Reset counter if window expired**: ✅ Enabled

## Important Notes

### Rate Limiting is IP-Based

⚠️ **Important**: Supabase's rate limiting is typically **IP-based**, not email-based. This means:

- Changing the email address won't bypass the rate limit
- Users on the same network (same IP) share the same rate limit
- Mobile users switching between WiFi and mobile data will have different IPs

### Rate Limit Types

Supabase may have different rate limits for:

1. **Email-based operations** (signup, password reset, email verification)
2. **API requests** (general API rate limits)
3. **Storage operations** (file uploads/downloads)
4. **Database queries** (if using direct database access)

### Checking Current Rate Limits

To see your current rate limit settings:

1. Go to **Authentication → Settings → Rate Limits**
2. Or check **Project Settings → API → Rate Limits**

## Troubleshooting

### Issue: Rate limit still applies after changing settings

**Solution**:
- Wait for the current rate limit window to expire
- Clear browser cache/cookies
- Try from a different network/IP address
- Check if you're on a free tier (may have stricter limits)

### Issue: Can't find Rate Limits settings

**Solution**:
- Rate limits may be under **"Project Settings"** → **"API"** → **"Rate Limits"**
- Or under **"Authentication"** → **"Configuration"** → **"Rate Limits"**
- Some settings may only be available on paid plans

### Issue: Rate limits too strict for testing

**Solution**:
1. Increase the limits in Dashboard (as shown above)
2. Use different IP addresses/networks for testing
3. Wait for the rate limit window to reset
4. Consider using Supabase's development/staging environment with higher limits

## Supabase Plan Limits

Different Supabase plans have different rate limit configurations:

- **Free Tier**: Stricter limits (usually 3-5 requests/hour)
- **Pro Tier**: More flexible limits (can be customized)
- **Team/Enterprise**: Fully customizable limits

Check your plan's documentation for specific limits.

## Supabase Platform API Limits (Admin)

In addition to the user-facing rate limits, the **Supabase Platform API** (used by the Dashboard and CLI) has its own rate limits to prevent abuse of administrative actions.

### Common Platform Rate Limits

1. **User Invites** (`POST /platform/auth/{ref}/invite`)
   - **Error**: `429 Too Many Requests`
   - **Limit**: Strictly limited to prevent spam (often ~10-20 invites per hour)
   - **Resolution**: Wait for the window to reset (usually 1 hour) before sending more invites.

2. **Management Operations**
   - Project creation, pausing, and restoring also have strict rate limits.
   - programmatic usage of the Management API should implement exponential backoff.

> **Note:** These limits apply to **you** (the developer/admin) when managing the project, not to your end-users using the application.

## Related Documentation

- [Supabase Auth Rate Limits](https://supabase.com/docs/guides/auth/rate-limits)
- [Supabase Dashboard Settings](https://supabase.com/dashboard/project/_/settings/auth)
- [Supabase API Rate Limits](https://supabase.com/docs/guides/platform/rate-limits)

## Quick Reference

**Dashboard Path**: 
```
Project → Authentication → Settings → Rate Limits
```

**Or**:
```
Project → Settings → API → Rate Limits
```

**Key Settings to Modify**:
- Signup requests per hour
- Password reset requests per hour
- Email verification requests per hour
- Rate limit window duration
- Reset counter behavior
