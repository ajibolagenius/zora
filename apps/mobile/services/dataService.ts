import { api } from './api';
import { HomeData, Product, Vendor, Region, SearchResults } from '../types';

export const homeService = {
  getHomeData: async (): Promise<HomeData> => {
    const response = await api.get('/home');
    return response.data;
  },
  
  getRegions: async (): Promise<Region[]> => {
    const response = await api.get('/regions');
    return response.data;
  },
};

export const productService = {
  getAll: async (params?: {
    region?: string;
    category?: string;
    search?: string;
    limit?: number;
    skip?: number;
  }): Promise<Product[]> => {
    const response = await api.get('/products', { params });
    return response.data;
  },
  
  getById: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  
  getByVendor: async (vendorId: string): Promise<Product[]> => {
    const response = await api.get(`/vendors/${vendorId}/products`);
    return response.data;
  },
  
  getByRegion: async (region: string): Promise<Product[]> => {
    const response = await api.get(`/products/region/${region}`);
    return response.data;
  },
  
  getPopular: async (): Promise<Product[]> => {
    const response = await api.get('/products/popular');
    return response.data;
  },
  
  search: async (query: string): Promise<SearchResults> => {
    const response = await api.get('/search', { params: { q: query } });
    return response.data;
  },
};

export const vendorService = {
  getAll: async (params?: { region?: string; category?: string }): Promise<Vendor[]> => {
    const response = await api.get('/vendors', { params });
    return response.data;
  },
  
  getById: async (id: string): Promise<Vendor> => {
    const response = await api.get(`/vendors/${id}`);
    return response.data;
  },
  
  getProducts: async (vendorId: string): Promise<Product[]> => {
    const response = await api.get(`/vendors/${vendorId}/products`);
    return response.data;
  },
  
  getReviews: async (vendorId: string): Promise<any[]> => {
    const response = await api.get(`/vendors/${vendorId}/reviews`);
    return response.data;
  },
};

export const orderService = {
  create: async (orderData: any, token: string): Promise<any> => {
    const response = await api.post('/orders', orderData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  
  getAll: async (token: string, status?: string): Promise<any[]> => {
    const response = await api.get('/orders', {
      params: { status },
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  
  getById: async (id: string, token: string): Promise<any> => {
    const response = await api.get(`/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  
  cancel: async (id: string, token: string): Promise<any> => {
    const response = await api.post(`/orders/${id}/cancel`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
};

export const paymentService = {
  createIntent: async (amount: number, orderId: string, token: string): Promise<any> => {
    const response = await api.post('/payments/create-intent', { amount, order_id: orderId }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  
  confirmPayment: async (paymentIntentId: string, token: string): Promise<any> => {
    const response = await api.post('/payments/confirm', { payment_intent_id: paymentIntentId }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  
  getConfig: async (): Promise<{ publishable_key: string }> => {
    const response = await api.get('/payments/config');
    return response.data;
  },
};
