import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  MapPin, 
  ChevronDown, 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Bell, 
  Menu, 
  X,
  Sparkles,
  Zap,
  PhoneCall,
  LogOut,
  Package,
  ShieldCheck
} from 'lucide-react';
import Logo from './Logo';
import { useCart } from '../../context/CartContext';
import { useLocationContext } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount, wishlist } = useCart();
  const { selectedLocation, setIsLocationModalOpen } = useLocationContext();
  const { user, logout, setIsAuthModalOpen } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { name: 'All Products', path: '/products' },
    { name: 'Pet Food', path: '/category/food' },
    { name: 'Accessories', path: '/category/accessories' },
    { name: 'Grooming & Spa', path: '/services' },
    { name: 'Vet Clinic', path: '/services?tab=clinic' },
    { name: 'Nearby Stores', path: '/stores' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100/80 shadow-xs">
      {/* Top micro-bar for Instant Delivery announcement */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium tracking-wide">
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-200 fill-amber-200" /> Instant
            </span>
            <span>Superfast 15-20 Min Pet Supplies Delivery in Hyderabad! 🐾</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px] font-medium text-amber-100">
            <Link to="/vendor/login" className="hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-md text-white font-bold flex items-center gap-1">
              <span>🏪 Vendor Portal</span>
            </Link>
            <span>•</span>
            <Link to="/delivery/login" className="hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-md text-white font-bold flex items-center gap-1">
              <span>🛵 Rider Portal</span>
            </Link>
            <span>•</span>
            <Link to="/admin/login" className="hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-md text-white font-bold flex items-center gap-1">
              <span>👑 Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-18 gap-2 sm:gap-4 md:gap-8">
          
          {/* Mobile Menu Icon (Left) */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 text-slate-800 hover:bg-amber-50 rounded-xl transition-colors"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo & Desktop Location Switcher */}
          <div className="flex items-center justify-center md:justify-start flex-1 md:flex-none gap-3 sm:gap-6">
            <Logo size="md" />

            {/* Desktop Location Selector */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="hidden md:flex items-center gap-2 text-left p-2 rounded-xl hover:bg-amber-50/80 transition-all border border-transparent hover:border-amber-200 group max-w-[280px]"
              title="Change Delivery Location"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 group-hover:scale-105 transition-transform">
                <MapPin className="w-4 h-4 fill-amber-500/20" />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                  <span>Deliver to</span>
                  <ChevronDown className="w-3 h-3 text-amber-600 group-hover:translate-y-0.5 transition-transform" />
                </div>
                <div className="text-sm font-semibold text-slate-800 truncate">
                  {selectedLocation.shortDisplay}
                </div>
              </div>
            </button>
          </div>

          {/* Search Bar (Desktop & Tablet) */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="hidden md:flex flex-1 max-w-xl relative items-center"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search dog food, collars, toys, shampoos, vet clinics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-24 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-sm text-slate-800 placeholder-slate-400 rounded-full border border-slate-200 focus:border-amber-500 focus:ring-3 focus:ring-amber-100 transition-all outline-none shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-full transition-colors shadow-xs"
              >
                Search
              </button>
            </div>
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Search Button */}
            <Link
              to="/products"
              className="p-1.5 sm:p-2 text-slate-800 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
              title="Search Products"
            >
              <Search className="w-5 h-5 sm:w-5 sm:h-5" />
            </Link>

            {/* Wishlist Link (Desktop) */}
            <Link
              to="/account?tab=wishlist"
              className="relative p-1.5 sm:p-2 text-slate-700 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors hidden sm:flex items-center justify-center"
              title="My Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Button with Dynamic Badge */}
            <Link
              to="/cart"
              className="relative p-1.5 sm:p-2 text-slate-800 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors flex items-center justify-center"
              title="Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-500 text-slate-950 text-[10px] font-black min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center shadow-xs">
                    {itemCount}
                  </span>
                )}
              </div>
            </Link>

            {/* User Account with Dropdown (Desktop) */}
            {user ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 group"
                  aria-label="User Account Menu"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-lg object-cover border border-amber-300"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-400 text-white font-black text-xs flex items-center justify-center border border-amber-300 shadow-xs">
                      {(user.name || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-800 transition-transform" />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-2.5 border-b border-slate-100">
                      <p className="font-bold text-xs text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        {user.role || 'customer'}
                      </span>
                    </div>

                    <div className="py-1 space-y-0.5 text-xs font-semibold text-slate-700">
                      <Link
                        to="/account"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2 p-2 rounded-xl hover:bg-amber-50 hover:text-amber-900 transition-colors"
                      >
                        <User className="w-4 h-4 text-amber-600" />
                        <span>My Pet Profiles</span>
                      </Link>
                      <Link
                        to="/account?tab=orders"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2 p-2 rounded-xl hover:bg-amber-50 hover:text-amber-900 transition-colors"
                      >
                        <Package className="w-4 h-4 text-amber-600" />
                        <span>Orders & History</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-white bg-slate-100 hover:bg-amber-500 rounded-xl transition-all duration-200 shadow-2xs hover:shadow-xs group"
              >
                <User className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Deliver To Bar matching reference image */}
        <div className="md:hidden py-1.5 border-t border-slate-100/80 flex items-center">
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-2 text-left group w-full"
          >
            <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <MapPin className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-700">
              <span className="text-slate-400 font-normal">Deliver to</span>
              <span className="font-bold text-slate-900">{selectedLocation.shortDisplay || 'Hyderabad, Telangana'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-600 ml-0.5" />
            </div>
          </button>
        </div>

        {/* Secondary Category Navigation (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 py-2.5 border-t border-slate-100 text-xs font-semibold text-slate-600">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`transition-colors hover:text-amber-600 pb-1 border-b-2 ${
                  isActive ? 'text-amber-600 border-amber-500 font-bold' : 'border-transparent'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="ml-auto flex items-center gap-3 text-slate-500">
            <span className="flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-bold">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Special Offer: Code PAWFIRST for ₹200 OFF
            </span>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3 shadow-xl">
          {/* Mobile Search input */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products, stores & services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 text-sm rounded-xl border border-slate-200 focus:outline-amber-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          <div className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg bg-slate-50 hover:bg-amber-50 text-xs font-semibold text-slate-700 hover:text-amber-700 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <Link 
                  to="/account" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-slate-700 font-semibold hover:text-amber-600 flex items-center gap-2"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 text-white font-black text-[10px] flex items-center justify-center">
                      {(user.name || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-rose-600 font-bold flex items-center gap-1 hover:underline"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-amber-600 font-bold hover:underline"
                >
                  Sign In
                </Link>
                <Link 
                  to="/support" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-slate-600 font-semibold"
                >
                  Need Help?
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
