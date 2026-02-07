// Zora African Market - Type Definitions

// User Types
export interface User {
  id: string;
  user_id?: string; // Supabase auth ID
  email: string;
  name: string;
  full_name?: string;
  picture?: string;
  phone?: string;
  membership_tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  zora_credits: number;
  loyalty_points: number;
  referral_code?: string;
  cultural_interests: string[];
  created_at?: string;
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
  shop_name?: string; // Alias for name, used in some legacy components
  description: string;
  cover_image: string;
  cover_image_url?: string; // Alias for cover_image
  logo_url: string;
  category: string;
  categories?: string[];
  regions: string[];
  rating: number;
  review_count: number;
  is_verified: boolean;
  tag?: string;
  distance?: string;
  delivery_time: string;
  delivery_time_min?: number;
  delivery_time_max?: number;
  delivery_fee: number;
  min_order: number;
  address?: string;
  opening_hours: OpeningHours[];
  is_open: boolean;
  status?: string;
  statusColor?: string;
  cultural_specialties?: string[];
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
  actual_delivery?: string;
  qr_code?: string;
  delivery_provider?: string;
  tracking_reference?: string;
  tracking_url?: string;
  dispatched_at?: string;
  updated_at?: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed' | 'free_delivery';
  type?: 'percentage' | 'fixed' | 'free_delivery'; // Alias for discount_type
  discount_value: number;
  value?: number; // Alias for discount_value
  min_order_amount?: number;
  min_order?: number; // Alias for min_order_amount
  max_discount_amount?: number;
  start_date?: string;
  valid_from?: string; // Alias for start_date
  end_date?: string;
  valid_until?: string; // Alias for end_date
  is_active: boolean;
  created_at?: string;
  usage_limit?: number;
  max_uses?: number; // Alias for usage_limit
  usage_count: number;
  current_uses?: number; // Alias for usage_count
}

// Review Types
export interface Review {
  id: string;
  user_id: string;
  user_name: string;
  user_picture?: string;
  user_avatar?: string; // Alias for user_picture
  product_id?: string;
  vendor_id?: string;
  rating: number;
  comment: string;
  content?: string; // Alias for comment
  title?: string;
  created_at: string;
  helpful_count?: number;
  verified_purchase?: boolean;
  images?: string[];
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
