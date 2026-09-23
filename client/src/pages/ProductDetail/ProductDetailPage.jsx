import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Heart, 
  Share2, 
  ShoppingBag, 
  Zap, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Minus, 
  Plus, 
  Check, 
  Sparkles,
  ChevronRight,
  Store,
  MapPin,
  Clock
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import ProductCard from '../../components/product/ProductCard';
import { api } from '../../services/api';

// Normalize API product → shape expected by ProductCard & Detail Page
function normalizeProduct(p) {
  if (!p) return null;
  return {
    id: p._id || p.id,
    _id: p._id || p.id,
    name: p.title || p.name || 'Pet Item',
    shortName: (p.title || p.name || '').slice(0, 40),
    brand: p.vendorName || p.brand || 'PAW NEAR',
    category: p.category?.toLowerCase() || 'food',
    subcategory: p.subCategory || p.subcategory || '',
    petType: p.petType || 'All Pets',
    breed: p.breed || '',
    ageYears: p.ageYears,
    price: p.price || 0,
    mrp: p.mrp || p.price || 0,
    discountPercent: p.mrp && p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0,
    rating: p.rating || 4.5,
    reviewsCount: p.reviewsCount || 0,
    isTopPick: p.isFeatured || false,
    isInstantDelivery: p.type !== 'service',
    deliveryTimeMinutes: 20,
    storeId: p.vendor || 'store-1',
    storeName: p.vendorName || 'PAW NEAR Store',
    storeDistance: '1.5 km',
    image: p.primaryImage || (p.images && p.images[0]) || '/images/prod_pedigree.jpg',
    gallery: p.images && p.images.length > 0 ? p.images : [p.primaryImage || '/images/prod_pedigree.jpg'],
    type: p.type || 'product',
    isService: p.type === 'service',
    description: p.description || '',
    inStock: (p.stock || 0) > 0,
    stockCount: p.stock || 0,
    sizes: p.sizes || [], 
    features: p.features || [],
    feedingGuide: p.feedingGuide || '',
    composition: p.composition || ''
  };
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isWishlisted } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // States
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('desc'); // 'desc' | 'feeding' | 'nutrition' | 'reviews'

  // Fetch product from backend API
  const fetchProductData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getProductById(id);
      if (res?.success && res.product) {
        const norm = normalizeProduct(res.product);
        setProduct(norm);
        if (norm.sizes && norm.sizes.length > 0) {
          setSelectedSize(norm.sizes[0].size);
        }

        // Fetch related products
        const relatedRes = await api.getProducts(`category=${encodeURIComponent(norm.category)}`);
        if (relatedRes?.success && Array.isArray(relatedRes.products)) {
          const normRelated = relatedRes.products
            .map(normalizeProduct)
            .filter(p => p.id !== norm.id)
            .slice(0, 4);
          setRelatedProducts(normRelated);
        }
      } else {
        setError('Product not found.');
      }
    } catch (err) {
      setError('Failed to connect to server.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProductData();
    window.scrollTo(0, 0);
  }, [fetchProductData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 mt-12 max-w-2xl mx-auto space-y-4">
        <h3 className="font-heading font-extrabold text-slate-800 text-xl">{error || 'Product Not Found'}</h3>
        <p className="text-sm text-slate-500">The product you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-bold hover:bg-amber-600 transition-colors"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);

  // Calculate pricing based on chosen size
  const activeSizeObj = product.sizes?.find(s => s.size === selectedSize) || {
    size: selectedSize,
    price: product.price,
    mrp: product.mrp
  };
  
  const currentPrice = activeSizeObj.price;
  const currentMrp = activeSizeObj.mrp;
  const discount = currentMrp ? Math.round(((currentMrp - currentPrice) / currentMrp) * 100) : product.discountPercent;

  const galleryImages = product.gallery || [product.image];

  const handleAddToCart = () => {
    addToCart(product, selectedSize || null, quantity);
  };

  const handleBuyNow = () => {
    const success = addToCart(product, selectedSize || null, quantity);
    if (success) {
      navigate('/checkout');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-32 md:pb-12">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 font-semibold flex-wrap">
        <Link to="/" className="hover:text-amber-600">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-amber-600">Products</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category}`} className="hover:text-amber-600 capitalize">{product.category}</Link>
        <span>/</span>
        <span className="text-slate-800 font-bold truncate max-w-xs">{product.shortName || product.name}</span>
      </nav>

      {/* Main Product Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-4 sm:p-8 border border-slate-200/80 shadow-xs">
        
        {/* Left Column: Image Gallery with Pagination */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Main Hero Image Container */}
          <div className="relative aspect-square w-full rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center p-6 overflow-hidden group">
            
            {/* Pagination Badge */}
            <div className="absolute top-4 right-4 z-10 bg-slate-900/60 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
              {selectedImgIndex + 1}/{galleryImages.length}
            </div>

            {/* Instant Delivery badge */}
            <div className="absolute top-4 left-4 z-10 bg-amber-500 text-white text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>15-20 Min Delivery</span>
            </div>

            <img
              src={galleryImages[selectedImgIndex] || product.image}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Thumbnail Strip */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-3 justify-center">
              {galleryImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIndex(idx)}
                  className={`w-16 h-16 rounded-2xl border-2 p-1 overflow-hidden transition-all ${
                    selectedImgIndex === idx
                      ? 'border-amber-500 shadow-md scale-105'
                      : 'border-slate-200 hover:border-amber-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details, Benefits, Select Size, Quantity, CTA buttons */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Top Bar with Brand & Wishlist */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200">
                {product.brand}
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2 rounded-full border transition-all ${
                    wishlisted
                      ? 'bg-rose-50 border-rose-200 text-rose-500'
                      : 'border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-slate-50'
                  }`}
                  title={wishlisted ? 'In Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-5 h-5 ${wishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>
            </div>

            {/* Title & Sub-weight */}
            <div>
              <h1 className="font-heading font-black text-slate-900 text-xl sm:text-2xl md:text-3xl leading-snug">
                {product.shortName || product.name}
              </h1>
              {selectedSize && <p className="text-sm font-bold text-slate-700 mt-0.5">{selectedSize}</p>}
            </div>

            {/* Ratings & Reviews */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <span className="text-amber-500">★</span>
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.reviewsCount || 450} reviews)</span>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-3 py-1">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                ₹{currentPrice}
              </span>
              {currentMrp && currentMrp > currentPrice && (
                <span className="text-sm sm:text-base text-slate-400 line-through">
                  ₹{currentMrp}
                </span>
              )}
              {discount > 0 && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Feature Benefits Cards */}
            {product.features && product.features.length > 0 && (
              <div className="grid grid-cols-3 gap-2 pt-1">
                {product.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-2xl bg-amber-50/40 border border-amber-100 text-center flex flex-col items-center justify-center space-y-0.5"
                  >
                    <span className="text-lg">{feat.icon}</span>
                    <h5 className="font-heading font-bold text-[10px] sm:text-xs text-slate-800 leading-tight">
                      {feat.title}
                    </h5>
                  </div>
                ))}
              </div>
            )}

            {/* Select Size Buttons */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-bold text-slate-800">
                  Select Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => {
                    const isSelected = selectedSize === s.size;
                    return (
                      <button
                        key={s.size}
                        type="button"
                        onClick={() => setSelectedSize(s.size)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-white text-slate-900 border-2 border-slate-900 shadow-2xs font-extrabold'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {s.size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Stepper Row */}
            <div className="flex items-center justify-between py-3 border-y border-slate-100">
              <span className="text-xs font-bold text-slate-800">Quantity</span>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                >
                  −
                </button>
                <span className="px-3 text-xs font-black text-slate-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Dual Actions */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-3.5 bg-[#E5A015] hover:bg-[#D49010] active:scale-98 text-slate-950 font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full py-3 bg-white hover:bg-slate-50 active:scale-98 text-slate-900 font-bold text-sm rounded-xl border border-slate-200 shadow-2xs transition-all flex items-center justify-center gap-2"
              >
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* Seller / Store Info */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-amber-500" />
              <span>Sold by: <strong className="text-slate-800">{product.storeName || 'PAW NEAR Store'}</strong></span>
            </div>
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Vendor
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        
        {/* Tab Headers */}
        <div className="flex items-center gap-4 sm:gap-8 border-b border-slate-200 overflow-x-auto no-scrollbar text-sm font-bold">
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-3 transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'desc' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Product Description
          </button>
          {!product.isService && (
            <>
              <button
                onClick={() => setActiveTab('feeding')}
                className={`pb-3 transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === 'feeding' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Usage / Guide
              </button>
              <button
                onClick={() => setActiveTab('nutrition')}
                className={`pb-3 transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === 'nutrition' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Composition / Ingredients
              </button>
            </>
          )}
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'reviews' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Customer Reviews ({product.reviewsCount || 450})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="text-sm text-slate-600 leading-relaxed">
          {activeTab === 'desc' && (
            <div className="space-y-4">
              <p>{product.description || 'No detailed description available.'}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <h6 className="font-heading font-bold text-xs text-slate-800 mb-1">Pet Type</h6>
                  <p className="text-xs text-slate-500">{product.petType}</p>
                </div>
                {product.category === 'pet-sale' && (
                  <div className="p-4 rounded-2xl bg-lime-50 border border-lime-200">
                    <h6 className="font-heading font-bold text-xs text-slate-800 mb-1">Pet Details</h6>
                    <p className="text-xs text-slate-500">
                      {product.breed || 'Breed not specified'}{product.ageYears !== null && product.ageYears !== undefined ? ` • ${product.ageYears} years old` : ''}
                    </p>
                  </div>
                )}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <h6 className="font-heading font-bold text-xs text-slate-800 mb-1">Instant Store Dispatch</h6>
                  <p className="text-xs text-slate-500">Shipped with temperature-regulated express delivery</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'feeding' && (
            <div className="space-y-3">
              <h5 className="font-heading font-bold text-slate-800 text-sm">Recommended Guideline</h5>
              <p className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950 font-medium">
                {product.feedingGuide || 'Follow general instructions based on pet weight and activity levels.'}
              </p>
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div className="space-y-3">
              <h5 className="font-heading font-bold text-slate-800 text-sm">Key Composition</h5>
              <p>{product.composition || '100% natural, vet-approved formulation.'}</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-center pr-4 border-r border-slate-200">
                  <div className="text-3xl font-black text-slate-900">{product.rating}</div>
                  <div className="flex items-center text-amber-500 justify-center">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">{product.reviewsCount || 450} Reviews</div>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div><strong>94%</strong> of pet parents recommend this product.</div>
                  <div className="text-slate-400">"My pet loves this! Highly recommended!" - Customer</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-heading font-extrabold text-slate-900 text-xl">
            You Might Also Like
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 px-4 flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <span className="text-[10px] text-slate-400 block font-semibold">Total Price</span>
          <span className="text-lg font-black text-slate-900">₹{currentPrice * quantity}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            className="px-4 py-2.5 bg-amber-50 text-amber-900 border border-amber-300 font-bold text-xs rounded-xl"
          >
            Add
          </button>
          <button
            onClick={handleBuyNow}
            className="px-5 py-2.5 bg-amber-500 text-white font-bold text-xs rounded-xl shadow-md"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
