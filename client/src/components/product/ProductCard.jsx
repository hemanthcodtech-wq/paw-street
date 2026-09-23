import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Heart, Plus, Minus, ShoppingBag, Zap, ShieldCheck, Calendar } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import BookingModal from '../service/BookingModal';

export default function ProductCard({ product, layout = 'grid' }) {
  const navigate = useNavigate();
  const { items, addToCart, updateQuantity, toggleWishlist, isWishlisted } = useCart();
  const [bookingSalon, setBookingSalon] = useState(null);

  const wishlisted = isWishlisted(product.id);
  const isServiceCard = Boolean(product?.isService || product?.type === 'service');
  
  // Check if item is already in cart
  const cartItem = items.find(item => item.id === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  const defaultSize = product.selectedSize || (product.sizes && product.sizes[0]?.size) || 'Standard';
  const displayPrice = product.sizes ? (product.sizes.find(s => s.isDefault)?.price || product.price) : product.price;
  const displayMrp = product.sizes ? (product.sizes.find(s => s.isDefault)?.mrp || product.mrp) : product.mrp;

  const serviceSalon = isServiceCard ? {
    id: product.vendorId || product.storeId || product.id,
    vendorId: product.vendorId || product.vendor || product.storeId || '',
    name: product.storeName || product.brand || 'PAW NEAR Service Partner',
    type: (product.category || '').toLowerCase().includes('clinic') || (product.category || '').toLowerCase().includes('vet') ? 'clinic' : 'grooming',
    tagline: product.description || 'Certified pet care service near you',
    address: product.storeAddress || 'Hyderabad',
    rating: product.rating || 4.8,
    reviewsCount: product.reviewsCount || 0,
    distance: product.storeDistance || 'Nearby',
    image: product.image,
    homeServiceEnabled: true,
    clinicVisitEnabled: true,
    homeVisitingFee: product.visitingFee || 99,
    services: [{
      id: product.id,
      _id: product._id || product.id,
      vendorId: product.vendorId || product.vendor || product.storeId || '',
      vendorName: product.storeName || product.brand || 'PAW NEAR Service Partner',
      name: product.name,
      desc: product.description || '',
      price: product.price || 0,
      originalPrice: product.mrp || product.price || 0,
      image: product.image || '/images/cat_grooming.jpg'
    }]
  } : null;

  if (isServiceCard && layout !== 'deal') {
    const isHorizontalService = layout === 'horizontal' || layout === 'list';
    return (
      <>
        <div className={`group bg-white rounded-2xl border border-slate-200/80 hover:border-amber-300 hover:shadow-md transition-all duration-300 overflow-hidden relative ${
          isHorizontalService
            ? layout === 'list' ? 'w-full min-h-[152px] flex flex-row p-3' : 'w-[290px] sm:w-[320px] shrink-0 min-h-[152px] flex flex-row p-3'
            : 'p-3.5 sm:p-4'
        }`}>
          <div className={`relative bg-white overflow-hidden flex items-center justify-center p-2 shrink-0 ${
            isHorizontalService ? 'w-24 sm:w-28 self-stretch rounded-xl border border-slate-100 bg-slate-50/80' : 'aspect-square w-full'
          }`}>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(product.id);
              }}
              className="absolute top-1 right-1 z-10 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white shadow-xs border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all active:scale-90"
              title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${wishlisted ? 'text-rose-500 fill-rose-500' : ''}`} />
            </button>

            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className={`flex-1 flex flex-col justify-between min-w-0 ${isHorizontalService ? 'pl-3' : 'pt-2.5'}`}>
            <div>
              <div className="flex items-center justify-between gap-1 text-[9px] sm:text-[11px] text-slate-400 mb-1">
                <span className="font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {serviceSalon?.type === 'clinic' ? 'Vet Care' : 'Grooming'}
                </span>
                <span className="font-medium shrink-0">{product.storeDistance || 'Nearby'}</span>
              </div>

              <h4 className="font-heading font-black text-slate-900 text-xs sm:text-[13px] line-clamp-2 hover:text-amber-600 transition-colors leading-snug">
                {product.shortName || product.name}
              </h4>
            </div>

            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="text-sm sm:text-base font-black text-slate-900">₹{displayPrice || product.price}</span>
              <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                <span>{product.rating || 4.8}</span>
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              </div>
            </div>

            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={() => setBookingSalon(serviceSalon)}
                className="flex-1 min-w-0 py-2 bg-[#E5A015] hover:bg-[#D49010] text-slate-950 font-black text-[11px] rounded-xl transition-all duration-200 flex items-center justify-center gap-1 active:scale-95 shadow-xs"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Appointment</span>
              </button>
            </div>
          </div>
        </div>

        {bookingSalon && (
          <BookingModal
            salon={bookingSalon}
            isOpen={!!bookingSalon}
            onClose={() => setBookingSalon(null)}
          />
        )}
      </>
    );
  }

  if (layout === 'deal') {
    const discount = displayMrp > displayPrice ? Math.round(((displayMrp - displayPrice) / displayMrp) * 100) : 0;
    return (
      <div className="group flex flex-col gap-2 sm:gap-3 relative">
        {/* Image Container with Border and Heart */}
        <div className="relative aspect-square rounded-2xl sm:rounded-[20px] border border-slate-200 overflow-hidden bg-white p-2 sm:p-4 flex items-center justify-center group-hover:border-amber-300 transition-colors">
          <Link to={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white shadow-xs border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all active:scale-90 z-10"
            title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${wishlisted ? 'text-rose-500 fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Details */}
        <Link to={`/product/${product.id}`} className="flex flex-col px-0.5">
          <h4 className="font-bold text-slate-900 text-[11px] sm:text-sm line-clamp-1 leading-snug">
            {product.name}
          </h4>
          <div className="mt-0.5 sm:mt-1 font-black text-slate-900 text-xs sm:text-base">
            ₹{displayPrice}
          </div>
          {discount > 0 ? (
            <div className="text-[10px] sm:text-xs font-black text-[#F26E21] mt-0.5 tracking-wide">
              {discount}% OFF
            </div>
          ) : (
            <div className="text-[10px] sm:text-xs font-black text-transparent mt-0.5">
              0% OFF
            </div>
          )}
        </Link>
      </div>
    );
  }

  if (layout === 'horizontal' || layout === 'list') {
    const isList = layout === 'list';
    return (
      <div className={`group flex bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400 hover:shadow-md transition-all duration-200 p-3 ${isList ? 'w-full min-h-[130px] sm:min-h-[140px]' : 'w-[290px] sm:w-[320px] shrink-0 min-h-[148px] sm:min-h-[152px]'}`}>
        {/* Left Image */}
        <div className="relative w-24 sm:w-28 h-auto self-stretch bg-slate-50/80 rounded-xl overflow-hidden flex items-center justify-center p-2 shrink-0 border border-slate-100">
          <Link to={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300 drop-shadow-xs"
            />
          </Link>
        </div>
        
        {/* Right Content */}
        <div className="flex-1 flex flex-col justify-between pl-3 min-w-0">
          <div>
            <Link to={`/product/${product.id}`}>
              <h4 className="font-heading font-black text-slate-900 text-xs sm:text-[13px] leading-snug line-clamp-2 hover:text-amber-600 transition-colors">
                {product.shortName || product.name}
              </h4>
            </Link>
            
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-1">
              <span className="truncate">{product.brand || 'Pets Villa'}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100 shrink-0" />
            </div>
            
            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-slate-500 font-medium mt-1">
              <div className="flex items-center gap-0.5 text-slate-700 font-bold">
                <Star className="w-3 h-3 text-[#FFB703] fill-[#FFB703]" />
                <span>{product.rating}</span>
                <span className="text-[10px] text-slate-400 font-normal">({product.reviewsCount > 999 ? '1.2k' : (product.reviewsCount || 140)})</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100/60">
            <div className="flex items-baseline gap-1">
              <span className="font-black text-slate-900 text-sm sm:text-base">
                ₹{displayPrice}
              </span>
              {displayMrp > displayPrice && (
                <span className="text-[10px] text-slate-400 line-through">
                  ₹{displayMrp}
                </span>
              )}
            </div>

            {inCartQty > 0 ? (
              <div className="flex items-center justify-between bg-[#FFB703] text-slate-950 font-black rounded-lg overflow-hidden px-1.5 py-1 text-xs shadow-xs">
                <button
                  onClick={() => updateQuantity(product.id, defaultSize, -1)}
                  className="p-1 hover:scale-110 active:scale-95 transition-transform"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3 stroke-[3]" />
                </button>
                <span className="px-2 font-bold">{inCartQty}</span>
                <button
                  onClick={() => updateQuantity(product.id, defaultSize, 1)}
                  className="p-1 hover:scale-110 active:scale-95 transition-transform"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3 stroke-[3]" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(product, defaultSize, 1)}
                className="bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-lg transition-all active:scale-95 shadow-xs flex items-center gap-1 ml-auto"
              >
                <span>ADD</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/80 hover:border-amber-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden relative p-3.5 sm:p-4">
      
      {/* Top Media Container */}
      <div className="relative aspect-square w-full bg-white overflow-hidden flex items-center justify-center p-2">
        
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-1 right-1 z-10 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white shadow-xs border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all active:scale-90"
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${wishlisted ? 'text-rose-500 fill-rose-500' : ''}`} />
        </button>

        {/* Product Image Link */}
        <Link to={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>

      {/* Product Content Details */}
      <div className="flex-1 flex flex-col justify-between pt-2.5">
        <div>
          {/* Brand & Distance */}
          <div className="flex items-center justify-between gap-1 text-[9px] sm:text-[11px] text-slate-400 mb-1">
            <span className="font-bold uppercase tracking-wider text-slate-500 truncate">{product.brand}</span>
            <span className="font-medium shrink-0">{product.storeDistance || '0.8 km'}</span>
          </div>

          {/* Title */}
          <Link to={`/product/${product.id}`}>
            <h4 className="font-heading font-black text-slate-900 text-xs sm:text-sm line-clamp-1 hover:text-amber-600 transition-colors leading-snug">
              {product.shortName || product.name}
            </h4>
          </Link>
          {product.category === 'pet-sale' && (
            <p className="text-[10px] text-slate-500 mt-1 truncate">
              {product.petType}{product.breed ? ` • ${product.breed}` : ''}{product.ageYears !== null && product.ageYears !== undefined ? ` • ${product.ageYears} yrs` : ''}
            </p>
          )}
        </div>

        {/* Price & Rating Bottom Row */}
        <div className="mt-2.5 flex items-center justify-between">
          <span className="text-base sm:text-lg font-black text-slate-900">
            ₹{displayPrice}
          </span>

          <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
            <span>{product.rating}</span>
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          </div>
        </div>

        {/* Quick Add CTA Bar with Full Pill Rounded Stepper matching screenshot */}
        <div className="mt-3 flex items-center gap-2">
          {inCartQty > 0 ? (
            <div className="flex-1 flex items-center justify-between bg-[#E5A015] hover:bg-[#D49010] text-slate-950 font-black rounded-full overflow-hidden shadow-xs px-2 py-1.5 text-xs sm:text-sm transition-colors">
              <button
                onClick={() => updateQuantity(product.id, cartItem.selectedSize, -1)}
                className="p-0.5 hover:scale-125 active:scale-90 transition-transform font-black"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
              <span className="text-xs sm:text-sm font-black">{inCartQty}</span>
              <button
                onClick={() => updateQuantity(product.id, cartItem.selectedSize, 1)}
                className="p-0.5 hover:scale-125 active:scale-90 transition-transform font-black"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product, defaultSize, 1)}
              className="flex-1 py-1.5 bg-amber-50/90 hover:bg-[#E5A015] text-amber-900 hover:text-slate-950 rounded-full text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1 active:scale-95 border border-amber-200 hover:border-[#E5A015] shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
          
          <button
            onClick={() => {
              const success = inCartQty > 0 ? true : addToCart(product, defaultSize, 1);
              if (success) {
                navigate('/checkout');
              }
            }}
            className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold transition-all duration-200 flex items-center justify-center active:scale-95 shadow-2xs"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
