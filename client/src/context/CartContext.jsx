import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user, setIsAuthModalOpen } = useAuth();

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('paw_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('paw_wishlist');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState({ code: 'PAWFIRST', discount: 200, label: 'First Order Discount' });
  const [toastMessage, setToastMessage] = useState(null);

  // Sync cart with localStorage
  useEffect(() => {
    localStorage.setItem('paw_cart', JSON.stringify(items));
  }, [items]);

  // Sync wishlist with localStorage
  useEffect(() => {
    localStorage.setItem('paw_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const requireAuth = (actionName = 'perform this action') => {
    if (!user || !user.isLoggedIn) {
      showToast(`🔒 Please sign in to ${actionName}!`);
      setIsAuthModalOpen(true);
      return false;
    }
    return true;
  };

  const addToCart = (product, selectedSize = null, quantity = 1) => {
    if (!requireAuth('add items to your cart')) {
      return false;
    }

    setItems(prevItems => {
      const sizeToUse = selectedSize || product.selectedSize || (product.sizes && product.sizes[0]?.size) || 'Standard';
      const existingIndex = prevItems.findIndex(item => item.id === product.id && item.selectedSize === sizeToUse);
      
      const priceToUse = product.sizes ? (product.sizes.find(s => s.size === sizeToUse)?.price || product.price) : product.price;
      const mrpToUse = product.sizes ? (product.sizes.find(s => s.size === sizeToUse)?.mrp || product.mrp) : product.mrp;

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        showToast(`Updated quantity for ${product.shortName || product.name}`);
        return updated;
      } else {
        showToast(`Added ${product.shortName || product.name} to cart`);
        return [
          ...prevItems,
          {
            id: product.id,
            name: `${product.shortName || product.name} (${sizeToUse})`,
            shortName: product.shortName || product.name,
            category: product.category,
            price: priceToUse,
            mrp: mrpToUse,
            selectedSize: sizeToUse,
            quantity: quantity,
            image: product.image,
            storeName: product.storeName || 'Paws & Whiskers',
            vendorId: product.vendor || product.vendorId || ''
          }
        ];
      }
    });
    return true;
  };

  const updateQuantity = (id, selectedSize, delta) => {
    if (!requireAuth('update cart items')) return;
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

  const toggleWishlist = (productId) => {
    if (!requireAuth('save favorite items')) {
      return false;
    }

    setWishlist(prev => {
      if (prev.includes(productId)) {
        showToast('Removed from Wishlist');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to Wishlist ❤️');
        return [...prev, productId];
      }
    });
    return true;
  };

  const isWishlisted = (productId) => wishlist.includes(productId);

  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'PAWFIRST') {
      setAppliedCoupon({ code: 'PAWFIRST', discount: 200, label: 'First Order Special (₹200 OFF)' });
      showToast('Coupon PAWFIRST applied! Saved ₹200');
      return { success: true, message: 'Coupon applied successfully!' };
    } else if (cleanCode === 'PAWFEST50') {
      setAppliedCoupon({ code: 'PAWFEST50', discount: 150, label: 'Pet Festival (₹150 OFF)' });
      showToast('Coupon PAWFEST50 applied! Saved ₹150');
      return { success: true, message: 'Coupon applied successfully!' };
    } else if (cleanCode === 'FREEDELIVERY') {
      setAppliedCoupon({ code: 'FREEDELIVERY', discount: 49, label: 'Free Express Delivery' });
      showToast('Free delivery coupon applied!');
      return { success: true, message: 'Free Delivery applied!' };
    } else {
      return { success: false, message: 'Invalid or expired coupon code' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  // Calculations
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const itemsTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const mrpTotal = items.reduce((acc, item) => acc + (item.mrp || item.price * 1.25) * item.quantity, 0);
  const rawSavings = Math.max(0, mrpTotal - itemsTotal);
  
  const deliveryFee = itemsTotal >= 499 || itemsTotal === 0 ? 0 : 39;
  const platformFee = items.length > 0 ? 9 : 0;
  const couponDiscount = appliedCoupon ? Math.min(appliedCoupon.discount, itemsTotal) : 0;
  const totalSavings = rawSavings + couponDiscount;
  
  const finalTotal = Math.max(0, itemsTotal + deliveryFee + platformFee - couponDiscount);

  return (
    <CartContext.Provider
      value={{
        items,
        wishlist,
        itemCount,
        itemsTotal,
        mrpTotal,
        deliveryFee,
        platformFee,
        couponDiscount,
        totalSavings,
        finalTotal,
        appliedCoupon,
        toastMessage,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isWishlisted,
        applyCoupon,
        removeCoupon,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
