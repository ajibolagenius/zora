import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  productService, 
  vendorService, 
  reviewService,
  orderService,
  promoCodeService,
} from '../services/supabaseService';
import type { Product, Vendor, Review, Order, PromoCode } from '../types/supabase';

// ============== Query Keys ==============
export const queryKeys = {
  products: {
    all: ['products'] as const,
    list: (filters?: ProductFilters) => ['products', 'list', filters] as const,
    detail: (id: string) => ['products', 'detail', id] as const,
    byVendor: (vendorId: string) => ['products', 'vendor', vendorId] as const,
    byCategory: (category: string) => ['products', 'category', category] as const,
    search: (query: string, filters?: ProductFilters) => ['products', 'search', query, filters] as const,
    featured: ['products', 'featured'] as const,
  },
  vendors: {
    all: ['vendors'] as const,
    list: (filters?: VendorFilters) => ['vendors', 'list', filters] as const,
    detail: (id: string) => ['vendors', 'detail', id] as const,
    featured: ['vendors', 'featured'] as const,
    nearby: (lat: number, lng: number) => ['vendors', 'nearby', lat, lng] as const,
  },
  reviews: {
    all: ['reviews'] as const,
    byProduct: (productId: string) => ['reviews', 'product', productId] as const,
    byVendor: (vendorId: string) => ['reviews', 'vendor', vendorId] as const,
  },
  orders: {
    all: ['orders'] as const,
    byUser: (userId: string) => ['orders', 'user', userId] as const,
    detail: (orderId: string) => ['orders', 'detail', orderId] as const,
  },
  promoCodes: {
    validate: (code: string) => ['promo', 'validate', code] as const,
  },
};

// ============== Filter Types ==============
export interface ProductFilters {
  category?: string;
  region?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'name' | 'newest';
}

export interface VendorFilters {
  category?: string;
  region?: string;
  minRating?: number;
  isOpen?: boolean;
  hasDelivery?: boolean;
}

// ============== Helper Functions ==============
const applyProductFilters = (products: Product[], filters?: ProductFilters): Product[] => {
  if (!filters) return products;
  
  let result = [...products];
  
  if (filters.category) {
    result = result.filter(p => p.category?.toLowerCase() === filters.category?.toLowerCase());
  }
  if (filters.region) {
    result = result.filter(p => p.cultural_region?.toLowerCase().includes(filters.region?.toLowerCase() || ''));
  }
  if (filters.minPrice !== undefined) {
    result = result.filter(p => p.price >= (filters.minPrice || 0));
  }
  if (filters.maxPrice !== undefined) {
    result = result.filter(p => p.price <= (filters.maxPrice || Infinity));
  }
  if (filters.minRating !== undefined) {
    result = result.filter(p => (p.rating || 0) >= (filters.minRating || 0));
  }
  if (filters.inStock) {
    result = result.filter(p => p.stock_quantity > 0);
  }
  
  // Apply sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }
  }
  
  return result;
};

// ============== Product Hooks ==============
export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: async () => {
      const products = await productService.getAll();
      return applyProductFilters(products, filters);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: queryKeys.products.featured,
    queryFn: () => productService.getFeatured(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });
}

export function useProductsByVendor(vendorId: string) {
  return useQuery({
    queryKey: queryKeys.products.byVendor(vendorId),
    queryFn: () => productService.getByVendor(vendorId),
    enabled: !!vendorId,
  });
}

export function useProductsByCategory(category: string) {
  return useQuery({
    queryKey: queryKeys.products.byCategory(category),
    queryFn: () => productService.getByCategory(category),
    enabled: !!category,
  });
}

export function useProductSearch(query: string, filters?: ProductFilters) {
  return useQuery({
    queryKey: queryKeys.products.search(query, filters),
    queryFn: async () => {
      if (!query || query.length < 2) return [];
      const results = await productService.search(query);
      return applyProductFilters(results, filters);
    },
    enabled: query.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  });
}

// ============== Vendor Hooks ==============
export function useVendors(filters?: VendorFilters) {
  return useQuery({
    queryKey: queryKeys.vendors.list(filters),
    queryFn: async () => {
      let vendors = await vendorService.getAll();
      
      // Apply filters
      if (filters) {
        if (filters.category) {
          vendors = vendors.filter(v => 
            v.categories?.some((c: string) => c.toLowerCase().includes(filters.category?.toLowerCase() || ''))
          );
        }
        if (filters.region) {
          vendors = vendors.filter(v => 
            v.cultural_specialties?.some((s: string) => s.toLowerCase().includes(filters.region?.toLowerCase() || ''))
          );
        }
        if (filters.minRating !== undefined) {
          vendors = vendors.filter(v => (v.rating || 0) >= (filters.minRating || 0));
        }
      }
      
      return vendors;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useFeaturedVendors() {
  return useQuery({
    queryKey: queryKeys.vendors.featured,
    queryFn: () => vendorService.getFeatured(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useVendor(id: string) {
  return useQuery({
    queryKey: queryKeys.vendors.detail(id),
    queryFn: () => vendorService.getById(id),
    enabled: !!id,
  });
}

export function useNearbyVendors(lat: number, lng: number, radiusKm: number = 10) {
  return useQuery({
    queryKey: queryKeys.vendors.nearby(lat, lng),
    queryFn: () => vendorService.getNearby(lat, lng, radiusKm),
    enabled: !!lat && !!lng,
    staleTime: 1 * 60 * 1000, // 1 minute for location-based data
  });
}

// ============== Review Hooks ==============
export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: queryKeys.reviews.byProduct(productId),
    queryFn: () => reviewService.getByProduct(productId),
    enabled: !!productId,
  });
}

export function useVendorReviews(vendorId: string) {
  return useQuery({
    queryKey: queryKeys.reviews.byVendor(vendorId),
    queryFn: () => reviewService.getByVendor(vendorId),
    enabled: !!vendorId,
  });
}

// ============== Order Hooks ==============
export function useUserOrders(userId: string) {
  return useQuery({
    queryKey: queryKeys.orders.byUser(userId),
    queryFn: () => orderService.getByUser(userId),
    enabled: !!userId,
  });
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: queryKeys.orders.detail(orderId),
    queryFn: () => orderService.getById(orderId),
    enabled: !!orderId,
  });
}

// ============== Promo Code Hook ==============
export function useValidatePromoCode(code: string) {
  return useQuery({
    queryKey: queryKeys.promoCodes.validate(code),
    queryFn: () => promoCodeService.validate(code),
    enabled: !!code && code.length >= 3,
    staleTime: 0, // Always check fresh
  });
}

// ============== Mutations ==============
export interface CreateReviewInput {
  productId?: string;
  vendorId?: string;
  rating: number;
  title: string;
  comment: string;
  userName: string;
  userAvatar?: string;
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input: CreateReviewInput) => {
      const newReview = await reviewService.create({
        product_id: input.productId,
        vendor_id: input.vendorId,
        rating: input.rating,
        title: input.title,
        body: input.comment,
        user_id: 'current_user', // Would come from auth context
      });
      
      return newReview;
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      if (variables.productId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.reviews.byProduct(variables.productId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(variables.productId) });
      }
      if (variables.vendorId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.reviews.byVendor(variables.vendorId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.vendors.detail(variables.vendorId) });
      }
    },
  });
}

export interface CreateOrderInput {
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: string;
  paymentMethod: string;
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input: CreateOrderInput) => {
      const order = await orderService.create({
        user_id: input.userId,
        items: input.items,
        subtotal: input.subtotal,
        delivery_fee: input.deliveryFee,
        total: input.total,
        delivery_address: input.deliveryAddress,
        status: 'pending',
        payment_status: 'pending',
      });
      
      return order;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.byUser(variables.userId) });
    },
  });
}

export function useApplyPromoCode() {
  return useMutation({
    mutationFn: async (code: string) => {
      return promoCodeService.apply(code);
    },
  });
}

// ============== Categories & Regions (derived from products) ==============
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const products = await productService.getAll();
      const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
      return categories.sort();
    },
    staleTime: 30 * 60 * 1000, // 30 minutes - categories don't change often
  });
}

export function useRegions() {
  return useQuery({
    queryKey: ['regions'],
    queryFn: async () => {
      const products = await productService.getAll();
      const regions = [...new Set(products.map(p => p.cultural_region).filter(Boolean))] as string[];
      return regions.sort();
    },
    staleTime: 30 * 60 * 1000,
  });
}

export function usePriceRange() {
  return useQuery({
    queryKey: ['priceRange'],
    queryFn: async () => {
      const products = await productService.getAll();
      const prices = products.map(p => p.price);
      return {
        min: Math.floor(Math.min(...prices)),
        max: Math.ceil(Math.max(...prices)),
      };
    },
    staleTime: 30 * 60 * 1000,
  });
}

// Export types for external use
export type { Product, Vendor, Review, Order, PromoCode };
