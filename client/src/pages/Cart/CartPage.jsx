import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Minus, 
  Plus, 
  ArrowRight, 
  ShoppingBag, 
  Sparkles, 
  Tag, 
  ShieldCheck, 
  MapPin, 
  ChevronRight, 
  CheckCircle2,
  X
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLocationContext } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';

export default function CartPage() {
  const navigate = useNavigate();
  const { user, setIsAuthModalOpen } = useAuth();
  const { 
    items, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    itemsTotal, 
    mrpTotal,
    deliveryFee, 
    platformFee, 
    couponDiscount, 
    totalSavings, 
    finalTotal, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon,
    showToast
  } = useCart();

  const { selectedLocation, setIsLocationModalOpen } = useLocationContext();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const result = applyCoupon(couponInput);
    if (!result.success) {
      setCouponError(result.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto shadow-inner text-4xl">
          🛒
        </div>
        <div className="space-y-2">
          <h2 className="font-heading font-black text-2xl text-slate-800">Your Cart is Empty</h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Looks like you haven't added anything to your cart yet. Explore food, treats, toys, and grooming essentials!
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-sm rounded-2xl shadow-lg hover:shadow-amber-500/25 transition-all"
        >
          <span>Explore Pet Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 md:pb-12">
      
      {/* Top Breadcrumb & Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900">
            My Cart ({items.reduce((sum, i) => sum + i.quantity, 0)} Items)
          </h1>
          <p className="text-xs text-slate-500">Superfast 15-20 min instant delivery enabled</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-600 font-bold hover:underline"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left Column: Cart Items List matching reference UI */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Delivery Location Preview Card */}
          <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Delivering to</div>
                <div className="text-xs font-extrabold text-slate-800 line-clamp-1">{selectedLocation.shortDisplay}</div>
              </div>
            </div>
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="text-xs font-extrabold text-amber-700 hover:text-amber-900 underline shrink-0"
            >
              Change
            </button>
          </div>

          {/* Cart Item Cards */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.selectedSize}`}
                className="flex items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 border border-slate-100 p-1 flex items-center justify-center shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-800 line-clamp-2">
                    {item.name}
                  </h4>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Size: <span className="font-semibold text-slate-600">{item.selectedSize}</span>
                  </div>
                  <div className="text-sm sm:text-base font-black text-slate-900 mt-1">
                    ₹{item.price}
                  </div>
                </div>

                {/* Quantity Controls + Delete Button matching reference screenshot */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <div className="flex items-center bg-slate-100 rounded-xl border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.selectedSize, -1)}
                      className="p-1.5 sm:p-2 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                    <span className="px-2.5 sm:px-3 text-xs sm:text-sm font-extrabold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.selectedSize, 1)}
                      className="p-1.5 sm:p-2 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Increase quantity"
                    >
                      <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id, item.selectedSize)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add more items prompt */}
          <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 text-xs">
            <span className="text-slate-600 font-medium">Missed something for your pet?</span>
            <Link to="/products" className="font-bold text-amber-600 hover:underline flex items-center gap-1">
              <span>+ Add More Items</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Bill Details, Coupons, Savings Banner & Checkout CTA */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Apply Coupon Box */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h4 className="font-heading font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-500" />
              Apply Coupons & Offers
            </h4>

            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="font-extrabold text-xs">{appliedCoupon.code}</span>
                    <span className="text-[11px] block text-emerald-700 font-medium">{appliedCoupon.label}</span>
                  </div>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs font-bold text-rose-600 hover:underline p-1"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. PAWFIRST)"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value);
                      setCouponError('');
                    }}
                    className="flex-1 bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl uppercase font-bold text-slate-800 outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-[11px] text-rose-600 font-semibold">{couponError}</p>
                )}
              </form>
            )}
          </div>

          {/* Bill Summary */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <h4 className="font-heading font-extrabold text-sm text-slate-800 uppercase tracking-wider pb-3 border-b border-slate-100">
              Bill Summary
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Item Total (MRP)</span>
                <span className="font-bold text-slate-800">₹{mrpTotal}</span>
              </div>

              {mrpTotal > itemsTotal && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount on MRP</span>
                  <span>- ₹{mrpTotal - itemsTotal}</span>
                </div>
              )}

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>- ₹{couponDiscount}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Instant Delivery Partner Fee</span>
                <span>{deliveryFee === 0 ? <strong className="text-emerald-600 uppercase">FREE</strong> : `₹${deliveryFee}`}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Platform & Packaging Fee</span>
                <span className="font-bold text-slate-800">₹{platformFee}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <div>
                  <span className="font-heading font-extrabold text-sm text-slate-900 block">Total Amount</span>
                  <span className="text-[10px] text-slate-400">Inclusive of all applicable taxes</span>
                </div>
                <span className="text-xl sm:text-2xl font-black text-slate-900">₹{finalTotal}</span>
              </div>
            </div>

            {/* Proceed to Checkout CTA */}
            <button
              onClick={() => {
                if (!user || !user.isLoggedIn) {
                  showToast('🔒 Please sign in to proceed to checkout!');
                  setIsAuthModalOpen(true);
                  return;
                }
                navigate('/checkout');
              }}
              className="w-full py-3.5 bg-[#E5A015] hover:bg-[#D49010] active:scale-98 text-slate-950 font-bold text-sm sm:text-base rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
            </button>

            {/* Green Savings Text matching screenshot ("You saved ₹200 on this order!") */}
            {totalSavings > 0 && (
              <p className="text-center text-xs font-bold text-emerald-600 pt-1">
                You saved ₹{totalSavings} on this order!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
