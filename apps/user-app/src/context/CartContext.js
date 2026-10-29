import React, { createContext, useContext, useState, useMemo } from 'react';
import { COUPONS } from '../data/mockData';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([
    {
      id: 'prod-1',
      name: 'Royal Canin Maxi Adult Dog Food',
      price: 3499,
      originalPrice: 3899,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80',
      storeName: 'Paw Street Central Store',
      weight: '4 kg'
    }
  ]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [deliverySpeed, setDeliverySpeed] = useState('standard'); // standard | express
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        showToast(`Updated ${product.name} quantity`);
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      showToast(`Added ${product.name} to cart`);
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
    showToast('Item removed from cart');
  };

  const updateQuantity = (productId, delta) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code) => {
    const found = COUPONS.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (found) {
      setAppliedCoupon(found);
      showToast(`Coupon ${found.code} applied!`);
      return { success: true, coupon: found };
    }
    return { success: false, message: 'Invalid or expired coupon' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    const calc = Math.round((subtotal * appliedCoupon.discount) / 100);
    return Math.min(calc, appliedCoupon.maxDiscount);
  }, [subtotal, appliedCoupon]);

  const deliveryFee = useMemo(() => {
    if (cartItems.length === 0) return 0;
    if (subtotal > 999) return 0;
    return deliverySpeed === 'express' ? 99 : 49;
  }, [subtotal, cartItems.length, deliverySpeed]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + deliveryFee);
  }, [subtotal, discountAmount, deliveryFee]);

  const totalItemCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discountAmount,
        deliveryFee,
        deliverySpeed,
        setDeliverySpeed,
        total,
        totalItemCount,
        toastMessage,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be within CartProvider');
  return context;
}

