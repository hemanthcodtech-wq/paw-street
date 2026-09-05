import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  Key, 
  CheckCircle2, 
  UserCheck,
  Building2,
  ExternalLink,
  Store
} from 'lucide-react';
import Logo from '../../components/common/Logo';
import { useAdmin } from '../../context/AdminContext';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { setAdminUser, setIsAuthenticated } = useAdmin();
  
  const [email, setEmail] = useState('admin@pawnear.com');
  const [password, setPassword] = useState('••••••••••••');
  const [rolePreset, setRolePreset] = useState('super_admin');

  const handleLogin = (e) => {
    e.preventDefault();
    setIsAuthenticated(true);
    if (rolePreset === 'super_admin') {
      setAdminUser({
        id: 'ADM-001',
        name: 'Vikramaditya Rao',
        email: 'admin@pawnear.com',
        role: 'Super Administrator',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        permissions: ['all']
      });
    } else if (rolePreset === 'ops_lead') {
      setAdminUser({
        id: 'ADM-002',
        name: 'Pooja Nair',
        email: 'ops@pawnear.com',
        role: 'Operations & Compliance Lead',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        permissions: ['vendors', 'products', 'support']
      });
    } else {
      setAdminUser({
        id: 'ADM-003',
        name: 'Rohan Deshmukh',
        email: 'finance@pawnear.com',
        role: 'Revenue & Finance Controller',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        permissions: ['revenue', 'payouts']
      });
    }
    navigate('/admin/dashboard');
  };

  const selectPreset = (preset, emailVal) => {
    setRolePreset(preset);
    setEmail(emailVal);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-slate-900 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#FFB703] selection:text-slate-950">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-block mb-1">
            <Logo to="/" size="lg" />
          </div>
          <div className="flex items-center justify-center gap-1.5 pt-1">
            <span className="bg-amber-100 text-amber-900 border border-amber-300/80 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest">
              Admin Command Center
            </span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            PAW NEAR Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
            Authorized portal for vendor governance, revenue controls, dynamic CMS & support operations.
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          
          {/* Demo 1-Click Persona Switcher */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              1-Click Demo Access Presets:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => selectPreset('super_admin', 'admin@pawnear.com')}
                className={`p-2 rounded-2xl border text-[11px] font-bold transition-all text-center ${
                  rolePreset === 'super_admin'
                    ? 'bg-[#FFB703] text-slate-950 border-amber-400 font-black shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => selectPreset('ops_lead', 'ops@pawnear.com')}
                className={`p-2 rounded-2xl border text-[11px] font-bold transition-all text-center ${
                  rolePreset === 'ops_lead'
                    ? 'bg-[#FFB703] text-slate-950 border-amber-400 font-black shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Ops Lead
              </button>
              <button
                type="button"
                onClick={() => selectPreset('finance_lead', 'finance@pawnear.com')}
                className={`p-2 rounded-2xl border text-[11px] font-bold transition-all text-center ${
                  rolePreset === 'finance_lead'
                    ? 'bg-[#FFB703] text-slate-950 border-amber-400 font-black shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Finance
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 transition-colors font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Security Passcode
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 transition-colors font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-amber-500 focus:ring-0" />
                <span>Keep session active</span>
              </label>
              <span className="text-amber-600 font-bold hover:underline cursor-pointer">
                2FA Hardware Key
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95 mt-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Enter Admin Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick links */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <Link to="/" className="hover:text-slate-900 flex items-center gap-1">
              <ExternalLink className="w-3 h-3" />
              <span>Customer Store</span>
            </Link>
            <Link to="/vendor/login" className="hover:text-amber-700 flex items-center gap-1 text-amber-600 font-bold">
              <Store className="w-3 h-3" />
              <span>Vendor Login</span>
            </Link>
          </div>

        </div>

        {/* Security badge */}
        <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          <span>PAW NEAR Enterprise Security • 256-Bit SSL Encrypted</span>
        </div>

      </div>

    </div>
  );
}
