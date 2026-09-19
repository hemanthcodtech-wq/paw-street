import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';
import { useDelivery } from '../../context/DeliveryContext';
import { useVendor } from '../../context/VendorContext';

/**
 * Role-based Protected Route Component
 * Guarantees that only authorized and authenticated users can access protected modules.
 */
export default function ProtectedRoute({ children, role = 'customer' }) {
  const location = useLocation();
  const { user } = useAuth();
  const { isAuthenticated: isAdminAuthenticated, isAuthChecking: isAdminAuthChecking } = useAdmin();
  const { isAuthenticated: isDeliveryAuthenticated } = useDelivery();
  const { vendor } = useVendor();

  // 1. Admin Role Guard
  if (role === 'admin') {
    if (isAdminAuthChecking) {
      return null;
    }
    if (!isAdminAuthenticated) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    return children;
  }

  // 2. Vendor Role Guard
  if (role === 'vendor') {
    const isVendorAuth = !!localStorage.getItem('paw_vendor_token') && vendor && (vendor.status === 'approved' || vendor.status === 'pending');
    if (!isVendorAuth) {
      return <Navigate to="/vendor/login" state={{ from: location }} replace />;
    }
    return children;
  }

  // 3. Delivery Partner Role Guard
  if (role === 'delivery') {
    if (!isDeliveryAuthenticated) {
      return <Navigate to="/delivery/login" state={{ from: location }} replace />;
    }
    return children;
  }

  // 4. Customer User Guard (Account, Checkout, Orders)
  if (role === 'customer') {
    if (!user || !user.isLoggedIn) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
  }

  return children;
}
