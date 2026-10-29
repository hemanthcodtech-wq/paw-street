import React, { createContext, useContext, useState } from 'react';
import { VENDOR_ORDERS, VENDOR_PRODUCTS } from '../data/mockPartnerData';

const VendorContext = createContext();

export function VendorProvider({ children }) {
  const [vendorOrders, setVendorOrders] = useState(VENDOR_ORDERS);
  const [products, setProducts] = useState(VENDOR_PRODUCTS);
  const [isStoreOpen, setIsStoreOpen] = useState(true);

  const toggleStock = (productId) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, inStock: !p.inStock } : p))
    );
  };

  const addProduct = (newProduct) => {
    const prod = {
      id: `prod-${Date.now()}`,
      stock: 20,
      inStock: true,
      image: newProduct.image || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80',
      ...newProduct
    };
    setProducts(prev => [prod, ...prev]);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setVendorOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
  };

  const toggleStoreStatus = () => {
    setIsStoreOpen(prev => !prev);
  };

  return (
    <VendorContext.Provider
      value={{
        vendorOrders,
        products,
        isStoreOpen,
        toggleStock,
        addProduct,
        updateOrderStatus,
        toggleStoreStatus
      }}
    >
      {children}
    </VendorContext.Provider>
  );
}

export function useVendor() {
  const context = useContext(VendorContext);
  if (!context) throw new Error('useVendor must be within VendorProvider');
  return context;
}

