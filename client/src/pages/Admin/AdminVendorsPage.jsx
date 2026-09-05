import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { 
  Store, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  Percent, 
  Clock, 
  Eye, 
  ChevronRight, 
  Sliders, 
  Sparkles,
  Camera,
  X,
  Plus
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminVendorsPage() {
  const { 
    vendors, 
    approveVendor, 
    rejectVendor, 
    toggleVendorStatus, 
    updateVendorCommission 
  } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'approved', 'suspended'
  const [selectedVendorForAudit, setSelectedVendorForAudit] = useState(null);
  const [commissionInput, setCommissionInput] = useState(12);
  const [rejectReasonInput, setRejectReasonInput] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  // Deep linking for audit
  useEffect(() => {
    const auditId = searchParams.get('auditId');
    if (auditId) {
      const v = vendors.find(item => item.id === auditId);
      if (v) {
        setSelectedVendorForAudit(v);
        setCommissionInput(v.commissionRate || 12);
      }
    }
  }, [searchParams, vendors]);

  const handleOpenAudit = (vendor) => {
    setSelectedVendorForAudit(vendor);
    setCommissionInput(vendor.commissionRate || 12);
    setShowRejectForm(false);
    setRejectReasonInput('');
  };

  const handleApprove = (vendorId) => {
    approveVendor(vendorId, commissionInput);
    setSelectedVendorForAudit(null);
  };

  const handleReject = (vendorId) => {
    rejectVendor(vendorId, rejectReasonInput || 'Compliance documentation incomplete or invalid.');
    setSelectedVendorForAudit(null);
  };

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = 
      v.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.phone.includes(searchQuery) ||
      v.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.storeLicenceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && v.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-900 border border-amber-300/80 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Vendor Governance
            </span>
          </div>
          <h1 className="font-heading font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
            Vendor Directory & KYC Governance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Verify licences, PAN/Aadhaar compliance, store photographs, and commission rates.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Stores', count: vendors.length },
            { id: 'pending', label: 'Pending Review', count: vendors.filter(v => v.status === 'pending').length, alert: true },
            { id: 'approved', label: 'Approved & Live', count: vendors.filter(v => v.status === 'approved').length },
            { id: 'suspended', label: 'Suspended', count: vendors.filter(v => v.status === 'suspended').length }
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
            placeholder="Search stores by name, city, licence..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-amber-400 font-medium"
          />
        </div>
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVendors.map((vendor) => {
          const isPending = vendor.status === 'pending';
          const isApproved = vendor.status === 'approved';
          const isSuspended = vendor.status === 'suspended';

          return (
            <div
              key={vendor.id}
              className={`bg-white rounded-3xl border transition-all p-5 space-y-4 shadow-xs ${
                isPending
                  ? 'border-amber-300 bg-gradient-to-b from-amber-50/30 to-white'
                  : isSuspended
                  ? 'border-rose-200 bg-rose-50/10'
                  : 'border-slate-200/90 hover:border-amber-300'
              }`}
            >
              {/* Card Top Row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={vendor.photos?.logo || '/images/cat_clinic.jpg'}
                    alt={vendor.storeName}
                    onError={(e) => { e.currentTarget.src = '/images/cat_clinic.jpg'; }}
                    className="w-13 h-13 rounded-2xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-heading font-black text-slate-900 text-sm sm:text-base truncate">
                        {vendor.storeName}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 font-semibold truncate mt-0.5">
                      {vendor.fullName} • <span className="text-slate-400 font-normal">{vendor.phone}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{vendor.location.address}, {vendor.location.city}</span>
                    </p>
                  </div>
                </div>

                {/* Status Pill */}
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                  isApproved
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : isPending
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    isApproved ? 'bg-emerald-600' : isPending ? 'bg-amber-500' : 'bg-rose-600'
                  }`} />
                  <span>{vendor.status}</span>
                </span>
              </div>

              {/* KYC Details Pill Box */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">STORE LICENCE</span>
                  <p className="font-mono font-bold text-slate-800 truncate">{vendor.storeLicenceNumber}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">PAN & AADHAAR</span>
                  <p className="font-mono font-bold text-slate-800 truncate">{vendor.panNumber} • {vendor.aadhaarNumber}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">PLATFORM COMMISSION</span>
                  <p className="font-bold text-amber-600">{vendor.commissionRate}% per order</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">TOTAL VOLUME</span>
                  <p className="font-bold text-slate-800">
                    {vendor.totalOrders > 0 ? `₹${vendor.totalRevenue.toLocaleString('en-IN')} (${vendor.totalOrders} ord)` : 'New Applicant'}
                  </p>
                </div>
              </div>

              {/* Service Capabilities Tags */}
              <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                {vendor.businessTypes?.map((bt, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md">
                    {bt}
                  </span>
                ))}
                {vendor.serviceDeliveryModes?.homeServiceEnabled && (
                  <span className="bg-amber-50 text-amber-800 font-bold border border-amber-200 px-2 py-0.5 rounded-md">
                    🏠 Home Visits (₹{vendor.serviceDeliveryModes.homeServiceFee})
                  </span>
                )}
                {vendor.serviceDeliveryModes?.clinicVisitEnabled && (
                  <span className="bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 px-2 py-0.5 rounded-md">
                    🏥 Clinic Visits
                  </span>
                )}
              </div>

              {/* Actions Bottom Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <button
                  onClick={() => handleOpenAudit(vendor)}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Full KYC</span>
                </button>

                <div className="flex items-center gap-2">
                  {isPending && (
                    <button
                      onClick={() => approveVendor(vendor.id, 12)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve (12%)</span>
                    </button>
                  )}

                  {!isPending && (
                    <button
                      onClick={() => toggleVendorStatus(vendor.id)}
                      className={`px-3 py-1.5 font-bold rounded-xl border transition-colors ${
                        isApproved
                          ? 'border-rose-200 text-rose-700 hover:bg-rose-50'
                          : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                      }`}
                    >
                      {isApproved ? 'Suspend' : 'Reactivate'}
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* KYC Full Inspection & Approval Modal */}
      {selectedVendorForAudit && createPortal(
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[88vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom duration-300">
            
            {/* Mobile Drag Bar */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-2 sm:hidden shrink-0" />

            {/* Modal Header */}
            <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-900 text-white">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#FFB703] text-slate-950 flex items-center justify-center font-black shrink-0 shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading font-black text-sm sm:text-base text-white truncate">
                    KYC Audit: {selectedVendorForAudit.storeName}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-400">
                    Application ID: {selectedVendorForAudit.id} • Submitted {selectedVendorForAudit.submittedDate}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedVendorForAudit(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors shrink-0"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body with Internal Scrolling */}
            <div className="p-5 sm:p-6 overflow-y-auto overscroll-contain flex-1 space-y-5 text-xs">
              
              {/* 1. Store Photographs Gallery */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  1. Store Photographs (Exterior & Interior)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <img
                      src={selectedVendorForAudit.photos?.storeFront || '/images/hero_pets.jpg'}
                      alt="Storefront"
                      onError={(e) => { e.currentTarget.src = '/images/hero_pets.jpg'; }}
                      className="w-full h-24 sm:h-32 rounded-xl object-cover border border-slate-200"
                    />
                    <span className="text-[10px] text-slate-500 font-semibold block text-center">Storefront Signboard</span>
                  </div>
                  <div className="space-y-1">
                    <img
                      src={selectedVendorForAudit.photos?.interior || '/images/promo_puppy.jpg'}
                      alt="Interior"
                      onError={(e) => { e.currentTarget.src = '/images/promo_puppy.jpg'; }}
                      className="w-full h-24 sm:h-32 rounded-xl object-cover border border-slate-200"
                    />
                    <span className="text-[10px] text-slate-500 font-semibold block text-center">Interior & Shelves</span>
                  </div>
                  <div className="space-y-1">
                    <img
                      src={selectedVendorForAudit.photos?.logo || '/images/cat_clinic.jpg'}
                      alt="Logo"
                      onError={(e) => { e.currentTarget.src = '/images/cat_clinic.jpg'; }}
                      className="w-full h-24 sm:h-32 rounded-xl object-cover border border-slate-200"
                    />
                    <span className="text-[10px] text-slate-500 font-semibold block text-center">Brand Logo</span>
                  </div>
                </div>
              </div>

              {/* 2. Registered Legal Licence & Tax Documents */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  2. Trade Licence, PAN & Aadhaar Documents
                </span>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-200/80">
                    <span className="text-slate-500">Trade Licence Number:</span>
                    <span className="font-mono font-bold text-slate-900">{selectedVendorForAudit.storeLicenceNumber}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/80">
                    <span className="text-slate-500">Individual PAN Card:</span>
                    <span className="font-mono font-bold text-slate-900">{selectedVendorForAudit.panNumber}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/80">
                    <span className="text-slate-500">Authorized Aadhaar Details:</span>
                    <span className="font-mono font-bold text-slate-900">{selectedVendorForAudit.aadhaarNumber}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Onboarding Deposit Paid:</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> ₹{selectedVendorForAudit.onboardingFeeAmount} Received via UPI
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Google Maps Location */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  3. Real-Time Store GPS Coordinates
                </span>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">{selectedVendorForAudit.location.address}, {selectedVendorForAudit.location.city} - {selectedVendorForAudit.location.pincode}</p>
                      <p className="text-[11px] text-slate-500 font-mono">Lat: {selectedVendorForAudit.location.lat}, Lng: {selectedVendorForAudit.location.lng}</p>
                    </div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0">
                    GPS Validated
                  </span>
                </div>
              </div>

              {/* 4. Commission Rate Setting for this Store */}
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900">
                    Set Custom Commission Percentage for this Store (%)
                  </label>
                  <span className="font-black text-amber-700 text-sm">{commissionInput}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={commissionInput}
                  onChange={(e) => setCommissionInput(e.target.value)}
                  className="w-full accent-amber-500"
                />
                <p className="text-[11px] text-slate-600">
                  PAW NEAR will deduct <strong>{commissionInput}%</strong> take-rate from completed orders placed with this store.
                </p>
              </div>

              {/* Reject Reason Form Toggle */}
              {showRejectForm && (
                <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 space-y-2 animate-in fade-in">
                  <label className="font-bold text-rose-900 block">
                    Reason for Rejecting Application *
                  </label>
                  <textarea
                    rows={2}
                    value={rejectReasonInput}
                    onChange={(e) => setRejectReasonInput(e.target.value)}
                    placeholder="e.g. Expired veterinary retail licence or unreadable PAN photograph..."
                    className="w-full bg-white border border-rose-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-rose-400"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowRejectForm(false)}
                      className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg font-bold text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(selectedVendorForAudit.id)}
                      className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Sticky Action Footer */}
            <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-2 shrink-0">
              {!showRejectForm ? (
                <button
                  type="button"
                  onClick={() => setShowRejectForm(true)}
                  className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Application</span>
                </button>
              ) : <div />}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedVendorForAudit(null)}
                  className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold rounded-xl text-xs transition-colors"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => handleApprove(selectedVendorForAudit.id)}
                  className="px-6 py-2.5 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-black rounded-xl shadow-xs transition-all active:scale-95 text-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Grant Live Store</span>
                </button>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
