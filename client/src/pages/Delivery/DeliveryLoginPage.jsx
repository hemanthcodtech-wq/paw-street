import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bike, 
  ShieldCheck, 
  Phone, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Navigation,
  Key,
  MapPin,
  Store,
  Banknote
} from 'lucide-react';
import Logo from '../../components/common/Logo';
import { useDelivery } from '../../context/DeliveryContext';

export default function DeliveryLoginPage() {
  const navigate = useNavigate();
  const { setRider, setIsAuthenticated } = useDelivery();

  const [phone, setPhone] = useState('+91 98451 22334');
  const [otp, setOtp] = useState('4821');
  const [rolePreset, setRolePreset] = useState('raju');

  const handleLogin = (e) => {
    e.preventDefault();
    setIsAuthenticated(true);
    if (rolePreset === 'raju') {
      setRider({
        id: 'RDR-702',
        name: 'Raju Kumar',
        phone: '+91 98451 22334',
        email: 'raju@pawnear.com',
        avatar: '/images/promo_puppy.jpg',
        vehicleNumber: 'TS 09 EQ 4421',
        vehicleType: 'EV Bike (Ather 450X)',
        rating: 4.92,
        totalDeliveries: 412,
        todayTrips: 8,
        todayEarnings: 760,
        onlineStatus: true,
        cashInHand: 1450,
        currentZone: 'Jubilee Hills & Banjara Hills, Hyderabad'
      });
    } else {
      setRider({
        id: 'RDR-809',
        name: 'Amit Verma',
        phone: '+91 98112 77889',
        email: 'amit@pawnear.com',
        avatar: '/images/promo_puppy.jpg',
        vehicleNumber: 'KA 03 MX 9912',
        vehicleType: 'Honda Activa 6G',
        rating: 4.88,
        totalDeliveries: 620,
        todayTrips: 11,
        todayEarnings: 1040,
        onlineStatus: true,
        cashInHand: 2890,
        currentZone: 'Indiranagar & Koramangala, Bengaluru'
      });
    }
    navigate('/delivery/dashboard');
  };

  const selectPreset = (preset, phoneVal) => {
    setRolePreset(preset);
    setPhone(phoneVal);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-slate-900 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#FFB703] selection:text-slate-950">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-block mb-1">
            <Logo to="/" size="xl" />
          </div>
          <div className="flex items-center justify-center gap-1.5 pt-1">
            <span className="bg-amber-100 text-amber-900 border border-amber-300/80 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest">
              Delivery Partner Portal
            </span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Delivery Captain Login
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
            Live turn-by-turn navigation, real-time trip execution & cash-on-delivery reconciliation.
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          
          {/* Demo 1-Click Rider Presets */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              1-Click Demo Rider Presets:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => selectPreset('raju', '+91 98451 22334')}
                className={`p-2.5 rounded-2xl border text-xs font-bold transition-all text-left flex items-center gap-2 ${
                  rolePreset === 'raju'
                    ? 'bg-[#FFB703] text-slate-950 border-amber-400 font-black shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Bike className="w-4 h-4 shrink-0" />
                <div className="min-w-0">
                  <span className="block truncate font-black">Rider Raju</span>
                  <span className="text-[10px] opacity-80 block truncate">Active Route (Hyderabad)</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => selectPreset('amit', '+91 98112 77889')}
                className={`p-2.5 rounded-2xl border text-xs font-bold transition-all text-left flex items-center gap-2 ${
                  rolePreset === 'amit'
                    ? 'bg-[#FFB703] text-slate-950 border-amber-400 font-black shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Banknote className="w-4 h-4 shrink-0" />
                <div className="min-w-0">
                  <span className="block truncate font-black">Rider Amit</span>
                  <span className="text-[10px] opacity-80 block truncate">COD Specialist (Bengaluru)</span>
                </div>
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Registered Mobile Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#FFB703] focus:bg-white text-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-slate-700">
                  Login Passcode / OTP
                </label>
                <span className="text-[10px] font-bold text-amber-600">Demo Code: 4821</span>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#FFB703] focus:bg-white text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-400"
                />
                <span className="text-slate-600 font-semibold text-xs">Stay online across shifts</span>
              </label>
              <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" /> GPS Active
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-black rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm active:scale-98"
            >
              <Bike className="w-4 h-4" />
              <span>Start Delivery Duty</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Shortcuts to other modules */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
            <Link to="/" className="hover:text-slate-900 flex items-center gap-1">
              <span>Customer Store</span>
            </Link>
            <Link to="/vendor/login" className="hover:text-amber-600 flex items-center gap-1">
              <Store className="w-3.5 h-3.5" />
              <span>Vendor Login</span>
            </Link>
            <Link to="/admin/login" className="hover:text-slate-900 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Login</span>
            </Link>
          </div>

        </div>

        <p className="text-center text-[11px] text-slate-400 font-medium">
          🔒 PAW NEAR Delivery Fleet Network • 256-Bit SSL Encrypted Live Telemetry
        </p>

      </div>

    </div>
  );
}
