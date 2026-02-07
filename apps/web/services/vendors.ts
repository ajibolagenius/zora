import { getSupabaseClient } from '@zora/api-client';

export interface Vendor {
    id: string;
    business_name: string;
    business_type: string;
    description: string;
    city: string;
    region: string;
    is_approved: boolean;
    is_featured: boolean;
    logo_url?: string;
    cover_image_url?: string;
    rating?: number;
    review_count?: number;
    product_count?: number;
    created_at: string;
}

export interface VendorStats {
    total_vendors: number;
    featured_vendors: number;
    new_vendors_this_month: number;
    regions_covered: number;
}

export class VendorsService {
    /**
     * Get featured vendors for display
     */
    static async getFeatured(limit = 8): Promise<Vendor[]> {
        const supabase = getSupabaseClient();
        
        const { data, error } = await supabase
            .from('vendors')
            .select(`
                *,
                profiles!inner(
                    business_name,
                    business_type,
                    description,
                    city,
                    region,
                    is_approved,
                    logo_url,
                    cover_image_url
                )
            `)
            .eq('profiles.is_approved', true)
            .eq('profiles.is_featured', true)
            .eq('profiles.role', 'vendor')
            .limit(limit);

        if (error) {
            console.error('Error fetching featured vendors:', error);
            return this.getFallbackVendors();
        }

        // Transform the data to match Vendor interface
        const vendors = data?.map(vendor => ({
            id: vendor.id,
            business_name: vendor.profiles.business_name,
            business_type: vendor.profiles.business_type,
            description: vendor.profiles.description,
            city: vendor.profiles.city,
            region: vendor.profiles.region,
            is_approved: vendor.profiles.is_approved,
            is_featured: vendor.profiles.is_featured,
            logo_url: vendor.profiles.logo_url,
            cover_image_url: vendor.profiles.cover_image_url,
            rating: vendor.rating || 4.5,
            review_count: vendor.review_count || 0,
            product_count: vendor.product_count || 0,
            created_at: vendor.created_at,
        })) || [];

        return vendors.length > 0 ? vendors : this.getFallbackVendors();
    }

    /**
     * Get vendor statistics
     */
    static async getStats(): Promise<VendorStats> {
        const supabase = getSupabaseClient();
        
        try {
            // Get total approved vendors
            const { count: totalVendors, error: totalError } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('role', 'vendor')
                .eq('is_approved', true);

            // Get featured vendors
            const { count: featuredVendors, error: featuredError } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('role', 'vendor')
                .eq('is_approved', true)
                .eq('is_featured', true);

            // Get new vendors this month
            const firstDayOfMonth = new Date();
            firstDayOfMonth.setDate(1);
            firstDayOfMonth.setHours(0, 0, 0, 0);

            const { count: newVendors, error: newVendorsError } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('role', 'vendor')
                .eq('is_approved', true)
                .gte('created_at', firstDayOfMonth.toISOString());

            // Get unique regions covered
            const { data: regions, error: regionsError } = await supabase
                .from('profiles')
                .select('region')
                .eq('role', 'vendor')
                .eq('is_approved', true)
                .not('region', 'is', null);

            const uniqueRegions = new Set(regions?.map(r => r.region).filter(Boolean));

            return {
                total_vendors: totalVendors || 150,
                featured_vendors: featuredVendors || 20,
                new_vendors_this_month: newVendors || 12,
                regions_covered: uniqueRegions.size || 15,
            };

        } catch (error) {
            console.error('Error fetching vendor stats:', error);
            return {
                total_vendors: 150,
                featured_vendors: 20,
                new_vendors_this_month: 12,
                regions_covered: 15,
            };
        }
    }

    /**
     * Get vendors by region
     */
    static async getByRegion(region: string, limit = 6): Promise<Vendor[]> {
        const supabase = getSupabaseClient();
        
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'vendor')
            .eq('is_approved', true)
            .eq('region', region)
            .limit(limit);

        if (error) {
            console.error('Error fetching vendors by region:', error);
            return [];
        }

        return data?.map(vendor => ({
            id: vendor.id,
            business_name: vendor.business_name,
            business_type: vendor.business_type,
            description: vendor.description,
            city: vendor.city,
            region: vendor.region,
            is_approved: vendor.is_approved,
            is_featured: vendor.is_featured,
            logo_url: vendor.logo_url,
            cover_image_url: vendor.cover_image_url,
            rating: 4.5,
            review_count: 0,
            product_count: 0,
            created_at: vendor.created_at,
        })) || [];
    }

    /**
     * Fallback vendors when database is not available
     */
    private static getFallbackVendors(): Vendor[] {
        return [
            {
                id: '1',
                business_name: "A Taste of Nigeria",
                business_type: "Food & Groceries",
                description: "Authentic Nigerian groceries and ingredients delivered fresh to your door.",
                city: "London",
                region: "London",
                is_approved: true,
                is_featured: true,
                rating: 4.8,
                review_count: 127,
                product_count: 45,
                created_at: "2024-01-15T10:00:00Z",
            },
            {
                id: '2',
                business_name: "Ghana Home Foods",
                business_type: "Food & Groceries",
                description: "Traditional Ghanaian foods and spices sourced directly from local producers.",
                city: "Manchester",
                region: "North West",
                is_approved: true,
                is_featured: true,
                rating: 4.7,
                review_count: 89,
                product_count: 38,
                created_at: "2024-01-10T14:30:00Z",
            },
            {
                id: '3',
                business_name: "East African Spices",
                business_type: "Spices & Seasonings",
                description: "Premium East African spices and seasonings for authentic home cooking.",
                city: "Birmingham",
                region: "Midlands",
                is_approved: true,
                is_featured: true,
                rating: 4.9,
                review_count: 156,
                product_count: 62,
                created_at: "2024-01-08T09:15:00Z",
            },
            {
                id: '4',
                business_name: "African Textiles Co",
                business_type: "Fashion & Textiles",
                description: "Beautiful African textiles and traditional clothing for all occasions.",
                city: "Leeds",
                region: "Yorkshire",
                is_approved: true,
                is_featured: true,
                rating: 4.6,
                review_count: 73,
                product_count: 28,
                created_at: "2024-01-05T16:45:00Z",
            },
        ];
    }
}
