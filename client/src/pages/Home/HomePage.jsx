import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  Star, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Truck,
  Heart,
  Award,
  RotateCcw
} from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { PRODUCTS } from '../../data/products';
import { STORES } from '../../data/stores';
import { SALONS } from '../../data/services';
import ProductCard from '../../components/product/ProductCard';
import SalonCard from '../../components/service/SalonCard';
import BookingModal from '../../components/service/BookingModal';
import { useLocationContext } from '../../context/LocationContext';
import { api } from '../../services/api';

export default function HomePage() {
  const navigate = useNavigate();
  const { selectedLocation } = useLocationContext();
  const [selectedSalonForBooking, setSelectedSalonForBooking] = React.useState(null);
  const [cms, setCms] = React.useState(null);
  const [catalogProducts, setCatalogProducts] = React.useState(PRODUCTS);
  const [homeStores, setHomeStores] = React.useState(STORES);

  const topPicks = catalogProducts.filter(p => p.tags?.includes('top_pick') || (!p.tags?.length && p.isTopPick));
  const newProducts = catalogProducts.filter(p => p.tags?.includes('new'));
  const accessoriesAndToys = catalogProducts.filter(p => p.category === 'accessories');
  const bestSellers = catalogProducts.slice(3, 7);
  const trendingProducts = catalogProducts.filter(p => p.tags?.includes('trending'));
  const storesFromProducts = [...new Map(
    catalogProducts
      .filter(product => product.storeName && product.storeName !== 'PAW NEAR Direct')
      .map(product => [product.storeName, {
        id: product.vendorId || product.storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: product.storeName,
        rating: product.rating || 4.8,
        reviewsCount: product.reviewsCount || 0,
        distance: 'Nearby',
        eta: '15 min',
        image: product.image || '/images/hero_pets.jpg'
      }])
  ).values()];
  const storesToDisplay = homeStores.length > 0 ? homeStores : storesFromProducts;

  const [homeSearchQuery, setHomeSearchQuery] = React.useState('');

  React.useEffect(() => {
    let ignore = false;
    api.getPlatformCms().then(res => {
      if (!ignore && res?.success && res.cms) {
        setCms(res.cms);
      }
    }).catch(() => {});
    api.getVendors().then(res => {
      if (!ignore && res?.success && Array.isArray(res.vendors)) {
        setHomeStores(res.vendors.map(vendor => ({
          id: vendor._id || vendor.id,
          name: vendor.storeName || vendor.name || 'Local Pet Store',
          rating: vendor.rating || 4.8,
          reviewsCount: vendor.reviewsCount || vendor.totalOrders || 0,
          distance: vendor.location?.city || 'Nearby',
          eta: vendor.isStoreOpen === false ? 'Closed' : '15 min',
          image: vendor.photos?.storeFront || vendor.photos?.logo || '/images/hero_pets.jpg'
        })));
      }
    }).catch(() => {});
    api.getProducts().then(res => {
      if (!ignore && res?.success && Array.isArray(res.products)) {
        setCatalogProducts(res.products.map(product => ({
          ...product,
          id: product._id || product.id,
          name: product.title || product.name,
          image: product.primaryImage || product.image || product.images?.[0] || '/images/prod_drools.jpg',
          storeName: product.vendorName || product.storeName || 'PAW NEAR Direct',
          vendorId: product.vendor?._id || product.vendor || product.vendorId || '',
          tags: Array.isArray(product.tags) ? product.tags : []
        })));
      }
    }).catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  const activeHeroBanners = (cms?.heroBanners || []).filter(b => b.isActive !== false);
  const activeAnnouncement = cms?.topAnnouncement?.isActive !== false ? cms?.topAnnouncement : null;
  const featuredSections = {
    flashDealsEnabled: true,
    popularNearYouEnabled: true,
    homeServicesFeaturedEnabled: true,
    trendingCategoriesEnabled: true,
    emergencyVetBannerEnabled: true,
    ...(cms?.featuredSections || {})
  };

  const handleMobileSearch = (e) => {
    e.preventDefault();
    if (homeSearchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(homeSearchQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 md:space-y-12 pb-16 md:pb-12">
      {activeAnnouncement && (
        <Link
          to={activeAnnouncement.link || '/products'}
          className="block -mx-3.5 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-2 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white text-xs sm:text-sm font-bold text-center hover:brightness-105 transition-all"
        >
          {activeAnnouncement.text}
        </Link>
      )}

      {activeHeroBanners.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {activeHeroBanners.slice(0, 3).map((banner) => (
            <Link
              key={banner.id}
              to={banner.link || '/products'}
              className={`relative overflow-hidden rounded-3xl min-h-[180px] p-5 text-white shadow-lg bg-gradient-to-br ${banner.bgColor || 'from-slate-900 to-slate-700'} flex flex-col justify-between`}
            >
              <div className="relative z-10 space-y-2 max-w-[72%]">
                <span className="inline-flex bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                  {banner.tag || 'Featured'}
                </span>
                <h2 className="font-heading font-black text-xl leading-tight">{banner.title}</h2>
                <p className="text-xs text-white/85 line-clamp-2">{banner.subTitle}</p>
              </div>
              <span className="relative z-10 text-xs font-black text-amber-200">
                {banner.ctaText || 'Explore'} →
              </span>
            </Link>
          ))}
        </section>
      )}
      
      {/* 1. Hero Promo Banner matching UI Reference ("Everything Your Pet Needs, Near You!") */}
      <section className="relative overflow-hidden bg-[#FDF8EE] -mx-3.5 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-12 mb-4">
        
        {/* Subtle Top-Right Golden Paw Watermark */}
        <div className="absolute top-2 right-4 sm:top-6 sm:right-6 pointer-events-none opacity-25 text-amber-500 z-0">
          <svg className="w-16 h-16 sm:w-24 sm:h-24 fill-amber-500" viewBox="0 0 24 24">
            <path d="M12 8.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm-4.5.5a2 2 0 100-4 2 2 0 000 4zm9 0a2 2 0 100-4 2 2 0 000 4zM5.5 12a1.8 1.8 0 100-3.6 1.8 1.8 0 000 3.6zm13 0a1.8 1.8 0 100-3.6 1.8 1.8 0 000 3.6zM12 10.5c-3.2 0-6 2.2-6 5.5 0 2.8 2.5 5 6 5s6-2.2 6-5.5c0-3.3-2.8-5.5-6-5.5z" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto flex flex-row items-center justify-between relative z-10">
          
          {/* Hero Left Content */}
          <div className="w-[55%] sm:w-1/2 flex flex-col justify-center space-y-2 sm:space-y-4 py-2 sm:py-4">
            
            {/* Headline matching screenshot */}
            <h1 className="font-heading font-black text-slate-900 text-[22px] leading-[1.15] sm:text-4xl md:text-5xl lg:text-6xl tracking-tight">
              Everything Your <br />
              <span className="text-[#E5A015]">Pet Needs,</span> <br />
              Near You!
            </h1>

            {/* Subtitle matching screenshot */}
            <p className="text-slate-600 text-[11px] sm:text-sm md:text-base max-w-[180px] sm:max-w-md leading-snug font-normal">
              Shop food, accessories, medicines & more. Care. Love. Paw Near.
            </p>

            {/* Shop Now Button matching screenshot */}
            <div className="pt-2 sm:pt-4">
              <Link
                to="/products"
                className="px-5 py-2 sm:px-7 sm:py-3 bg-[#E5A015] hover:bg-[#D49010] active:scale-95 text-slate-950 font-bold text-xs sm:text-base rounded-lg sm:rounded-xl shadow-xs hover:shadow-md transition-all inline-flex items-center"
              >
                Shop Now
              </Link>
            </div>
          </div>

          {/* Hero Right Visual (Dog + Cat Transparent PNG matching reference) */}
          <div className="w-[45%] sm:w-1/2 relative flex justify-end items-end h-[160px] sm:h-[280px] md:h-[360px]">
            <img
              src="/images/hero_pets_transparent.png"
              alt="Golden Retriever Dog and Cat"
              className="absolute bottom-[-10%] sm:bottom-0 right-[-10%] sm:right-0 h-[115%] sm:h-full w-auto object-contain transform origin-bottom group-hover:scale-[1.03] transition-transform duration-500 max-w-none"
            />
          </div>
        </div>
      </section>

      {/* 2. Shop By Category (Matching UI Template: Grooming, Accessories, Food, Clinic, Medicine, Boarding) */}
      <section className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-black text-slate-900 text-base sm:text-xl md:text-2xl tracking-tight">
            What does your pet need?
          </h2>
        </div>

        {/* Categories Grid (2 rows x 3 cols matching reference image) */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2.5 sm:gap-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              to={category.id === 'grooming' || category.id === 'clinic' || category.id === 'boarding'
                ? `/services?tab=${category.id}`
                : `/category/${category.id}`}
              className="group bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 hover:bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden"
            >
              {/* Category 3D Image Avatar */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-1.5 sm:mb-2 overflow-hidden flex items-center justify-center">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300 drop-shadow-sm"
                />
              </div>

              {/* Title matching screenshot */}
              <h3 className="font-heading font-medium text-[11px] sm:text-xs md:text-sm text-slate-900 group-hover:text-[#E5A015] transition-colors line-clamp-1 mt-1">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Vendors Nearby */}
      <section className="space-y-3 sm:space-y-4 mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-black text-slate-900 text-base sm:text-xl md:text-2xl tracking-tight">
            Top vendors nearby
          </h2>
          <Link
            to="/stores"
            className="text-xs sm:text-sm font-medium text-slate-700 hover:text-[#E5A015] flex items-center gap-1 group transition-colors"
          >
            <span>View all</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Vendors Carousel */}
        <div className="flex overflow-x-auto gap-3 sm:gap-4 pb-2 snap-x hide-scrollbar -mx-2 px-2">
          {storesToDisplay.slice(0, 4).map((store, i) => {
            const isFirst = i === 0;
            const logoBg = isFirst ? 'bg-amber-400' : 'bg-teal-500';
            const logoText = isFirst ? 'text-slate-900' : 'text-white';

            return (
              <Link 
                to={`/store/${store.id}`} 
                key={store.id} 
                className="w-[280px] sm:w-[320px] snap-start flex-shrink-0 bg-white rounded-[20px] border border-slate-200 p-3 flex gap-3 items-center shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Logo Circle */}
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-center text-[10px] leading-tight shrink-0 shadow-inner ${logoBg} ${logoText} overflow-hidden`}>
                  {isFirst ? (
                    <div className="flex flex-col items-center">
                      <div className="flex gap-0.5 mb-0.5">
                        <span className="text-sm">🐶</span>
                        <span className="text-sm">🐱</span>
                      </div>
                      <span className="font-black tracking-tight leading-none px-1">{store.name.split(' ')[0]}</span>
                    </div>
                  ) : (
                    <span className="px-1 text-xs">{store.name.split(' ')[0]}</span>
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <div className="flex items-center gap-1">
                    <h4 className="font-bold text-slate-900 text-sm truncate">{store.name}</h4>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100 shrink-0" />
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5 whitespace-nowrap">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="font-bold text-slate-700">{store.rating}</span>
                    <span>({store.reviewsCount > 999 ? '1.2k' : store.reviewsCount})</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 mx-0.5"></span>
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{store.distance.split(' ')[0]} km</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1.5 text-emerald-600 font-bold text-[10px] bg-emerald-50 w-fit px-1.5 py-0.5 rounded-md">
                    <Zap className="w-3 h-3 fill-emerald-600" />
                    <span>{store.eta.split(' ')[0]} delivery</span>
                  </div>
                </div>

                {/* Right Image */}
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                  <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
                </div>
              </Link>
            )
          })}
          {storesToDisplay.length === 0 && (
            <p className="w-full py-6 text-center text-sm text-slate-400">No approved vendors nearby yet.</p>
          )}
        </div>
      </section>

      {/* Popular Near You */}
      {featuredSections.popularNearYouEnabled && (
      <section className="space-y-3 sm:space-y-4 mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-black text-slate-900 text-base sm:text-xl md:text-2xl tracking-tight">
            Popular near you
          </h2>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-medium text-slate-700 hover:text-[#E5A015] flex items-center gap-1 group transition-colors"
          >
            <span>View all</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Horizontal Products Carousel */}
        <div className="flex overflow-x-auto gap-3 sm:gap-4 py-1 pb-3 snap-x hide-scrollbar -mx-2 px-2 items-stretch">
          {catalogProducts.slice(4, 9).map((product) => (
            <div key={product.id} className="snap-start flex-shrink-0 flex">
              <ProductCard product={product} layout="horizontal" />
            </div>
          ))}
        </div>
      </section>
      )}

      {/* New Arrivals */}
      {newProducts.length > 0 && (
      <section className="space-y-3 sm:space-y-4 mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-black text-slate-900 text-base sm:text-xl md:text-2xl tracking-tight">
            New arrivals
          </h2>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-medium text-slate-700 hover:text-[#E5A015] flex items-center gap-1 group transition-colors"
          >
            <span>View all</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {newProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      )}

      {/* 3. Secondary Promo Banner: Pamper Your Pet with the Best! (Left side text, Right side image) */}
      {featuredSections.homeServicesFeaturedEnabled && (
      <section className="relative rounded-3xl overflow-hidden bg-[#0C1015] text-white p-4 sm:p-6 md:p-8 shadow-xl border border-slate-800 group">
        
        {/* Ambient floating bubbles effect */}
        <div className="absolute top-4 left-1/3 w-3 h-3 bg-white/20 rounded-full blur-[1px] animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-4 h-4 bg-amber-400/20 rounded-full blur-[1px] animate-bounce" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-6 right-1/3 w-6 h-6 bg-amber-500/10 rounded-full blur-[2px] animate-pulse" />

        <div className="flex flex-row items-center justify-between gap-2 sm:gap-6 relative z-10 h-[140px] sm:h-[220px]">
          
          {/* Content Top/Left */}
          <div className="w-[60%] sm:w-[65%] flex flex-col items-start justify-center">
            <h2 className="font-heading font-black text-[18px] sm:text-2xl md:text-3xl text-white tracking-tight leading-snug">
              Pamper Your Pet <br className="hidden sm:inline" />with the Best!
            </h2>
            <p className="text-[11px] sm:text-sm text-slate-300 mt-1 mb-2 sm:mt-2 sm:mb-4 max-w-[180px] sm:max-w-sm">
              Upto 20% OFF on Grooming products
            </p>
            <Link
              to="/services"
              className="inline-flex items-center gap-1 sm:gap-1.5 px-4 sm:px-6 py-2 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-bold text-[11px] sm:text-sm rounded-lg sm:rounded-[14px] shadow-sm transition-all active:scale-95"
            >
              <span>Explore Now</span>
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </Link>
          </div>

          {/* Image Bottom/Right */}
          <div className="w-[40%] sm:w-[35%] h-full flex justify-end items-end relative">
            <div className="relative w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl -mb-4 -mr-2 sm:-mb-6 sm:-mr-4">
              <img
                src="/images/promo_puppy.jpg"
                alt="Cute puppy in bubble bath tub"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Trust Features Banner */}
      <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 py-4 sm:py-5 px-1 shadow-sm overflow-hidden mb-6 sm:mb-8">
        <div className="grid grid-cols-4 divide-x divide-slate-100">
          
          <div className="flex flex-col items-center justify-center text-center px-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-1.5 sm:mb-2">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
            </div>
            <h4 className="font-bold text-slate-900 text-[10px] sm:text-sm leading-tight mb-0.5">Free Delivery</h4>
            <p className="text-slate-400 text-[9px] sm:text-xs font-medium">Above ₹199</p>
          </div>

          <div className="flex flex-col items-center justify-center text-center px-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-50 flex items-center justify-center mb-1.5 sm:mb-2">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
            </div>
            <h4 className="font-bold text-slate-900 text-[10px] sm:text-sm leading-tight mb-0.5">Best Quality</h4>
            <p className="text-slate-400 text-[9px] sm:text-xs font-medium">100% Premium</p>
          </div>

          <div className="flex flex-col items-center justify-center text-center px-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-50 flex items-center justify-center mb-1.5 sm:mb-2">
              <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
            </div>
            <h4 className="font-bold text-slate-900 text-[10px] sm:text-sm leading-tight mb-0.5">Easy Returns</h4>
            <p className="text-slate-400 text-[9px] sm:text-xs font-medium">Within 7 Days</p>
          </div>

          <div className="flex flex-col items-center justify-center text-center px-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-1.5 sm:mb-2">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" />
            </div>
            <h4 className="font-bold text-slate-900 text-[10px] sm:text-sm leading-tight mb-0.5">Secure Pay</h4>
            <p className="text-slate-400 text-[9px] sm:text-xs font-medium">100% Safe</p>
          </div>

        </div>
      </section>

      {/* 4. Top Picks For You (Deals of the Day style) */}
      {featuredSections.flashDealsEnabled && (
      <section className="bg-white rounded-[24px] sm:rounded-[32px] border border-slate-200/80 p-4 sm:p-6 shadow-sm mb-4">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-4">
            <h2 className="font-heading font-black text-slate-900 text-[13px] sm:text-lg md:text-xl uppercase tracking-wider">
              Top Picks for You
            </h2>
            {/* Timer Badge */}
            <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 bg-rose-50 border border-rose-200 text-rose-500 rounded-full text-[9px] sm:text-xs font-bold whitespace-nowrap">
              <Clock className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
              <span>12h 44m 04s</span>
            </div>
          </div>
          <Link
            to="/products"
            className="text-[10px] sm:text-xs font-black text-[#1E293B] uppercase tracking-widest flex items-center gap-0.5 group transition-colors hover:text-rose-500 shrink-0 ml-2"
          >
            <span>See All</span>
            <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="w-full h-px bg-slate-100 mb-4 sm:mb-6"></div>

        {/* Product Grid */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6">
          {topPicks.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} layout="deal" />
          ))}
        </div>
      </section>
      )}

      {/* 5. Best Sellers */}
      <section className="bg-gradient-to-br from-[#FFF8F1] to-[#FFF1E5] rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 shadow-sm border border-orange-100">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shadow-inner">
              <Star className="w-4 h-4 text-orange-600 fill-orange-600" />
            </div>
            <h2 className="font-heading font-black text-slate-900 text-lg sm:text-xl md:text-2xl tracking-tight">
              Best Sellers
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group transition-colors bg-white px-3 py-1.5 rounded-full shadow-sm border border-orange-100"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Trending Now */}
      {featuredSections.trendingCategoriesEnabled && (
      <section className="bg-gradient-to-br from-[#F5F8FF] to-[#EBF0FF] rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 shadow-sm border border-blue-100">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shadow-inner">
              <Zap className="w-4 h-4 text-blue-600 fill-blue-600" />
            </div>
            <h2 className="font-heading font-black text-slate-900 text-lg sm:text-xl md:text-2xl tracking-tight">
              Trending Now
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group transition-colors bg-white px-3 py-1.5 rounded-full shadow-sm border border-blue-100"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      )}

      {/* Interactive Booking Modal */}
      {selectedSalonForBooking && (
        <BookingModal
          salon={selectedSalonForBooking}
          isOpen={!!selectedSalonForBooking}
          onClose={() => setSelectedSalonForBooking(null)}
        />
      )}
    </div>
  );
}
