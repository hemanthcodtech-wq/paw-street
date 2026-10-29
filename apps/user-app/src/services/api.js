import AsyncStorage from '@react-native-async-storage/async-storage';
import { PRODUCTS, STORES, SERVICES, COUPONS, USER_SEED } from '../data/mockData';

const DEFAULT_API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseUrl = DEFAULT_API_BASE_URL;
  }

  setBaseUrl(url) {
    this.baseUrl = url;
  }

  async getToken() {
    try {
      return await AsyncStorage.getItem('paw_user_token');
    } catch (e) {
      return null;
    }
  }

  async request(endpoint, options = {}) {
    const token = await this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, isOffline: true, message: error.message };
    }
  }

  async getProducts() {
    const res = await this.request('/products');
    if (res && res.success && Array.isArray(res.products) && res.products.length > 0) {
      return res.products.map(p => ({
        ...p,
        id: p._id || p.id,
        name: p.title || p.name,
        image: p.primaryImage || p.image || p.images?.[0] || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80',
        storeName: p.vendorName || p.storeName || 'Paw Street Superstore',
        rating: p.rating || 4.8,
        reviewsCount: p.reviewsCount || 120,
        inStock: p.stock > 0 || p.inStock !== false
      }));
    }
    return PRODUCTS;
  }

  async getStores() {
    const res = await this.request('/platform/stores');
    if (res && res.success && Array.isArray(res.stores) && res.stores.length > 0) {
      return res.stores;
    }
    return STORES;
  }

  async getServices() {
    return SERVICES;
  }

  async login(emailOrPhone, password) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: emailOrPhone, password })
    });
    if (res && res.token) {
      await AsyncStorage.setItem('paw_user_token', res.token);
      return { success: true, user: res.user || USER_SEED };
    }
    // Offline / Demo fallback
    return {
      success: true,
      user: {
        ...USER_SEED,
        email: emailOrPhone.includes('@') ? emailOrPhone : 'customer@thepawstreet.com',
        phone: !emailOrPhone.includes('@') ? emailOrPhone : '+91 98450 11223'
      }
    };
  }

  async createOrder(orderPayload) {
    const res = await this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderPayload)
    });
    if (res && res.success) {
      return res;
    }
    return {
      success: true,
      order: {
        id: `PAW-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'Order Placed',
        createdAt: new Date().toISOString(),
        ...orderPayload
      }
    };
  }
}

export const api = new ApiService();

