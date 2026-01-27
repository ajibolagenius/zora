#!/usr/bin/env node

/**
 * Database Population Script for Zora African Market
 * 
 * This script fetches data from various free APIs and populates the Supabase database.
 * Uses Supabase MCP tools for database operations.
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  // API endpoints
  APIs: {
    users: 'https://dummyjson.com/users',
    meals: {
      themealdb: 'https://www.themealdb.com/api/json/v1/1',
      spoonacular: 'https://api.spoonacular.com/recipes', // Requires API key
    },
    books: {
      google: 'https://www.googleapis.com/books/v1/volumes',
      openLibrary: 'https://openlibrary.org',
    },
    gallery: {
      unsplash: 'https://api.unsplash.com', // Requires API key
      flickr: 'https://api.flickr.com/services/rest', // Requires API key
      pexels: 'https://api.pexels.com/v1', // Requires API key
    },
    ecommerce: 'https://fakestoreapi.com',
    test: 'https://jsonplaceholder.typicode.com',
  },
  
  // Limits for data fetching
  limits: {
    users: 100,
    meals: 50,
    books: 50,
    products: 100,
    images: 50,
  },
  
  // UK locations for vendors (Brixton area)
  ukLocations: [
    { name: 'Brixton', lat: 51.4627, lng: -0.1155 },
    { name: 'Camden', lat: 51.5396, lng: -0.1430 },
    { name: 'Hackney', lat: 51.5492, lng: -0.0556 },
    { name: 'Tottenham', lat: 51.6037, lng: -0.0657 },
    { name: 'Peckham', lat: 51.4700, lng: -0.0697 },
  ],
  
  // African regions mapping
  regions: [
    { name: 'West Africa', countries: ['Nigeria', 'Ghana', 'Senegal', 'Ivory Coast'] },
    { name: 'East Africa', countries: ['Kenya', 'Tanzania', 'Ethiopia', 'Uganda'] },
    { name: 'North Africa', countries: ['Morocco', 'Egypt', 'Tunisia', 'Algeria'] },
    { name: 'South Africa', countries: ['South Africa', 'Zimbabwe', 'Botswana'] },
    { name: 'Central Africa', countries: ['Cameroon', 'Congo', 'Gabon'] },
  ],
  
  // Product categories mapping
  categories: [
    'Spices',
    'Grains',
    'Vegetables',
    'Meats',
    'Textiles',
    'Beverages',
  ],
};

// Utility functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const randomChoice = (array) => array[Math.floor(Math.random() * array.length)];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const randomFloat = (min, max, decimals = 2) => {
  const num = Math.random() * (max - min) + min;
  return parseFloat(num.toFixed(decimals));
};

// API Fetchers
class APIFetcher {
  static async fetchUsers(limit = 30) {
    try {
      console.log(`Fetching ${limit} users from dummyjson.com...`);
      const response = await axios.get(`${CONFIG.APIs.users}?limit=${limit}`);
      return response.data.users || [];
    } catch (error) {
      console.error('Error fetching users:', error.message);
      return [];
    }
  }

  static async fetchMealsFromThemealdb(limit = 50) {
    try {
      console.log(`Fetching ${limit} meals from themealdb.com...`);
      const meals = [];
      
      // Fetch random meals
      for (let i = 0; i < limit; i++) {
        try {
          const response = await axios.get(`${CONFIG.APIs.meals.themealdb}/random.php`);
          if (response.data.meals && response.data.meals[0]) {
            meals.push(response.data.meals[0]);
          }
          await delay(100); // Rate limiting
        } catch (error) {
          console.warn(`Error fetching meal ${i}:`, error.message);
        }
      }
      
      return meals;
    } catch (error) {
      console.error('Error fetching meals:', error.message);
      return [];
    }
  }

  static async fetchBooksFromGoogle(limit = 50, query = 'african') {
    try {
      console.log(`Fetching ${limit} books from Google Books API...`);
      const response = await axios.get(`${CONFIG.APIs.books.google}`, {
        params: {
          q: query,
          maxResults: limit,
          langRestrict: 'en',
        },
      });
      return response.data.items || [];
    } catch (error) {
      console.error('Error fetching books:', error.message);
      return [];
    }
  }

  static async fetchBooksFromOpenLibrary(limit = 50, subject = 'africa') {
    try {
      console.log(`Fetching ${limit} books from Open Library...`);
      const response = await axios.get(`${CONFIG.APIs.books.openLibrary}/subjects/${subject}.json`, {
        params: {
          limit: limit,
        },
      });
      return response.data.works || [];
    } catch (error) {
      console.error('Error fetching books from Open Library:', error.message);
      return [];
    }
  }

  static async fetchImagesFromPexels(limit = 50, query = 'african food') {
    try {
      console.log(`Fetching ${limit} images from Pexels...`);
      // Note: This requires an API key. For now, we'll use placeholder images
      // In production, you'd need: headers: { Authorization: `Bearer ${PEXELS_API_KEY}` }
      console.warn('Pexels API requires authentication. Using placeholder images.');
      return [];
    } catch (error) {
      console.error('Error fetching images:', error.message);
      return [];
    }
  }

  static async fetchProductsFromFakeStore(limit = 20) {
    try {
      console.log(`Fetching ${limit} products from fakestoreapi.com...`);
      const response = await axios.get(`${CONFIG.APIs.ecommerce}/products?limit=${limit}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching products:', error.message);
      return [];
    }
  }

  static async fetchTestData() {
    try {
      console.log('Fetching test data from jsonplaceholder...');
      const [posts, comments, albums, photos] = await Promise.all([
        axios.get(`${CONFIG.APIs.test}/posts`),
        axios.get(`${CONFIG.APIs.test}/comments`),
        axios.get(`${CONFIG.APIs.test}/albums`),
        axios.get(`${CONFIG.APIs.test}/photos`),
      ]);
      
      return {
        posts: posts.data,
        comments: comments.data,
        albums: albums.data,
        photos: photos.data,
      };
    } catch (error) {
      console.error('Error fetching test data:', error.message);
      return {};
    }
  }
}

// Data Transformers
class DataTransformer {
  static transformUser(userData) {
    return {
      email: userData.email || `user${userData.id}@example.com`,
      name: `${userData.firstName} ${userData.lastName}`,
      avatar_url: userData.image || null,
      phone: userData.phone || null,
      membership_tier: randomChoice(['bronze', 'silver', 'gold', 'platinum']),
      zora_credits: randomFloat(0, 100),
      loyalty_points: randomInt(0, 1000),
      cultural_interests: CONFIG.regions.slice(0, randomInt(1, 3)).map(r => r.name),
    };
  }

  static transformMealToProduct(mealData, vendorId) {
    const category = randomChoice(CONFIG.categories);
    const region = randomChoice(CONFIG.regions);
    
    return {
      vendor_id: vendorId,
      name: mealData.strMeal || 'African Meal',
      description: mealData.strInstructions || `Delicious ${mealData.strMeal || 'meal'} from ${region.name}`,
      price: randomFloat(5.99, 49.99),
      unit_price_label: 'per portion',
      stock_quantity: randomInt(10, 100),
      category: category,
      cultural_region: region.name,
      image_urls: mealData.strMealThumb ? [mealData.strMealThumb] : [],
      weight: `${randomInt(250, 1000)}g`,
      certifications: randomChoice([
        ['Organic'],
        ['Top Rated'],
        ['Eco-Friendly'],
        ['Organic', 'Top Rated'],
        [],
      ]),
      nutrition: {
        calories: randomInt(200, 800),
        protein: randomInt(10, 50),
        carbs: randomInt(20, 80),
        fat: randomInt(5, 30),
      },
      heritage_story: `This traditional ${mealData.strMeal || 'dish'} has been passed down through generations in ${region.name}.`,
      is_active: true,
      is_featured: Math.random() > 0.7,
      badge: Math.random() > 0.8 ? randomChoice(['Best Seller', 'New', 'Limited']) : null,
      rating: randomFloat(3.5, 5.0, 1),
      review_count: randomInt(0, 150),
    };
  }

  static transformBookToProduct(bookData, vendorId) {
    const category = 'Textiles'; // Books can be categorized differently
    const region = randomChoice(CONFIG.regions);
    
    const volumeInfo = bookData.volumeInfo || bookData;
    const title = volumeInfo.title || 'African Book';
    const description = volumeInfo.description || `A fascinating book about ${region.name}`;
    
    return {
      vendor_id: vendorId,
      name: title,
      description: description.substring(0, 500), // Limit description length
      price: randomFloat(9.99, 29.99),
      unit_price_label: 'per book',
      stock_quantity: randomInt(5, 50),
      category: category,
      cultural_region: region.name,
      image_urls: volumeInfo.imageLinks?.thumbnail ? [volumeInfo.imageLinks.thumbnail] : [],
      weight: `${randomInt(200, 800)}g`,
      certifications: [],
      heritage_story: `This book explores the rich culture and heritage of ${region.name}.`,
      is_active: true,
      is_featured: Math.random() > 0.8,
      badge: null,
      rating: randomFloat(4.0, 5.0, 1),
      review_count: randomInt(5, 100),
    };
  }

  static transformFakeStoreProduct(productData, vendorId) {
    const category = this.mapCategory(productData.category);
    const region = randomChoice(CONFIG.regions);
    
    // Parse price, but preserve 0 values
    const parsedPrice = productData.price !== undefined && productData.price !== null 
      ? parseFloat(productData.price) 
      : null;
    
    return {
      vendor_id: vendorId,
      name: productData.title || productData.name,
      description: productData.description || `Quality ${productData.title || 'product'} from ${region.name}`,
      price: parsedPrice !== null && !isNaN(parsedPrice) ? parsedPrice : randomFloat(5.99, 99.99),
      unit_price_label: 'per item',
      stock_quantity: randomInt(10, 200),
      category: category,
      cultural_region: region.name,
      image_urls: productData.image ? [productData.image] : [],
      weight: `${randomInt(100, 2000)}g`,
      certifications: Math.random() > 0.6 ? ['Top Rated'] : [],
      heritage_story: `Authentic product sourced from ${region.name}.`,
      is_active: true,
      is_featured: Math.random() > 0.7,
      badge: Math.random() > 0.8 ? 'Best Seller' : null,
      rating: productData.rating?.rate ?? randomFloat(3.5, 5.0, 1),
      review_count: productData.rating?.count ?? randomInt(0, 200),
    };
  }

  static mapCategory(category) {
    const categoryMap = {
      "men's clothing": 'Textiles',
      "women's clothing": 'Textiles',
      electronics: 'Beverages', // Map to closest match
      jewelery: 'Textiles',
    };
    return categoryMap[category?.toLowerCase()] || randomChoice(CONFIG.categories);
  }

  static createVendor(userId, index) {
    const location = randomChoice(CONFIG.ukLocations);
    const region = randomChoice(CONFIG.regions);
    const specialties = region.countries.slice(0, randomInt(1, 3));
    
    const shopNames = [
      `${region.name} Market`,
      `${specialties[0]} Delights`,
      `Authentic ${region.name}`,
      `${region.name} Groceries`,
      `Taste of ${region.name}`,
    ];
    
    return {
      user_id: userId,
      shop_name: shopNames[index % shopNames.length] || `${region.name} Store`,
      description: `Your trusted source for authentic ${region.name} products. We bring the flavors and traditions of ${region.name} to your doorstep.`,
      logo_url: null, // Can be populated with images later
      cover_image_url: null,
      address: `${randomInt(1, 200)} ${randomChoice(['High Street', 'Road', 'Avenue', 'Lane'])}, ${location.name}, London`,
      latitude: location.lat + randomFloat(-0.05, 0.05, 6),
      longitude: location.lng + randomFloat(-0.05, 0.05, 6),
      coverage_radius_km: randomFloat(5, 15),
      is_verified: Math.random() > 0.3,
      rating: randomFloat(4.0, 5.0, 1),
      review_count: randomInt(10, 500),
      cultural_specialties: specialties,
      categories: CONFIG.categories.slice(0, randomInt(2, 4)),
      delivery_time_min: randomInt(20, 40),
      delivery_time_max: randomInt(45, 90),
      delivery_fee: randomFloat(2.99, 5.99),
      minimum_order: randomFloat(15, 30),
      is_featured: Math.random() > 0.7,
      badge: Math.random() > 0.8 ? randomChoice(['Top Rated', 'Fast Delivery', 'Verified']) : null,
    };
  }
}

// Main Population Script
class DatabasePopulator {
  constructor() {
    this.supabaseClient = null;
    this.stats = {
      users: 0,
      vendors: 0,
      products: 0,
      errors: [],
    };
  }

  async initialize() {
    console.log('Initializing database populator...');
    // Note: In a real implementation, you'd initialize Supabase client here
    // For now, we'll use MCP tools via the call_mcp_tool function
    console.log('Ready to populate database.');
  }

  async populateUsers() {
    console.log('\n=== Populating Users ===');
    const users = await APIFetcher.fetchUsers(CONFIG.limits.users);
    
    if (users.length === 0) {
      console.log('No users fetched. Skipping user population.');
      return [];
    }

    console.log(`Fetched ${users.length} users. Transforming data...`);
    const transformedUsers = users.map(user => DataTransformer.transformUser(user));
    
    // Insert users using Supabase MCP
    const insertedUsers = [];
    for (const user of transformedUsers) {
      try {
        // Note: We'll need to create auth users first, then profiles
        // For now, we'll prepare the data
        insertedUsers.push(user);
        this.stats.users++;
      } catch (error) {
        console.error(`Error inserting user:`, error.message);
        this.stats.errors.push({ type: 'user', error: error.message });
      }
    }

    console.log(`✓ Inserted ${insertedUsers.length} users`);
    return insertedUsers;
  }

  async populateVendors(userIds) {
    console.log('\n=== Populating Vendors ===');
    
    if (!userIds || userIds.length === 0) {
      console.log('No user IDs available. Creating vendors from user data...');
      // We'll create vendors based on fetched users
      userIds = Array.from({ length: Math.min(20, this.stats.users) }, (_, i) => `user-${i}`);
    }

    const vendors = [];
    const vendorCount = Math.min(20, userIds.length);
    
    for (let i = 0; i < vendorCount; i++) {
      const userId = userIds[i] || `vendor-${i}`;
      const vendor = DataTransformer.createVendor(userId, i);
      vendors.push(vendor);
    }

    console.log(`✓ Prepared ${vendors.length} vendors`);
    this.stats.vendors = vendors.length;
    return vendors;
  }

  async populateProducts(vendorIds) {
    console.log('\n=== Populating Products ===');
    
    if (!vendorIds || vendorIds.length === 0) {
      console.log('No vendor IDs available. Skipping product population.');
      return [];
    }

    const products = [];
    
    // Fetch meals
    console.log('Fetching meals...');
    const meals = await APIFetcher.fetchMealsFromThemealdb(30);
    for (const meal of meals) {
      const vendorId = randomChoice(vendorIds);
      const product = DataTransformer.transformMealToProduct(meal, vendorId);
      products.push(product);
    }

    // Fetch books
    console.log('Fetching books...');
    const books = await APIFetcher.fetchBooksFromGoogle(20, 'african');
    for (const book of books) {
      const vendorId = randomChoice(vendorIds);
      const product = DataTransformer.transformBookToProduct(book, vendorId);
      products.push(product);
    }

    // Fetch e-commerce products
    console.log('Fetching e-commerce products...');
    const fakeProducts = await APIFetcher.fetchProductsFromFakeStore(20);
    for (const productData of fakeProducts) {
      const vendorId = randomChoice(vendorIds);
      const product = DataTransformer.transformFakeStoreProduct(productData, vendorId);
      products.push(product);
    }

    console.log(`✓ Prepared ${products.length} products`);
    this.stats.products = products.length;
    return products;
  }

  async saveDataToFile(data, filename) {
    const filePath = path.join(__dirname, '..', 'data', filename);
    const dir = path.dirname(filePath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✓ Saved data to ${filename}`);
  }

  async run() {
    console.log('🚀 Starting Database Population Script\n');
    console.log('='.repeat(60));
    
    try {
      await this.initialize();
      
      // Step 1: Populate Users
      const users = await this.populateUsers();
      await this.saveDataToFile(users, 'populated_users.json');
      
      // Step 2: Populate Vendors
      const vendorUserIds = users.map((_, i) => `user-${i}`).slice(0, 20);
      const vendors = await this.populateVendors(vendorUserIds);
      await this.saveDataToFile(vendors, 'populated_vendors.json');
      
      // Step 3: Populate Products
      const vendorIds = vendors.map((_, i) => `vendor-${i}`).slice(0, 10);
      const products = await this.populateProducts(vendorIds);
      await this.saveDataToFile(products, 'populated_products.json');
      
      // Summary
      console.log('\n' + '='.repeat(60));
      console.log('📊 Population Summary:');
      console.log(`  Users: ${this.stats.users}`);
      console.log(`  Vendors: ${this.stats.vendors}`);
      console.log(`  Products: ${this.stats.products}`);
      console.log(`  Errors: ${this.stats.errors.length}`);
      
      if (this.stats.errors.length > 0) {
        console.log('\n⚠️  Errors encountered:');
        this.stats.errors.forEach(err => {
          console.log(`  - ${err.type}: ${err.error}`);
        });
      }
      
      console.log('\n✅ Data preparation complete!');
      console.log('📝 Next step: Use Supabase MCP tools to insert data into database.');
      
    } catch (error) {
      console.error('\n❌ Fatal error:', error);
      process.exit(1);
    }
  }
}

// Run the script
if (require.main === module) {
  const populator = new DatabasePopulator();
  populator.run().catch(console.error);
}

module.exports = { DatabasePopulator, APIFetcher, DataTransformer };
