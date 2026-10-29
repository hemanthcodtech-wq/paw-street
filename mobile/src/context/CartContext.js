import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COUPONS } from '../data/mockData';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(COUPONS[0]); // Default PAWFIRST
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    saveCart();
  }, [items, wishlist]);

  const loadCart = async () => {
    try {
      const savedItems = await AsyncStorage.getItem('paw_mobile_cart');
      const savedWishlist = await AsyncStorage.getItem('paw_mobile_wishlist');
      if (savedItems) setItems(JSON.parse(savedItems));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (e) {
      console.warn('Failed to load cart', e);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem('paw_mobile_cart', JSON.stringify(items));
      await AsyncStorage.setItem('paw_mobile_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Failed to save cart', e);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const addToCart = (product, selectedSize = null, quantity = 1) => {
    const size = selectedSize || (product.sizes && product.sizes[0]?.size) || 'Standard';
    const price = product.sizes ? (product.sizes.find(s => s.size === size)?.price || product.price) : product.price;
    const mrp = product.sizes ? (product.sizes.find(s => s.size === size)?.mrp || product.mrp) : product.mrp;

    setItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id && item.selectedSize === size);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        showToast(`Updated quantity for ${product.shortName || product.name}`);
        return next;
      } else {
        showToast(`Added ${product.shortName || product.name} to cart 🐾`);
        return [
          ...prev,
          {
            id: product.id,
            name: product.shortName || product.name,
            fullName: product.name,
            image: product.image,
            price,
            mrp,
            selectedSize: size,
            storeName: product.storeName,
            quantity
          }
        ];
      }
    });
  };

  const updateQuantity = (id, selectedSize, delta) => {
    setItems(prev => {
      return prev
        .map(item => {
          if (item.id === id && item.selectedSize === selectedSize) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (id, selectedSize) => {
    setItems(prev => prev.filter(item => !(item.id === id && item.selectedSize === selectedSize)));
    showToast('Item removed from cart');
  };

  const clearCart = () => {
    setItems([]);
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        showToast(`Removed from wishlist`);
        return prev.filter(p => p.id !== product.id);
      } else {
        showToast(`Saved to wishlist ❤️`);
        return [...prev, product];
      }
    });
  };

  const isWishlisted = (productId) => {
    return wishlist.some(p => p.id === productId);
  };

  const applyCoupon = (couponCode) => {
    const coupon = COUPONS.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase());
    if (coupon) {
      if (subtotal < coupon.minOrder) {
        showToast(`Minimum order ₹${coupon.minOrder} required for ${coupon.code}`);
        return false;
      }
      setAppliedCoupon(coupon);
      showToast(`Applied ${coupon.code}! Saved ₹${coupon.discount}`);
      return true;
    }
    showToast('Invalid coupon code');
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalMrp = items.reduce((sum, item) => sum + ((item.mrp || item.price) * item.quantity), 0);
  const discountMrp = totalMrp - subtotal;
  const deliveryFee = subtotal > 499 || subtotal === 0 ? 0 : 49;
  const couponDiscount = appliedCoupon && subtotal >= (appliedCoupon.minOrder || 0) ? appliedCoupon.discount : 0;
  const grandTotal = Math.max(0, subtotal + deliveryFee - couponDiscount);
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        wishlist,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isWishlisted,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        totalMrp,
        discountMrp,
        deliveryFee,
        couponDiscount,
        grandTotal,
        totalItemCount,
        toastMessage
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
