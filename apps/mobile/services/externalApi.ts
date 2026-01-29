import axios from 'axios';
import { Product, Vendor, Region } from '../types';
import { ApiEndpoints, CommonImages, PlaceholderImages, ImageUrlBuilders } from '../constants';

// External API endpoints (using constants)
const MEAL_DB_API = ApiEndpoints.mealDb;
const FOODISH_API = ApiEndpoints.foodish;
const PLATZI_API = ApiEndpoints.platzi;

// African regions data
export const AFRICAN_REGIONS: Region[] = [
  {
    id: 'west-africa',
    name: 'West Africa',
    image: CommonImages.westAfrica,
  },
  {
    id: 'east-africa',
    name: 'East Africa',
    image: CommonImages.eastAfrica,
  },
  {
    id: 'north-africa',
    name: 'North Africa',
    image: CommonImages.northAfrica,
  },
  {
    id: 'southern-africa',
    name: 'Southern Africa',
    image: CommonImages.southernAfrica,
  },
  {
    id: 'central-africa',
    name: 'Central Africa',
    image: CommonImages.centralAfrica,
  },
];

// African product names for transformation
const AFRICAN_PRODUCT_NAMES = [
  'Jollof Rice Spice Mix',
  'Premium Palm Oil',
  'Egusi Seeds',
  'Dried Stockfish',
  'Plantain Flour',
  'Garri (Cassava Flakes)',
  'Suya Spice Blend',
  'Ogbono Seeds',
  'Crayfish (Ground)',
  'Locust Beans (Iru)',
  'Shea Butter (Ori)',
  'Baobab Powder',
  'Moringa Leaves',
  'Hibiscus Flowers (Zobo)',
  'Dawadawa Seasoning',
  'Yam Flour (Elubo)',
  'Black Soap (Ose Dudu)',
  'Kola Nuts',
  'African Pepper (Uziza)',
  'Dried Catfish',
];

const AFRICAN_CATEGORIES = [
  'Traditional Ingredients',
  'Spices & Seasonings',
  'Grains & Flours',
  'Dried Fish & Proteins',
  'Oils & Condiments',
  'Beauty & Wellness',
  'Beverages',
  'Snacks',
];

// Generate random African-styled product
const generateAfricanProduct = (index: number, imageUrl: string): Product => {
  const regions = ['west-africa', 'east-africa', 'north-africa', 'southern-africa', 'central-africa'];
  const badges = ['HOT', 'NEW', 'TOP RATED', 'ORGANIC', 'BESTSELLER', ''];
  const certifications = [[], ['organic'], ['organic', 'fair-trade'], ['eco-friendly']];
  
  const basePrice = Math.round((Math.random() * 15 + 3) * 100) / 100;
  const hasDiscount = Math.random() > 0.7;
  
  return {
    id: `prod-${index}`,
    name: AFRICAN_PRODUCT_NAMES[index % AFRICAN_PRODUCT_NAMES.length],
    description: `Authentic African ${AFRICAN_PRODUCT_NAMES[index % AFRICAN_PRODUCT_NAMES.length]} sourced directly from local farmers and producers. Perfect for traditional recipes.`,
    price: hasDiscount ? Math.round(basePrice * 0.85 * 100) / 100 : basePrice,
    original_price: hasDiscount ? basePrice : undefined,
    image_url: imageUrl,
    vendor_id: `vendor-${(index % 5) + 1}`,
    region: regions[index % regions.length],
    category: AFRICAN_CATEGORIES[index % AFRICAN_CATEGORIES.length],
    badge: badges[Math.floor(Math.random() * badges.length)] || undefined,
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
    review_count: Math.floor(Math.random() * 200 + 10),
    weight: `${Math.floor(Math.random() * 900 + 100)}g`,
    in_stock: Math.random() > 0.1,
    certifications: certifications[Math.floor(Math.random() * certifications.length)],
  };
};

// Generate vendor data
const generateVendors = (): Vendor[] => {
  const vendorData = [
    {
      id: 'vendor-1',
      name: "Mama Africa's Kitchen",
      avatar: ImageUrlBuilders.dicebearAvatar('Vendor1'),
      cover_image: PlaceholderImages.image800,
      category: 'African Groceries',
      regions: ['west-africa', 'east-africa'],
      rating: 4.9,
      review_count: 342,
      delivery_time: '25-35 min',
      delivery_fee: 0,
      min_order: 15,
      is_verified: true,
      is_open: true,
      tag: 'FEATURED',
      distance: '1.2 km',
      description: 'Authentic West African ingredients and spices, sourced directly from trusted farmers across Nigeria, Ghana, and Senegal.',
    },
    {
      id: 'vendor-2',
      name: 'Lagos Fresh Market',
      avatar: ImageUrlBuilders.dicebearAvatar('Vendor2'),
      cover_image: PlaceholderImages.image800,
      category: 'Fresh Produce & Meats',
      regions: ['west-africa'],
      rating: 4.7,
      review_count: 256,
      delivery_time: '20-30 min',
      delivery_fee: 2.50,
      min_order: 20,
      is_verified: true,
      is_open: true,
      tag: 'POPULAR',
      distance: '0.8 km',
      description: 'Fresh meats, fish, and produce delivered straight from our partners in Lagos and Accra.',
    },
    {
      id: 'vendor-3',
      name: 'Cairo Spice Emporium',
      avatar: ImageUrlBuilders.dicebearAvatar('Vendor3'),
      cover_image: PlaceholderImages.image800,
      category: 'Spices & Seasonings',
      regions: ['north-africa', 'east-africa'],
      rating: 4.8,
      review_count: 189,
      delivery_time: '30-40 min',
      delivery_fee: 1.99,
      min_order: 10,
      is_verified: true,
      is_open: true,
      tag: 'TOP RATED',
      distance: '2.1 km',
      description: 'Premium spices and seasonings from across North Africa, including ras el hanout, harissa, and berbere.',
    },
    {
      id: 'vendor-4',
      name: 'Ethiopian Delights',
      avatar: ImageUrlBuilders.dicebearAvatar('Vendor4'),
      cover_image: PlaceholderImages.image800,
      category: 'Ethiopian Cuisine',
      regions: ['east-africa'],
      rating: 4.6,
      review_count: 134,
      delivery_time: '35-45 min',
      delivery_fee: 3.00,
      min_order: 25,
      is_verified: true,
      is_open: false,
      distance: '3.5 km',
      description: 'Authentic Ethiopian ingredients including teff flour, berbere spice, and injera bread.',
    },
    {
      id: 'vendor-5',
      name: 'Cape Town Organics',
      avatar: ImageUrlBuilders.dicebearAvatar('Vendor5'),
      cover_image: PlaceholderImages.image800,
      category: 'Organic & Natural',
      regions: ['southern-africa'],
      rating: 4.5,
      review_count: 98,
      delivery_time: '40-50 min',
      delivery_fee: 2.00,
      min_order: 30,
      is_verified: false,
      is_open: true,
      distance: '4.2 km',
      description: 'Organic products from Southern Africa including rooibos, biltong, and moringa.',
    },
  ];
  
  return vendorData;
};

// Fetch food images from Foodish API
export const fetchFoodImages = async (count: number = 20): Promise<string[]> => {
  try {
    const promises = Array(count).fill(null).map(() => 
      axios.get(`${FOODISH_API}`).then(res => res.data.image)
    );
    const images = await Promise.all(promises);
    return images;
  } catch (error) {
    console.error('Error fetching food images:', error);
    // Fallback to static images
    return Array(count).fill(PlaceholderImages.image400);
  }
};

// Fetch meals from TheMealDB API
export const fetchMeals = async (area: string = ''): Promise<any[]> => {
  try {
    const endpoint = area 
      ? `${MEAL_DB_API}/filter.php?a=${area}`
      : `${MEAL_DB_API}/search.php?s=`;
    const response = await axios.get(endpoint);
    return response.data.meals || [];
  } catch (error) {
    console.error('Error fetching meals:', error);
    return [];
  }
};

// Fetch products from Platzi API for additional variety
export const fetchPlatziProducts = async (): Promise<any[]> => {
  try {
    const response = await axios.get(`${PLATZI_API}/products?limit=20`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching Platzi products:', error);
    return [];
  }
};

// Main service for external API data
export const externalApiService = {
  // Get products with real food images
  getProducts: async (limit: number = 20): Promise<Product[]> => {
    const images = await fetchFoodImages(limit);
    return images.map((img, index) => generateAfricanProduct(index, img));
  },
  
  // Get vendors
  getVendors: async (): Promise<Vendor[]> => {
    return generateVendors();
  },
  
  // Get vendor by ID
  getVendorById: async (id: string): Promise<Vendor | undefined> => {
    const vendors = generateVendors();
    return vendors.find(v => v.id === id);
  },
  
  // Get products by vendor
  getProductsByVendor: async (vendorId: string): Promise<Product[]> => {
    const images = await fetchFoodImages(8);
    return images.map((img, index) => ({
      ...generateAfricanProduct(index, img),
      vendor_id: vendorId,
    }));
  },
  
  // Get product by ID
  getProductById: async (id: string): Promise<Product | undefined> => {
    const images = await fetchFoodImages(1);
    const index = parseInt(id.replace('prod-', '')) || 0;
    return generateAfricanProduct(index, images[0]);
  },
  
  // Search products
  searchProducts: async (query: string): Promise<Product[]> => {
    const images = await fetchFoodImages(10);
    const products = images.map((img, index) => generateAfricanProduct(index, img));
    return products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
    );
  },
  
  // Get regions
  getRegions: async (): Promise<Region[]> => {
    return AFRICAN_REGIONS;
  },
  
  // Get products by region
  getProductsByRegion: async (region: string): Promise<Product[]> => {
    const images = await fetchFoodImages(12);
    return images.map((img, index) => ({
      ...generateAfricanProduct(index, img),
      region,
    }));
  },
  
  // Get featured vendors
  getFeaturedVendors: async (): Promise<Vendor[]> => {
    const vendors = generateVendors();
    return vendors.filter(v => v.tag);
  },
  
  // Get random food image
  getRandomFoodImage: async (): Promise<string> => {
    try {
      const response = await axios.get(FOODISH_API);
      return response.data.image;
    } catch (error) {
      return PlaceholderImages.image400;
    }
  },
};

export default externalApiService;
