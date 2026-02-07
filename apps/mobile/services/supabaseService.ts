/**
 * Supabase Data Service
 * Replaces FastAPI/MongoDB backend with direct Supabase client calls
 * 
 * This service provides all data operations using Supabase.
 * For development/demo purposes, it falls back to mock data when Supabase is not configured.
 */

import { supabase, isSupabaseConfigured, getSupabaseClient } from '../lib/supabase';
import type { User, Vendor, Product, Order, Review, PromoCode } from '../types';
import mockDatabase from '../data/mock_database.json';
import { getFeaturedVendors, getFeaturedProducts } from './rankingService';
import type { Vendor as MockVendor, Product as MockProduct } from './mockDataService';
import { encodeProductSlug } from '../lib/slugUtils';
import { Platform } from 'react-native';
import { getVendorImagesWithFallback } from '../lib/vendorImageUtils';
import { qrCodeGenerator } from './qrCodeService';

/**
 * Safely gets the Supabase client's from method
 * Returns null if Supabase is not configured or not initialized
 * For native platforms, attempts to wait for async initialization
 */
async function getSupabaseFrom(): Promise<((table: string) => any) | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  // Try to get the method (this will trigger initialization on web)
  let fromMethod = supabase.from;

  // If not available (likely native platform), try to wait for async initialization
  if (!fromMethod && Platform.OS !== 'web') {
    try {
      // Wait a short time for async initialization to complete
      // This is a best-effort approach - if it's not ready, we'll fall back to mock data
      await Promise.race([
        getSupabaseClient(),
        new Promise(resolve => setTimeout(resolve, 100)), // 100ms timeout
      ]);
      fromMethod = supabase.from;
    } catch (error) {
      // Ignore errors - will fall back to mock data
    }
  }

  return fromMethod || null;
}

/**
 * Safely gets the Supabase client's rpc method
 * Returns null if Supabase is not configured or not initialized
 * For native platforms, attempts to wait for async initialization
 */
async function getSupabaseRpc(): Promise<((functionName: string, args?: any) => any) | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  // Try to get the method (this will trigger initialization on web)
  let rpcMethod = supabase.rpc;

  // If not available (likely native platform), try to wait for async initialization
  if (!rpcMethod && Platform.OS !== 'web') {
    try {
      // Wait a short time for async initialization to complete
      await Promise.race([
        getSupabaseClient(),
        new Promise(resolve => setTimeout(resolve, 100)), // 100ms timeout
      ]);
      rpcMethod = supabase.rpc;
    } catch (error) {
      // Ignore errors - will fall back to mock data
    }
  }

  return rpcMethod || null;
}

// ============== AUTH SERVICE ==============
export const authService = {
  // Sign up with email
  signUp: async (email: string, password: string, name: string) => {
    if (!isSupabaseConfigured()) {
      // Mock signup
      return { user: { id: 'mock_user_' + Date.now(), email, name }, error: null };
    }

    const client = await getSupabaseClient();
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (data.user && !error) {
      // Profile is automatically created by handle_new_user() trigger
      // But ensure it exists with correct data
      const fromMethod = await getSupabaseFrom();
      if (fromMethod) {
        // Try to insert, but handle conflict if trigger already created it
        try {
          await fromMethod('profiles').insert({
            id: data.user.id,
            email: data.user.email,
            full_name: name,
            membership_tier: 'bronze',
            zora_credits: 5.0,
            loyalty_points: 100,
            cultural_interests: [],
            referral_code: `ZORA${data.user.id.substring(0, 6).toUpperCase()}`,
          });
        } catch (insertError: any) {
          // Profile already exists (created by trigger), update it if needed
          try {
            await fromMethod('profiles')
              .update({ full_name: name, email: data.user.email })
              .eq('id', data.user.id);
          } catch (updateError) {
            console.error('Failed to update existing profile:', updateError);
            // Log error but don't throw - profile exists, just couldn't update metadata
          }
        }
      }
    }

    return { user: data.user, error };
  },

  // Sign in with email
  signIn: async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      // Mock signin
      return {
        user: { id: 'mock_user_123', email },
        session: { access_token: 'mock_token' },
        error: null
      };
    }

    const client = await getSupabaseClient();
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    return { user: data.user, session: data.session, error };
  },

  // Sign in with Google OAuth
  signInWithGoogle: async () => {
    if (!isSupabaseConfigured()) {
      return { url: null, error: new Error('Supabase not configured') };
    }

    const client = await getSupabaseClient();
    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'zoramarket://auth/callback',
      },
    });

    return { url: data.url, error };
  },

  // Sign out
  signOut: async () => {
    if (!isSupabaseConfigured()) {
      return { error: null };
    }

    const client = await getSupabaseClient();
    const { error } = await client.auth.signOut();
    return { error };
  },

  // Get current user
  getCurrentUser: async () => {
    if (!isSupabaseConfigured()) {
      return null;
    }

    const client = await getSupabaseClient();
    const { data: { user } } = await client.auth.getUser();
    return user;
  },

  // Get user profile
  getProfile: async (userId: string) => {
    if (!isSupabaseConfigured()) {
      // Return mock user profile
      return {
        id: userId,
        email: 'demo@zora.market',
        name: 'Demo User',
        membership_tier: 'gold',
        zora_credits: 25.50,
        loyalty_points: 1250,
        cultural_interests: ['West Africa', 'East Africa'],
      } as User;
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      // Fallback to mock data
      return {
        id: userId,
        email: 'demo@zora.market',
        name: 'Demo User',
        membership_tier: 'gold',
        zora_credits: 25.50,
        loyalty_points: 1250,
        cultural_interests: ['West Africa', 'East Africa'],
      } as User;
    }

    const { data, error } = await fromMethod('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    return data;
  },

  // Update user profile
  updateProfile: async (userId: string, updates: Partial<User>) => {
    if (!isSupabaseConfigured()) {
      return { data: updates, error: null };
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return { data: updates, error: null };
    }

    const { data, error } = await fromMethod('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    return { data, error };
  },
};

/**
 * Enrich vendor data with generated images when missing
 * Uses free APIs (Unsplash, DiceBear) to populate cover images and logos
 */
function enrichVendorImages(vendor: Vendor): Vendor {
  if (!vendor.cover_image_url || !vendor.logo_url) {
    const { coverImageUrl, logoUrl } = getVendorImagesWithFallback(
      vendor.id,
      vendor.shop_name,
      vendor.cover_image_url,
      vendor.logo_url
    );

    return {
      ...vendor,
      cover_image_url: vendor.cover_image_url || coverImageUrl,
      logo_url: vendor.logo_url || logoUrl,
    };
  }

  return vendor;
}

/**
 * Adapt a mock vendor to match the application's Vendor interface
 */
function adaptMockVendor(mockVendor: any): Vendor {
  // Extract working hours or set defaults
  const defaultHours = [
    { day: 'Monday', open: '09:00', close: '17:00', is_closed: false },
    { day: 'Tuesday', open: '09:00', close: '17:00', is_closed: false },
    { day: 'Wednesday', open: '09:00', close: '17:00', is_closed: false },
    { day: 'Thursday', open: '09:00', close: '17:00', is_closed: false },
    { day: 'Friday', open: '09:00', close: '17:00', is_closed: false },
    { day: 'Saturday', open: '10:00', close: '15:00', is_closed: false },
    { day: 'Sunday', open: '00:00', close: '00:00', is_closed: true },
  ];

  return {
    id: mockVendor.id,
    name: mockVendor.shop_name || mockVendor.name || '',
    shop_name: mockVendor.shop_name || mockVendor.name || '',
    description: mockVendor.description || '',
    cover_image: mockVendor.cover_image_url || mockVendor.cover_image || '',
    cover_image_url: mockVendor.cover_image_url || mockVendor.cover_image || '',
    logo_url: mockVendor.logo_url || '',
    category: mockVendor.categories?.[0] || mockVendor.category || 'General',
    categories: mockVendor.categories || [],
    regions: mockVendor.cultural_specialties || mockVendor.regions || [],
    rating: mockVendor.rating || 0,
    review_count: mockVendor.review_count || 0,
    is_verified: mockVendor.is_verified || false,
    delivery_time: `${mockVendor.delivery_time_min || 30}-${mockVendor.delivery_time_max || 60} min`,
    delivery_time_min: mockVendor.delivery_time_min,
    delivery_time_max: mockVendor.delivery_time_max,
    delivery_fee: mockVendor.delivery_fee || 0,
    min_order: mockVendor.minimum_order || mockVendor.min_order || 0,
    address: mockVendor.address || '',
    opening_hours: mockVendor.opening_hours || defaultHours,
    is_open: true, // Simplified for now
    cultural_specialties: mockVendor.cultural_specialties || [],
  };
}

/**
 * Adapt a mock product to match the application's Product interface
 */
function adaptMockProduct(mockProduct: any): Product {
  const images = mockProduct.image_urls || mockProduct.images || [mockProduct.image_url || ''];

  return {
    id: mockProduct.id,
    vendor_id: mockProduct.vendor_id,
    name: mockProduct.name,
    description: mockProduct.description || '',
    price: mockProduct.price || 0,
    currency: 'GBP', // Default to GBP
    image_url: images[0] || '',
    images: images,
    category: mockProduct.category || 'General',
    region: mockProduct.cultural_region || mockProduct.region || '',
    rating: mockProduct.rating || 0,
    review_count: mockProduct.review_count || 0,
    in_stock: (mockProduct.stock_quantity || 0) > 0,
    stock_quantity: mockProduct.stock_quantity || 0,
    attributes: mockProduct.attributes || {},
    certifications: mockProduct.certifications || [],
    nutrition_info: mockProduct.nutrition || undefined,
    origin: mockProduct.cultural_region || undefined,
  };
}

// ============== VENDOR SERVICE ==============
export const vendorService = {
  getAll: async (options: { page?: number; limit?: number } = {}): Promise<Vendor[]> => {
    const { page = 1, limit = 20 } = options;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    if (!isSupabaseConfigured()) {
      // Return mock vendors with adapted structure
      const vendors = mockDatabase.vendors.map(v => enrichVendorImages(adaptMockVendor(v)));
      return vendors.slice(start, end + 1);
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      // Fallback to mock data if Supabase not available
      const vendors = mockDatabase.vendors.map(v => enrichVendorImages(adaptMockVendor(v)));
      return vendors.slice(start, end + 1);
    }

    const { data, error } = await fromMethod('vendors')
      .select('*')
      .order('is_featured', { ascending: false })
      .range(start, end);

    const vendors = data || [];
    // Enrich vendors with generated images when missing
    return vendors.map(enrichVendorImages);
  },

  getFeatured: async (userRegion?: string, limit: number = 10): Promise<Vendor[]> => {
    if (!isSupabaseConfigured()) {
      // Use ranking system for mock data
      const featured = getFeaturedVendors(mockDatabase.vendors as MockVendor[], userRegion, limit);
      return featured.map((v: any) => enrichVendorImages(adaptMockVendor(v)));
    }

    // Fetch all vendors and rank them
    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      const featured = getFeaturedVendors(mockDatabase.vendors as MockVendor[], userRegion, limit);
      return featured.map((v: any) => enrichVendorImages(adaptMockVendor(v)));
    }

    const { data } = await fromMethod('vendors')
      .select('*');

    if (!data || data.length === 0) return [];

    // Convert Supabase vendors to mock format for ranking, then convert back
    const vendorsForRanking = data.map((v: any) => ({
      ...v,
      location: {
        type: 'Point',
        coordinates: [v.longitude, v.latitude],
      },
      cultural_specialties: v.cultural_specialties || [],
      categories: v.categories || [],
    })) as unknown as MockVendor[];

    const ranked = getFeaturedVendors(vendorsForRanking, userRegion, limit);

    // Convert back to Supabase format and enrich with images
    return ranked.map(v => enrichVendorImages(adaptMockVendor(v)));
  },

  getById: async (id: string): Promise<Vendor | null> => {
    if (!isSupabaseConfigured()) {
      const vendor = mockDatabase.vendors.find(v => v.id === id);
      if (!vendor) return null;
      const enrichedVendor = {
        ...vendor,
        latitude: vendor.location.coordinates[1],
        longitude: vendor.location.coordinates[0],
        updated_at: vendor.created_at,
      } as unknown as Vendor;
      return enrichVendorImages(enrichedVendor);
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      const vendor = mockDatabase.vendors.find(v => v.id === id);
      if (!vendor) return null;
      return enrichVendorImages(adaptMockVendor(vendor));
    }

    const { data, error } = await fromMethod('vendors')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return enrichVendorImages(data);
  },

  getBySlug: async (slug: string): Promise<Vendor | null> => {
    if (!isSupabaseConfigured()) {
      // For mock data, try to find by slug or fallback to ID
      const vendor = mockDatabase.vendors.find(v => {
        // Generate slug from shop_name for mock data
        const vendorSlug = (v as any).slug ||
          v.shop_name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        return vendorSlug === slug || v.id === slug;
      });
      if (!vendor) return null;
      return enrichVendorImages(adaptMockVendor(vendor));
    }

    // Check if supabase client is available
    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      console.warn('Supabase client not initialized, falling back to mock data');
      const vendor = mockDatabase.vendors.find(v => {
        const vendorSlug = (v as any).slug ||
          v.shop_name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        return vendorSlug === slug || v.id === slug;
      });
      if (!vendor) return null;
      return enrichVendorImages(adaptMockVendor(vendor));
    }

    const { data } = await fromMethod('vendors')
      .select('*')
      .eq('slug', slug)
      .single();

    return data;
  },

  checkSlugUnique: async (slug: string, excludeVendorId?: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      // For mock data, just check if any vendor has this slug
      const existing = mockDatabase.vendors.find(v => {
        const vendorSlug = (v as any).slug ||
          v.shop_name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        return vendorSlug === slug && (!excludeVendorId || v.id !== excludeVendorId);
      });
      return !existing;
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      const existing = mockDatabase.vendors.find(v => {
        const vendorSlug = (v as any).slug ||
          v.shop_name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        return vendorSlug === slug && (!excludeVendorId || v.id !== excludeVendorId);
      });
      return !existing;
    }

    const { data } = await fromMethod('vendors')
      .select('id')
      .eq('slug', slug)
      .limit(1);

    if (!data || data.length === 0) return true;

    // If excluding a vendor ID, check if the found vendor is the excluded one
    if (excludeVendorId && data[0].id === excludeVendorId) {
      return true;
    }

    return false;
  },

  getNearby: async (lat: number, lng: number, radiusKm: number = 10): Promise<Vendor[]> => {
    if (!isSupabaseConfigured()) {
      // Simple distance filter for mock data
      return mockDatabase.vendors
        .filter(v => {
          const vLat = v.location.coordinates[1];
          const vLng = v.location.coordinates[0];
          const distance = Math.sqrt(
            Math.pow((vLat - lat) * 111, 2) +
            Math.pow((vLng - lng) * 111 * Math.cos(lat * Math.PI / 180), 2)
          );
          return distance <= radiusKm;
        })
        .map(v => enrichVendorImages(adaptMockVendor(v)));
    }

    // Using PostGIS for proper geospatial queries in Supabase
    const rpcMethod = await getSupabaseRpc();
    if (!rpcMethod) {
      // Fallback to mock data
      return mockDatabase.vendors
        .filter(v => {
          const vLat = v.location.coordinates[1];
          const vLng = v.location.coordinates[0];
          const distance = Math.sqrt(
            Math.pow((vLat - lat) * 111, 2) +
            Math.pow((vLng - lng) * 111 * Math.cos(lat * Math.PI / 180), 2)
          );
          return distance <= radiusKm;
        })
        .map(v => enrichVendorImages(adaptMockVendor(v)));
    }

    const { data } = await rpcMethod('get_nearby_vendors', {
      user_lat: lat,
      user_lng: lng,
      radius_km: radiusKm,
    });

    return data || [];
  },
};

// ============== PRODUCT SERVICE ==============
export const productService = {
  getAll: async (): Promise<Product[]> => {
    if (!isSupabaseConfigured()) {
      return mockDatabase.products
        .filter(p => p.is_active)
        .map(p => adaptMockProduct(p));
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return mockDatabase.products
        .filter(p => p.is_active)
        .map(p => adaptMockProduct(p));
    }

    const { data } = await fromMethod('products')
      .select('*')
      .eq('is_active', true)
      .order('is_featured', { ascending: false });

    return data || [];
  },

  getFeatured: async (userRegion?: string, limit: number = 20): Promise<Product[]> => {
    if (!isSupabaseConfigured()) {
      // Use ranking system for mock data
      const featured = getFeaturedProducts(mockDatabase.products as MockProduct[], userRegion, limit);
      return featured.map((p: any) => adaptMockProduct(p));
    }

    // Fetch all active products and rank them
    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      const featured = getFeaturedProducts(mockDatabase.products as MockProduct[], userRegion, limit);
      return featured.map((p: any) => adaptMockProduct(p));
    }

    const { data } = await fromMethod('products')
      .select('*')
      .eq('is_active', true);

    if (!data || data.length === 0) return [];

    // Convert Supabase products to mock format for ranking
    const productsForRanking = data.map((p: any) => ({
      ...p,
      image_urls: Array.isArray(p.image_urls) ? p.image_urls : [p.image_urls || ''],
      certifications: Array.isArray(p.certifications) ? p.certifications : [],
    })) as unknown as MockProduct[];

    const ranked = getFeaturedProducts(productsForRanking, userRegion, limit);

    // Convert back to Supabase format
    return ranked.map((p: any) => adaptMockProduct(p));
  },

  getById: async (id: string): Promise<Product | null> => {
    if (!isSupabaseConfigured()) {
      const product = mockDatabase.products.find(p => p.id === id);
      if (!product) return null;
      return adaptMockProduct(product);
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      const product = mockDatabase.products.find(p => p.id === id);
      if (!product) return null;
      return adaptMockProduct(product);
    }

    const { data } = await fromMethod('products')
      .select('*')
      .eq('id', id)
      .single();

    return data;
  },

  getBySlug: async (slug: string): Promise<Product | null> => {
    // Import slug utilities
    const { decodeProductSlug, isValidProductSlug } = await import('../lib/slugUtils');

    // Check if slug is a valid Base62 slug (for UUIDs) or a legacy ID
    if (isValidProductSlug(slug)) {
      try {
        // Try to decode the Base62 slug to UUID
        const uuid = decodeProductSlug(slug);

        // Use the decoded UUID to fetch the product
        return await productService.getById(uuid);
      } catch (error) {
        console.error('Error decoding product slug:', error);
        // Fall through to try as legacy ID
      }
    }

    // Fallback: try to fetch by slug as if it's a legacy ID (for backward compatibility)
    // This handles cases where product IDs are not UUIDs (e.g., "prd_011")
    return await productService.getById(slug);
  },

  getByVendor: async (vendorId: string): Promise<Product[]> => {
    if (!isSupabaseConfigured()) {
      return mockDatabase.products
        .filter(p => p.vendor_id === vendorId && p.is_active)
        .map(p => adaptMockProduct(p));
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return mockDatabase.products
        .filter(p => p.vendor_id === vendorId && p.is_active)
        .map(p => adaptMockProduct(p));
    }

    const { data } = await fromMethod('products')
      .select('*')
      .eq('vendor_id', vendorId)
      .eq('is_active', true);

    return data || [];
  },

  getByCategory: async (category: string): Promise<Product[]> => {
    if (!isSupabaseConfigured()) {
      return mockDatabase.products
        .filter(p => p.category.toLowerCase() === category.toLowerCase() && p.is_active)
        .map(p => adaptMockProduct(p));
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return mockDatabase.products
        .filter(p => p.category.toLowerCase() === category.toLowerCase() && p.is_active)
        .map(p => adaptMockProduct(p));
    }

    const { data } = await fromMethod('products')
      .select('*')
      .ilike('category', category)
      .eq('is_active', true);

    return data || [];
  },

  search: async (query: string): Promise<Product[]> => {
    if (!isSupabaseConfigured()) {
      const lowerQuery = query.toLowerCase();
      return mockDatabase.products
        .filter(p =>
          p.is_active && (
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery)
          )
        )
        .map(p => adaptMockProduct(p));
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      const lowerQuery = query.toLowerCase();
      return mockDatabase.products
        .filter(p =>
          p.is_active && (
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery)
          )
        )
        .map(p => adaptMockProduct(p));
    }

    const { data } = await fromMethod('products')
      .select('*')
      .eq('is_active', true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`);

    return data || [];
  },
};

// ============== ORDER SERVICE ==============
export const orderService = {
  create: async (orderData: Partial<Order>): Promise<Order | null> => {
    if (!isSupabaseConfigured()) {
      // Return mock order
      return {
        id: 'order_' + Date.now(),
        ...orderData,
        status: 'pending',
        payment_status: 'pending',
        qr_code: `QR_${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Order;
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return {
        id: 'order_' + Date.now(),
        ...orderData,
        status: 'pending',
        payment_status: 'pending',
        qr_code: `QR_${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Order;
    }

    const { data, error } = await fromMethod('orders')
      .insert({
        ...orderData,
        qr_code: qrCodeGenerator.generateOrderQR(orderData.id || `temp_${Date.now()}`),
      })
      .select()
      .single();

    return data;
  },

  getByUser: async (userId: string): Promise<Order[]> => {
    if (!isSupabaseConfigured()) {
      // Return mock orders
      return (mockDatabase.orders as any[])?.filter(o => o.user_id === userId) || [];
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return (mockDatabase.orders as any[])?.filter(o => o.user_id === userId) || [];
    }

    const { data } = await fromMethod('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return data || [];
  },

  getById: async (orderId: string): Promise<Order | null> => {
    if (!isSupabaseConfigured()) {
      return (mockDatabase.orders as any[])?.find(o => o.id === orderId) || null;
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return (mockDatabase.orders as any[])?.find(o => o.id === orderId) || null;
    }

    const { data } = await fromMethod('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    return data;
  },

  updateStatus: async (orderId: string, status: Order['status']): Promise<Order | null> => {
    if (!isSupabaseConfigured()) {
      return null;
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return null;
    }

    const { data } = await fromMethod('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single();

    return data;
  },

  verifyQRCode: async (qrCode: string): Promise<Order | null> => {
    let searchCode = qrCode;
    let orderIdFromQr = null;

    // Check if it's a Zora Market URL and extract ID
    if (qrCode.startsWith('zoramarket://')) {
      try {
        const url = qrCode.replace('zoramarket://', '');
        const [path] = url.split('?');
        const [type, id] = path.split('/');

        if (type === 'order' && id) {
          orderIdFromQr = id;
        }
      } catch (e) {
        console.warn('Failed to parse QR URI in service:', e);
      }
    }

    if (!isSupabaseConfigured()) {
      return (mockDatabase.orders as any[])?.find(o =>
        o.qr_code === qrCode ||
        o.qr_code_token === qrCode ||
        (orderIdFromQr && o.id === orderIdFromQr)
      ) || null;
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return (mockDatabase.orders as any[])?.find(o =>
        o.qr_code === qrCode ||
        o.qr_code_token === qrCode ||
        (orderIdFromQr && o.id === orderIdFromQr)
      ) || null;
    }

    // If we extracted an ID, try fetching by ID directly first (most reliable)
    if (orderIdFromQr) {
      const { data } = await fromMethod('orders')
        .select('*')
        .eq('id', orderIdFromQr)
        .single();

      if (data) return data;
    }

    // Fallback to strict code match
    const { data } = await fromMethod('orders')
      .select('*')
      .eq('qr_code', qrCode)
      .single();

    return data;
  },
};

// ============== REVIEW SERVICE ==============
export const reviewService = {
  getByProduct: async (productId: string): Promise<Review[]> => {
    if (!isSupabaseConfigured()) {
      return (mockDatabase.reviews as any[])?.filter(r => r.product_id === productId).map(r => ({
        ...r,
        comment: r.content || r.comment || '',
      })) || [];
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return (mockDatabase.reviews as any[])?.filter(r => r.product_id === productId).map(r => ({
        ...r,
        comment: r.content || r.comment || '',
      })) || [];
    }

    // Fetch reviews first
    const { data: reviews, error: reviewsError } = await fromMethod('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (reviewsError) {
      console.error('Error fetching product reviews:', reviewsError);
      return [];
    }

    if (!reviews || reviews.length === 0) {
      return [];
    }

    // Fetch user profiles for these reviews
    const userIds = [...new Set(reviews.map((r: any) => r.user_id).filter(Boolean))];
    let profilesMap: Record<string, any> = {};

    if (userIds.length > 0) {
      try {
        const { data: profiles } = await fromMethod('profiles')
          .select('id, full_name, avatar_url')
          .in('id', userIds);

        if (profiles) {
          profilesMap = profiles.reduce((acc: Record<string, any>, profile: any) => {
            acc[profile.id] = profile;
            return acc;
          }, {});
        }
      } catch (profileError) {
        console.warn('Error fetching profiles for reviews (non-critical):', profileError);
        // Continue without profile data
      }
    }

    // Transform reviews with profile data
    return reviews.map((review: any) => {
      const profile = profilesMap[review.user_id];
      return {
        ...review,
        user_name: profile?.full_name || 'Anonymous',
        user_avatar: profile?.avatar_url || null,
        content: review.content || '',
        comment: review.content || review.comment || '',
      };
    });
  },

  getByVendor: async (vendorId: string): Promise<Review[]> => {
    if (!isSupabaseConfigured()) {
      return (mockDatabase.reviews as any[])?.filter(r => r.vendor_id === vendorId).map(r => ({
        ...r,
        comment: r.content || r.comment || '',
      })) || [];
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return (mockDatabase.reviews as any[])?.filter(r => r.vendor_id === vendorId).map(r => ({
        ...r,
        comment: r.content || r.comment || '',
      })) || [];
    }

    // Fetch reviews first
    const { data: reviews, error: reviewsError } = await fromMethod('reviews')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });

    if (reviewsError) {
      console.error('Error fetching vendor reviews:', reviewsError);
      return [];
    }

    if (!reviews || reviews.length === 0) {
      return [];
    }

    // Fetch profiles for all unique user_ids
    const userIds = [...new Set(reviews.map((r: any) => r.user_id).filter(Boolean))];
    let profilesMap: Record<string, any> = {};

    if (userIds.length > 0) {
      try {
        const { data: profiles } = await fromMethod('profiles')
          .select('id, full_name, avatar_url')
          .in('id', userIds);

        if (profiles) {
          profilesMap = profiles.reduce((acc: Record<string, any>, profile: any) => {
            acc[profile.id] = profile;
            return acc;
          }, {});
        }
      } catch (profileError) {
        console.warn('Error fetching profiles for reviews (non-critical):', profileError);
        // Continue without profile data
      }
    }

    // Transform reviews with profile data
    return reviews.map((review: any) => {
      const profile = profilesMap[review.user_id];
      return {
        ...review,
        user_name: profile?.full_name || 'Anonymous',
        user_avatar: profile?.avatar_url || null,
        content: review.content || '',
        comment: review.content || review.comment || '',
      };
    });
  },

  create: async (reviewData: Partial<Review>): Promise<Review | null> => {
    if (!isSupabaseConfigured()) {
      return {
        id: 'review_' + Date.now(),
        ...reviewData,
        helpful_count: 0,
        verified_purchase: true,
        created_at: new Date().toISOString(),
      } as Review;
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return {
        id: 'review_' + Date.now(),
        ...reviewData,
        helpful_count: 0,
        verified_purchase: true,
        created_at: new Date().toISOString(),
      } as Review;
    }

    const { data } = await fromMethod('reviews')
      .insert(reviewData)
      .select()
      .single();

    return data;
  },
};

// Mock promo codes helper
const getMockPromoCodes = (): Record<string, PromoCode> => ({
  'WELCOME10': {
    id: 'promo_1',
    code: 'WELCOME10',
    type: 'percentage',
    discount_type: 'percentage',
    value: 10,
    discount_value: 10,
    min_order: 20,
    max_uses: 1000,
    current_uses: 500,
    usage_count: 500,
    valid_from: '2024-01-01',
    valid_until: '2025-12-31',
    is_active: true,
    created_at: '2024-01-01',
  },
  'FREESHIP': {
    id: 'promo_2',
    code: 'FREESHIP',
    type: 'free_delivery',
    discount_type: 'free_delivery',
    value: 0,
    discount_value: 0,
    min_order: 30,
    max_uses: undefined,
    current_uses: 100,
    usage_count: 100,
    valid_from: '2024-01-01',
    valid_until: '2025-12-31',
    is_active: true,
    created_at: '2024-01-01',
  },
});

// ============== DISPUTE SERVICE ==============
export interface Dispute {
  id: string;
  order_id: string;
  user_id: string;
  issue_type: 'missing' | 'wrong' | 'damaged' | 'quality' | 'other';
  affected_items: any; // JSONB array
  description: string;
  preferred_resolution: 'refund' | 'replacement' | 'partial_refund' | 'store_credit' | 'other';
  evidence_images: string[];
  status: 'pending' | 'under_review' | 'resolved' | 'rejected' | 'closed';
  resolution?: string;
  resolution_notes?: string;
  resolved_at?: string;
  resolved_by?: string;
  created_at: string;
  updated_at: string;
}

export const disputeService = {
  create: async (disputeData: Partial<Dispute>): Promise<Dispute | null> => {
    if (!isSupabaseConfigured()) {
      return {
        id: 'dispute_' + Date.now(),
        ...disputeData,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Dispute;
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return {
        id: 'dispute_' + Date.now(),
        ...disputeData,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Dispute;
    }

    const { data, error } = await fromMethod('disputes')
      .insert(disputeData)
      .select()
      .single();

    if (error) {
      console.error('Error creating dispute:', error);
      return null;
    }

    return data;
  },

  getById: async (disputeId: string): Promise<Dispute | null> => {
    if (!isSupabaseConfigured()) {
      return null;
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return null;
    }

    const { data } = await fromMethod('disputes')
      .select('*')
      .eq('id', disputeId)
      .single();

    return data;
  },

  getByOrder: async (orderId: string): Promise<Dispute | null> => {
    if (!isSupabaseConfigured()) {
      return null;
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return null;
    }

    const { data } = await fromMethod('disputes')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return data;
  },

  getByUser: async (userId: string): Promise<Dispute[]> => {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return [];
    }

    const { data } = await fromMethod('disputes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return data || [];
  },

  updateStatus: async (
    disputeId: string,
    status: Dispute['status'],
    resolution?: string,
    resolutionNotes?: string
  ): Promise<Dispute | null> => {
    if (!isSupabaseConfigured()) {
      return null;
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return null;
    }

    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (resolution) {
      updateData.resolution = resolution;
    }

    if (resolutionNotes) {
      updateData.resolution_notes = resolutionNotes;
    }

    if (status === 'resolved' || status === 'closed') {
      updateData.resolved_at = new Date().toISOString();
    }

    const { data } = await fromMethod('disputes')
      .update(updateData)
      .eq('id', disputeId)
      .select()
      .single();

    return data;
  },
};

// ============== PROMO CODE SERVICE ==============
export const promoCodeService = {
  validate: async (code: string): Promise<PromoCode | null> => {
    if (!isSupabaseConfigured()) {
      // Mock promo codes
      const mockCodes = getMockPromoCodes();
      return mockCodes[code.toUpperCase()] || null;
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      // Return mock promo codes
      const mockCodes = getMockPromoCodes();
      return mockCodes[code.toUpperCase()] || null;
    }

    const now = new Date().toISOString();
    const { data } = await fromMethod('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .lte('valid_from', now)
      .gte('valid_until', now)
      .single();

    return data;
  },

  apply: async (code: string): Promise<{ success: boolean; discount: number; message: string }> => {
    const promo = await promoCodeService.validate(code);

    if (!promo) {
      return { success: false, discount: 0, message: 'Invalid or expired promo code' };
    }

    if (promo.max_uses && (promo.current_uses || 0) >= promo.max_uses) {
      return { success: false, discount: 0, message: 'Promo code usage limit reached' };
    }

    // Calculate discount based on type
    let discount = 0;
    let message = '';

    switch (promo.type) {
      case 'percentage':
        discount = promo.value || 0; // Will be calculated as percentage of subtotal
        message = `${promo.value}% discount applied!`;
        break;
      case 'fixed':
        discount = promo.value || 0;
        message = `£${(promo.value || 0).toFixed(2)} discount applied!`;
        break;
      case 'free_delivery':
        discount = 0; // Delivery fee will be set to 0
        message = 'Free delivery applied!';
        break;
    }

    return { success: true, discount, message };
  },
};

// Export default service object
export default {
  auth: authService,
  vendors: vendorService,
  products: productService,
  orders: orderService,
  reviews: reviewService,
  promoCodes: promoCodeService,
  disputes: disputeService,
};
