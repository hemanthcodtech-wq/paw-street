import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Bike, 
  MapPin, 
  Navigation, 
  Banknote, 
  Power, 
  Menu, 
  X, 
  Phone, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  LogOut, 
  ShieldCheck, 
  Sparkles,
  Layers,
  Store,
  User,
  ExternalLink
} from 'lucide-react';
import { useDelivery } from '../../context/DeliveryContext';
import Logo from '../common/Logo';

export default function DeliveryLayout({ children }) {
  const { 
    rider, 
    toggleOnlineStatus, 
    activeOrder, 
    assignments 
  } = useDelivery();
  
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingAssignedCount = assignments.filter(a => a.status === 'assigned').length;

  const navItems = [
    {
      name: 'Duty Tasks',
      shortName: 'Tasks',
      path: '/delivery/dashboard',
      altPath: '/delivery',
      icon: Layers,
      badge: pendingAssignedCount > 0 ? `${pendingAssignedCount} New` : null,
      badgeColor: 'bg-[#FFB703] text-slate-950 font-black'
    },
    {
      name: 'Live GPS Navigation',
      shortName: 'Live Map',
      path: '/delivery/navigation',
      icon: Navigation,
      badge: activeOrder ? 'Active' : null,
      badgeColor: 'bg-emerald-500 text-white font-black animate-pulse'
    },
    {
      name: 'Cash on Delivery (COD)',
      shortName: 'COD & Cash',
      path: '/delivery/cod',
      icon: Banknote,
      badge: rider.cashInHand > 0 ? `₹${rider.cashInHand}` : null,
      badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300 font-black'
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-slate-900 flex flex-col font-sans selection:bg-[#FFB703] selection:text-slate-950">
      
      {/* Top Rider Duty Status Bar */}
      <div className={`text-white text-xs px-3.5 sm:px-6 py-2 flex items-center justify-between gap-2 border-b shadow-inner transition-colors ${
        rider.onlineStatus 
          ? 'bg-slate-950 border-slate-800' 
          : 'bg-slate-900 border-slate-800 opacity-90'
      }`}>
        <div className="flex items-center gap-2 min-w-0">
          <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
            rider.onlineStatus 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
          }`}>
            <span className={`w-2 h-2 rounded-full ${rider.onlineStatus ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
            <span>{rider.onlineStatus ? 'ONLINE • ON DUTY' : 'OFFLINE • OFF DUTY'}</span>
          </span>
          <span className="text-slate-400 text-xs hidden md:inline truncate">
            {rider.currentZone}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1 text-[11px] text-slate-300">
            <span className="text-slate-400 hidden sm:inline">Cash Held:</span>
            <strong className="text-amber-400 font-bold">₹{rider.cashInHand.toLocaleString('en-IN')}</strong>
          </div>

          <button
            onClick={toggleOnlineStatus}
            className={`px-3 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 active:scale-95 shadow-xs ${
              rider.onlineStatus
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{rider.onlineStatus ? 'Go Offline' : 'Go Online'}</span>
          </button>
        </div>
      </div>

      {/* Main Delivery Header Navbar */}
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

            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Logo to="/delivery/dashboard" size="lg" className="shrink-0" />
              <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 pl-3 min-w-0">
                <span className="bg-amber-100 text-amber-900 border border-amber-300/80 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                  Delivery Partner
                </span>
                <span className="text-xs font-bold text-slate-700 truncate max-w-[140px] md:max-w-xs">
                  {rider.name} • {rider.vehicleNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Quick Links, Cash-in-Hand Chip & Rider Avatar */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            <Link
              to="/delivery/cod"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-xs font-bold text-amber-900 transition-colors"
            >
              <Banknote className="w-3.5 h-3.5 text-amber-600" />
              <span>COD: ₹{rider.cashInHand}</span>
            </Link>

            {/* Rider Avatar Profile */}
            <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#FFB703] to-[#FB8500] text-slate-950 font-black flex items-center justify-center text-xs sm:text-sm shadow-xs border border-amber-300 shrink-0">
                {rider.name.charAt(0)}
              </div>
              <div className="hidden xl:block text-left min-w-0">
                <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                  {rider.name}
                </p>
                <p className="text-[10px] text-amber-700 font-bold flex items-center gap-1">
                  <span>⭐ {rider.rating}</span> • <span>{rider.todayTrips} trips</span>
                </p>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Floating Active Trip Ribbon */}
      {activeOrder && location.pathname !== '/delivery/navigation' && (
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white px-4 py-2.5 border-b border-amber-500/30 sticky top-16 z-20 shadow-md animate-in slide-in-from-top-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-8 h-8 rounded-xl bg-[#FFB703] text-slate-950 flex items-center justify-center font-black shrink-0 animate-bounce">
                <Bike className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <p className="font-bold text-white truncate">
                  Active Trip: {activeOrder.store.name} ➔ {activeOrder.customer.name}
                </p>
                <p className="text-[11px] text-amber-300 font-semibold truncate">
                  {activeOrder.distanceKm} km • Est. Payout: ₹{activeOrder.estimatedPayout} • {activeOrder.paymentType === 'COD' ? `COD ₹${activeOrder.codAmount}` : 'Prepaid'}
                </p>
              </div>
            </div>

            <Link
              to="/delivery/navigation"
              className="px-3 py-1.5 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shrink-0 shadow-xs active:scale-95 transition-all"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Open Live GPS</span>
            </Link>
          </div>
        </div>
      )}

      {/* Main Delivery Body Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 flex gap-6 pb-24 lg:pb-8">
        
        {/* Desktop Sidebar Navigation */}
        <aside className="w-72 shrink-0 hidden lg:block">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-3.5 shadow-xs sticky top-24 space-y-3">
            
            {/* Rider Identity Card */}
            <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-xs space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-xs shrink-0">
                  {rider.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black truncate">{rider.name}</p>
                  <span className="text-[10px] text-amber-400 font-bold block truncate">{rider.vehicleType}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1.5 border-t border-slate-800 text-[10px] text-slate-400">
                <span>Vehicle Plate:</span>
                <span className="font-mono font-bold text-white">{rider.vehicleNumber}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] text-slate-400">
                <span>Partner Rating:</span>
                <span className="font-bold text-emerald-400">⭐ {rider.rating} (Top Rider)</span>
              </div>
            </div>

            {/* Sidebar Links */}
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

            {/* Shift Quick Metrics Widget */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Today's Shift Stats
              </span>
              <div className="flex justify-between text-slate-700 text-[11px]">
                <span>Completed Trips:</span>
                <strong className="text-slate-900">{rider.todayTrips} Orders</strong>
              </div>
              <div className="flex justify-between text-slate-700 text-[11px]">
                <span>COD Cash in Hand:</span>
                <strong className="text-amber-700 font-bold">₹{rider.cashInHand}</strong>
              </div>
            </div>

            {/* Rider Logout */}
            <button
              onClick={() => {
                navigate('/delivery/login');
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Rider Log Out</span>
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
                <Logo to="/delivery/dashboard" size="lg" />
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

            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Rider Support Hotline</span>
                <p className="font-bold text-slate-900 mt-0.5">📞 1800-419-PAWN (7296)</p>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/delivery/login');
                }}
                className="w-full flex items-center justify-center gap-2 py-2 text-rose-600 font-bold hover:bg-rose-50 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Mobile Bottom Navigation Bar */}
      <nav 
        aria-label="Delivery Mobile Navigation"
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
