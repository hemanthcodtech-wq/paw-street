import AsyncStorage from '@react-native-async-storage/async-storage';
import { SEED_VENDOR, SEED_DELIVERY_RIDER, VENDOR_ORDERS, VENDOR_PRODUCTS } from '../data/mockPartnerData';

const DEFAULT_API_BASE_URL = 'http://localhost:5000/api';

class PartnerApiService {
  constructor() {
    this.baseUrl = DEFAULT_API_BASE_URL;
  }

  setBaseUrl(url) {
    this.baseUrl = url;
  }

  async getToken() {
    try {
      return await AsyncStorage.getItem('paw_partner_token');
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

  async partnerLogin(email, password, role = 'vendor') {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role })
    });

    if (res && res.token) {
      await AsyncStorage.setItem('paw_partner_token', res.token);
      return { success: true, user: res.user };
    }

    // Offline / Demo fallback
    const fallbackUser = role === 'vendor' ? { ...SEED_VENDOR, email } : { ...SEED_DELIVERY_RIDER, email };
    await AsyncStorage.setItem('paw_partner_token', 'mock_partner_token');
    return { success: true, user: fallbackUser };
  }

  async getVendorOrders() {
    const res = await this.request('/vendors/orders');
    if (res && res.success && Array.isArray(res.orders)) {
      return res.orders;
    }
    return VENDOR_ORDERS;
  }

  async getDeliveryDutyProfile() {
    const res = await this.request('/delivery/profile');
    if (res && res.success && res.rider) {
      return res.rider;
    }
    return SEED_DELIVERY_RIDER;
  }
}

export const partnerApi = new PartnerApiService();

