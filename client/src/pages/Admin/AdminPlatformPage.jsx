import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Sliders, 
  Sparkles, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Image as ImageIcon, 
  Tag, 
  ExternalLink, 
  Eye, 
  Megaphone, 
  Layers, 
  Percent, 
  Check, 
  X,
  Zap,
  Flame
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminPlatformPage() {
  const { 
    platformContent, 
    updateAnnouncementBar, 
    toggleFeaturedSection, 
    addHeroBanner, 
    toggleHeroBannerStatus, 
    deleteHeroBanner,
    addPromoCoupon,
    toggleCouponStatus
  } = useAdmin();

  // Announcement Bar Form State
  const [announcementEnabled, setAnnouncementEnabled] = useState(platformContent.announcementBar.enabled);
  const [announcementText, setAnnouncementText] = useState(platformContent.announcementBar.text);
  const [announcementLinkText, setAnnouncementLinkText] = useState(platformContent.announcementBar.linkText);
  const [announcementLinkUrl, setAnnouncementLinkUrl] = useState(platformContent.announcementBar.linkUrl);
  const [announcementSaved, setAnnouncementSaved] = useState(false);

  // New Banner Modal State
  const [showAddBannerModal, setShowAddBannerModal] = useState(false);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    badge: '⚡ FLASH OFFER',
    tagline: 'SPECIAL PROMO',
    ctaText: 'Explore Catalog',
    ctaLink: '/products',
    bgGradient: 'from-amber-400 via-amber-500 to-[#FB8500]',
    image: '/images/promo_puppy.jpg'
  });

  // New Coupon Modal State
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountPercent: 25,
    maxDiscount: 200,
    minOrderValue: 499,
    description: ''
  });

  const handleSaveAnnouncement = (e) => {
    e.preventDefault();
    updateAnnouncementBar(announcementEnabled, announcementText, announcementLinkText, announcementLinkUrl);
    setAnnouncementSaved(true);
    setTimeout(() => setAnnouncementSaved(false), 2500);
  };

  const handleCreateBanner = (e) => {
    e.preventDefault();
    addHeroBanner(bannerForm);
    setShowAddBannerModal(false);
    setBannerForm({
      title: '',
      subtitle: '',
      badge: '⚡ FLASH OFFER',
      tagline: 'SPECIAL PROMO',
      ctaText: 'Explore Catalog',
      ctaLink: '/products',
      bgGradient: 'from-amber-400 via-amber-500 to-[#FB8500]',
      image: '/images/promo_puppy.jpg'
    });
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    addPromoCoupon(couponForm);
    setShowAddCouponModal(false);
    setCouponForm({
      code: '',
      discountPercent: 25,
      maxDiscount: 200,
      minOrderValue: 499,
      description: ''
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-900 border border-amber-300/80 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Dynamic App CMS
            </span>
          </div>
          <h1 className="font-heading font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
            Platform Content & UI Controls
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Push real-time hero promotions, homepage modules, coupons and top announcement banners without redeploying apps.
          </p>
        </div>
      </div>

      {/* 1. Dynamic Top Announcement Bar Manager */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-black text-sm sm:text-base text-slate-900">
                Top Announcement Marquee Bar
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400">
                Displayed at the very top of the customer website and mobile view
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs font-bold text-slate-600">Active:</span>
            <input
              type="checkbox"
              checked={announcementEnabled}
              onChange={(e) => setAnnouncementEnabled(e.target.checked)}
              className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-0"
            />
          </label>
        </div>

        <form onSubmit={handleSaveAnnouncement} className="space-y-3 pt-1 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Announcement Message Text
              </label>
              <input
                type="text"
                required
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-400 font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                CTA Button Text & Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={announcementLinkText}
                  onChange={(e) => setAnnouncementLinkText(e.target.value)}
                  placeholder="Claim"
                  className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                />
                <input
                  type="text"
                  value={announcementLinkUrl}
                  onChange={(e) => setAnnouncementLinkUrl(e.target.value)}
                  placeholder="/products"
                  className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">
              Live Preview: <strong className="text-slate-700 font-normal">"{announcementText}"</strong>
            </span>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95 text-xs"
            >
              {announcementSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5 text-[#FFB703]" />}
              <span>{announcementSaved ? 'Saved & Live!' : 'Publish Live Text'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Hero Promotional Carousel Banners Manager */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-black text-sm sm:text-base text-slate-900">
                Homepage Hero Carousel Banners ({platformContent.heroBanners.length})
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400">
                Full-width interactive hero slides on the homepage discovery feed
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddBannerModal(true)}
            className="px-4 py-2 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95 shrink-0 self-start sm:self-center"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create Promo Banner</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {platformContent.heroBanners.map((banner, index) => (
            <div
              key={banner.id}
              className={`rounded-2xl border p-4 flex flex-col justify-between space-y-3 transition-all relative overflow-hidden ${
                banner.isActive
                  ? 'bg-slate-900 text-white border-slate-800 shadow-md'
                  : 'bg-slate-100 text-slate-400 border-slate-200 opacity-60'
              }`}
            >
              <div className="space-y-2 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black bg-[#FFB703] text-slate-950 px-2 py-0.5 rounded-full uppercase">
                    Slide {index + 1} • {banner.badge}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    banner.isActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-300 text-slate-600'
                  }`}>
                    {banner.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <h4 className="font-heading font-black text-base line-clamp-2">
                  {banner.title}
                </h4>
                <p className="text-[11px] text-slate-300 line-clamp-2">
                  {banner.subtitle}
                </p>
              </div>

              {/* Banner Card Footer */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs relative z-10">
                <span className="text-[11px] font-bold text-amber-300">
                  CTA: {banner.ctaText} → {banner.ctaLink}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleHeroBannerStatus(banner.id)}
                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                    title={banner.isActive ? 'Deactivate Banner' : 'Activate Banner'}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteHeroBanner(banner.id)}
                    className="p-1.5 bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 rounded-lg transition-colors"
                    title="Delete Banner"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Homepage Section Visibility & Flash Deals Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Section Visibility Switches */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-black text-sm sm:text-base text-slate-900">
                Homepage Featured Section Switches
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400">
                Toggle dynamic sections on/off instantly
              </p>
            </div>
          </div>

          <div className="space-y-2.5 pt-1 text-xs">
            {[
              { key: 'flashDealsEnabled', label: '🔥 Flash Deals & Super Savings Grid' },
              { key: 'popularNearYouEnabled', label: '📍 Popular Near You (Store Locator & 15m Delivery)' },
              { key: 'homeServicesFeaturedEnabled', label: '✂️ Home Grooming & Vet Care Booking Widget' },
              { key: 'trendingCategoriesEnabled', label: '🏷️ Trending Category Circular Explorer' },
              { key: 'emergencyVetBannerEnabled', label: '🩺 24/7 Emergency Veterinary Helpline Banner' }
            ].map(sec => (
              <div key={sec.key} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800">{sec.label}</span>
                <button
                  onClick={() => toggleFeaturedSection(sec.key)}
                  className={`px-3 py-1 rounded-xl font-bold text-xs transition-colors ${
                    platformContent.featuredSections[sec.key]
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {platformContent.featuredSections[sec.key] ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Promo Coupons & Discount Manager */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-heading font-black text-sm sm:text-base text-slate-900">
                  Active Promo Discount Coupons
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-400">
                  Customer cart checkout promotional codes
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAddCouponModal(true)}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Code</span>
            </button>
          </div>

          <div className="space-y-2.5 pt-1 text-xs">
            {platformContent.promoCoupons.map(coupon => (
              <div key={coupon.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-lg text-xs">
                      {coupon.code}
                    </span>
                    <span className="font-bold text-emerald-700">{coupon.discountPercent}% OFF</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {coupon.description} (Min order ₹{coupon.minOrderValue})
                  </p>
                </div>

                <button
                  onClick={() => toggleCouponStatus(coupon.id)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold shrink-0 transition-colors ${
                    coupon.isActive
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {coupon.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Add Banner Modal */}
      {showAddBannerModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[92vh] sm:max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom duration-300">
            
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-900 text-white">
              <h3 className="font-heading font-black text-sm text-white">
                Create Homepage Hero Banner
              </h3>
              <button onClick={() => setShowAddBannerModal(false)} className="p-1 text-slate-400 hover:text-white rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBanner} className="p-5 overflow-y-auto overscroll-contain flex-1 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Banner Heading Title *</label>
                <input
                  type="text"
                  required
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  placeholder="e.g. Mega Weekend Pet Food Fest"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subtitle / Offer Description *</label>
                <input
                  type="text"
                  required
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  placeholder="e.g. Flat 30% OFF on premium brands + Free Treats"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={bannerForm.badge}
                    onChange={(e) => setBannerForm({ ...bannerForm, badge: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={bannerForm.ctaText}
                    onChange={(e) => setBannerForm({ ...bannerForm, ctaText: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddBannerModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-black rounded-xl shadow-xs text-xs"
                >
                  Publish Banner
                </button>
              </div>
            </form>

          </div>
        </div>,
        document.body
      )}

      {/* Add Coupon Modal */}
      {showAddCouponModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[92vh] sm:max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom duration-300">
            
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-900 text-white">
              <h3 className="font-heading font-black text-sm text-white">
                Create Discount Coupon Code
              </h3>
              <button onClick={() => setShowAddCouponModal(false)} className="p-1 text-slate-400 hover:text-white rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="p-5 overflow-y-auto overscroll-contain flex-1 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Coupon Code (Uppercase) *</label>
                <input
                  type="text"
                  required
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. MONSOON30"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs uppercase font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount % *</label>
                  <input
                    type="number"
                    required
                    min="5"
                    max="90"
                    value={couponForm.discountPercent}
                    onChange={(e) => setCouponForm({ ...couponForm, discountPercent: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Max Discount (₹)</label>
                  <input
                    type="number"
                    value={couponForm.maxDiscount}
                    onChange={(e) => setCouponForm({ ...couponForm, maxDiscount: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Minimum Order Value (₹)</label>
                <input
                  type="number"
                  value={couponForm.minOrderValue}
                  onChange={(e) => setCouponForm({ ...couponForm, minOrderValue: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description / Campaign Terms</label>
                <input
                  type="text"
                  value={couponForm.description}
                  onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                  placeholder="e.g. 30% off on all grooming kits"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCouponModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-black rounded-xl shadow-xs text-xs"
                >
                  Activate Code
                </button>
              </div>
            </form>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
