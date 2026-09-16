import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Search, 
  ShoppingBag, 
  Sparkles, 
  Heart, 
  ArrowRight, 
  Store, 
  PhoneCall, 
  Compass,
  Zap,
  HelpCircle
} from 'lucide-react';
import Logo from '../../components/common/Logo';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const quickCategories = [
    { label: '🐶 Dog Food', path: '/category/food?pet=dog' },
    { label: '🐱 Cat Food', path: '/category/food?pet=cat' },
    { label: '🎾 Toys & Chews', path: '/category/accessories' },
    { label: '🛁 Pet Spa & Grooming', path: '/services' },
    { label: '🏥 Vet Clinic', path: '/services?tab=clinic' },
    { label: '🏪 Nearby Stores', path: '/stores' }
  ];

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-10 sm:py-16 px-4 font-sans text-slate-900 selection:bg-[#FFB703] selection:text-slate-950">
      
      {/* Central 404 Card */}
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-amber-100 shadow-2xl p-6 sm:p-10 text-center relative overflow-hidden space-y-8">
        
        {/* Ambient Top Glow Orbs */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-200/40 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-orange-200/40 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
            <span>404 Error • Page Lost in the Park</span>
          </div>
        </div>

        {/* Hero Visual Display with Animated 404 & Cute Pet Art */}
        <div className="space-y-4">
          <div className="relative inline-block">
            {/* Big 404 with Paw Center */}
            <div className="text-7xl sm:text-9xl font-black font-heading tracking-tight bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent flex items-center justify-center select-none">
              <span>4</span>
              <span className="inline-block transform hover:rotate-12 transition-transform duration-300 mx-1 sm:mx-2 text-6xl sm:text-8xl">
                🐾
              </span>
              <span>4</span>
            </div>

            {/* Floating Puppy Ear Tag */}
            <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 whitespace-nowrap">
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400 animate-bounce" />
              <span>Paws-itively Not Found!</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 max-w-md mx-auto">
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Oops! This Page Wandered Off
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Looks like our furry scout couldn't find the page you're searching for. It might have been moved, renamed, or went chasing a squirrel!
            </p>
          </div>
        </div>

        {/* In-Page Quick Product Search Bar */}
        <form 
          onSubmit={handleSearchSubmit} 
          className="max-w-md mx-auto relative flex items-center"
        >
          <input
            type="text"
            placeholder="Search dog food, treats, toys, supplements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-24 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 rounded-2xl border border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all outline-none shadow-inner"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 text-xs font-black rounded-xl transition-all shadow-xs active:scale-95"
          >
            Search
          </button>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="space-y-2 max-w-lg mx-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Popular Neighborhood Categories:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {quickCategories.map((cat, idx) => (
              <Link
                key={idx}
                to={cat.path}
                className="px-3 py-1.5 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 text-slate-700 hover:text-amber-900 border border-slate-200 rounded-xl text-xs font-bold transition-all duration-200 shadow-2xs hover:scale-105 active:scale-95"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3.5 bg-[#FFB703] hover:bg-[#E5A015] active:scale-95 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-md hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 stroke-[2.5]" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            to="/products"
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Browse 15-Min Store</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 24/7 Helpline Footer Card */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Need emergency pet medicine or assistance?</span>
          </div>
          <Link
            to="/support"
            className="font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1.5 hover:underline"
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-500" />
            <span>24/7 Pet Helpline</span>
          </Link>
        </div>

      </div>

    </div>
  );
}
