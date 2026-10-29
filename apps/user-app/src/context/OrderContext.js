import React, { createContext, useContext, useState } from 'react';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([
    {
      id: 'PAW-782910',
      date: 'Today, 2:15 PM',
      total: 3499,
      status: 'Out for Delivery',
      estimatedDelivery: 'Today by 4:30 PM',
      otp: '4821',
      rider: {
        name: 'Raju Kumar (Paw Rider)',
        phone: '+91 98451 22334',
        vehicle: 'EV Scooter (TS 09 EQ 4421)',
        rating: 4.9
      },
      items: [
        {
          name: 'Royal Canin Maxi Adult Dog Food',
          quantity: 1,
          price: 3499,
          image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80'
        }
      ],
      deliveryAddress: 'Flat 402, Green Valley Apts, Road 12, Banjara Hills, Hyderabad',
      paymentMethod: 'Prepaid (UPI)'
    }
  ]);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState(null);

  const placeOrder = (orderDetails) => {
    const newOrder = {
      id: `PAW-${Math.floor(100000 + Math.random() * 900000)}`,
      date: 'Just Now',
      status: 'Order Confirmed',
      estimatedDelivery: 'In 35-45 minutes',
      otp: `${Math.floor(1000 + Math.random() * 9000)}`,
      rider: {
        name: 'Ramesh Reddy (Express Delivery)',
        phone: '+91 97000 88991',
        vehicle: 'Honda Activa (TS 07 JK 9102)',
        rating: 4.8
      },
      ...orderDetails
    };
    setOrders(prev => [newOrder, ...prev]);
    setActiveTrackingOrder(newOrder);
    return newOrder;
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        activeTrackingOrder,
        setActiveTrackingOrder,
        placeOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrder must be within OrderProvider');
  return context;
}

