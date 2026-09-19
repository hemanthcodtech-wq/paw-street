import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Store, 
  LogOut, 
  Menu, 
  X, 
  Power, 
  Bell, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useVendor } from '../../context/VendorContext';
import Logo from '../common/Logo';

export default function VendorLayout({ children }) {
  const { vendor, metrics, toggleStoreOpen, setApprovalStatus, isLoading } = useVendor();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDemoApprovalBanner, setShowDemoApprovalBanner] = useState(true);

  React.useEffect(() => {
    // If not loading, and vendor ID is empty, they need to onboard
    if (!isLoading && (!vendor.id && vendor.storeName === '')) {
      navigate('/vendor/onboarding');
    }
  }, [isLoading, vendor.id, vendor.storeName, navigate]);

  const navItems = [
    {
      name: 'Overview',
      shortName: 'Dashboard',
      path: '/vendor/dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      name: 'Products & Stock',
      shortName: 'Catalog',
      path: '/vendor/products',
      icon: Package,
      badge: metrics.outOfStockCount > 0 ? `${metrics.outOfStockCount} Low` : null,
      badgeColor: 'bg-rose-500 text-white'
    },
    {
      name: 'Live Orders',
      shortName: 'Orders',
      path: '/vendor/orders',
      icon: ShoppingBag,
      badge: metrics.activeOrdersCount > 0 ? `${metrics.activeOrdersCount} Live` : null,
      badgeColor: 'bg-[#FFB703] text-slate-950',
      badgeCount: metrics.activeOrdersCount
    },
    {
      name: 'Delivery Team',
      shortName: 'Delivery',
      path: '/vendor/delivery-team',
      icon: Users,
      badge: `${metrics.activeDeliveryBoysCount}/${metrics.totalDeliveryBoysCount}`
    },
    {
      name: 'Store & Profile',
      shortName: 'Store',
      path: '/vendor/store-profile',
      icon: Store,
      badge: vendor.status === 'approved' ? 'Verified' : 'Pending',
      badgeColor: vendor.status === 'approved' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
    }
  ];

  const isApproved = vendor.status === 'approved';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Top Demo Status Simulation Bar */}
      {showDemoApprovalBanner && (
        <div className="bg-slate-950 text-white text-xs px-3 sm:px-6 py-2 flex items-center justify-between gap-2 border-b border-slate-800/80 shadow-inner">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex items-center gap-1 bg-amber-400/15 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Demo</span>
            </span>
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs truncate">
              <span className="text-slate-400 hidden xs:inline">Store Status:</span>
              <span className={`font-bold flex items-center gap-1 ${
                isApproved ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isApproved ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                {isApproved ? 'APPROVED' : 'PENDING REVIEW'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isApproved ? (
              <button
                onClick={() => setApprovalStatus('pending')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 hover:border-amber-500/50 rounded-lg font-bold text-[10px] sm:text-xs transition-all flex items-center gap-1 shadow-2xs active:scale-95"
                title="Switch store back to pending verification status"
              >
                <Clock className="w-3 h-3" />
                <span>Simulate Review</span>
              </button>
            ) : (
              <button
                onClick={() => setApprovalStatus('approved')}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] sm:text-xs rounded-lg shadow-2xs transition-all flex items-center gap-1 active:scale-95"
                title="Simulate instant admin verification approval"
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>Approve Store</span>
              </button>
            )}
            <button
              onClick={() => setShowDemoApprovalBanner(false)}
              className="text-slate-400 hover:text-slate-200 p-1 rounded-md hover:bg-slate-800/80 transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Vendor Header / Navbar */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Mobile Drawer Trigger & Logo Branding */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shrink-0 active:scale-95"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
            </button>

            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Logo to="/vendor/dashboard" size="lg" className="shrink-0" />
              
              {/* Partner Label & Store Name (Optimized for all viewports) */}
              <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 pl-3 min-w-0">
                <span className="bg-amber-100 text-amber-900 border border-amber-300/80 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                  Vendor Partner
                </span>
                <span className="text-xs font-bold text-slate-700 truncate max-w-[140px] md:max-w-[200px] lg:max-w-xs" title={vendor.storeName}>
                  {vendor.storeName}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Store Status, Links, Notifications, Profile */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            
            {/* Store Open / Closed Toggle Button */}
            <button
              onClick={toggleStoreOpen}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs active:scale-95 ${
                vendor.isStoreOpen
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                  : 'bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-100'
              }`}
              title="Toggle whether your store is accepting customer orders"
            >
              <span className={`w-2 h-2 rounded-full ${vendor.isStoreOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <span className="hidden md:inline font-semibold text-slate-600">Store:</span>
              <span>{vendor.isStoreOpen ? 'Open' : 'Closed'}</span>
            </button>

            {/* Link to Customer App (Desktop) */}
            <Link
              to="/"
              className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>Customer Store</span>
            </Link>

            {/* Notification Bell with Badge */}
            <button 
              onClick={() => navigate('/vendor/orders')}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-slate-200/90 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all relative active:scale-95"
              aria-label="Orders Notifications"
            >
              <Bell className="w-4 h-4" />
              {metrics.activeOrdersCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {metrics.activeOrdersCount}
                </span>
              )}
            </button>

            {/* Profile Avatar */}
            <Link
              to="/vendor/store-profile"
              className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200 hover:opacity-85 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FFB703] to-[#FB8500] text-slate-950 font-black flex items-center justify-center text-xs shadow-xs border border-amber-300">
                {vendor.fullName.charAt(0)}
              </div>
              <div className="hidden xl:block text-left min-w-0">
                <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[110px]">{vendor.fullName}</p>
                <p className="text-[10px] text-slate-400 capitalize">{vendor.status}</p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Vendor Body Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex gap-6 pb-24 lg:pb-8">
        
        {/* Desktop Sidebar Navigation */}
        <aside className="w-64 shrink-0 hidden lg:block">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-3 shadow-xs sticky top-24 space-y-1">
            
            {/* Store Status Card inside Sidebar */}
            <div className={`p-3 rounded-xl mb-3 ${isApproved ? 'bg-emerald-50/60 border border-emerald-100' : 'bg-amber-50 border border-amber-200'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Store Status</span>
                <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full ${
                  isApproved ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-slate-950'
                }`}>
                  {isApproved ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                  {isApproved ? 'Approved' : 'Under Review'}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900 truncate">{vendor.storeName}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{vendor.location.city}</p>
            </div>

            {/* Nav links */}
            <div className="space-y-1">
              {navItems.map(item => {
                const isActive = location.pathname === item.path || (item.path === '/vendor/dashboard' && location.pathname === '/vendor');
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                      isActive
                        ? 'bg-[#FFB703] text-slate-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : ''}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        item.badgeColor || (isActive ? 'bg-slate-950 text-white' : 'bg-slate-200 text-slate-700')
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Separator & Quick Actions */}
            <div className="pt-4 mt-4 border-t border-slate-100 space-y-1">
              <Link
                to="/vendor/onboarding"
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <Store className="w-4 h-4" />
                <span>Onboarding Application</span>
              </Link>
              <Link
                to="/vendor/login"
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Vendor Sign Out</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Mobile Slide-out Drawer Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div 
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
              onClick={() => setMobileMenuOpen(false)} 
            />
            <div className="relative bg-white w-72 max-w-[85vw] h-full shadow-2xl p-4 flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2">
                    <Logo to="/vendor/dashboard" size="sm" />
                    <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                      Vendor
                    </span>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {navItems.map(item => {
                    const isActive = location.pathname === item.path || (item.path === '/vendor/dashboard' && location.pathname === '/vendor');
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-bold text-sm transition-colors ${
                          isActive
                            ? 'bg-[#FFB703] text-slate-950 shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-800">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Go to Customer App</span>
                </Link>
                <Link
                  to="/vendor/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-rose-50 text-rose-600 rounded-xl font-bold text-xs"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Page Content Viewport */}
        <main className="flex-1 min-w-0">
          {!isApproved && location.pathname !== '/vendor/onboarding' && location.pathname !== '/vendor/store-profile' && (
            <div className="mb-4 sm:mb-6 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-l-4 border-amber-500 p-3 sm:p-4 rounded-r-2xl bg-amber-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Store Application Under Admin Review</h3>
                  <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">
                    Your onboarding submission is being reviewed by the PAW NEAR verification team. You can preview store settings and catalogue in test mode.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setApprovalStatus('approved')}
                className="px-3 py-1.5 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1 w-full sm:w-auto justify-center"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve Store (Demo)</span>
              </button>
            </div>
          )}

          {children}
        </main>
      </div>

      {/* Fixed Sticky Modern Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1.5 px-2 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] flex items-center justify-around pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {navItems.map(item => {
          const isActive = location.pathname === item.path || (item.path === '/vendor/dashboard' && location.pathname === '/vendor');
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all relative min-w-[56px] select-none ${
                isActive 
                  ? 'text-slate-950 font-black' 
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <div className="relative">
                <div className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-[#FFB703] text-slate-950 scale-105 shadow-xs ring-2 ring-amber-300/50' : 'hover:bg-slate-100'}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                </div>
                {item.badgeCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 min-w-[17px] h-4 px-1 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                    {item.badgeCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-black text-slate-950' : 'font-medium text-slate-500'}`}>
                {item.shortName || item.name}
              </span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
}
