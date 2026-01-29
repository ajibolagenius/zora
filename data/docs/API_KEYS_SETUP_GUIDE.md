# API Keys Setup Guide

This document provides step-by-step instructions for generating the required API keys for the Zora application. Please follow each section carefully and provide the requested credentials once you have obtained them.

---

## Overview

The following API keys are required for the application to function properly:

1. **Google Maps API Key** - For location services and map functionality
2. **Stripe API Keys** - For payment processing
3. **Klarna API Credentials** - For Klarna payment integration (optional)
4. **Clearpay API Credentials** - For Clearpay payment integration (optional)

---

## 1. Google Maps API Key

### Prerequisites
- A Google Cloud Platform (GCP) account
- A billing account set up (Google Maps requires billing, but offers free credits)

### Steps to Generate

1. **Access Google Cloud Console**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Sign in with your Google account

2. **Create or Select a Project**
   - Click on the project dropdown at the top of the page
   - Click "New Project" if you don't have one
   - Enter a project name (e.g., "Zora App")
   - Click "Create"

3. **Enable Required APIs**
   - In the left sidebar, navigate to **APIs & Services** → **Library**
   - Search for and enable the following APIs:
     - **Maps SDK for Android** (if supporting Android)
     - **Maps SDK for iOS** (if supporting iOS)
     - **Places API** (for location search)
     - **Geocoding API** (for address conversion)
     - **Directions API** (for route planning, if needed)

4. **Create API Key**
   - Navigate to **APIs & Services** → **Credentials**
   - Click **"+ CREATE CREDENTIALS"** at the top
   - Select **"API key"**
   - Your API key will be generated immediately

5. **Restrict the API Key (Recommended)**
   - Click on the newly created API key to edit it
   - Under **"Application restrictions"**, select:
     - **"Android apps"** (if supporting Android) - Add your app's package name and SHA-1 certificate fingerprint
     - **"iOS apps"** (if supporting iOS) - Add your app's bundle identifier
   - Under **"API restrictions"**, select **"Restrict key"** and choose only the APIs you enabled above
   - Click **"Save"**

6. **Set Up Billing**
   - Navigate to **Billing** in the left sidebar
   - Link a billing account (Google provides $200 free credit per month for Maps usage)

### Information to Provide
- **API Key**: The generated API key string (starts with `AIza...`)

---

## 2. Stripe API Keys

### Prerequisites
- A Stripe account (create one at [stripe.com](https://stripe.com))

### Steps to Generate

1. **Access Stripe Dashboard**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/)
   - Sign in to your account

2. **Navigate to API Keys**
   - In the left sidebar, click **"Developers"**
   - Click **"API keys"** from the dropdown

3. **Get Your Keys**
   - You'll see two sets of keys: **Test mode** and **Live mode**
   - For development, use **Test mode keys**
   - For production, use **Live mode keys** (toggle at the top right)

4. **Publishable Key**
   - The **Publishable key** is safe to use in client-side code
   - It starts with `pk_test_` (test) or `pk_live_` (live)
   - Copy this key

5. **Secret Key** (Backend Only)
   - The **Secret key** starts with `sk_test_` (test) or `sk_live_` (live)
   - ⚠️ **Keep this key secure** - only use it on your backend server
   - Copy this key and store it securely

6. **Webhook Setup** (If needed)
   - Navigate to **Developers** → **Webhooks**
   - Click **"Add endpoint"** to set up webhook URLs for payment events

### Information to Provide
- **Publishable Key (Test)**: `pk_test_...`
- **Publishable Key (Live)**: `pk_live_...` (for production)
- **Secret Key (Test)**: `sk_test_...` (for backend)
- **Secret Key (Live)**: `sk_live_...` (for backend, production)

---

## 3. Klarna API Credentials

### Prerequisites
- A Klarna merchant account
- Business registration documents (may be required)

### Steps to Generate

1. **Access Klarna Developer Portal**
   - Go to [Klarna Developer Portal](https://developers.klarna.com/)
   - Sign in or create an account

2. **Create a Merchant Account**
   - If you don't have a merchant account, you'll need to:
     - Complete the merchant application
     - Provide business information and documentation
     - Wait for approval (can take a few business days)

3. **Access API Credentials**
   - Once approved, log in to the [Klarna Merchant Portal](https://merchants.klarna.com/)
   - Navigate to **Settings** → **API Credentials**

4. **Get Your Credentials**
   - You'll find:
     - **Username** (API Username)
     - **Password** (API Password)
   - These are different from your merchant portal login credentials

5. **Test Environment**
   - Klarna provides a test environment for development
   - Test credentials are available in the developer portal
   - Use test credentials during development

### Information to Provide
- **API Username**: Your Klarna API username
- **API Password**: Your Klarna API password
- **Environment**: Test or Production
- **Merchant ID**: (if applicable)

---

## 4. Clearpay API Credentials

### Prerequisites
- A Clearpay merchant account
- Business registration and verification

### Steps to Generate

1. **Access Clearpay Merchant Portal**
   - Go to [Clearpay Merchant Portal](https://merchants.clearpay.com/)
   - Sign in or create an account

2. **Apply for Merchant Account**
   - Complete the merchant application form
   - Provide required business documentation
   - Wait for account approval

3. **Access API Settings**
   - Once approved, log in to your merchant dashboard
   - Navigate to **Settings** → **API Settings** or **Developers** → **API Keys**

4. **Generate API Credentials**
   - You'll need:
     - **Merchant ID**
     - **Secret Key** or **API Key**
   - Some accounts may require generating a new API key

5. **Test Environment**
   - Clearpay provides sandbox/test credentials for development
   - Access test credentials from the developer section

### Information to Provide
- **Merchant ID**: Your Clearpay merchant identifier
- **API Key/Secret Key**: Your Clearpay API key
- **Environment**: Test or Production

---

## Security Best Practices

When providing API keys:

1. **Never commit keys to version control** - Keys should be stored in environment variables
2. **Use test keys for development** - Only use production keys when deploying to production
3. **Restrict API keys** - Apply restrictions (IP, domain, app) where possible
4. **Rotate keys regularly** - Change keys periodically for security
5. **Share securely** - Send keys through secure channels (encrypted email, password manager, secure file sharing)

---

## Information Checklist

Please provide the following information once you have obtained all API keys:

### Google Maps
- [ ] API Key: `___________________________`

### Stripe
- [ ] Publishable Key (Test): `___________________________`
- [ ] Publishable Key (Live): `___________________________`
- [ ] Secret Key (Test): `___________________________`
- [ ] Secret Key (Live): `___________________________`

### Klarna (Optional)
- [ ] API Username: `___________________________`
- [ ] API Password: `___________________________`
- [ ] Merchant ID: `___________________________`
- [ ] Environment: `___________________________`

### Clearpay (Optional)
- [ ] Merchant ID: `___________________________`
- [ ] API Key: `___________________________`
- [ ] Environment: `___________________________`

---

## Support & Questions

If you encounter any issues during the setup process:

- **Google Maps**: [Google Cloud Support](https://cloud.google.com/support)
- **Stripe**: [Stripe Support](https://support.stripe.com/)
- **Klarna**: [Klarna Developer Support](https://developers.klarna.com/support)
- **Clearpay**: [Clearpay Merchant Support](https://www.clearpay.co.uk/en-GB/merchants)

For questions about how these keys will be used in the application, please contact the development team.

---

**Document Version**: 1.0  
**Last Updated**: January 2026
