import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, Cart, Product, Vendor } from '../types';
import { api } from '../services/api';
import { useAuthStore } from './authStore';

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
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  applyPromoCode: (code: string) => Promise<void>;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      vendors: [],
      subtotal: 0,
      deliveryFee: 0,
      serviceFee: 0.50,
      discount: 0,
      total: 0,
      promoCode: null,
      isLoading: false,
      
      addItem: async (product: Product, quantity = 1) => {
        const { sessionToken } = useAuthStore.getState();
        const { items } = get();
        
        // Check if item already exists
        const existingIndex = items.findIndex(item => item.product_id === product.id);
        
        if (existingIndex !== -1) {
          // Update quantity locally first
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
        
        // Sync with server if authenticated
        if (sessionToken) {
          try {
            const response = await api.post('/cart/add', {
              product_id: product.id,
              vendor_id: product.vendor_id,
              quantity,
            }, {
              headers: { Authorization: `Bearer ${sessionToken}` }
            });
            
            // Update from server response
            const cart = response.data;
            set({
              items: cart.items || [],
              vendors: cart.vendors || [],
              subtotal: cart.subtotal || 0,
              deliveryFee: cart.delivery_fee || 0,
              serviceFee: cart.service_fee || 0.50,
              total: cart.total || 0,
            });
          } catch (error) {
            console.error('Error syncing cart:', error);
          }
        }
      },
      
      removeItem: async (productId: string) => {
        const { sessionToken } = useAuthStore.getState();
        const { items } = get();
        
        // Remove locally
        set({ items: items.filter(item => item.product_id !== productId) });
        get().calculateTotals();
        
        // Sync with server
        if (sessionToken) {
          try {
            const response = await api.delete(`/cart/item/${productId}`, {
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
            });
          } catch (error) {
            console.error('Error removing item:', error);
          }
        }
      },
      
      updateQuantity: async (productId: string, quantity: number) => {
        const { sessionToken } = useAuthStore.getState();
        const { items } = get();
        
        if (quantity <= 0) {
          return get().removeItem(productId);
        }
        
        // Update locally
        const newItems = items.map(item =>
          item.product_id === productId ? { ...item, quantity } : item
        );
        set({ items: newItems });
        get().calculateTotals();
        
        // Sync with server
        if (sessionToken) {
          try {
            const response = await api.put('/cart/update', {
              items: newItems.map(item => ({
                product_id: item.product_id,
                vendor_id: item.vendor_id,
                quantity: item.quantity,
              }))
            }, {
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
            });
          } catch (error) {
            console.error('Error updating quantity:', error);
          }
        }
      },
      
      clearCart: async () => {
        const { sessionToken } = useAuthStore.getState();
        
        set({
          items: [],
          vendors: [],
          subtotal: 0,
          deliveryFee: 0,
          discount: 0,
          total: 0,
          promoCode: null,
        });
        
        if (sessionToken) {
          try {
            await api.delete('/cart/clear', {
              headers: { Authorization: `Bearer ${sessionToken}` }
            });
          } catch (error) {
            console.error('Error clearing cart:', error);
          }
        }
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
        // TODO: Implement promo code validation
        set({ promoCode: code });
      },
      
      getItemCount: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.quantity, 0);
      },
      
      // Helper to calculate totals locally
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
        
        set({
          subtotal: Math.round(subtotal * 100) / 100,
          deliveryFee: Math.round(deliveryFee * 100) / 100,
          total: Math.round(total * 100) / 100,
        });
      },
    }),
    {
      name: 'zora-cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        items: state.items,
        promoCode: state.promoCode,
      }),
    }
  )
);

export default useCartStore;
