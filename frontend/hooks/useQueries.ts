import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService, vendorService, reviewService, type Product, type Vendor, type Review } from '../services/mockDataService';

// ============== Query Keys ==============
export const queryKeys = {
  products: {
    all: ['products'] as const,
    list: (filters?: ProductFilters) => ['products', 'list', filters] as const,
    detail: (id: string) => ['products', 'detail', id] as const,
    byVendor: (vendorId: string) => ['products', 'vendor', vendorId] as const,
    search: (query: string, filters?: ProductFilters) => ['products', 'search', query, filters] as const,
  },
  vendors: {
    all: ['vendors'] as const,
    list: (filters?: VendorFilters) => ['vendors', 'list', filters] as const,
    detail: (id: string) => ['vendors', 'detail', id] as const,
  },
  reviews: {
    all: ['reviews'] as const,
    byProduct: (productId: string) => ['reviews', 'product', productId] as const,
    byVendor: (vendorId: string) => ['reviews', 'vendor', vendorId] as const,
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

// ============== Product Hooks ==============
export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => {
      let products = productService.getAll();
      
      // Apply filters
      if (filters) {
        if (filters.category) {
          products = products.filter(p => p.category.toLowerCase() === filters.category?.toLowerCase());
        }
        if (filters.region) {
          products = products.filter(p => p.cultural_region?.toLowerCase().includes(filters.region?.toLowerCase() || ''));
        }
        if (filters.minPrice !== undefined) {
          products = products.filter(p => p.price >= (filters.minPrice || 0));
        }
        if (filters.maxPrice !== undefined) {
          products = products.filter(p => p.price <= (filters.maxPrice || Infinity));
        }
        if (filters.minRating !== undefined) {
          products = products.filter(p => (p.rating || 0) >= (filters.minRating || 0));
        }
        if (filters.inStock) {
          products = products.filter(p => p.stock_quantity > 0);
        }
        
        // Apply sorting
        if (filters.sortBy) {
          switch (filters.sortBy) {
            case 'price_asc':
              products.sort((a, b) => a.price - b.price);
              break;
            case 'price_desc':
              products.sort((a, b) => b.price - a.price);
              break;
            case 'rating':
              products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
              break;
            case 'name':
              products.sort((a, b) => a.name.localeCompare(b.name));
              break;
            case 'newest':
              // Already sorted by default
              break;
          }
        }
      }
      
      return products;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
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

export function useProductSearch(query: string, filters?: ProductFilters) {
  return useQuery({
    queryKey: queryKeys.products.search(query, filters),
    queryFn: () => {
      if (!query || query.length < 2) return [];
      
      let results = productService.search(query);
      
      // Apply additional filters
      if (filters) {
        if (filters.category) {
          results = results.filter(p => p.category.toLowerCase() === filters.category?.toLowerCase());
        }
        if (filters.region) {
          results = results.filter(p => p.cultural_region?.toLowerCase().includes(filters.region?.toLowerCase() || ''));
        }
        if (filters.minPrice !== undefined) {
          results = results.filter(p => p.price >= (filters.minPrice || 0));
        }
        if (filters.maxPrice !== undefined) {
          results = results.filter(p => p.price <= (filters.maxPrice || Infinity));
        }
        if (filters.minRating !== undefined) {
          results = results.filter(p => (p.rating || 0) >= (filters.minRating || 0));
        }
      }
      
      return results;
    },
    enabled: query.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  });
}

// ============== Vendor Hooks ==============
export function useVendors(filters?: VendorFilters) {
  return useQuery({
    queryKey: queryKeys.vendors.list(filters),
    queryFn: () => {
      let vendors = vendorService.getAll();
      
      // Apply filters
      if (filters) {
        if (filters.category) {
          vendors = vendors.filter(v => 
            v.categories.some(c => c.toLowerCase().includes(filters.category?.toLowerCase() || ''))
          );
        }
        if (filters.region) {
          vendors = vendors.filter(v => 
            v.cultural_specialties?.some(s => s.toLowerCase().includes(filters.region?.toLowerCase() || ''))
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

export function useVendor(id: string) {
  return useQuery({
    queryKey: queryKeys.vendors.detail(id),
    queryFn: () => vendorService.getById(id),
    enabled: !!id,
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

// ============== Review Mutation ==============
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newReview = reviewService.create({
        product_id: input.productId,
        vendor_id: input.vendorId,
        rating: input.rating,
        title: input.title,
        comment: input.comment,
        user_name: input.userName,
        user_avatar: input.userAvatar,
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

// ============== Categories & Regions ==============
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      const products = productService.getAll();
      const categories = [...new Set(products.map(p => p.category))];
      return categories.sort();
    },
    staleTime: 30 * 60 * 1000, // 30 minutes - categories don't change often
  });
}

export function useRegions() {
  return useQuery({
    queryKey: ['regions'],
    queryFn: () => {
      const products = productService.getAll();
      const regions = [...new Set(products.map(p => p.cultural_region).filter(Boolean))] as string[];
      return regions.sort();
    },
    staleTime: 30 * 60 * 1000,
  });
}

export function usePriceRange() {
  return useQuery({
    queryKey: ['priceRange'],
    queryFn: () => {
      const products = productService.getAll();
      const prices = products.map(p => p.price);
      return {
        min: Math.floor(Math.min(...prices)),
        max: Math.ceil(Math.max(...prices)),
      };
    },
    staleTime: 30 * 60 * 1000,
  });
}
