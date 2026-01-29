/**
 * Cart Service
 * Service for managing shopping cart operations
 */

import { getSupabaseClient } from '../supabase';

/**
 * Database cart item type (from Supabase)
 */
interface DbCartItem {
    id: string;
    user_id: string;
    product_id: string;
    vendor_id: string;
    quantity: number;
    created_at: string;
    updated_at: string;
    product?: {
        id: string;
        name: string;
        price: number;
        image_urls: string[];
        stock_quantity: number;
    };
    vendor?: {
        id: string;
        shop_name: string;
        logo_url: string;
        delivery_fee: number;
        delivery_time_min: number;
        delivery_time_max: number;
    };
}

/**
 * Cart item with product and vendor details
 */
export interface CartItemWithDetails extends DbCartItem {
    product: NonNullable<DbCartItem['product']>;
    vendor: NonNullable<DbCartItem['vendor']>;
}

/**
 * Cart summary
 */
export interface CartSummary {
    items: CartItemWithDetails[];
    itemCount: number;
    subtotal: number;
    deliveryFee: number;
    serviceFee: number;
    total: number;
}

export const cartService = {
    /**
     * Get cart items for current user
     */
    async getCart(): Promise<CartItemWithDetails[]> {
        const supabase = getSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('cart_items')
            .select(`
                *,
                product:products(id, name, price, image_urls, stock_quantity),
                vendor:vendors(id, shop_name, logo_url, delivery_fee, delivery_time_min, delivery_time_max)
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []) as CartItemWithDetails[];
    },

    /**
     * Get cart summary with totals
     */
    async getCartSummary(): Promise<CartSummary> {
        const items = await this.getCart();

        const subtotal = items.reduce(
            (sum, item) => sum + (item.product.price * item.quantity),
            0
        );

        // Get unique vendors and sum their delivery fees
        const vendorIds = [...new Set(items.map(item => item.vendor_id))];
        const deliveryFee = items.length > 0
            ? Math.max(...items.map(item => item.vendor?.delivery_fee || 0))
            : 0;

        const serviceFee = subtotal > 0 ? 0.50 : 0; // Fixed service fee
        const total = subtotal + deliveryFee + serviceFee;

        return {
            items,
            itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
            subtotal,
            deliveryFee,
            serviceFee,
            total,
        };
    },

    /**
     * Add item to cart (upserts if already exists)
     */
    async addToCart(productId: string, quantity: number = 1): Promise<DbCartItem> {
        const supabase = getSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error('Not authenticated');

        // Get product to get vendor_id
        const { data: product, error: productError } = await supabase
            .from('products')
            .select('vendor_id, stock_quantity')
            .eq('id', productId)
            .single();

        if (productError) throw productError;
        if (!product) throw new Error('Product not found');

        // Check stock
        if (product.stock_quantity < quantity) {
            throw new Error('Insufficient stock');
        }

        // Check if item already in cart
        const { data: existingItem } = await supabase
            .from('cart_items')
            .select('id, quantity')
            .eq('user_id', user.id)
            .eq('product_id', productId)
            .single();

        if (existingItem) {
            // Update quantity
            const newQuantity = existingItem.quantity + quantity;
            if (newQuantity > product.stock_quantity) {
                throw new Error('Cannot add more than available stock');
            }

            const { data, error } = await supabase
                .from('cart_items')
                .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
                .eq('id', existingItem.id)
                .select()
                .single();

            if (error) throw error;
            return data;
        }

        // Insert new item
        const { data, error } = await supabase
            .from('cart_items')
            .insert({
                user_id: user.id,
                product_id: productId,
                vendor_id: product.vendor_id,
                quantity,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Update cart item quantity
     */
    async updateQuantity(cartItemId: string, quantity: number): Promise<DbCartItem | null> {
        const supabase = getSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error('Not authenticated');

        if (quantity <= 0) {
            await this.removeFromCart(cartItemId);
            return null;
        }

        // Get cart item with product to check stock
        const { data: cartItem, error: fetchError } = await supabase
            .from('cart_items')
            .select('product_id')
            .eq('id', cartItemId)
            .eq('user_id', user.id)
            .single();

        if (fetchError) throw fetchError;
        if (!cartItem) throw new Error('Cart item not found');

        // Check stock
        const { data: product } = await supabase
            .from('products')
            .select('stock_quantity')
            .eq('id', cartItem.product_id)
            .single();

        if (product && quantity > product.stock_quantity) {
            throw new Error('Cannot exceed available stock');
        }

        const { data, error } = await supabase
            .from('cart_items')
            .update({ quantity, updated_at: new Date().toISOString() })
            .eq('id', cartItemId)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Remove item from cart
     */
    async removeFromCart(cartItemId: string): Promise<void> {
        const supabase = getSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error('Not authenticated');

        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('id', cartItemId)
            .eq('user_id', user.id);

        if (error) throw error;
    },

    /**
     * Clear entire cart
     */
    async clearCart(): Promise<void> {
        const supabase = getSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error('Not authenticated');

        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', user.id);

        if (error) throw error;
    },

    /**
     * Get cart item count
     */
    async getCartCount(): Promise<number> {
        const supabase = getSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return 0;

        const { count, error } = await supabase
            .from('cart_items')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

        if (error) throw error;
        return count || 0;
    },

    /**
     * Check if product is in cart
     */
    async isInCart(productId: string): Promise<boolean> {
        const supabase = getSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return false;

        const { data, error } = await supabase
            .from('cart_items')
            .select('id')
            .eq('user_id', user.id)
            .eq('product_id', productId)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
        return !!data;
    },

    /**
     * Get cart item by product ID
     */
    async getCartItemByProduct(productId: string): Promise<DbCartItem | null> {
        const supabase = getSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return null;

        const { data, error } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', user.id)
            .eq('product_id', productId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },
};

export default cartService;
