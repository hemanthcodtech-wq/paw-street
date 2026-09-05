import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// User Pages
import HomePage from '../pages/Home/HomePage';
import ProductsPage from '../pages/Products/ProductsPage';
import ProductDetailPage from '../pages/ProductDetail/ProductDetailPage';
import ServicesPage from '../pages/Services/ServicesPage';
import StoresPage from '../pages/Stores/StoresPage';
import CartPage from '../pages/Cart/CartPage';
import CheckoutPage from '../pages/Checkout/CheckoutPage';
import OrderSuccessPage from '../pages/OrderSuccess/OrderSuccessPage';
import LiveTrackingPage from '../pages/LiveTracking/LiveTrackingPage';
import AccountPage from '../pages/Account/AccountPage';
import SupportPage from '../pages/Support/SupportPage';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';

// Vendor Module Pages & Layout (Section 4)
import VendorLayout from '../components/vendor/VendorLayout';
import VendorLoginPage from '../pages/Vendor/VendorLoginPage';
import VendorOnboardingPage from '../pages/Vendor/VendorOnboardingPage';
import VendorDashboardPage from '../pages/Vendor/VendorDashboardPage';
import VendorProductsPage from '../pages/Vendor/VendorProductsPage';
import VendorOrdersPage from '../pages/Vendor/VendorOrdersPage';
import VendorDeliveryTeamPage from '../pages/Vendor/VendorDeliveryTeamPage';
import VendorStoreProfilePage from '../pages/Vendor/VendorStoreProfilePage';

// Admin Module Pages & Layout (Section 3)
import AdminLayout from '../components/admin/AdminLayout';
import AdminLoginPage from '../pages/Admin/AdminLoginPage';
import AdminDashboardPage from '../pages/Admin/AdminDashboardPage';
import AdminVendorsPage from '../pages/Admin/AdminVendorsPage';
import AdminProductsPage from '../pages/Admin/AdminProductsPage';
import AdminRevenuePage from '../pages/Admin/AdminRevenuePage';
import AdminPlatformPage from '../pages/Admin/AdminPlatformPage';
import AdminSupportPage from '../pages/Admin/AdminSupportPage';

// Delivery Module Pages & Layout (Section 5)
import DeliveryLayout from '../components/delivery/DeliveryLayout';
import DeliveryLoginPage from '../pages/Delivery/DeliveryLoginPage';
import DeliveryDashboardPage from '../pages/Delivery/DeliveryDashboardPage';
import DeliveryLiveMapPage from '../pages/Delivery/DeliveryLiveMapPage';
import DeliveryCodPage from '../pages/Delivery/DeliveryCodPage';
import DeliveryEarningsPage from '../pages/Delivery/DeliveryEarningsPage';

export default function AppRouter() {
  const location = useLocation();

  return (
    <div key={location.pathname} className="page-transition">
      <Routes location={location}>
      {/* Home Discovery */}
      <Route path="/" element={<HomePage />} />

      {/* Product Catalog & Discovery */}
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/category/:categoryId" element={<ProductsPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />

      {/* Grooming, Clinic & Boarding Services */}
      <Route path="/services" element={<ServicesPage />} />

      {/* Multi-Vendor Stores Directory */}
      <Route path="/stores" element={<StoresPage />} />
      <Route path="/store/:storeId" element={<StoresPage />} />

      {/* Cart & Checkout */}
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />

      {/* Order Success & Swiggy-Style Live Map Tracking */}
      <Route path="/order-success/:id" element={<OrderSuccessPage />} />
      <Route path="/track-order/:id" element={<LiveTrackingPage />} />

      {/* User Account, Pet Profiles, Wishlist & Orders */}
      <Route path="/account" element={<AccountPage />} />
      <Route path="/account/orders" element={<AccountPage />} />
      <Route path="/account/wishlist" element={<AccountPage />} />
      <Route path="/account/addresses" element={<AccountPage />} />

      {/* Authentication Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/signup" element={<RegisterPage />} />

      {/* In-App Customer Support & Returns */}
      <Route path="/support" element={<SupportPage />} />

      {/* 4. Vendor Module Routes */}
      <Route path="/vendor/login" element={<VendorLoginPage />} />
      <Route path="/vendor/onboarding" element={<VendorOnboardingPage />} />
      <Route path="/vendor/register" element={<VendorOnboardingPage />} />
      
      {/* 4.2 Vendor Store Management Routes with VendorLayout */}
      <Route path="/vendor" element={<VendorLayout><VendorDashboardPage /></VendorLayout>} />
      <Route path="/vendor/dashboard" element={<VendorLayout><VendorDashboardPage /></VendorLayout>} />
      <Route path="/vendor/products" element={<VendorLayout><VendorProductsPage /></VendorLayout>} />
      <Route path="/vendor/orders" element={<VendorLayout><VendorOrdersPage /></VendorLayout>} />
      <Route path="/vendor/delivery-team" element={<VendorLayout><VendorDeliveryTeamPage /></VendorLayout>} />
      <Route path="/vendor/store-profile" element={<VendorLayout><VendorStoreProfilePage /></VendorLayout>} />

      {/* 3. Admin Module Routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
      <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
      <Route path="/admin/vendors" element={<AdminLayout><AdminVendorsPage /></AdminLayout>} />
      <Route path="/admin/products" element={<AdminLayout><AdminProductsPage /></AdminLayout>} />
      <Route path="/admin/revenue" element={<AdminLayout><AdminRevenuePage /></AdminLayout>} />
      <Route path="/admin/platform" element={<AdminLayout><AdminPlatformPage /></AdminLayout>} />
      <Route path="/admin/support" element={<AdminLayout><AdminSupportPage /></AdminLayout>} />

      {/* 5. Delivery Partner Module Routes */}
      <Route path="/delivery/login" element={<DeliveryLoginPage />} />
      <Route path="/delivery" element={<DeliveryLayout><DeliveryDashboardPage /></DeliveryLayout>} />
      <Route path="/delivery/dashboard" element={<DeliveryLayout><DeliveryDashboardPage /></DeliveryLayout>} />
      <Route path="/delivery/navigation" element={<DeliveryLayout><DeliveryLiveMapPage /></DeliveryLayout>} />
      <Route path="/delivery/cod" element={<DeliveryLayout><DeliveryCodPage /></DeliveryLayout>} />
      <Route path="/delivery/earnings" element={<DeliveryLayout><DeliveryEarningsPage /></DeliveryLayout>} />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </div>
  );
}
