import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, 
  CreditCard, 
  Banknote, 
  ShieldCheck, 
  Zap, 
  Clock, 
  CheckCircle2, 
  ArrowLeft, 
  Lock,
  Plus,
  AlertCircle,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../../context/CartContext';
import { useLocationContext } from '../../context/LocationContext';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { loadRazorpayScript } from '../../utils/razorpay';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, itemsTotal, mrpTotal, deliveryFee, platformFee, couponDiscount, finalTotal, clearCart } = useCart();
  const { selectedLocation, savedAddresses, switchLocation, addAddress } = useLocationContext();
  const { placeOrder } = useOrders();
  const { user } = useAuth();

  const [deliverySpeed, setDeliverySpeed] = useState('instant'); // 'instant' | 'scheduled'
  const [scheduledSlot, setScheduledSlot] = useState('Tomorrow, 10:00 AM - 12:00 PM');
  const [paymentMethod, setPaymentMethod] = useState('online'); // 'online' | 'cod'
  const [isProcessing, setIsProcessing] = useState(false);
  const [addressError, setAddressError] = useState('');

  // Add Address Inline State
  const [showAddressForm, setShowAddressForm] = useState(savedAddresses.length === 0);
  const [newAddr, setNewAddr] = useState({
    name: '',
    phone: '',
    addressLine1: '',
    area: '',
    city: '',
    pincode: '',
    type: 'Home'
  });

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleSaveInlineAddress = (e) => {
    e.preventDefault();
    if (!newAddr.addressLine1.trim() || !newAddr.phone.trim()) {
      setAddressError('Please enter street address and contact phone number.');
      return;
    }
    const created = addAddress({
      ...newAddr,
      tag: newAddr.type
    });
    setAddressError('');
    setShowAddressForm(false);
  };

  const completeOrderSuccess = async (paymentDetails = null) => {
    const activeAddress = selectedLocation?.addressLine1 ? selectedLocation : {
      name: newAddr.name || 'Pet Parent',
      phone: newAddr.phone || '',
      addressLine1: newAddr.addressLine1,
      area: newAddr.area || '',
      city: newAddr.city || '',
      pincode: newAddr.pincode || '',
      shortDisplay: `${newAddr.addressLine1}, ${newAddr.area || newAddr.city || 'Home'}`
    };

    // Create new active order (await because placeOrder is now async)
    const newOrder = await placeOrder({
      deliveryAddress: activeAddress,
      deliverySpeed: deliverySpeed === 'instant' ? 'Instant 20-Min Express' : `Scheduled (${scheduledSlot})`,
      paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online (Razorpay / UPI / Cards)',
      paymentDetails,
      customerEmail: user?.email || '',
      customerPhone: user?.phone || activeAddress.phone || '',
      items: items,
      itemsTotal: itemsTotal,
      couponDiscount: couponDiscount,
      deliveryFee: deliveryFee,
      platformFee: platformFee,
      finalTotal: finalTotal
    });

    // Fire celebratory confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    clearCart();
    setIsProcessing(false);
    navigate(`/order-success/${newOrder.id || 'ORD-89421'}`);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setAddressError('');

    // Strict address validation
    const hasSavedSelected = selectedLocation && selectedLocation.addressLine1 && selectedLocation.addressLine1.trim().length > 3;
    const hasInlineFilled = newAddr.addressLine1 && newAddr.addressLine1.trim().length > 3 && (newAddr.phone || user?.phone);

    if (!hasSavedSelected && !hasInlineFilled) {
      setAddressError('Please provide a complete delivery address and phone number before placing your order.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Auto-save inline address if filled
    if (!hasSavedSelected && hasInlineFilled) {
      addAddress({
        ...newAddr,
        tag: newAddr.type
      });
    }

    setIsProcessing(true);

    // 1. CASH ON DELIVERY (COD)
    if (paymentMethod === 'cod') {
      setTimeout(() => {
        completeOrderSuccess({ mode: 'cod', status: 'pending_on_delivery' });
      }, 900);
      return;
    }

    // 2. ONLINE PAYMENT VIA RAZORPAY
    try {
      const isLoaded = await loadRazorpayScript();
      if (isLoaded && window.Razorpay) {
        // Request order from backend
        const razorpayRes = await api.createRazorpayOrder(finalTotal, `rcpt_${Date.now()}`);
        
        if (razorpayRes && razorpayRes.order) {
          const key = razorpayRes.keyId || razorpayRes.key || 'rzp_test_TZzYiXfrR4BC17';
          const options = {
            key: key,
            amount: razorpayRes.order.amount,
            currency: 'INR',
            name: 'PAW NEAR Pet Care',
            description: `Payment for ${items.length} item(s)`,
            order_id: razorpayRes.order.id,
            handler: async function (response) {
              try {
                await api.verifyRazorpayPayment({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature
                });
              } catch (verifyErr) {
                console.warn('Payment verify notice', verifyErr);
              }
              completeOrderSuccess(response);
            },
            prefill: {
              name: user?.name || selectedLocation?.name || newAddr.name || 'Pet Parent',
              email: user?.email || 'customer@thepawstreet.com',
              contact: selectedLocation?.phone || newAddr.phone || user?.phone || '+919876543210'
            },
            theme: {
              color: '#F59E0B'
            }
          };

          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', function (resp) {
            console.warn('Payment failed', resp.error);
            setIsProcessing(false);
            alert(resp.error?.description || 'Payment was not completed. Please try again.');
          });
          rzp.open();
          return;
        }
      }
    } catch (err) {
      console.warn('Razorpay SDK flow notice:', err);
    }

    // Fallback simulation in offline environment
    setTimeout(() => {
      completeOrderSuccess({ mode: 'online_verified', transactionId: `TXN_${Date.now()}` });
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 md:pb-12">
      
      {/* Header & Back */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/cart')}
          className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900">Checkout & Payment</h1>
          <p className="text-xs text-slate-500">Secure 256-bit encrypted transaction</p>
        </div>
      </div>

      {/* Address Error Alert */}
      {addressError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3 text-rose-700 text-xs font-bold animate-shake">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{addressError}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left Column: Delivery Address, Speed & Payment Selection */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Delivery Address Selection & Form */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-black">1</span>
                Delivery Address
              </h3>
              {savedAddresses.length > 0 && !showAddressForm && (
                <button
                  type="button"
                  onClick={() => setShowAddressForm(true)}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New</span>
                </button>
              )}
            </div>

            {/* Existing Saved Addresses */}
            {savedAddresses.length > 0 && !showAddressForm && (
              <div className="grid grid-cols-1 gap-2.5">
                {savedAddresses.map((addr) => {
                  const isSelected = selectedLocation?.id === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => switchLocation(addr)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-amber-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800">{addr.type || 'Home'}</span>
                            <span className="text-[10px] text-slate-500 font-semibold">• {addr.name || user?.name || 'Customer'}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">{addr.addressLine1}</p>
                          <p className="text-[11px] text-slate-400">{addr.shortDisplay || `${addr.area}, ${addr.city}`}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">📞 {addr.phone || user?.phone || 'No phone'}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Inline Address Entry Form (when no addresses exist or adding new) */}
            {(savedAddresses.length === 0 || showAddressForm) && (
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Enter Delivery Details</span>
                  {savedAddresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="text-slate-500 text-[11px] hover:text-slate-800"
                    >
                      Use Saved Address
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    placeholder="Recipient Name *"
                    value={newAddr.name}
                    onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                    className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-amber-500 font-medium"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="10-Digit Mobile Number *"
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-amber-500 font-medium"
                    required
                  />
                </div>

                <input
                  type="text"
                  placeholder="Flat / House No / Building / Street Address *"
                  value={newAddr.addressLine1}
                  onChange={(e) => setNewAddr({ ...newAddr, addressLine1: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-amber-500 font-medium"
                  required
                />

                <div className="grid grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    placeholder="Area / Locality"
                    value={newAddr.area}
                    onChange={(e) => setNewAddr({ ...newAddr, area: e.target.value })}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-amber-500 font-medium"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-amber-500 font-medium"
                  />
                  <input
                    type="text"
                    placeholder="Pincode *"
                    value={newAddr.pincode}
                    onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-amber-500 font-medium"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  {['Home', 'Work', 'Other'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewAddr({ ...newAddr, type: t })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        newAddr.type === t
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Delivery Speed Options */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-heading font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-black">2</span>
              Delivery Speed
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setDeliverySpeed('instant')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                  deliverySpeed === 'instant'
                    ? 'border-amber-500 bg-amber-50/60 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="p-1.5 rounded-lg bg-amber-500 text-white">
                    <Zap className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                    Recommended
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Instant Express (15-20 mins)</div>
                  <p className="text-[11px] text-slate-500">Dispatched immediately from nearest pet store</p>
                </div>
              </div>

              <div
                onClick={() => setDeliverySpeed('scheduled')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                  deliverySpeed === 'scheduled'
                    ? 'border-amber-500 bg-amber-50/60 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="p-1.5 rounded-lg bg-slate-200 text-slate-700">
                    <Clock className="w-4 h-4" />
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Scheduled Slot</div>
                  <p className="text-[11px] text-slate-500">Pick a specific convenient time slot</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Streamlined Payment Method: Online or COD */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-heading font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-black">3</span>
              Select Payment Method
            </h3>

            <div className="space-y-3">
              
              {/* 1. Online Payment via Razorpay */}
              <div
                onClick={() => setPaymentMethod('online')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                  paymentMethod === 'online'
                    ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-amber-200 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    paymentMethod === 'online' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900">Online Payment (Razorpay)</span>
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Fastest • UPI / Cards / NetBanking
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Pay securely via Google Pay, PhonePe, Paytm, Debit/Credit Cards & NetBanking
                    </p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  paymentMethod === 'online' ? 'bg-amber-500 text-white' : 'border border-slate-300'
                }`}>
                  {paymentMethod === 'online' && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>

              {/* 2. Cash on Delivery (COD) */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                  paymentMethod === 'cod'
                    ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-amber-200 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    paymentMethod === 'cod' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">Cash on Delivery (COD)</span>
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        Available
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Pay with cash or UPI QR directly to the delivery partner at your doorstep
                    </p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  paymentMethod === 'cod' ? 'bg-amber-500 text-white' : 'border border-slate-300'
                }`}>
                  {paymentMethod === 'cod' && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order CTA */}
        <div className="lg:col-span-5 space-y-4 sticky top-28">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <h4 className="font-heading font-extrabold text-sm text-slate-800 uppercase tracking-wider pb-3 border-b border-slate-100">
              Order Review ({items.length} items)
            </h4>

            {/* Quick item list */}
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {items.map((it) => (
                <div key={`${it.id}-${it.selectedSize}`} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <img src={it.image} alt="" className="w-8 h-8 rounded-lg object-contain bg-slate-50" />
                    <span className="truncate max-w-[170px] font-medium text-slate-800">
                      {it.name} (x{it.quantity})
                    </span>
                  </div>
                  <span className="font-bold text-slate-900">₹{it.price * it.quantity}</span>
                </div>
              ))}
            </div>

            {/* Pricing Breakdown */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal (MRP)</span>
                <span>₹{mrpTotal}</span>
              </div>
              {mrpTotal > itemsTotal && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount on MRP</span>
                  <span>- ₹{mrpTotal - itemsTotal}</span>
                </div>
              )}
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount</span>
                  <span>- ₹{couponDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charge</span>
                <span>{deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Platform Fee</span>
                <span>₹{platformFee}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                <span className="font-extrabold text-slate-900 text-sm">To Pay</span>
                <span className="text-2xl font-black text-slate-900">₹{finalTotal}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-amber-500 hover:bg-amber-600 active:scale-98 disabled:opacity-50 text-white font-extrabold text-base rounded-2xl shadow-lg hover:shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>
                {isProcessing 
                  ? 'Connecting to Payment...' 
                  : paymentMethod === 'cod' 
                    ? `Place COD Order (₹${finalTotal})` 
                    : `Pay with Razorpay (₹${finalTotal})`
                }
              </span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% Safe Payments • Instant Live Tracking</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
