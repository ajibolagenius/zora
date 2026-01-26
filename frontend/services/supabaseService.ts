/**
 * Supabase Data Service
 * Replaces FastAPI/MongoDB backend with direct Supabase client calls
 * 
 * This service provides all data operations using Supabase.
 * For development/demo purposes, it falls back to mock data when Supabase is not configured.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User, Vendor, Product, Order, Review, PromoCode } from '../types/supabase';
import mockDatabase from '../data/mock_database.json';
import { getFeaturedVendors, getFeaturedProducts } from './rankingService';
import type { Vendor as MockVendor, Product as MockProduct } from './mockDataService';
import { encodeProductSlug } from '../lib/slugUtils';

/**
 * Safely gets the Supabase client's from method
 * Returns null if Supabase is not configured or not initialized
 */
function getSupabaseFrom() {
  if (!isSupabaseConfigured()) {
    return null;
  }
  const fromMethod = supabase.from;
  if (!fromMethod) {
    return null;
  }
  return fromMethod;
}

/**
 * Safely gets the Supabase client's rpc method
 * Returns null if Supabase is not configured or not initialized
 */
function getSupabaseRpc() {
  if (!isSupabaseConfigured()) {
    return null;
  }
  const rpcMethod = (supabase as any).rpc;
  if (!rpcMethod) {
    return null;
  }
  return rpcMethod;
}

// ============== AUTH SERVICE ==============
export const authService = {
  // Sign up with email
  signUp: async (email: string, password: string, name: string) => {
    if (!isSupabaseConfigured()) {
      // Mock signup
      return { user: { id: 'mock_user_' + Date.now(), email, name }, error: null };
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });
    
    if (data.user && !error) {
      // Create user profile
      const fromMethod = getSupabaseFrom();
      if (fromMethod) {
        await fromMethod('users').insert({
          id: data.user.id,
          email,
          name,
          membership_tier: 'bronze',
          zora_credits: 5.0,
          loyalty_points: 100,
          cultural_interests: [],
        });
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
    
    const { data, error } = await supabase.auth.signInWithPassword({
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
    
    const { data, error } = await supabase.auth.signInWithOAuth({
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
    
    const { error } = await supabase.auth.signOut();
    return { error };
  },
  
  // Get current user
  getCurrentUser: async () => {
    if (!isSupabaseConfigured()) {
      return null;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
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
    
    const { data, error } = await supabase
      .from('users')
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
    
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    return { data, error };
  },
};

// ============== VENDOR SERVICE ==============
export const vendorService = {
  getAll: async (): Promise<Vendor[]> => {
    if (!isSupabaseConfigured()) {
      // Return mock vendors with adapted structure
      return mockDatabase.vendors.map(v => ({
        ...v,
        latitude: v.location.coordinates[1],
        longitude: v.location.coordinates[0],
        updated_at: v.created_at,
      })) as unknown as Vendor[];
    }
    
    const fromMethod = getSupabaseFrom();
    if (!fromMethod) {
      // Fallback to mock data if Supabase not available
      return mockDatabase.vendors.map(v => ({
        ...v,
        latitude: v.location.coordinates[1],
        longitude: v.location.coordinates[0],
        updated_at: v.created_at,
      })) as unknown as Vendor[];
    }
    
    const { data, error } = await fromMethod('vendors')
      .select('*')
      .order('is_featured', { ascending: false });
    
    return data || [];
  },
  
  getFeatured: async (userRegion?: string, limit: number = 10): Promise<Vendor[]> => {
    if (!isSupabaseConfigured()) {
      // Use ranking system for mock data
      const featured = getFeaturedVendors(mockDatabase.vendors as MockVendor[], userRegion, limit);
      return featured.map(v => ({
        ...v,
        latitude: v.location.coordinates[1],
        longitude: v.location.coordinates[0],
        updated_at: v.created_at,
      })) as unknown as Vendor[];
    }
    
    // Fetch all vendors and rank them
    const fromMethod = getSupabaseFrom();
    if (!fromMethod) {
      const featured = getFeaturedVendors(mockDatabase.vendors as MockVendor[], userRegion, limit);
      return featured.map(v => ({
        ...v,
        latitude: v.location.coordinates[1],
        longitude: v.location.coordinates[0],
        updated_at: v.created_at,
      })) as unknown as Vendor[];
    }
    
    const { data } = await fromMethod('vendors')
      .select('*');
    
    if (!data || data.length === 0) return [];
    
    // Convert Supabase vendors to mock format for ranking, then convert back
    const vendorsForRanking = data.map(v => ({
      ...v,
      location: {
        type: 'Point',
        coordinates: [v.longitude, v.latitude],
      },
      cultural_specialties: v.cultural_specialties || [],
      categories: v.categories || [],
    })) as unknown as MockVendor[];
    
    const ranked = getFeaturedVendors(vendorsForRanking, userRegion, limit);
    
    // Convert back to Supabase format
    return ranked.map(v => ({
      ...v,
      latitude: v.location.coordinates[1],
      longitude: v.location.coordinates[0],
      updated_at: v.created_at || new Date().toISOString(),
    })) as unknown as Vendor[];
  },
  
  getById: async (id: string): Promise<Vendor | null> => {
    if (!isSupabaseConfigured()) {
      const vendor = mockDatabase.vendors.find(v => v.id === id);
      if (!vendor) return null;
      return {
        ...vendor,
        latitude: vendor.location.coordinates[1],
        longitude: vendor.location.coordinates[0],
        updated_at: vendor.created_at,
      } as unknown as Vendor;
    }
    
    const fromMethod = getSupabaseFrom();
    if (!fromMethod) {
      const vendor = mockDatabase.vendors.find(v => v.id === id);
      if (!vendor) return null;
      return {
        ...vendor,
        latitude: vendor.location.coordinates[1],
        longitude: vendor.location.coordinates[0],
        updated_at: vendor.created_at,
      } as unknown as Vendor;
    }
    
    const { data } = await fromMethod('vendors')
      .select('*')
      .eq('id', id)
      .single();
    
    return data;
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
      return {
        ...vendor,
        latitude: vendor.location.coordinates[1],
        longitude: vendor.location.coordinates[0],
        updated_at: vendor.created_at,
      } as unknown as Vendor;
    }
    
    // Check if supabase client is available
    const fromMethod = supabase.from;
    if (!fromMethod) {
      console.warn('Supabase client not initialized, falling back to mock data');
      const vendor = mockDatabase.vendors.find(v => {
        const vendorSlug = (v as any).slug || 
          v.shop_name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        return vendorSlug === slug || v.id === slug;
      });
      if (!vendor) return null;
      return {
        ...vendor,
        latitude: vendor.location.coordinates[1],
        longitude: vendor.location.coordinates[0],
        updated_at: vendor.created_at,
      } as unknown as Vendor;
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
    
    const fromMethod = getSupabaseFrom();
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
        .map(v => ({
          ...v,
          latitude: v.location.coordinates[1],
          longitude: v.location.coordinates[0],
          updated_at: v.created_at,
        })) as unknown as Vendor[];
    }
    
    // Using PostGIS for proper geospatial queries in Supabase
    const rpcMethod = getSupabaseRpc();
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
        .map(v => ({
          ...v,
          latitude: v.location.coordinates[1],
          longitude: v.location.coordinates[0],
          updated_at: v.created_at,
        })) as unknown as Vendor[];
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
        .map(p => ({ ...p, updated_at: p.created_at })) as unknown as Product[];
    }
    
    const fromMethod = getSupabaseFrom();
    if (!fromMethod) {
      return mockDatabase.products
        .filter(p => p.is_active)
        .map(p => ({ ...p, updated_at: p.created_at })) as unknown as Product[];
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
      return featured.map(p => ({ ...p, updated_at: p.created_at })) as unknown as Product[];
    }
    
    // Fetch all active products and rank them
    const fromMethod = getSupabaseFrom();
    if (!fromMethod) {
      const featured = getFeaturedProducts(mockDatabase.products as MockProduct[], userRegion, limit);
      return featured.map(p => ({ ...p, updated_at: p.created_at })) as unknown as Product[];
    }
    
    const { data } = await fromMethod('products')
      .select('*')
      .eq('is_active', true);
    
    if (!data || data.length === 0) return [];
    
    // Convert Supabase products to mock format for ranking
    const productsForRanking = data.map(p => ({
      ...p,
      image_urls: Array.isArray(p.image_urls) ? p.image_urls : [p.image_urls || ''],
      certifications: Array.isArray(p.certifications) ? p.certifications : [],
    })) as unknown as MockProduct[];
    
    const ranked = getFeaturedProducts(productsForRanking, userRegion, limit);
    
    // Convert back to Supabase format
    return ranked.map(p => ({ ...p, updated_at: p.created_at || new Date().toISOString() })) as unknown as Product[];
  },
  
  getById: async (id: string): Promise<Product | null> => {
    if (!isSupabaseConfigured()) {
      const product = mockDatabase.products.find(p => p.id === id);
      if (!product) return null;
      return { ...product, updated_at: product.created_at } as unknown as Product;
    }
    
    const fromMethod = getSupabaseFrom();
    if (!fromMethod) {
      const product = mockDatabase.products.find(p => p.id === id);
      if (!product) return null;
      return { ...product, updated_at: product.created_at } as unknown as Product;
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
        .map(p => ({ ...p, updated_at: p.created_at })) as unknown as Product[];
    }
    
    const fromMethod = getSupabaseFrom();
    if (!fromMethod) {
      return mockDatabase.products
        .filter(p => p.vendor_id === vendorId && p.is_active)
        .map(p => ({ ...p, updated_at: p.created_at })) as unknown as Product[];
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
        .map(p => ({ ...p, updated_at: p.created_at })) as unknown as Product[];
    }
    
    const fromMethod = getSupabaseFrom();
    if (!fromMethod) {
      return mockDatabase.products
        .filter(p => p.category.toLowerCase() === category.toLowerCase() && p.is_active)
        .map(p => ({ ...p, updated_at: p.created_at })) as unknown as Product[];
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
        .map(p => ({ ...p, updated_at: p.created_at })) as unknown as Product[];
    }
    
    const fromMethod = getSupabaseFrom();
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
        .map(p => ({ ...p, updated_at: p.created_at })) as unknown as Product[];
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
    
    const { data, error } = await supabase
      .from('orders')
      .insert({
        ...orderData,
        qr_code: `QR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      })
      .select()
      .single();
    
    return data;
  },
  
  getByUser: async (userId: string): Promise<Order[]> => {
    if (!isSupabaseConfigured()) {
      // Return mock orders
      return mockDatabase.orders?.filter(o => o.user_id === userId) || [];
    }
    
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    return data || [];
  },
  
  getById: async (orderId: string): Promise<Order | null> => {
    if (!isSupabaseConfigured()) {
      return mockDatabase.orders?.find(o => o.id === orderId) || null;
    }
    
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
    
    return data;
  },
  
  updateStatus: async (orderId: string, status: Order['status']): Promise<Order | null> => {
    if (!isSupabaseConfigured()) {
      return null;
    }
    
    const { data } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single();
    
    return data;
  },
  
  verifyQRCode: async (qrCode: string): Promise<Order | null> => {
    if (!isSupabaseConfigured()) {
      return mockDatabase.orders?.find(o => o.qr_code === qrCode) || null;
    }
    
    const { data } = await supabase
      .from('orders')
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
      return mockDatabase.reviews?.filter(r => r.product_id === productId) || [];
    }
    
    const { data } = await supabase
      .from('reviews')
      .select('*, users(name, avatar_url)')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });
    
    return data || [];
  },
  
  getByVendor: async (vendorId: string): Promise<Review[]> => {
    if (!isSupabaseConfigured()) {
      return mockDatabase.reviews?.filter(r => r.vendor_id === vendorId) || [];
    }
    
    const { data } = await supabase
      .from('reviews')
      .select('*, users(name, avatar_url)')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });
    
    return data || [];
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
    
    const { data } = await supabase
      .from('reviews')
      .insert(reviewData)
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
      const mockCodes: Record<string, PromoCode> = {
        'WELCOME10': {
          id: 'promo_1',
          code: 'WELCOME10',
          type: 'percentage',
          value: 10,
          min_order: 20,
          max_uses: 1000,
          current_uses: 500,
          valid_from: '2024-01-01',
          valid_until: '2025-12-31',
          is_active: true,
          created_at: '2024-01-01',
        },
        'FREESHIP': {
          id: 'promo_2',
          code: 'FREESHIP',
          type: 'free_delivery',
          value: 0,
          min_order: 30,
          max_uses: null,
          current_uses: 100,
          valid_from: '2024-01-01',
          valid_until: '2025-12-31',
          is_active: true,
          created_at: '2024-01-01',
        },
      };
      return mockCodes[code.toUpperCase()] || null;
    }
    
    const now = new Date().toISOString();
    const { data } = await supabase
      .from('promo_codes')
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
    
    if (promo.max_uses && promo.current_uses >= promo.max_uses) {
      return { success: false, discount: 0, message: 'Promo code usage limit reached' };
    }
    
    // Calculate discount based on type
    let discount = 0;
    let message = '';
    
    switch (promo.type) {
      case 'percentage':
        discount = promo.value; // Will be calculated as percentage of subtotal
        message = `${promo.value}% discount applied!`;
        break;
      case 'fixed':
        discount = promo.value;
        message = `£${promo.value.toFixed(2)} discount applied!`;
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
};
