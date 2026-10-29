import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

const OrderContext = createContext();

const INITIAL_ORDERS = [
  {
    id: 'ORD-89412',
    date: 'Today, 2:15 PM',
    status: 'out_for_delivery', // 'placed', 'preparing', 'out_for_delivery', 'delivered'
    statusText: 'Rider is on the way with your pet essentials!',
    items: [
      { name: 'Drools Focus Adult Super Premium (3 kg)', quantity: 1, price: 1899 },
      { name: 'Neem & Tea Tree Organic Pet Shampoo', quantity: 1, price: 420 }
    ],
    totalAmount: 2119,
    deliveryAddress: 'Flat 402, Royal Palms Residency, Road No 12, Banjara Hills',
    eta: '12 min',
    rider: {
      name: 'Ramesh Kumar',
      vehicle: 'Hero Splendor (TS 09 EA 4120)',
      phone: '+91 91234 56789',
      rating: 4.9,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    timeline: [
      { step: 'Order Placed', time: '02:00 PM', done: true },
      { step: 'Store Packed', time: '02:08 PM', done: true },
      { step: 'Rider Picked Up', time: '02:14 PM', done: true },
      { step: 'Out for Delivery', time: '02:16 PM', done: true, current: true },
      { step: 'Delivered', time: 'Est. 02:28 PM', done: false }
    ]
  }
];

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [activeOrder, setActiveOrder] = useState(INITIAL_ORDERS[0]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const saved = await AsyncStorage.getItem('paw_mobile_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          setOrders(parsed);
          setActiveOrder(parsed[0]);
        }
      }
    } catch (e) {
      console.warn('Failed to load orders', e);
    }
  };

  const placeOrder = async (orderPayload) => {
    const newOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      date: 'Just now',
      status: 'preparing',
      statusText: 'Paw Street store is packing your items',
      items: orderPayload.items,
      totalAmount: orderPayload.totalAmount,
      deliveryAddress: orderPayload.deliveryAddress,
      paymentMethod: orderPayload.paymentMethod || 'Cash on Delivery (COD)',
      eta: '18 min',
      rider: {
        name: 'Suresh Varma',
        vehicle: 'Honda Activa (TS 08 EF 9921)',
        phone: '+91 98877 66554',
        rating: 4.8,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
      },
      timeline: [
        { step: 'Order Placed', time: 'Just now', done: true },
        { step: 'Store Packed', time: 'In progress', done: false, current: true },
        { step: 'Rider Picked Up', time: 'Upcoming', done: false },
        { step: 'Out for Delivery', time: 'Upcoming', done: false },
        { step: 'Delivered', time: 'Est. 18 min', done: false }
      ]
    };

    const updated = [newOrder, ...orders];
    setOrders(updated);
    setActiveOrder(newOrder);
    await AsyncStorage.setItem('paw_mobile_orders', JSON.stringify(updated));

    // Call backend API if reachable
    api.createOrder(orderPayload).catch(() => {});

    return newOrder;
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        activeOrder,
        setActiveOrder,
        placeOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
