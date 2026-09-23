import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import LoadingFallback from '../components/common/LoadingFallback';

// 1. Customer Storefront Pages (Lazy Loaded)
const HomePage = lazy(() => import('../pages/Home/HomePage'));
const ProductsPage = lazy(() => import('../pages/Products/ProductsPage'));
const ProductDetailPage = lazy(() => import('../pages/ProductDetail/ProductDetailPage'));
const ServicesPage = lazy(() => import('../pages/Services/ServicesPage'));
const StoresPage = lazy(() => import('../pages/Stores/StoresPage'));
const CartPage = lazy(() => import('../pages/Cart/CartPage'));
const CheckoutPage = lazy(() => import('../pages/Checkout/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('../pages/OrderSuccess/OrderSuccessPage'));
const LiveTrackingPage = lazy(() => import('../pages/LiveTracking/LiveTrackingPage'));
const AccountPage = lazy(() => import('../pages/Account/AccountPage'));
const SupportPage = lazy(() => import('../pages/Support/SupportPage'));
const LoginPage = lazy(() => import('../pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/Auth/RegisterPage'));
const NotFoundPage = lazy(() => import('../pages/NotFound/NotFoundPage'));

// 2. Vendor Module Pages & Layout (Lazy Loaded)
const VendorLayout = lazy(() => import('../components/vendor/VendorLayout'));
const VendorLoginPage = lazy(() => import('../pages/Vendor/VendorLoginPage'));
const VendorOnboardingPage = lazy(() => import('../pages/Vendor/VendorOnboardingPage'));
const VendorDashboardPage = lazy(() => import('../pages/Vendor/VendorDashboardPage'));
const VendorProductsPage = lazy(() => import('../pages/Vendor/VendorProductsPage'));
const VendorOrdersPage = lazy(() => import('../pages/Vendor/VendorOrdersPage'));
const VendorDeliveryTeamPage = lazy(() => import('../pages/Vendor/VendorDeliveryTeamPage'));
const VendorStoreProfilePage = lazy(() => import('../pages/Vendor/VendorStoreProfilePage'));

// 3. Admin Module Pages & Layout (Lazy Loaded)
const AdminLayout = lazy(() => import('../components/admin/AdminLayout'));
const AdminLoginPage = lazy(() => import('../pages/Admin/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('../pages/Admin/AdminDashboardPage'));
const AdminVendorsPage = lazy(() => import('../pages/Admin/AdminVendorsPage'));
const AdminProductsPage = lazy(() => import('../pages/Admin/AdminProductsPage'));
const AdminRevenuePage = lazy(() => import('../pages/Admin/AdminRevenuePage'));
const AdminPlatformPage = lazy(() => import('../pages/Admin/AdminPlatformPage'));

// 4. Delivery Module Pages & Layout (Lazy Loaded)
const DeliveryLayout = lazy(() => import('../components/delivery/DeliveryLayout'));
const DeliveryLoginPage = lazy(() => import('../pages/Delivery/DeliveryLoginPage'));
const DeliveryDashboardPage = lazy(() => import('../pages/Delivery/DeliveryDashboardPage'));
const DeliveryLiveMapPage = lazy(() => import('../pages/Delivery/DeliveryLiveMapPage'));
const DeliveryCodPage = lazy(() => import('../pages/Delivery/DeliveryCodPage'));

export default function AppRouter() {
  const location = useLocation();

  return (
    <div key={location.pathname} className="page-transition">
      <Suspense fallback={<LoadingFallback />}>
        <Routes location={location}>
          {/* Public Discovery & Storefront */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/category/:categoryId" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/store/:storeId" element={<StoresPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/support" element={<SupportPage />} />

          {/* Public Auth Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/signup" element={<RegisterPage />} />

          {/* Protected Customer Routes */}
          <Route path="/checkout" element={<ProtectedRoute role="customer"><CheckoutPage /></ProtectedRoute>} />
          <Route path="/order-success/:id" element={<ProtectedRoute role="customer"><OrderSuccessPage /></ProtectedRoute>} />
          <Route path="/track-order/:id" element={<ProtectedRoute role="customer"><LiveTrackingPage /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute role="customer"><AccountPage /></ProtectedRoute>} />
          <Route path="/account/orders" element={<ProtectedRoute role="customer"><AccountPage /></ProtectedRoute>} />
          <Route path="/account/wishlist" element={<ProtectedRoute role="customer"><AccountPage /></ProtectedRoute>} />
          <Route path="/account/addresses" element={<ProtectedRoute role="customer"><AccountPage /></ProtectedRoute>} />

          {/* 4. Vendor Module Routes */}
          <Route path="/vendor/login" element={<VendorLoginPage />} />
          <Route path="/vendor/onboarding" element={<VendorOnboardingPage />} />
          <Route path="/vendor/register" element={<VendorOnboardingPage />} />
          
          {/* Protected Vendor Management Routes */}
          <Route path="/vendor" element={<ProtectedRoute role="vendor"><VendorLayout><VendorDashboardPage /></VendorLayout></ProtectedRoute>} />
          <Route path="/vendor/dashboard" element={<ProtectedRoute role="vendor"><VendorLayout><VendorDashboardPage /></VendorLayout></ProtectedRoute>} />
          <Route path="/vendor/products" element={<ProtectedRoute role="vendor"><VendorLayout><VendorProductsPage /></VendorLayout></ProtectedRoute>} />
          <Route path="/vendor/orders" element={<ProtectedRoute role="vendor"><VendorLayout><VendorOrdersPage /></VendorLayout></ProtectedRoute>} />
          <Route path="/vendor/delivery-team" element={<ProtectedRoute role="vendor"><VendorLayout><VendorDeliveryTeamPage /></VendorLayout></ProtectedRoute>} />
          <Route path="/vendor/store-profile" element={<ProtectedRoute role="vendor"><VendorLayout><VendorStoreProfilePage /></VendorLayout></ProtectedRoute>} />

          {/* 3. Admin Module Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          
          {/* Protected Admin Governance Routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout><AdminDashboardPage /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminLayout><AdminDashboardPage /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/vendors" element={<ProtectedRoute role="admin"><AdminLayout><AdminVendorsPage /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute role="admin"><AdminLayout><AdminProductsPage /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/revenue" element={<ProtectedRoute role="admin"><AdminLayout><AdminRevenuePage /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/platform" element={<ProtectedRoute role="admin"><AdminLayout><AdminPlatformPage /></AdminLayout></ProtectedRoute>} />

          {/* 5. Delivery Partner Module Routes */}
          <Route path="/delivery/login" element={<DeliveryLoginPage />} />
          
          {/* Protected Delivery Operations Routes */}
          <Route path="/delivery" element={<ProtectedRoute role="delivery"><DeliveryLayout><DeliveryDashboardPage /></DeliveryLayout></ProtectedRoute>} />
          <Route path="/delivery/dashboard" element={<ProtectedRoute role="delivery"><DeliveryLayout><DeliveryDashboardPage /></DeliveryLayout></ProtectedRoute>} />
          <Route path="/delivery/navigation" element={<ProtectedRoute role="delivery"><DeliveryLayout><DeliveryLiveMapPage /></DeliveryLayout></ProtectedRoute>} />
          <Route path="/delivery/cod" element={<ProtectedRoute role="delivery"><DeliveryLayout><DeliveryCodPage /></DeliveryLayout></ProtectedRoute>} />

          {/* 404 Not Found Catch-All Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}
