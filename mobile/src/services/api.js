import AsyncStorage from '@react-native-async-storage/async-storage';
import { PRODUCTS, STORES, SERVICES, COUPONS, USER_SEED } from '../data/mockData';

// On Android Emulator localhost is 10.0.2.2, on iOS simulator it's localhost:5000, or local LAN IP
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
      return await AsyncStorage.getItem('paw_mobile_token');
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
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 second timeout

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const data = await response.json();
      return data;
    } catch (error) {
      // Offline fallback
      return { success: false, isOffline: true, message: error.message };
    }
  }

  // 1. Products API
  async getProducts() {
    const res = await this.request('/products');
    if (res && res.success && Array.isArray(res.products) && res.products.length > 0) {
      return res.products.map(p => ({
        ...p,
        id: p._id || p.id,
        name: p.title || p.name,
        image: p.primaryImage || p.image || p.images?.[0] || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80',
        storeName: p.vendorName || p.storeName || 'Paw Street Superstore',
        price: p.price || 999,
        mrp: p.mrp || 1299
      }));
    }
    return PRODUCTS;
  }

  async getProductById(id) {
    const res = await this.request(`/products/${id}`);
    if (res && res.success && res.product) {
      return res.product;
    }
    return PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
  }

  // 2. Stores API
  async getStores() {
    const res = await this.request('/vendors');
    if (res && res.success && Array.isArray(res.vendors) && res.vendors.length > 0) {
      return res.vendors.map(v => ({
        id: v._id || v.id,
        name: v.storeName || v.name || 'Paw Partner Store',
        rating: v.rating || 4.8,
        reviewsCount: v.reviewsCount || 40,
        city: v.location?.city || 'Banjara Hills, Hyderabad',
        distance: '1.5 km',
        eta: '15 min',
        isOpen: v.isStoreOpen !== false,
        tags: ['Verified', 'Quick Delivery'],
        image: v.photos?.storeFront || v.photos?.logo || 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=600&q=80'
      }));
    }
    return STORES;
  }

  // 3. Services API
  async getServices() {
    return SERVICES;
  }

  // 4. Coupons
  async getCoupons() {
    const res = await this.request('/platform/cms');
    if (res && res.success && res.cms?.coupons?.length > 0) {
      return res.cms.coupons;
    }
    return COUPONS;
  }

  // 5. Auth API
  async login(emailOrPhone, password) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: emailOrPhone, password })
    });
    if (res && res.success && res.token) {
      await AsyncStorage.setItem('paw_mobile_token', res.token);
      return res;
    }
    // Simulation / dev login
    const devUser = {
      ...USER_SEED,
      email: emailOrPhone.includes('@') ? emailOrPhone : 'customer@thepawstreet.com',
      phone: emailOrPhone.includes('@') ? '+91 98765 43210' : emailOrPhone
    };
    await AsyncStorage.setItem('paw_mobile_token', 'dev_token_mobile_123');
    await AsyncStorage.setItem('paw_mobile_user', JSON.stringify(devUser));
    return { success: true, user: devUser, token: 'dev_token_mobile_123' };
  }

  async getProfile() {
    const res = await this.request('/auth/me');
    if (res && res.success && (res.user || res.data)) {
      return res.user || res.data;
    }
    const saved = await AsyncStorage.getItem('paw_mobile_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return USER_SEED;
  }

  // 6. Orders
  async createOrder(orderData) {
    const res = await this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
    if (res && res.success && res.order) {
      return res;
    }
    // Dev fallback order creation
    const fallbackOrder = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      deliveryAddress: orderData.deliveryAddress,
      paymentMethod: orderData.paymentMethod || 'COD',
      eta: '25-30 min'
    };
  // 7. Vendor Onboarding
  async submitVendorOnboarding(formData) {
    const res = await this.request('/vendor/onboarding', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    if (res && res.success) {
      return res;
    }
    return {
      success: true,
      vendor: {
        id: `vnd-${Date.now().toString().slice(-6)}`,
        ...formData,
        status: 'pending'
      }
    };
  }
}

export const api = new ApiService();
