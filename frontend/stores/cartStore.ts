import { create } from 'zustand';
import { CartItem, Cart, Product, Vendor } from '../types';
import { api } from '../services/api';
import { useAuthStore } from './authStore';
import { vendorService } from '../services/mockDataService';
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
    calculateTotals: () => void;
}

export const useCartStore = create<CartState>()((set, get) => ({
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

    calculateTotals: () => {
        const { items, serviceFee, discount } = get();

        // Calculate subtotal
        const subtotal = items.reduce((sum, item) => {
            const price = item.product?.price || 0;
            return sum + (price * item.quantity);
        }, 0);

        // Calculate delivery fee (simplified - would be per vendor in production)
        const uniqueVendors = new Set(items.map(item => item.vendor_id));
        const deliveryFee = uniqueVendors.size * PricingConstants.deliveryFeePerVendor;

        const total = subtotal + deliveryFee + serviceFee - discount;

        // Group items by vendor and lookup vendor data from mock service
        const vendorMap = new Map<string, { id: string; name: string; logo_url: string; delivery_time: string; items: CartItem[] }>();

        items.forEach(item => {
            const vendorId = item.vendor_id || item.product?.vendor_id || 'unknown';

            if (!vendorMap.has(vendorId)) {
                // Look up vendor data from mock service
                const vendorData = vendorService.getById(vendorId);
                const vendorName = vendorData?.shop_name || item.product?.vendor?.name || 'Unknown Vendor';
                const vendorLogo = vendorData?.logo_url || item.product?.vendor?.logo_url || PlaceholderImages.vendorLogo;
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
