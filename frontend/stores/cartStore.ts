import { create } from 'zustand';
import { CartItem, Cart, Product, Vendor } from '../types';
import { api } from '../services/api';
import { useAuthStore } from './authStore';
import { vendorService } from '../services/mockDataService';

interface CartState {
  items: CartItem[];
  vendors: Cart['vendors'];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discount: number;
  total: number;
  promoCode: string | null;
  isLoading: boolean;
  
  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  fetchCart: () => Promise<void>;
  applyPromoCode: (code: string) => Promise<void>;
  getItemCount: () => number;
  calculateTotals: () => void;
}

// TEST DATA - Remove after testing
const TEST_CART_ITEMS: CartItem[] = [
  {
    product_id: 'prd_001',
    vendor_id: 'vnd_001',
    quantity: 2,
    product: {
      id: 'prd_001',
      vendor_id: 'vnd_001',
      name: 'Jollof Seasoning Mix',
      description: 'Premium spice blend',
      price: 5.99,
      stock_quantity: 150,
      category: 'Spices',
      cultural_region: 'West Africa',
      image_urls: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCSTXrtnY1KRcIFzdwf0gp07sGWOAqbXsjIxeLQpAIrz2UTGPqv6hgPc05kGbJa1ZVTNDpFNPjkFP82wPEGSqQySw7k2GxVA1UzAEWE1DbfmKsNFY9MemAm1gC4Z-72iMUv_uLTDp9cIhRl25kHAwH4EwbH722eRAYUVI2jrtz8hmJjtIr5cJKNjierykD5cGCncYrvrmbT3riKMFiDpC0SbOWyUOditDmlXrV6ttZhwlcP-5Z7ndSmo6VrnAk_GnSSVvmlRo27SooO'],
      weight: '100g',
      is_active: true,
      is_featured: true,
      rating: 4.9,
      review_count: 234,
    } as Product,
  },
  {
    product_id: 'prd_002',
    vendor_id: 'vnd_001',
    quantity: 1,
    product: {
      id: 'prd_002',
      vendor_id: 'vnd_001',
      name: 'Suya Spice Blend',
      description: 'Authentic suya seasoning',
      price: 4.99,
      stock_quantity: 200,
      category: 'Spices',
      cultural_region: 'West Africa',
      image_urls: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAE_Qz01OtNi1gHE45pnCpTqh3IK34ckdWfkYdj2VJk0SJbVzzpHs5cG7u2TYyBPRxB6u5XfW7LpfI3kKp98bHdCYJ1j2A4cJ7KcXqX0j3K1dDAXn7hN3cQy7Uj5n3C9hF3QLPh7FoqE3Xr8y9J8k7K5mJ3H2GDFB7C6v5A4s3D2'],
      weight: '75g',
      is_active: true,
      rating: 4.7,
      review_count: 189,
    } as Product,
  },
];

export const useCartStore = create<CartState>()((set, get) => ({
  // TESTING: Initialize with test items to verify button visibility
  items: TEST_CART_ITEMS,
  vendors: [],
  subtotal: 0,
  deliveryFee: 0,
  serviceFee: 0.50,
  discount: 0,
  total: 0,
  promoCode: null,
  isLoading: false,
  
  addItem: (product: Product, quantity = 1) => {
    const { items } = get();
    
    // Check if item already exists
    const existingIndex = items.findIndex(item => item.product_id === product.id);
    
    if (existingIndex !== -1) {
      // Update quantity locally
      const newItems = [...items];
      newItems[existingIndex].quantity += quantity;
      set({ items: newItems });
    } else {
      // Add new item locally
      const newItem: CartItem = {
        product_id: product.id,
        vendor_id: product.vendor_id,
        quantity,
        product,
      };
      set({ items: [...items, newItem] });
    }
    
    // Recalculate totals
    get().calculateTotals();
  },
  
  removeItem: (productId: string) => {
    const { items } = get();
    set({ items: items.filter(item => item.product_id !== productId) });
    get().calculateTotals();
  },
  
  updateQuantity: (productId: string, quantity: number) => {
    const { items } = get();
    
    if (quantity <= 0) {
      return get().removeItem(productId);
    }
    
    const newItems = items.map(item =>
      item.product_id === productId ? { ...item, quantity } : item
    );
    set({ items: newItems });
    get().calculateTotals();
  },
  
  clearCart: () => {
    set({
      items: [],
      vendors: [],
      subtotal: 0,
      deliveryFee: 0,
      discount: 0,
      total: 0,
      promoCode: null,
    });
  },
  
  fetchCart: async () => {
    const { sessionToken } = useAuthStore.getState();
    if (!sessionToken) return;
    
    set({ isLoading: true });
    try {
      const response = await api.get('/cart', {
        headers: { Authorization: `Bearer ${sessionToken}` }
      });
      const cart = response.data;
      set({
        items: cart.items || [],
        vendors: cart.vendors || [],
        subtotal: cart.subtotal || 0,
        deliveryFee: cart.delivery_fee || 0,
        serviceFee: cart.service_fee || 0.50,
        total: cart.total || 0,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error fetching cart:', error);
      set({ isLoading: false });
    }
  },
  
  applyPromoCode: async (code: string) => {
    set({ promoCode: code });
  },
  
  getItemCount: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + item.quantity, 0);
  },
  
  calculateTotals: () => {
    const { items, serviceFee, discount } = get();
    
    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => {
      const price = item.product?.price || 0;
      return sum + (price * item.quantity);
    }, 0);
    
    // Calculate delivery fee (simplified - would be per vendor in production)
    const uniqueVendors = new Set(items.map(item => item.vendor_id));
    const deliveryFee = uniqueVendors.size * 2.99;
    
    const total = subtotal + deliveryFee + serviceFee - discount;
    
    // Group items by vendor and lookup vendor data from mock service
    const vendorMap = new Map<string, { id: string; name: string; logo_url: string; delivery_time: string; items: CartItem[] }>();
    
    items.forEach(item => {
      const vendorId = item.vendor_id || item.product?.vendor_id || 'unknown';
      
      if (!vendorMap.has(vendorId)) {
        // Look up vendor data from mock service
        const vendorData = vendorService.getById(vendorId);
        const vendorName = vendorData?.shop_name || item.product?.vendor?.name || 'Unknown Vendor';
        const vendorLogo = vendorData?.logo_url || item.product?.vendor?.logo_url || 'https://via.placeholder.com/40';
        const deliveryMin = vendorData?.delivery_time_min || 2;
        const deliveryMax = vendorData?.delivery_time_max || 3;
        
        vendorMap.set(vendorId, {
          id: vendorId,
          name: vendorName,
          logo_url: vendorLogo,
          delivery_time: `${deliveryMin}-${deliveryMax} days`,
          items: [],
        });
      }
      vendorMap.get(vendorId)?.items.push(item);
    });
    
    const vendors = Array.from(vendorMap.values());
    
    set({
      subtotal: Math.round(subtotal * 100) / 100,
      deliveryFee: Math.round(deliveryFee * 100) / 100,
      total: Math.round(total * 100) / 100,
      vendors,
    });
  },
}));

export default useCartStore;
