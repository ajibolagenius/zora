import { getSupabaseClient } from '../supabase';
import type { Product, CreateProductInput, UpdateProductInput, ProductQueryParams, PaginatedResponse } from '@zora/types';

export const productsService = {
    /**
     * Get all products with optional filters
     */
    async getAll(params?: ProductQueryParams): Promise<PaginatedResponse<Product>> {
        const supabase = getSupabaseClient();
        const {
            page = 1,
            limit = 20,
            sortBy = 'created_at',
            sortOrder = 'desc',
            search,
            category,
            region,
            vendor,
            minPrice,
            maxPrice,
            inStock,
        } = params || {};

        let query = supabase
            .from('products')
            .select('*, vendor:vendors(*)', { count: 'exact' });

        // Apply filters
        if (search) {
            query = query.ilike('name', `%${search}%`);
        }
        if (category) {
            query = query.eq('category', category);
        }
        if (region) {
            query = query.eq('region', region);
        }
        if (vendor) {
            query = query.eq('vendor_id', vendor);
        }
        if (minPrice !== undefined) {
            query = query.gte('price', minPrice);
        }
        if (maxPrice !== undefined) {
            query = query.lte('price', maxPrice);
        }
        if (inStock !== undefined) {
            query = query.eq('in_stock', inStock);
        }

        // Apply sorting
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });

        // Apply pagination
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;

        if (error) throw error;

        return {
            data: data || [],
            total: count || 0,
            page,
            limit,
            hasMore: (count || 0) > page * limit,
        };
    },

    /**
     * Get a single product by ID
     */
    async getById(id: string): Promise<Product | null> {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('products')
            .select('*, vendor:vendors(*)')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Get a single product by slug
     */
    async getBySlug(slug: string): Promise<Product | null> {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('products')
            .select('*, vendor:vendors(*)')
            .eq('slug', slug)
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Get products by vendor
     */
    async getByVendor(vendorId: string, params?: ProductQueryParams): Promise<PaginatedResponse<Product>> {
        return this.getAll({ ...params, vendor: vendorId });
    },

    /**
     * Create a new product (vendor only)
     */
    async create(product: CreateProductInput): Promise<Product> {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('products')
            .insert(product)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Update a product (vendor only)
     */
    async update({ id, ...updates }: UpdateProductInput): Promise<Product> {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Delete a product (vendor only)
     */
    async delete(id: string): Promise<void> {
        const supabase = getSupabaseClient();
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    /**
     * Get featured products
     */
    async getFeatured(limit = 10): Promise<Product[]> {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('products')
            .select('*, vendor:vendors(*)')
            .eq('is_featured', true)
            .limit(limit);

        if (error) throw error;
        return data || [];
    },

    /**
     * Get popular products (by rating/reviews)
     */
    async getPopular(limit = 10): Promise<Product[]> {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('products')
            .select('*, vendor:vendors(*)')
            .order('rating', { ascending: false })
            .order('review_count', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];
    },
};

export default productsService;
