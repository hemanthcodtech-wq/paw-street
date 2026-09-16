import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    try {
      const token = localStorage.getItem('paw_token');
      if (!token) return [];
      const cached = localStorage.getItem('paw_orders');
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return [];
  });

  // Sync orders with backend if token available
  useEffect(() => {
    const token = localStorage.getItem('paw_token');
    if (!token) {
      setOrders([]);
      return;
    }
    api.getMyOrders().then(res => {
      // Backend returns { success, orders } array
      const fetched = res?.orders || res?.data;
      if (res && res.success && Array.isArray(fetched) && fetched.length > 0) {
        // Map backend order shape to frontend display shape
        const mapped = fetched.map(o => ({
          id: o.orderId || o._id,
          _id: o._id,
          date: o.createdAt ? new Date(o.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Just now',
          timestamp: o.createdAt ? new Date(o.createdAt).getTime() : Date.now(),
          status: o.status || 'placed',
          statusLabel: o.status === 'placed' ? 'Order Placed' : o.status === 'out_for_delivery' ? 'Out for Delivery' : o.status === 'delivered' ? 'Delivered' : o.status === 'cancelled' ? 'Cancelled' : 'In Progress',
          store: { name: 'Paws & Whiskers Supermart' },
          items: (o.items || []).map(i => ({
            name: i.title,
            image: i.image || '/images/prod_pedigree.jpg',
            quantity: i.quantity,
            price: i.price,
            size: i.serviceMode || 'Standard'
          })),
          paymentMode: o.payment?.method === 'COD' ? 'Cash on Delivery' : 'Online (Razorpay / UPI / Cards)',
          totalAmount: o.pricing?.total || 0,
          deliveryAddress: o.shippingAddress || {}
        }));
        setOrders(prev => {
          // Merge: keep local-only orders (not yet synced) and replace any with same id
          const backendIds = new Set(mapped.map(o => o.id));
          const localOnly = prev.filter(o => !backendIds.has(o.id));
          return [...mapped, ...localOnly];
        });
        localStorage.setItem('paw_orders', JSON.stringify(mapped));
      }
    }).catch(err => console.log('Offline orders sync notice'));
  }, []);

  const placeOrder = async (orderData) => {
    const newId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const addr = orderData.deliveryAddress || {};

    // Frontend display order object
    const newOrder = {
      id: newId,
      date: 'Just now',
      timestamp: Date.now(),
      status: 'placed',
      statusLabel: 'Order Placed',
      deliveryType: orderData.deliverySpeed || 'Instant 20-Min Express',
      store: {
        name: 'Paws & Whiskers Supermart',
        address: 'Road No 10, Jubilee Hills, Hyderabad',
        phone: '+91 98480 12345'
      },
      deliveryAddress: addr,
      rider: {
        name: 'Suresh Kumar',
        phone: '+91 91234 56789',
        rating: 4.9,
        trips: 1840,
        vehicle: 'Hero Electric (TS09 EK 4821)',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        currentEta: '18 mins'
      },
      items: orderData.items,
      paymentMode: orderData.paymentMethod,
      itemTotal: orderData.itemsTotal,
      discount: orderData.couponDiscount,
      deliveryFee: orderData.deliveryFee,
      platformFee: orderData.platformFee,
      totalAmount: orderData.finalTotal,
      deliveryOtp: `${Math.floor(1000 + Math.random() * 9000)}`,
      liveCoordinates: {
        store: { lat: 17.4319, lng: 78.4073 },
        customer: { lat: 17.4156, lng: 78.4350 },
        rider: { lat: 17.4319, lng: 78.4073 }
      }
    };

    // Backend-compatible payload with correct field names
    const backendPayload = {
      customerName: addr.name || 'Pet Parent',
      customerEmail: orderData.customerEmail || '',
      customerPhone: addr.phone || orderData.customerPhone || '+91 98451 22334',
      items: (orderData.items || []).map(item => ({
        id: item.id,
        name: item.name || item.shortName,
        title: item.name || item.shortName || 'Pet Product',
        image: item.image || '/images/prod_pedigree.jpg',
        price: item.price,
        quantity: item.quantity,
        vendorId: item.vendorId || '',
        vendorName: item.storeName || '',
        type: item.type || 'product',
        selectedSize: item.selectedSize || item.size || ''
      })),
      shippingAddress: {
        street: addr.addressLine1 || addr.shortDisplay || 'Hyderabad',
        city: addr.city || 'Hyderabad',
        pincode: addr.pincode || '500034',
        lat: addr.lat || 17.4156,
        lng: addr.lng || 78.4350
      },
      pricing: {
        subtotal: orderData.itemsTotal || 0,
        deliveryFee: orderData.deliveryFee || 0,
        discount: orderData.couponDiscount || 0,
        total: orderData.finalTotal || 0
      },
      payment: {
        method: orderData.paymentMethod === 'Cash on Delivery' ? 'COD' : 'RAZORPAY_ONLINE',
        status: orderData.paymentMethod === 'Cash on Delivery' ? 'pending' : 'paid'
      }
    };

    // Persist to backend — update local id if backend returns one
    try {
      const res = await api.createOrder(backendPayload);
      if (res?.success && res?.order) {
        newOrder.id = res.order.orderId || newOrder.id;
        newOrder._id = res.order._id;
      }
    } catch (err) {
      console.warn('Order saved locally only:', err);
    }

    setOrders(prev => [newOrder, ...prev]);
    localStorage.setItem('paw_orders', JSON.stringify([newOrder, ...orders]));
    return newOrder;
  };

  const getOrderById = (id) => {
    return orders.find(o => o.id === id || o._id === id) || orders[0];
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        getOrderById
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within OrderProvider');
  return context;
}
