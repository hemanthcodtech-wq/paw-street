import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Store, 
  PackageCheck, 
  DollarSign, 
  Sliders, 
  Menu, 
  X, 
  Bell, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles,
  AlertCircle,
  TrendingUp,
  LogOut,
  Layers,
  Search,
  CheckCircle2,
  ChevronRight,
  Clock
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import Logo from '../common/Logo';

export default function AdminLayout({ children }) {
  const { 
    adminUser, 
    approvedVendorsCount,
    pendingVendorsCount, 
    pendingProductsCount,
    setIsAuthenticated 
  } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showDemoBar, setShowDemoBar] = useState(true);

  const navItems = [
    {
      name: 'Overview',
      shortName: 'Dashboard',
      path: '/admin/dashboard',
      altPath: '/admin',
      icon: LayoutDashboard,
      badge: null,
      section: 'Command Center'
    },
    {
      name: 'Vendor Governance',
      shortName: 'Vendors',
      path: '/admin/vendors',
      icon: Store,
      badge: pendingVendorsCount > 0 ? `${pendingVendorsCount} New` : null,
      badgeColor: 'bg-[#FFB703] text-slate-950 font-black',
      section: '3.1 Governance'
    },
    {
      name: 'Product & Service Audit',
      shortName: 'Products',
      path: '/admin/products',
      icon: PackageCheck,
      badge: pendingProductsCount > 0 ? `${pendingProductsCount} Audit` : null,
      badgeColor: 'bg-amber-500 text-slate-950 font-black',
      section: '3.1 Governance'
    },
    {
      name: 'Revenue & Business Controls',
      shortName: 'Revenue',
      path: '/admin/revenue',
      icon: DollarSign,
      badge: null,
      section: '3.2 Finance'
    },
    {
      name: 'Platform CMS & Content',
      shortName: 'CMS',
      path: '/admin/platform',
      icon: Sliders,
      badge: 'Live',
      badgeColor: 'bg-emerald-500 text-white font-bold',
      section: '3.3 App Control'
    },
  ];

  const totalAlertsCount = pendingVendorsCount + pendingProductsCount;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-slate-900 flex flex-col font-sans selection:bg-[#FFB703] selection:text-slate-950">
      
      {/* Top Demo Simulation Bar (Identical to Vendor Panel styling) */}
      {showDemoBar && (
        <div className="bg-slate-950 text-white text-xs px-3 sm:px-6 py-2 flex items-center justify-between gap-2 border-b border-slate-800/80 shadow-inner">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex items-center gap-1 bg-amber-400/15 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Admin Demo</span>
            </span>
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs truncate">
              <span className="text-slate-400 hidden xs:inline">Session:</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SUPER ADMIN ROOT ACCESS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-300">
              <span>Audits Pending:</span>
              <strong className="text-amber-400 font-bold">{totalAlertsCount}</strong>
            </div>
            <button
              onClick={() => setShowDemoBar(false)}
              className="text-slate-400 hover:text-slate-200 p-1 rounded-md hover:bg-slate-800/80 transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Admin Header / Navbar (Clean White & Amber Theme) */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          
          {/* Left: Mobile Drawer Trigger & Logo Branding */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shrink-0 active:scale-95"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
            </button>

            <Logo to="/admin/dashboard" size="lg" className="shrink-0" />
          </div>

          {/* Right: Notification Bell & Admin Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">

            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-slate-200/90 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all relative active:scale-95"
                aria-label="Pending Approvals & Notifications"
              >
                <Bell className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                {totalAlertsCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-bounce">
                    {totalAlertsCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-heading font-black text-xs text-slate-900">Platform Action Items</span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                      {totalAlertsCount} Action Required
                    </span>
                  </div>
                  <div className="py-2 space-y-1.5 text-xs">
                    {pendingVendorsCount > 0 && (
                      <Link
                        to="/admin/vendors"
                        onClick={() => setNotificationsOpen(false)}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-amber-50 text-slate-800 group"
                      >
                        <div className="flex items-center gap-2">
                          <Store className="w-4 h-4 text-amber-600" />
                          <span><strong>{pendingVendorsCount}</strong> Vendor Applications</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    )}
                    {pendingProductsCount > 0 && (
                      <Link
                        to="/admin/products"
                        onClick={() => setNotificationsOpen(false)}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-amber-50 text-slate-800 group"
                      >
                        <div className="flex items-center gap-2">
                          <PackageCheck className="w-4 h-4 text-amber-600" />
                          <span><strong>{pendingProductsCount}</strong> Products for Audit</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    )}
                    {totalAlertsCount === 0 && (
                      <p className="text-center py-4 text-slate-400 text-xs">
                        🎉 All vendor applications, products & tickets are up to date!
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile */}
            <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#FFB703] to-[#FB8500] text-slate-950 font-black flex items-center justify-center text-xs sm:text-sm shadow-xs border border-amber-300 shrink-0">
                {adminUser.name.charAt(0)}
              </div>
              <div className="hidden xl:block text-left min-w-0">
                <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                  {adminUser.name}
                </p>
                <p className="text-[10px] text-amber-700 font-bold">
                  {adminUser.role}
                </p>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Admin Body Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex gap-6 pb-24 lg:pb-8">
        
        {/* Desktop Sidebar Navigation (Matching VendorLayout design system) */}
        <aside className="w-72 shrink-0 hidden lg:block">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-3.5 shadow-xs sticky top-24 space-y-3">
            
            {/* Admin Profile Summary Card */}
            <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-xs space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 font-black flex items-center justify-center text-xs shadow-xs shrink-0">
                  {adminUser.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black truncate">{adminUser.name}</p>
                  <span className="text-[10px] text-amber-400 font-bold block truncate">{adminUser.role}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1.5 border-t border-slate-800 text-[10px] text-slate-400">
                <span>Access Role:</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Root Access
                </span>
              </div>
            </div>

            {/* Sidebar Navigation Links */}
            <div className="space-y-1">
              {navItems.map(item => {
                const isActive = location.pathname === item.path || (item.altPath && location.pathname === item.altPath);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all gap-2 ${
                      isActive
                        ? 'bg-[#FFB703] text-slate-950 shadow-xs font-black'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'stroke-[2.5]' : 'text-slate-400'}`} />
                      <span className="truncate">{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap ${
                        item.badgeColor || (isActive ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700')
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Platform Quick Stats Widget */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Platform Health
              </span>
              <div className="flex justify-between text-slate-700 text-[11px]">
                <span>Active Vendors:</span>
                <strong className="text-slate-900">{approvedVendorsCount} Approved</strong>
              </div>
              <div className="flex justify-between text-slate-700 text-[11px]">
                <span>Pending Audits:</span>
                <strong className="text-amber-600 font-bold">{pendingVendorsCount + pendingProductsCount}</strong>
              </div>
              <div className="flex justify-between text-slate-700 text-[11px]">
                <span>Platform Status:</span>
                <strong className="text-emerald-600 font-bold">Operational</strong>
              </div>
            </div>

            {/* Admin Logout */}
            <button
              onClick={() => {
                navigate('/admin/login');
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Admin Log Out</span>
            </button>

          </div>
        </aside>

        {/* Dynamic Page Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>

      {/* Mobile Off-Canvas Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)} 
          />
          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl p-5 flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <Logo to="/admin/dashboard" size="md" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="space-y-1">
                {navItems.map(item => {
                  const isActive = location.pathname === item.path || (item.altPath && location.pathname === item.altPath);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all ${
                        isActive
                          ? 'bg-[#FFB703] text-slate-950 font-black shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : ''}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Drawer Bottom Shortcuts */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-1.5 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Customer Front App</span>
              </Link>
              <Link
                to="/vendor/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-1.5 py-2 bg-amber-50 text-amber-900 font-bold text-xs rounded-xl hover:bg-amber-100 transition-colors"
              >
                <Store className="w-3.5 h-3.5 text-amber-600" />
                <span>Vendor Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Mobile Bottom Navigation Bar (Matching Vendor/Client styling with #FFB703 Active Pill) */}
      <nav 
        aria-label="Admin Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center justify-around"
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.altPath && location.pathname === item.altPath);
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all relative min-w-[48px] ${
                isActive
                  ? 'text-slate-950 font-black'
                  : 'text-slate-500 font-medium hover:text-slate-900'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-transform ${
                isActive ? 'bg-[#FFB703] shadow-2xs scale-105' : 'bg-transparent'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight leading-tight">
                {item.shortName}
              </span>
              
              {/* Mobile Tab Notification Dot */}
              {item.badge && !isActive && (
                <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </Link>
          );
        })}
      </nav>

    </div>
  );
}
