import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Store, 
  PackageCheck, 
  DollarSign, 
  Users, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  Sliders, 
  Percent, 
  Truck, 
  Eye,
  RefreshCw
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { 
    adminUser, 
    vendors, 
    productsGovernance, 
    revenueMetrics, 
    totalVendorsCount,
    approvedVendorsCount,
    pendingVendorsCount,
    pendingProductsCount,
    approveVendor,
    isLoading,
    refreshAdminData
  } = useAdmin();

  const pendingVendors = vendors.filter(v => v.status === 'pending');
  const pendingProducts = productsGovernance.filter(p => p.status === 'pending_approval');

  return (
    <div className="space-y-6">
      
      {/* Executive Welcome Hero Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Command Center
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                MongoDB Atlas Connected
              </span>
            </div>
            <h1 className="font-heading font-black text-xl sm:text-2xl lg:text-3xl text-white tracking-tight">
              Executive Dashboard, {adminUser.name.split(' ')[0]} 👑
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Real-time database governance, revenue orchestration, dynamic CMS and support ticketing across all active city zones.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={refreshAdminData}
              disabled={isLoading}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 active:scale-95"
              title="Sync with MongoDB"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Syncing...' : 'Sync DB'}</span>
            </button>
            <Link
              to="/admin/vendors"
              className="px-3.5 py-2 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Review Vendors ({pendingVendorsCount})</span>
            </Link>
            <Link
              to="/admin/revenue"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
            >
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              <span>Revenue Controls</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Action Required Alert Cards (Pending Audits & Approvals) */}
      {(pendingVendorsCount > 0 || pendingProductsCount > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* Vendor Applications Awaiting Approval */}
          <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-900 block">
                  Vendor Applications
                </span>
                <p className="text-base font-black text-amber-950">
                  {pendingVendorsCount} Pending Approval
                </p>
              </div>
            </div>
            <Link
              to="/admin/vendors"
              className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors shrink-0"
            >
              Audit
            </Link>
          </div>

          {/* Products Awaiting Review */}
          <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
                <PackageCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-900 block">
                  Product Catalog
                </span>
                <p className="text-base font-black text-amber-950">
                  {pendingProductsCount} Awaiting Audit
                </p>
              </div>
            </div>
            <Link
              to="/admin/products"
              className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors shrink-0"
            >
              Verify
            </Link>
          </div>

        </div>
      )}

      {/* Financial & Business KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total GMV */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Gross Merchandise Value</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">
            ₹{revenueMetrics.totalGmv.toLocaleString('en-IN')}
          </p>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <span>+{revenueMetrics.growthRatePercent}%</span>
            <span className="text-slate-400 font-normal">vs last month</span>
          </div>
        </div>

        {/* Total Platform Net Earnings */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Platform Commission Profit</span>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-600">
            ₹{revenueMetrics.totalNetPlatformProfit.toLocaleString('en-IN')}
          </p>
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700">
            <span>Avg 13.5%</span>
            <span className="text-slate-400 font-normal">blended take-rate</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Fulfilled Orders</span>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-xl">
              <ShoppingBag className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">
            {revenueMetrics.totalOrdersCount.toLocaleString('en-IN')}
          </p>
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
            <span>₹{revenueMetrics.averageOrderValue}</span>
            <span className="text-slate-400 font-normal">AOV per basket</span>
          </div>
        </div>

        {/* Active Stores */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Registered Vendors</span>
            <span className="p-1.5 bg-amber-50 text-amber-700 rounded-xl">
              <Store className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">
            {totalVendorsCount} Stores
          </p>
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-800">
            <span>{approvedVendorsCount} Active</span>
            <span className="text-slate-400 font-normal">• {pendingVendorsCount} Review</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Pending Vendor Applications Roster + Quick Control Tiles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Pending Vendor Applications Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-black text-base sm:text-lg text-slate-900">
                Pending Vendor Approvals
              </h2>
              <p className="text-xs text-slate-500">
                Verify licence, PAN, Aadhaar and store GPS before granting live storefront.
              </p>
            </div>
            <Link
              to="/admin/vendors"
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <span>View All ({vendors.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {pendingVendors.length > 0 ? (
            <div className="space-y-3">
              {pendingVendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className="bg-slate-50 hover:bg-amber-50/40 border border-slate-200/90 hover:border-amber-200 rounded-2xl p-3.5 sm:p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      src={vendor.photos?.logo || '/images/cat_clinic.jpg'}
                      alt={vendor.storeName}
                      onError={(e) => { e.currentTarget.src = '/images/cat_clinic.jpg'; }}
                      className="w-12 h-12 rounded-xl object-cover bg-white border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-900 text-sm truncate">
                          {vendor.storeName}
                        </h3>
                        <span className="bg-amber-100 text-amber-900 border border-amber-300/60 text-[10px] font-black px-2 py-0.5 rounded-full uppercase shrink-0">
                          KYC Review
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-semibold mt-0.5 truncate">
                        Manager: <strong className="text-slate-900">{vendor.fullName}</strong> • {vendor.phone}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        📍 {vendor.location.address}, {vendor.location.city} • Licence: <span className="font-mono text-slate-600">{vendor.storeLicenceNumber}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => navigate(`/admin/vendors?auditId=${vendor.id}`)}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/90 font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Inspect KYC</span>
                    </button>
                    <button
                      onClick={() => approveVendor(vendor.id, 12)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 active:scale-95 transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl p-8 text-center text-slate-500 text-xs space-y-1">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="font-bold text-slate-800 text-sm">All vendor onboarding applications are reviewed!</p>
              <p className="text-slate-400">New partner registrations will appear here automatically.</p>
            </div>
          )}

          {/* Pending Products Preview Section */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                Products & Services Awaiting Audit ({pendingProducts.length})
              </h3>
              <Link to="/admin/products" className="text-xs font-bold text-amber-600 hover:underline">
                Audit Catalog
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pendingProducts.map((p) => (
                <div key={p.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200/90 flex items-center justify-between gap-2 text-xs hover:border-amber-200 transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <img 
                      src={p.image || '/images/prod_drools.jpg'} 
                      alt={p.title} 
                      onError={(e) => { e.currentTarget.src = '/images/prod_drools.jpg'; }}
                      className="w-10 h-10 rounded-lg object-cover bg-white border border-slate-200 shrink-0" 
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900 truncate">{p.title}</p>
                      <p className="text-[11px] text-slate-500 truncate">{p.vendorName} • ₹{p.price}</p>
                    </div>
                  </div>
                  <Link
                    to="/admin/products"
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] rounded-lg shrink-0"
                  >
                    Review
                  </Link>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Col: Quick Control Hub (3.2, 3.3, 3.4) */}
        <div className="space-y-4">
          
          {/* Section 3.2 Revenue & Commission Controls Tile */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Percent className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Revenue Controls</h3>
                  <span className="text-[10px] text-slate-400">Finance & Payouts</span>
                </div>
              </div>
              <Link to="/admin/revenue" className="text-xs font-bold text-emerald-600 hover:underline">
                Configure
              </Link>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Base Commission:</span>
                <strong className="text-slate-900">10% - 18%</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery Base Fee:</span>
                <strong className="text-slate-900">₹49 (Free &gt; ₹499)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Vendor Deposit:</span>
                <strong className="text-slate-900">₹2,499 / onboarding</strong>
              </div>
            </div>
          </div>

          {/* Section 3.3 Platform Dynamic CMS Control Tile */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Dynamic App CMS</h3>
                  <span className="text-[10px] text-slate-400">Real-time Banners</span>
                </div>
              </div>
              <Link to="/admin/platform" className="text-xs font-bold text-amber-600 hover:underline">
                Manage
              </Link>
            </div>
            <p className="text-xs text-slate-500">
              Live banner promotions, top announcement bar & flash deals without app redeployment.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
