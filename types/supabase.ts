/**
 * Supabase Database Types
 * These types define the structure of your Supabase database tables
 * 
 * To generate these automatically from your Supabase project:
 * npx supabase gen types typescript --project-id your-project-id > types/supabase.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          phone: string | null;
          membership_tier: 'bronze' | 'silver' | 'gold' | 'platinum';
          zora_credits: number;
          loyalty_points: number;
          cultural_interests: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          membership_tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
          zora_credits?: number;
          loyalty_points?: number;
          cultural_interests?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          membership_tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
          zora_credits?: number;
          loyalty_points?: number;
          cultural_interests?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      vendors: {
        Row: {
          id: string;
          user_id: string;
          shop_name: string;
          description: string | null;
          logo_url: string | null;
          cover_image_url: string | null;
          address: string;
          latitude: number;
          longitude: number;
          coverage_radius_km: number;
          is_verified: boolean;
          rating: number;
          review_count: number;
          cultural_specialties: string[];
          categories: string[];
          delivery_time_min: number;
          delivery_time_max: number;
          delivery_fee: number;
          minimum_order: number;
          is_featured: boolean;
          badge: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          shop_name: string;
          description?: string | null;
          logo_url?: string | null;
          cover_image_url?: string | null;
          address: string;
          latitude: number;
          longitude: number;
          coverage_radius_km?: number;
          is_verified?: boolean;
          rating?: number;
          review_count?: number;
          cultural_specialties?: string[];
          categories?: string[];
          delivery_time_min?: number;
          delivery_time_max?: number;
          delivery_fee?: number;
          minimum_order?: number;
          is_featured?: boolean;
          badge?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          shop_name?: string;
          description?: string | null;
          logo_url?: string | null;
          cover_image_url?: string | null;
          address?: string;
          latitude?: number;
          longitude?: number;
          coverage_radius_km?: number;
          is_verified?: boolean;
          rating?: number;
          review_count?: number;
          cultural_specialties?: string[];
          categories?: string[];
          delivery_time_min?: number;
          delivery_time_max?: number;
          delivery_fee?: number;
          minimum_order?: number;
          is_featured?: boolean;
          badge?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          vendor_id: string;
          name: string;
          description: string | null;
          price: number;
          unit_price_label: string | null;
          stock_quantity: number;
          category: string;
          cultural_region: string | null;
          image_urls: string[];
          weight: string | null;
          certifications: string[];
          nutrition: Json | null;
          heritage_story: string | null;
          is_active: boolean;
          is_featured: boolean;
          badge: string | null;
          rating: number;
          review_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          vendor_id: string;
          name: string;
          description?: string | null;
          price: number;
          unit_price_label?: string | null;
          stock_quantity?: number;
          category: string;
          cultural_region?: string | null;
          image_urls?: string[];
          weight?: string | null;
          certifications?: string[];
          nutrition?: Json | null;
          heritage_story?: string | null;
          is_active?: boolean;
          is_featured?: boolean;
          badge?: string | null;
          rating?: number;
          review_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          vendor_id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          unit_price_label?: string | null;
          stock_quantity?: number;
          category?: string;
          cultural_region?: string | null;
          image_urls?: string[];
          weight?: string | null;
          certifications?: string[];
          nutrition?: Json | null;
          heritage_story?: string | null;
          is_active?: boolean;
          is_featured?: boolean;
          badge?: string | null;
          rating?: number;
          review_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          vendor_id: string;
          status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
          items: Json;
          subtotal: number;
          delivery_fee: number;
          service_fee: number;
          discount: number;
          total: number;
          payment_method: string;
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
          delivery_address: Json;
          delivery_instructions: string | null;
          estimated_delivery: string | null;
          actual_delivery: string | null;
          driver_id: string | null;
          tracking_url: string | null;
          qr_code: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          vendor_id: string;
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
          items: Json;
          subtotal: number;
          delivery_fee: number;
          service_fee: number;
          discount?: number;
          total: number;
          payment_method: string;
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
          delivery_address: Json;
          delivery_instructions?: string | null;
          estimated_delivery?: string | null;
          actual_delivery?: string | null;
          driver_id?: string | null;
          tracking_url?: string | null;
          qr_code?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          vendor_id?: string;
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
          items?: Json;
          subtotal?: number;
          delivery_fee?: number;
          service_fee?: number;
          discount?: number;
          total?: number;
          payment_method?: string;
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
          delivery_address?: Json;
          delivery_instructions?: string | null;
          estimated_delivery?: string | null;
          actual_delivery?: string | null;
          driver_id?: string | null;
          tracking_url?: string | null;
          qr_code?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          product_id: string | null;
          vendor_id: string | null;
          rating: number;
          title: string | null;
          content: string | null;
          images: string[];
          helpful_count: number;
          verified_purchase: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id?: string | null;
          vendor_id?: string | null;
          rating: number;
          title?: string | null;
          content?: string | null;
          images?: string[];
          helpful_count?: number;
          verified_purchase?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string | null;
          vendor_id?: string | null;
          rating?: number;
          title?: string | null;
          content?: string | null;
          images?: string[];
          helpful_count?: number;
          verified_purchase?: boolean;
          created_at?: string;
        };
      };
      promo_codes: {
        Row: {
          id: string;
          code: string;
          type: 'percentage' | 'fixed' | 'free_delivery';
          value: number;
          min_order: number;
          max_uses: number | null;
          current_uses: number;
          valid_from: string;
          valid_until: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          type: 'percentage' | 'fixed' | 'free_delivery';
          value: number;
          min_order?: number;
          max_uses?: number | null;
          current_uses?: number;
          valid_from: string;
          valid_until: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          type?: 'percentage' | 'fixed' | 'free_delivery';
          value?: number;
          min_order?: number;
          max_uses?: number | null;
          current_uses?: number;
          valid_from?: string;
          valid_until?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Convenience types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Specific table types for easier access
export type User = Tables<'users'>;
export type Vendor = Tables<'vendors'>;
export type Product = Tables<'products'>;
export type Order = Tables<'orders'>;
export type Review = Tables<'reviews'>;
export type PromoCode = Tables<'promo_codes'>;
