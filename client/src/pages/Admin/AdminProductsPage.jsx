import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  PackageCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Store, 
  Tag, 
  Sliders, 
  Eye, 
  Sparkles,
  X,
  Package
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminProductsPage() {
  const { 
    productsGovernance, 
    approveProduct, 
    rejectProduct,
    pendingProductsCount 
  } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending_approval', 'approved', 'rejected'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedProductForAudit, setSelectedProductForAudit] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const categories = ['all', 'Dog Food', 'Pet Treats', 'Pet Grooming & Spa', 'Veterinary Pharmacy'];

  const filteredProducts = productsGovernance.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleApprove = (id) => {
    approveProduct(id);
    setSelectedProductForAudit(null);
  };

  const handleReject = (id) => {
    rejectProduct(id, rejectReason || 'Product violates PAW NEAR quality or prescription compliance.');
    setSelectedProductForAudit(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-900 border border-amber-300/80 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Catalog Governance
            </span>
          </div>
          <h1 className="font-heading font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
            Product & Service Governance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Audit vendor-submitted listings, check prescription guidelines, packaging labels and pricing.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Items', count: productsGovernance.length },
            { id: 'pending_approval', label: 'Awaiting Audit', count: pendingProductsCount, alert: true },
            { id: 'approved', label: 'Approved', count: productsGovernance.filter(p => p.status === 'approved').length },
            { id: 'rejected', label: 'Rejected', count: productsGovernance.filter(p => p.status === 'rejected').length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-[#FFB703] text-slate-950 font-black shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                statusFilter === tab.id
                  ? 'bg-slate-950 text-white'
                  : tab.alert && tab.count > 0
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-200 text-slate-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items by title, store or category..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-amber-400 font-medium"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((item) => {
          const isPending = item.status === 'pending_approval';
          const isApproved = item.status === 'approved';
          const isRejected = item.status === 'rejected';

          return (
            <div
              key={item.id}
              className={`bg-white rounded-3xl border transition-all p-4 space-y-3.5 shadow-xs flex flex-col justify-between ${
                isPending
                  ? 'border-amber-300 bg-gradient-to-b from-amber-50/20 to-white'
                  : isRejected
                  ? 'border-rose-200 bg-rose-50/10'
                  : 'border-slate-200/90'
              }`}
            >
              <div className="space-y-3">
                
                {/* Image & Badges */}
                <div className="relative">
                  <img
                    src={item.image || '/images/prod_drools.jpg'}
                    alt={item.title}
                    onError={(e) => { e.currentTarget.src = '/images/prod_drools.jpg'; }}
                    className="w-full h-40 rounded-2xl object-cover bg-slate-100 border border-slate-200"
                  />
                  <span className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-xs ${
                    isApproved
                      ? 'bg-emerald-600 text-white'
                      : isPending
                      ? 'bg-[#FFB703] text-slate-950 font-black animate-pulse'
                      : 'bg-rose-600 text-white'
                  }`}>
                    {isPending ? 'Pending Audit' : item.status}
                  </span>
                  
                  <span className="absolute bottom-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {item.type === 'service' ? 'Service Package' : `Stock: ${item.stock}`}
                  </span>
                </div>

                {/* Details */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {item.category}
                  </span>
                  <h3 className="font-heading font-black text-slate-900 text-sm line-clamp-2 mt-0.5">
                    {item.title}
                  </h3>
                  
                  <p className="text-xs text-slate-500 font-semibold flex items-center gap-1 mt-1">
                    <Store className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{item.vendorName}</span>
                  </p>
                </div>

                {/* Pricing Box */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">PRICE / MRP</span>
                    <p className="font-black text-slate-900">
                      ₹{item.price} <span className="text-slate-400 line-through text-[11px]">₹{item.mrp}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">DISCOUNT</span>
                    <span className="text-emerald-600 font-bold text-xs">
                      {Math.round(((item.mrp - item.price) / item.mrp) * 100)}% OFF
                    </span>
                  </div>
                </div>

                {item.notes && (
                  <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200/80">
                    ℹ️ {item.notes}
                  </p>
                )}

                {item.rejectionReason && (
                  <p className="text-[11px] text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200">
                    ❌ {item.rejectionReason}
                  </p>
                )}

              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedProductForAudit(item)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>

                {isPending && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleReject(item.id)}
                      className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Product Inspection Modal */}
      {selectedProductForAudit && createPortal(
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[92vh] sm:max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom duration-300">
            
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-900 text-white">
              <div className="min-w-0">
                <h3 className="font-heading font-black text-sm text-white truncate">
                  Product Audit: {selectedProductForAudit.title}
                </h3>
                <p className="text-[10px] text-slate-400">
                  Seller: {selectedProductForAudit.vendorName}
                </p>
              </div>
              <button
                onClick={() => setSelectedProductForAudit(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto overscroll-contain flex-1 space-y-4 text-xs">
              <img
                src={selectedProductForAudit.image || '/images/prod_drools.jpg'}
                alt={selectedProductForAudit.title}
                onError={(e) => { e.currentTarget.src = '/images/prod_drools.jpg'; }}
                className="w-full h-48 rounded-2xl object-cover border border-slate-200"
              />

              <div className="space-y-2">
                <h4 className="font-heading font-black text-base text-slate-900">
                  {selectedProductForAudit.title}
                </h4>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">CATEGORY</span>
                    <p className="font-bold text-slate-800">{selectedProductForAudit.category}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">PRICE / MRP</span>
                    <p className="font-bold text-slate-800">₹{selectedProductForAudit.price} (MRP ₹{selectedProductForAudit.mrp})</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">
                  Rejection Reason (if declining audit):
                </label>
                <textarea
                  rows={2}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Unclear product image or missing ingredients..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleReject(selectedProductForAudit.id)}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl text-xs transition-colors"
              >
                Reject Listing
              </button>

              <button
                type="button"
                onClick={() => handleApprove(selectedProductForAudit.id)}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-xs text-xs transition-all active:scale-95 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Listing</span>
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
