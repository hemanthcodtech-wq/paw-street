import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  Grid, 
  List, 
  X, 
  Filter,
  Zap,
  Package,
  RefreshCw,
  Star
} from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import ProductCard from '../../components/product/ProductCard';
import { api } from '../../services/api';

// Normalize API product → shape expected by ProductCard
function normalizeProduct(p) {
  // Preserve the vendor ObjectId as both storeId (for display) and vendorId (for order linking)
  const vendorId = p.vendor?._id || p.vendor || '';
  const vendorStoreName = p.vendor?.storeName || p.vendorName || 'PAW NEAR Store';
  return {
    id: p._id || p.id,
    _id: p._id || p.id,
    name: p.title || p.name || 'Pet Item',
    shortName: (p.title || p.name || '').slice(0, 40),
    brand: vendorStoreName || p.brand || 'PAW NEAR',
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
    storeId: vendorId || 'store-1',
    storeName: vendorStoreName,
    storeDistance: '1.5 km',
    image: p.primaryImage || (p.images && p.images[0]) || '/images/prod_pedigree.jpg',
    gallery: p.images || [p.primaryImage || '/images/prod_pedigree.jpg'],
    type: p.type || 'product',
    isService: p.type === 'service',
    description: p.description || '',
    inStock: (p.stock || 0) > 0,
    stockCount: p.stock || 0,
    isFlashDeal: p.isFlashDeal || false,
    // These two fields are critical for vendor order tracking
    vendor: vendorId,
    vendorId: vendorId ? vendorId.toString() : '',
  };
}

// Skeleton loader card
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-3 animate-pulse">
      <div className="bg-slate-100 rounded-xl h-40 mb-3" />
      <div className="bg-slate-100 rounded-lg h-3 mb-2 w-3/4" />
      <div className="bg-slate-100 rounded-lg h-3 mb-3 w-1/2" />
      <div className="bg-slate-100 rounded-lg h-8 w-full" />
    </div>
  );
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categoryId } = useParams();

  const searchQuery = searchParams.get('search') || '';
  const activeCategory = categoryId || searchParams.get('category') || '';

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [activeSubcategory, setActiveSubcategory] = useState('All');
  const [selectedPetType, setSelectedPetType] = useState('All');
  const [selectedSort, setSelectedSort] = useState('popular');
  const [selectedType, setSelectedType] = useState('all'); // 'all' | 'product' | 'service'
  const [priceMax, setPriceMax] = useState(10000);
  const [instantDeliveryOnly, setInstantDeliveryOnly] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [showMobileFilterModal, setShowMobileFilterModal] = useState(false);

  // Fetch products from backend API
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (selectedType !== 'all') params.set('type', selectedType);

      const res = await api.getProducts(params.toString());
      if (res?.success && Array.isArray(res.products)) {
        setProducts(res.products.map(normalizeProduct));
      } else {
        setError('Could not load products. Please try again.');
      }
    } catch (err) {
      setError('Failed to connect to server.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedType]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Subcategory pills from CATEGORIES data
  const subcategoryPills = useMemo(() => {
    if (!activeCategory) return ['All'];
    const foundCat = CATEGORIES.find(c => c.id === activeCategory);
    return foundCat ? ['All', ...(foundCat.subcategories || [])] : ['All'];
  }, [activeCategory]);

  // Client-side filter + sort
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category match (loose: check both id and name)
    if (activeCategory && activeCategory !== 'all') {
      list = list.filter(p => {
        const cat = (p.category || '').toLowerCase();
        return cat.includes(activeCategory.toLowerCase()) || activeCategory.toLowerCase().includes(cat);
      });
    }

    // Subcategory
    if (activeSubcategory !== 'All') {
      list = list.filter(p => activeCategory === 'pet-sale'
        ? (p.petType || '').toLowerCase().includes(activeSubcategory.replace(/s$/, '').toLowerCase())
        : (p.subcategory || '').toLowerCase().includes(activeSubcategory.toLowerCase())
      );
    }

    // Pet Type
    if (selectedPetType !== 'All') {
      list = list.filter(p =>
        (p.petType || '').includes(selectedPetType) || (p.petType || '') === 'All Pets'
      );
    }

    // Price ceiling
    list = list.filter(p => p.price <= priceMax);

    // Instant delivery
    if (instantDeliveryOnly) {
      list = list.filter(p => p.isInstantDelivery);
    }

    // Sort
    list.sort((a, b) => {
      if (selectedSort === 'price_asc') return a.price - b.price;
      if (selectedSort === 'price_desc') return b.price - a.price;
      if (selectedSort === 'rating') return b.rating - a.rating;
      if (selectedSort === 'discount') return b.discountPercent - a.discountPercent;
      if (selectedSort === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      // popular — featured first
      return (b.isTopPick ? 1 : 0) - (a.isTopPick ? 1 : 0);
    });

    return list;
  }, [products, activeCategory, activeSubcategory, selectedPetType, priceMax, instantDeliveryOnly, selectedSort]);

  const currentCategoryObj = CATEGORIES.find(c => c.id === activeCategory);
  const pageTitle = searchQuery
    ? `Results for "${searchQuery}"`
    : currentCategoryObj
    ? currentCategoryObj.name
    : 'All Pet Products & Services';

  const resetFilters = () => {
    setActiveSubcategory('All');
    setSelectedPetType('All');
    setPriceMax(10000);
    setInstantDeliveryOnly(false);
    setSelectedType('all');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Title */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading font-black text-slate-900 text-xl sm:text-2xl md:text-3xl">
            {pageTitle}
          </h1>
          {!isLoading && (
            <p className="text-xs text-slate-500 mt-0.5">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>

        {/* Type Switcher: Products vs Services */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          {[
            { id: 'all', label: '🐾 All' },
            { id: 'product', label: '📦 Products' },
            { id: 'service', label: '✂️ Services' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedType === t.id
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products, brands, categories..."
            value={searchQuery}
            onChange={(e) =>
              setSearchParams(e.target.value ? { search: e.target.value } : {})
            }
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-[#E5A015] focus:bg-white shadow-2xs transition-colors"
          />
        </div>

        <button
          onClick={fetchProducts}
          className="p-2.5 bg-slate-50 hover:bg-amber-50 border border-slate-200/80 rounded-2xl text-slate-600 hover:text-amber-600 shadow-2xs transition-colors shrink-0"
          title="Refresh products"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={() => setShowMobileFilterModal(true)}
          className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-2xl text-slate-700 shadow-2xs transition-colors shrink-0"
          title="Filter Options"
        >
          <SlidersHorizontal className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      {/* Subcategory Pills + View Toggle */}
      {subcategoryPills.length > 1 && (
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5 flex-1">
            {subcategoryPills.map((subcat) => {
              const isActive = activeSubcategory === subcat;
              return (
                <button
                  key={subcat}
                  onClick={() => setActiveSubcategory(subcat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all select-none ${
                    isActive
                      ? 'bg-[#E5A015] text-slate-950 shadow-xs'
                      : 'bg-slate-100 hover:bg-amber-50 text-slate-700 border border-transparent hover:border-amber-300'
                  }`}
                >
                  {subcat}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors shrink-0"
            title="Toggle View"
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block md:col-span-3 space-y-6 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs h-fit sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-heading font-extrabold text-sm text-slate-800 flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-500" />
              Filter By
            </h3>
            <button
              onClick={resetFilters}
              className="text-[11px] font-bold text-amber-600 hover:underline"
            >
              Reset
            </button>
          </div>

          {/* Sort */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Sort By</h4>
            <select
              value={selectedSort}
              onChange={e => setSelectedSort(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-amber-400"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="rating">Highest Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>

          {/* Instant Delivery */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span className="text-xs font-bold text-amber-900">Instant 15-Min</span>
            </div>
            <input
              type="checkbox"
              checked={instantDeliveryOnly}
              onChange={(e) => setInstantDeliveryOnly(e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          {/* Pet Type */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Pet Type</h4>
            <div className="space-y-1.5">
              {['All', 'Dog', 'Cat', 'Bird', 'Fish', 'Small Pet'].map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50"
                >
                  <input
                    type="radio"
                    name="petType"
                    checked={selectedPetType === type}
                    onChange={() => setSelectedPetType(type)}
                    className="accent-amber-500"
                  />
                  <span>{type === 'All' ? 'All Pets' : `${type}s`}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              <span>Max Price</span>
              <span className="text-amber-600 font-extrabold">₹{priceMax.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min={100}
              max={10000}
              step={100}
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹100</span>
              <span>₹10,000+</span>
            </div>
          </div>

          {/* Category Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Categories</h4>
            <div className="space-y-1">
              <Link
                to="/products"
                className={`block px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                  !activeCategory ? 'bg-amber-50 text-amber-800 font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                🐾 All Products
              </Link>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  className={`block px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    activeCategory === cat.id ? 'bg-amber-50 text-amber-800 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat.icon} {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="md:col-span-9">

          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center space-y-3">
              <p className="text-rose-700 font-bold text-sm">{error}</p>
              <button
                onClick={fetchProducts}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Loading Skeletons */}
          {isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredProducts.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto">
                <Package className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-slate-800 text-lg">No Products Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  {products.length === 0
                    ? 'No products have been added yet. Vendors can add products from their dashboard.'
                    : "No products match your current filters. Try resetting them."}
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="px-5 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-amber-600 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Product Cards */}
          {!isLoading && !error && filteredProducts.length > 0 && (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'
                  : 'space-y-3'
              }
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} layout={viewMode} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilterModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading font-extrabold text-base text-slate-800">Filter Products</h3>
              <button
                onClick={() => setShowMobileFilterModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sort */}
            <div>
              <div className="text-xs font-bold text-slate-700 uppercase mb-2">Sort By</div>
              <select
                value={selectedSort}
                onChange={e => setSelectedSort(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest First</option>
                <option value="rating">Highest Rated</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>

            {/* Instant Delivery */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50 border border-amber-200">
              <span className="text-xs font-bold text-amber-900">⚡ Instant 15-Min Delivery Only</span>
              <input
                type="checkbox"
                checked={instantDeliveryOnly}
                onChange={(e) => setInstantDeliveryOnly(e.target.checked)}
                className="w-4 h-4 accent-amber-500"
              />
            </div>

            {/* Pet Type */}
            <div>
              <div className="text-xs font-bold text-slate-700 uppercase mb-2">Pet Type</div>
              <div className="flex flex-wrap gap-2">
                {['All', 'Dog', 'Cat', 'Bird', 'Fish'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedPetType(type)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                      selectedPetType === type
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {type === 'All' ? 'All Pets' : `${type}s`}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Max Price</span>
                <span className="text-amber-600 font-extrabold">₹{priceMax.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={100}
                max={10000}
                step={100}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={resetFilters}
                className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl"
              >
                Reset
              </button>
              <button
                onClick={() => setShowMobileFilterModal(false)}
                className="flex-1 py-3 bg-amber-500 text-white font-bold text-sm rounded-xl shadow-md"
              >
                Show ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
