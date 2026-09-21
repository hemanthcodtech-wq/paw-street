/**
 * PAW NEAR Universal API Client
 * Seamlessly interfaces with Node.js/Express backend across Local Dev and Production
 */

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '');
  }
  // If running in local browser, default to backend port 5000
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:5000/api';
  }
  // Production fallback relative path
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Generic Fetch Wrapper with automatic JSON handling & Bearer Auth token
 */
async function request(endpoint, options = {}) {
  // Determine the best token based on current route or active role
  const isVendorPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/vendor');
  const isAdminPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  const isDeliveryPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/delivery');

  let token = null;
  if (isVendorPath) {
    token = localStorage.getItem('paw_vendor_token') || localStorage.getItem('paw_token');
  } else if (isAdminPath) {
    token = localStorage.getItem('paw_admin_token') || localStorage.getItem('paw_token');
  } else if (isDeliveryPath) {
    token = localStorage.getItem('paw_rider_token') || localStorage.getItem('paw_token');
  } else {
    token = localStorage.getItem('paw_token') || localStorage.getItem('paw_vendor_token') || localStorage.getItem('paw_admin_token');
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(`[API REQUEST ERROR] ${endpoint}:`, error.message);
    return { success: false, message: error.message, isOffline: true };
  }
}

export const api = {
  // Base configuration
  getBaseUrl: () => API_BASE_URL,

  // 1. Health Check
  getHealth: () => request('/health'),
  getPlatformCms: () => request('/platform/cms'),

  // 2. Authentication & Google Auth
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (body) => request('/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }),
  sendOtp: (email, purpose) => request('/auth/send-otp', { method: 'POST', body: JSON.stringify({ email, purpose }) }),
  verifyOtp: (email, otp) => request('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ email, otp }) }),
  googleAuth: (credential, profile) => request('/auth/google', { method: 'POST', body: JSON.stringify({ credential, profile }) }),
  getProfile: () => request('/auth/me'),
  updateProfile: (body) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),

  // 3. Products & Services
  getProducts: (params = '') => request(`/products${params ? `?${params}` : ''}`),
  getProductById: (id) => request(`/products/${id}`),
  createProduct: (body) => request('/products', { method: 'POST', body: JSON.stringify(body) }),
  updateProduct: (id, data) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),

  // ----------------------------------------------------------------------
  // VENDORS
  // ----------------------------------------------------------------------
  getVendors: () => request('/vendors'),
  getVendorById: (id) => request(`/vendors/${id}`),

  // ----------------------------------------------------------------------
  // PLATFORM & ADMIN
  // ----------------------------------------------------------------------
  submitVendorOnboarding: (body) => request('/vendors/onboarding', { method: 'POST', body: JSON.stringify(body) }),
  getVendors: () => request('/vendors'),
  getVendorProfile: () => request('/vendors/profile'),
  updateVendorProfile: (body) => request('/vendors/profile', { method: 'PUT', body: JSON.stringify(body) }),
  toggleStoreOpen: () => request('/vendors/toggle-open', { method: 'PUT' }),
  getVendorDashboardStats: () => request('/vendors/dashboard-stats'),
  getVendorOrders: () => request('/vendors/orders'),
  getVendorCatalog: () => request('/vendors/products'),
  createVendorProduct: (body) => request('/vendors/products', { method: 'POST', body: JSON.stringify(body) }),
  updateVendorProduct: (id, body) => request(`/vendors/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteVendorProduct: (id) => request(`/vendors/products/${id}`, { method: 'DELETE' }),
  updateVendorOrderStatus: (orderId, status) => request(`/vendors/orders/${orderId}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  assignVendorOrderDelivery: (orderId, deliveryBoyId) => request(`/vendors/orders/${orderId}/assign`, { method: 'PUT', body: JSON.stringify({ deliveryBoyId }) }),
  getVendorDeliveryTeam: () => request('/vendors/delivery-team'),
  addVendorDeliveryBoy: (body) => request('/vendors/delivery-team', { method: 'POST', body: JSON.stringify(body) }),
  updateVendorDeliveryBoy: (id, body) => request(`/vendors/delivery-team/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteVendorDeliveryBoy: (id) => request(`/vendors/delivery-team/${id}`, { method: 'DELETE' }),

  // 5. Orders & Live Tracking
  createOrder: (body) => request('/orders', { method: 'POST', body: JSON.stringify(body) }),
  getOrderById: (id) => request(`/orders/${id}`),
  getMyOrders: () => request('/orders'),
  updateOrderStatus: (id, status, notes) => request(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status, notes }) }),

  // 6. Payments & Razorpay
  createRazorpayOrder: (amount, receipt) => request('/payments/razorpay/create-order', { method: 'POST', body: JSON.stringify({ amount, receipt }) }),
  verifyRazorpayPayment: (body) => request('/payments/razorpay/verify-payment', { method: 'POST', body: JSON.stringify(body) }),
  collectCodPayment: (orderId, amountCollected) => request('/payments/cod/collect', { method: 'POST', body: JSON.stringify({ orderId, amountCollected }) }),

  // 7. Delivery Partner
  getDeliveryProfile: () => request('/delivery/profile'),
  toggleDeliveryDuty: (onlineStatus) => request('/delivery/duty-toggle', { method: 'PUT', body: JSON.stringify({ onlineStatus }) }),
  reconcileCashDeposit: (body) => request('/delivery/reconcile-deposit', { method: 'POST', body: JSON.stringify(body) }),

  // 8. Admin Governance & CMS (Connected directly to MongoDB)
  getAdminMetrics: () => request('/admin/metrics'),
  getAdminVendors: () => request('/admin/vendors'),
  approveVendor: (id, commissionRate) => request(`/admin/vendors/${id}/approve`, { method: 'PUT', body: JSON.stringify({ commissionRate }) }),
  rejectVendor: (id, rejectionReason) => request(`/admin/vendors/${id}/reject`, { method: 'PUT', body: JSON.stringify({ rejectionReason }) }),
  toggleVendorStatus: (id) => request(`/admin/vendors/${id}/toggle-status`, { method: 'PUT' }),
  updateVendorCommission: (id, commissionRate) => request(`/admin/vendors/${id}/commission`, { method: 'PUT', body: JSON.stringify({ commissionRate }) }),
  getAdminProducts: () => request('/admin/products'),
  approveProduct: (id) => request(`/admin/products/${id}/approve`, { method: 'PUT' }),
  rejectProduct: (id, rejectionReason) => request(`/admin/products/${id}/reject`, { method: 'PUT', body: JSON.stringify({ rejectionReason }) }),
  updateAdminProductTags: (id, tags) => request(`/admin/products/${id}/tags`, { method: 'PUT', body: JSON.stringify({ tags }) }),
  getAdminCms: () => request('/admin/cms'),
  updateAdminCms: (body) => request('/admin/cms', { method: 'PUT', body: JSON.stringify(body) }),
  getAdminBusinessSettings: () => request('/admin/business-settings'),
  updateAdminBusinessSettings: (body) => request('/admin/business-settings', { method: 'PUT', body: JSON.stringify(body) }),
  getAdminFinanceLedger: () => request('/admin/finance-ledger'),
  processAdminVendorPayout: (vendorId, body = {}) => request(`/admin/payouts/${vendorId}/process`, { method: 'POST', body: JSON.stringify(body) }),
  getAdminOrders: () => request('/admin/orders'),

  // 9. Cloudinary Image Upload
  uploadImage: async (file, folder = 'pawnear/general') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData
      });
      return await response.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  }
};

export default api;
