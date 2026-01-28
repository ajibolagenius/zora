import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '../lib/storage';
import { CartItem, Cart, Product, Vendor } from '../types';
import { api } from '../services/api';
import { useAuthStore } from './authStore';
import { vendorService as mockVendorService } from '../services/mockDataService';
import { vendorService as supabaseVendorService } from '../services/supabaseService';
import { isSupabaseConfigured } from '../lib/supabase';
import { PricingConstants, PlaceholderImages } from '../constants';

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
    calculateTotals: () => Promise<void>;
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
                const { session } = useAuthStore.getState();
                const sessionToken = session?.access_token;
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

            calculateTotals: async () => {
                const { items, serviceFee, discount } = get();

                // Calculate subtotal
                const subtotal = items.reduce((sum, item) => {
                    const price = item.product?.price || 0;
                    return sum + (price * item.quantity);
                }, 0);

                // Calculate delivery fee based on order total
                // Orders £29.99 or more = free delivery
                // Orders under £29.99 = £2.50 delivery fee
                const deliveryFee = subtotal >= PricingConstants.freeDeliveryThreshold 
                    ? 0 
                    : PricingConstants.deliveryFee;

                const total = subtotal + deliveryFee + serviceFee - discount;

                // Group items by vendor and lookup vendor data
                const vendorMap = new Map<string, { id: string; name: string; logo_url: string; delivery_time: string; delivery_fee: number; subtotal: number; items: CartItem[] }>();

                // Get unique vendor IDs
                const vendorIds = [...new Set(items.map(item => item.vendor_id || item.product?.vendor_id).filter(Boolean) as string[])];

                // Fetch vendor data for all unique vendors
                const vendorDataMap = new Map<string, any>();
                if (vendorIds.length > 0) {
                    if (isSupabaseConfigured()) {
                        // Use Supabase vendor service
                        const vendorPromises = vendorIds.map(async (vendorId) => {
                            try {
                                const vendor = await supabaseVendorService.getById(vendorId);
                                return { vendorId, vendor };
                            } catch (error) {
                                console.error(`Error fetching vendor ${vendorId}:`, error);
                                return { vendorId, vendor: null };
                            }
                        });
                        const vendorResults = await Promise.all(vendorPromises);
                        vendorResults.forEach(({ vendorId, vendor }) => {
                            if (vendor) {
                                vendorDataMap.set(vendorId, vendor);
                            }
                        });
                    } else {
                        // Use mock vendor service
                        vendorIds.forEach(vendorId => {
                            const vendor = mockVendorService.getById(vendorId);
                            if (vendor) {
                                vendorDataMap.set(vendorId, vendor);
                            }
                        });
                    }
                }

                items.forEach(item => {
                    const vendorId = item.vendor_id || item.product?.vendor_id || 'unknown';

                    if (!vendorMap.has(vendorId)) {
                        // Look up vendor data
                        const vendorData = vendorDataMap.get(vendorId);
                        const vendorName = vendorData?.shop_name || vendorData?.name || item.product?.vendor?.name || item.product?.vendor?.shop_name || 'Unknown Vendor';
                        const vendorLogo = vendorData?.logo_url || item.product?.vendor?.logo_url || PlaceholderImages.vendorLogo;
                        const deliveryMin = vendorData?.delivery_time_min || 2;
                        const deliveryMax = vendorData?.delivery_time_max || 3;

                        vendorMap.set(vendorId, {
                            id: vendorId,
                            name: vendorName,
                            logo_url: vendorLogo,
                            delivery_time: `${deliveryMin}-${deliveryMax} days`,
                            delivery_fee: 0, // Delivery fee is now order-based, not vendor-based
                            subtotal: 0,
                            items: [],
                        });
                    }
                    const vendorEntry = vendorMap.get(vendorId);
                    if (vendorEntry) {
                        vendorEntry.items.push(item);
                        vendorEntry.subtotal += (item.product?.price || 0) * item.quantity;
                    }
                });

                const vendors = Array.from(vendorMap.values());

                set({
                    subtotal: Math.round(subtotal * 100) / 100,
                    deliveryFee: Math.round(deliveryFee * 100) / 100,
                    total: Math.round(total * 100) / 100,
                    vendors,
                });
            },
        }),
        {
            name: 'zora-cart-storage',
            storage: createJSONStorage(() => zustandStorage),
            skipHydration: true,
        }
    )
);

export default useCartStore;
