// Zora African Market - Type Definitions

// User Types
export interface User {
  user_id: string;
  email: string;
  name: string;
  picture?: string;
  phone?: string;
  membership_tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  zora_credits: number;
  loyalty_points: number;
  referral_code?: string;
  cultural_interests: string[];
  created_at: string;
}

// Address Types
export interface Address {
  id: string;
  user_id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
  is_default: boolean;
  instructions?: string;
}

// Vendor Types
export interface OpeningHours {
  day: string;
  open: string;
  close: string;
  is_closed: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  description: string;
  cover_image: string;
  logo_url: string;
  category: string;
  regions: string[];
  rating: number;
  review_count: number;
  is_verified: boolean;
  tag?: string;
  distance?: string;
  delivery_time: string;
  delivery_fee: number;
  min_order: number;
  address?: string;
  opening_hours: OpeningHours[];
  is_open: boolean;
}

// Product Types
export interface NutritionInfo {
  serving_size?: string;
  calories?: number;
  protein?: string;
  carbs?: string;
  fat?: string;
  fiber?: string;
  sodium?: string;
}

export interface Product {
  id: string;
  vendor_id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  currency: string;
  image_url: string;
  images: string[];
  category: string;
  subcategory?: string;
  region: string;
  weight?: string;
  unit?: string;
  badge?: string;
  rating: number;
  review_count: number;
  in_stock: boolean;
  stock_quantity: number;
  attributes: Record<string, string>;
  nutrition_info?: NutritionInfo;
  origin?: string;
  certifications: string[];
  vendor?: Vendor;
}

// Cart Types
export interface CartItem {
  product_id: string;
  vendor_id: string;
  quantity: number;
  variant?: string;
  product?: Product;
  vendor?: Vendor;
}

export interface CartVendor {
  id: string;
  name: string;
  logo_url: string;
  /**
   * Human-readable shipping origin, typically derived from vendor.address
   * e.g. "Brixton" or "Lagos"
   */
  location?: string;
  delivery_time: string;
  delivery_fee: number;
  items: CartItem[];
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  vendors: CartVendor[];
  subtotal: number;
  delivery_fee: number;
  service_fee: number;
  discount: number;
  total: number;
  promo_code?: string;
}

// Order Types
export interface OrderItem {
  product_id: string;
  vendor_id: string;
  name: string;
  image_url: string;
  price: number;
  quantity: number;
  variant?: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  service_fee: number;
  discount: number;
  total: number;
  currency: string;
  delivery_address?: Address;
  delivery_option: 'delivery' | 'pickup';
  payment_method: string;
  payment_intent_id?: string;
  created_at: string;
  estimated_delivery?: string;
  delivered_at?: string;
}

// Review Types
export interface Review {
  id: string;
  user_id: string;
  user_name: string;
  user_picture?: string;
  product_id?: string;
  vendor_id?: string;
  rating: number;
  comment: string;
  created_at: string;
}

// Region Types
export interface Region {
  id: string;
  name: string;
  image_url: string;
  description?: string;
}

// Banner Types
export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  cta_text: string;
  cta_link: string;
  badge?: string;
}

// Home Data Types
export interface HomeData {
  banners: Banner[];
  regions: Region[];
  featured_vendors: Vendor[];
  popular_products: Product[];
}

// Search Results
export interface SearchResults {
  products: Product[];
  vendors: Vendor[];
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Auth Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionToken: string | null;
}

// Notification Types
export interface Notification {
  id: string;
  user_id: string;
  type: 'order' | 'promo' | 'review' | 'reward' | 'system';
  title: string;
  description: string;
  is_read: boolean;
  action_url?: string;
  created_at: string;
}
