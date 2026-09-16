import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  Plus,
  ArrowLeft,
  ExternalLink,
  CreditCard,
  Building2,
  User,
  Check,
  Download,
  AlertCircle,
  Maximize2
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
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'approved', 'rejected', 'suspended'
  const [selectedVendorForAudit, setSelectedVendorForAudit] = useState(null);
  const [commissionInput, setCommissionInput] = useState(12);
  const [rejectReasonInput, setRejectReasonInput] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [isActionProcessing, setIsActionProcessing] = useState(false);
  const [previewDocModal, setPreviewDocModal] = useState(null);

  // Deep linking for audit
  useEffect(() => {
    const auditId = searchParams.get('auditId');
    if (auditId) {
      const v = vendors.find(item => item.id === auditId || item._id === auditId);
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
    setSearchParams({ auditId: vendor.id || vendor._id });
  };

  const handleCloseAudit = () => {
    setSelectedVendorForAudit(null);
    setShowRejectForm(false);
    setRejectReasonInput('');
    setSearchParams({});
  };

  const handleApprove = async (vendorId) => {
    setIsActionProcessing(true);
    try {
      await approveVendor(vendorId, commissionInput);
      handleCloseAudit();
    } catch (err) {
      alert('Error approving vendor: ' + err.message);
    } finally {
      setIsActionProcessing(false);
    }
  };

  const handleReject = async (vendorId) => {
    setIsActionProcessing(true);
    try {
      await rejectVendor(vendorId, rejectReasonInput || 'Compliance documentation incomplete or invalid.');
      handleCloseAudit();
    } catch (err) {
      alert('Error rejecting vendor: ' + err.message);
    } finally {
      setIsActionProcessing(false);
    }
  };

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = 
      v.storeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.phone?.includes(searchQuery) ||
      v.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.location?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.storeLicenceNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && v.status === statusFilter;
  });

  // =========================================================================
  // VIEW 1: FULL-PAGE VENDOR APPLICATION REVIEW (NO POPUP CARDS)
  // =========================================================================
  if (selectedVendorForAudit) {
    const v = selectedVendorForAudit;
    const isPending = v.status === 'pending';
    const isApproved = v.status === 'approved';
    const isRejected = v.status === 'rejected';

    const tradeDoc = v.kycDocs?.tradeLicenceUrl || '';
    const panDoc = v.kycDocs?.panCardUrl || '';
    const aadhaarDoc = v.kycDocs?.aadhaarUrl || '';

    const storeFrontPhoto = v.photos?.storeFront || '/images/hero_pets.jpg';
    const interiorPhoto = v.photos?.interior || '/images/promo_puppy.jpg';
    const logoPhoto = v.photos?.logo || '/images/cat_clinic.jpg';
    const profilePic = v.photos?.profilePic || '';

    const googleMapsUrl = v.location?.lat && v.location?.lng
      ? `https://www.google.com/maps?q=${v.location.lat},${v.location.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${v.storeName} ${v.location?.address || ''} ${v.location?.city || ''}`)}`;

    return (
      <div className="space-y-6 pb-20 animate-in fade-in duration-200">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={handleCloseAudit}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-colors flex items-center gap-1.5 text-xs font-bold shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Vendors</span>
            </button>
            <div className="h-6 w-px bg-slate-200 hidden sm:block" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[10px] font-bold text-slate-400">
                  ID: {v.id || v._id}
                </span>
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  isApproved
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300/80'
                    : isPending
                    ? 'bg-amber-100 text-amber-900 border border-amber-300/80 animate-pulse'
                    : isRejected
                    ? 'bg-rose-100 text-rose-800 border border-rose-300/80'
                    : 'bg-slate-100 text-slate-700 border border-slate-300'
                }`}>
                  {v.status}
                </span>
                <span className="text-slate-400 text-xs">•</span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Submitted: {v.submittedDate || 'Recently'}
                </span>
              </div>
              <h1 className="font-heading font-black text-xl sm:text-2xl text-slate-900 tracking-tight mt-0.5">
                {v.storeName}
              </h1>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            {isPending && !showRejectForm && (
              <button
                type="button"
                onClick={() => setShowRejectForm(true)}
                className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </button>
            )}

            {isPending && (
              <button
                type="button"
                disabled={isActionProcessing}
                onClick={() => handleApprove(v.id || v._id)}
                className="disabled:opacity-50 px-5 py-2.5 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-black rounded-xl shadow-xs transition-all active:scale-95 text-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isActionProcessing ? 'Approving...' : 'Approve & Send Email'}</span>
              </button>
            )}

            {!isPending && (
              <button
                type="button"
                onClick={() => toggleVendorStatus(v.id || v._id)}
                className={`px-4 py-2.5 font-bold rounded-xl border text-xs transition-colors ${
                  isApproved
                    ? 'border-rose-200 text-rose-700 hover:bg-rose-50'
                    : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                {isApproved ? 'Suspend Vendor' : 'Reactivate Vendor'}
              </button>
            )}
          </div>
        </div>

        {/* Rejection Form Banner */}
        {showRejectForm && (
          <div className="bg-rose-50 p-5 rounded-3xl border border-rose-200 space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600" />
              <span>Provide Reason for Rejection</span>
            </div>
            <p className="text-xs text-rose-700">
              This exact reason will be formatted into an official rejection notice and emailed directly to <strong>{v.email}</strong>.
            </p>
            <textarea
              rows={3}
              value={rejectReasonInput}
              onChange={(e) => setRejectReasonInput(e.target.value)}
              placeholder="e.g. Expired veterinary trade licence or unreadable photograph of the PAN card. Please upload a clear original copy and re-apply."
              className="w-full bg-white border border-rose-300 rounded-2xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowRejectForm(false)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isActionProcessing}
                onClick={() => handleReject(v.id || v._id)}
                className="disabled:opacity-50 px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-xs"
              >
                {isActionProcessing ? 'Sending...' : 'Confirm Rejection & Send Email'}
              </button>
            </div>
          </div>
        )}

        {/* Top 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Business Category</p>
              <p className="font-bold text-slate-900 text-sm">{v.category || 'Pet Store & Retail'}</p>
              <div className="flex gap-1 mt-1 flex-wrap">
                {(v.businessTypes || ['Pet Store & Retail']).map((bt, i) => (
                  <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                    {bt}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 font-bold shrink-0">
              <Percent className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Platform Take-Rate</p>
              <p className="font-black text-slate-900 text-base">{commissionInput}% Commission</p>
              <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Adjustable in governance section below</p>
            </div>
          </div>
        </div>

        {/* Main 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT 2 COLUMNS: Profile, Documents & Store Photographs */}
          <div className="lg:col-span-2 space-y-6">

            {/* 1. Basic Owner & Contact Profile */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-500" />
                  <h3 className="font-heading font-black text-base text-slate-900">
                    Proprietor & Store Manager Details
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-slate-400">Section 1</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 items-start">
                {profilePic ? (
                  <div 
                    onClick={() => setPreviewDocModal({ title: `${v.fullName} (Store Owner)`, url: profilePic })}
                    className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-300 shrink-0 shadow-sm cursor-pointer group relative"
                  >
                    <img
                      src={profilePic}
                      alt={v.fullName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-amber-100 text-amber-900 font-black text-2xl flex items-center justify-center shrink-0 border border-amber-200 shadow-sm">
                    {v.fullName?.charAt(0)?.toUpperCase() || 'V'}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-xs">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 font-semibold block text-[11px]">Primary Contact Person</span>
                    <span className="font-bold text-slate-900 text-sm block mt-0.5">{v.fullName}</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 font-semibold block text-[11px]">Registered Store Name</span>
                    <span className="font-bold text-slate-900 text-sm block mt-0.5">{v.storeName}</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 font-semibold block text-[11px]">Official Email</span>
                      <span className="font-bold text-slate-900 block mt-0.5">{v.email}</span>
                    </div>
                    <a
                      href={`mailto:${v.email}`}
                      className="p-2 bg-white hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition-colors"
                      title="Send Email"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 font-semibold block text-[11px]">Phone Number</span>
                      <span className="font-bold text-slate-900 block mt-0.5">{v.phone}</span>
                    </div>
                    <a
                      href={`tel:${v.phone}`}
                      className="p-2 bg-white hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition-colors"
                      title="Call Phone"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Official Legal Documents (Licence, PAN, Aadhaar) */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-500" />
                  <h3 className="font-heading font-black text-base text-slate-900">
                    Trade Licence, PAN & Aadhaar Documents
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-slate-400">Section 2</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. Trade Licence */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Document 1</span>
                      <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-md">Licence</span>
                    </div>
                    <p className="font-bold text-slate-900 text-xs mt-1">Trade & Municipal Licence</p>
                    <p className="font-mono font-bold text-indigo-900 text-xs mt-0.5 bg-white p-1.5 rounded-lg border border-slate-200 break-all">
                      {v.storeLicenceNumber || 'Not provided'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {tradeDoc ? (
                      <div 
                        onClick={() => setPreviewDocModal({ title: `Trade Licence (${v.storeLicenceNumber})`, url: tradeDoc })}
                        className="relative group rounded-xl overflow-hidden border border-slate-200 bg-white cursor-pointer h-36 flex items-center justify-center"
                      >
                        {tradeDoc?.toLowerCase().includes('.pdf') || tradeDoc?.toLowerCase().includes('/raw/') ? (
                          <div className="flex flex-col items-center gap-2 text-indigo-700">
                            <FileText className="w-10 h-10" />
                            <span className="text-xs font-bold">PDF Document</span>
                            <span className="text-[10px] text-slate-400">Click to view</span>
                          </div>
                        ) : (
                          <img
                            src={tradeDoc}
                            alt="Trade Licence Document"
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        )}
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <span className="px-2.5 py-1 bg-white text-slate-900 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md">
                            <Eye className="w-3.5 h-3.5" /> View Full Document
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="h-36 rounded-xl bg-slate-100 border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 p-2 text-center text-[11px]">
                        <FileText className="w-6 h-6 mb-1 text-slate-400" />
                        <span>Document copy pending</span>
                      </div>
                    )}

                    {tradeDoc && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewDocModal({ title: `Trade Licence (${v.storeLicenceNumber})`, url: tradeDoc })}
                          className="flex-1 py-1.5 bg-white hover:bg-slate-100 text-indigo-700 border border-slate-200 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> Inspect
                        </button>
                        <a
                          href={tradeDoc}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl text-[11px] font-bold flex items-center justify-center transition-colors"
                          title="Open in new window"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. PAN Card */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Document 2</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">PAN Card</span>
                    </div>
                    <p className="font-bold text-slate-900 text-xs mt-1">Individual / Business PAN</p>
                    <p className="font-mono font-bold text-emerald-900 text-xs mt-0.5 bg-white p-1.5 rounded-lg border border-slate-200 break-all">
                      {v.panNumber || 'Not provided'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {panDoc ? (
                      <div 
                        onClick={() => setPreviewDocModal({ title: `PAN Card (${v.panNumber})`, url: panDoc })}
                        className="relative group rounded-xl overflow-hidden border border-slate-200 bg-white cursor-pointer h-36 flex items-center justify-center"
                      >
                        {panDoc?.toLowerCase().includes('.pdf') || panDoc?.toLowerCase().includes('/raw/') ? (
                          <div className="flex flex-col items-center gap-2 text-emerald-700">
                            <ShieldCheck className="w-10 h-10" />
                            <span className="text-xs font-bold">PDF Document</span>
                            <span className="text-[10px] text-slate-400">Click to view</span>
                          </div>
                        ) : (
                          <img
                            src={panDoc}
                            alt="PAN Card Document"
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        )}
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <span className="px-2.5 py-1 bg-white text-slate-900 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md">
                            <Eye className="w-3.5 h-3.5" /> View Full Document
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="h-36 rounded-xl bg-slate-100 border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 p-2 text-center text-[11px]">
                        <ShieldCheck className="w-6 h-6 mb-1 text-slate-400" />
                        <span>PAN copy pending</span>
                      </div>
                    )}

                    {panDoc && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewDocModal({ title: `PAN Card (${v.panNumber})`, url: panDoc })}
                          className="flex-1 py-1.5 bg-white hover:bg-slate-100 text-emerald-700 border border-slate-200 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> Inspect
                        </button>
                        <a
                          href={panDoc}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl text-[11px] font-bold flex items-center justify-center transition-colors"
                          title="Open in new window"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Aadhaar Card */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Document 3</span>
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-md">Aadhaar</span>
                    </div>
                    <p className="font-bold text-slate-900 text-xs mt-1">Authorized Aadhaar UID</p>
                    <p className="font-mono font-bold text-amber-900 text-xs mt-0.5 bg-white p-1.5 rounded-lg border border-slate-200 break-all">
                      {v.aadhaarNumber || 'Not provided'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {aadhaarDoc ? (
                      <div 
                        onClick={() => setPreviewDocModal({ title: `Aadhaar UID (${v.aadhaarNumber})`, url: aadhaarDoc })}
                        className="relative group rounded-xl overflow-hidden border border-slate-200 bg-white cursor-pointer h-36 flex items-center justify-center"
                      >
                        {aadhaarDoc?.toLowerCase().includes('.pdf') || aadhaarDoc?.toLowerCase().includes('/raw/') ? (
                          <div className="flex flex-col items-center gap-2 text-amber-700">
                            <FileText className="w-10 h-10" />
                            <span className="text-xs font-bold">PDF Document</span>
                            <span className="text-[10px] text-slate-400">Click to view</span>
                          </div>
                        ) : (
                          <img
                            src={aadhaarDoc}
                            alt="Aadhaar Document"
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        )}
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <span className="px-2.5 py-1 bg-white text-slate-900 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md">
                            <Eye className="w-3.5 h-3.5" /> View Full Document
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="h-36 rounded-xl bg-slate-100 border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 p-2 text-center text-[11px]">
                        <FileText className="w-6 h-6 mb-1 text-slate-400" />
                        <span>Aadhaar copy pending</span>
                      </div>
                    )}

                    {aadhaarDoc && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewDocModal({ title: `Aadhaar UID (${v.aadhaarNumber})`, url: aadhaarDoc })}
                          className="flex-1 py-1.5 bg-white hover:bg-slate-100 text-amber-700 border border-slate-200 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> Inspect
                        </button>
                        <a
                          href={aadhaarDoc}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl text-[11px] font-bold flex items-center justify-center transition-colors"
                          title="Open in new window"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* 3. Verified Store Photographs Gallery */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-amber-500" />
                  <h3 className="font-heading font-black text-base text-slate-900">
                    Store Photographs (Exterior, Interior & Branding)
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-slate-400">Section 3</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div 
                    onClick={() => setPreviewDocModal({ title: `${v.storeName} - Storefront Signboard`, url: storeFrontPhoto })}
                    className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer"
                  >
                    <img
                      src={storeFrontPhoto}
                      alt="Storefront Signboard"
                      onError={(e) => { e.currentTarget.src = '/images/hero_pets.jpg'; }}
                      className="w-full h-44 object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3 py-1.5 bg-white text-slate-900 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md">
                        <Eye className="w-3.5 h-3.5" /> View Photo
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-xs text-slate-800">Storefront Signboard</p>
                    <p className="text-[10px] text-slate-400">Physical road facade & board</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div 
                    onClick={() => setPreviewDocModal({ title: `${v.storeName} - Interior & Shelves`, url: interiorPhoto })}
                    className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer"
                  >
                    <img
                      src={interiorPhoto}
                      alt="Interior & Shelves"
                      onError={(e) => { e.currentTarget.src = '/images/promo_puppy.jpg'; }}
                      className="w-full h-44 object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3 py-1.5 bg-white text-slate-900 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md">
                        <Eye className="w-3.5 h-3.5" /> View Photo
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-xs text-slate-800">Interior & Shelves</p>
                    <p className="text-[10px] text-slate-400">Inventory display & dispensary</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div 
                    onClick={() => setPreviewDocModal({ title: `${v.storeName} - Brand Logo`, url: logoPhoto })}
                    className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer"
                  >
                    <img
                      src={logoPhoto}
                      alt="Brand Logo"
                      onError={(e) => { e.currentTarget.src = '/images/cat_clinic.jpg'; }}
                      className="w-full h-44 object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3 py-1.5 bg-white text-slate-900 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md">
                        <Eye className="w-3.5 h-3.5" /> View Photo
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-xs text-slate-800">Brand Logo / Avatar</p>
                    <p className="text-[10px] text-slate-400">Public app listing mark</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT 1 COLUMN: Geolocation, Operations, Banking & Governance */}
          <div className="space-y-6">

            {/* 4. Real-time GPS Location */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-rose-500" />
                  <h3 className="font-heading font-black text-base text-slate-900">
                    Store Location & GPS
                  </h3>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  GPS Validated
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] font-semibold block">Full Address</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">
                    {v.location?.address || 'Address not entered'}
                  </p>
                  <p className="text-slate-600 text-xs">
                    {v.location?.city || 'Hyderabad'}, {v.location?.state || 'Telangana'} - {v.location?.pincode || '500034'}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 text-[10px] font-semibold block">Coordinates</span>
                    <span className="font-mono text-slate-800 font-bold">
                      Lat: {v.location?.lat || 17.4156}, Lng: {v.location?.lng || 78.4350}
                    </span>
                  </div>
                </div>

                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 bg-white hover:bg-slate-100 text-rose-600 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <MapPin className="w-4 h-4" /> Open in Google Maps
                </a>
              </div>
            </div>

            {/* 5. Service Delivery Capabilities */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-heading font-black text-sm text-slate-900">
                  Service Delivery Modes
                </h3>
                <span className="text-[10px] font-bold text-slate-400">Section 4</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-700">🛵 Doorstep / Home Delivery</span>
                  <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                    v.serviceDeliveryModes?.homeServiceEnabled !== false
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {v.serviceDeliveryModes?.homeServiceEnabled !== false ? 'Enabled' : 'Disabled'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-700">🏥 In-Clinic Doctor Visits</span>
                  <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                    v.serviceDeliveryModes?.clinicVisitEnabled !== false
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {v.serviceDeliveryModes?.clinicVisitEnabled !== false ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>

            {/* 6. Bank Account & UPI Settlement */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-heading font-black text-sm text-slate-900">
                    Payout & Bank Information
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-slate-400">Section 5</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs space-y-2">
                <div className="flex justify-between py-0.5 border-b border-slate-200/60">
                  <span className="text-slate-400">Account Holder:</span>
                  <span className="font-bold text-slate-800">{v.bankDetails?.accountHolderName || v.fullName}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-200/60">
                  <span className="text-slate-400">Bank Name:</span>
                  <span className="font-bold text-slate-800">{v.bankDetails?.bankName || 'HDFC Bank Ltd.'}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-200/60">
                  <span className="text-slate-400">Account Number:</span>
                  <span className="font-mono font-bold text-slate-800">{v.bankDetails?.accountNumber || '••••••••4920'}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-200/60">
                  <span className="text-slate-400">IFSC Code:</span>
                  <span className="font-mono font-bold text-slate-800">{v.bankDetails?.ifscCode || 'HDFC0001248'}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-400">UPI VPA:</span>
                  <span className="font-mono font-bold text-emerald-700">{v.bankDetails?.upiId || `${v.email.split('@')[0]}@okhdfcbank`}</span>
                </div>
              </div>
            </div>

            {/* 7. Platform Commission & Approval Decision */}
            <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-6 rounded-3xl border border-amber-300 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <h3 className="font-heading font-black text-base text-slate-900">
                  Commission Rate & Decision
                </h3>
              </div>

              {/* Commission Slider */}
              <div className="bg-white p-4 rounded-2xl border border-amber-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-900">
                    Platform Commission Rate (%)
                  </label>
                  <span className="font-black text-amber-700 text-base">{commissionInput}%</span>
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
                <p className="text-[11px] text-slate-500">
                  Deducted automatically from orders completed through {v.storeName}.
                </p>
              </div>

              {/* Automated Password Email Notice */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                <span className="text-[11px] font-bold text-slate-900 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-sky-500" /> Automated Credential Dispatch
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Upon approval, an email with a secure setup link will be automatically dispatched to{' '}
                  <strong className="text-slate-900">{v.email}</strong> so the vendor can set their own account password and access their store dashboard.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                {isPending && (
                  <button
                    type="button"
                    disabled={isActionProcessing}
                    onClick={() => handleApprove(v.id || v._id)}
                    className="disabled:opacity-50 w-full py-3 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-black rounded-2xl shadow-md transition-all active:scale-95 text-xs flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isActionProcessing ? 'Approving Store & Sending Email...' : 'Approve & Dispatch Welcome Email'}</span>
                  </button>
                )}

                {isPending && !showRejectForm && (
                  <button
                    type="button"
                    onClick={() => setShowRejectForm(true)}
                    className="w-full py-2.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 font-bold rounded-2xl text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Application</span>
                  </button>
                )}

                {!isPending && (
                  <button
                    type="button"
                    onClick={() => toggleVendorStatus(v.id || v._id)}
                    className={`w-full py-2.5 font-bold rounded-2xl border text-xs transition-colors ${
                      isApproved
                        ? 'border-rose-200 text-rose-700 hover:bg-rose-50'
                        : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    {isApproved ? 'Suspend Store Access' : 'Reactivate Store Access'}
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleCloseAudit}
                  className="w-full py-2 text-slate-500 hover:text-slate-700 font-bold text-xs transition-colors"
                >
                  Return to Vendor Directory
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* Interactive Lightbox Document Viewer Modal */}
        {previewDocModal && (
          <div 
            onClick={() => setPreviewDocModal(null)}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-800 flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
                <h3 className="font-heading font-black text-sm sm:text-base text-white truncate">
                  {previewDocModal.title}
                </h3>
                <div className="flex items-center gap-2">
                  <a
                    href={previewDocModal.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1 font-bold"
                    title="Open in new window"
                  >
                    <ExternalLink className="w-4 h-4" /> Open Full
                  </a>
                  <button
                    onClick={() => setPreviewDocModal(null)}
                    className="p-1.5 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 overflow-auto flex-1 flex items-center justify-center bg-slate-950/5">
                {previewDocModal.url?.toLowerCase().includes('.pdf') || previewDocModal.url?.toLowerCase().includes('/raw/') ? (
                  <iframe
                    src={previewDocModal.url}
                    title={previewDocModal.title}
                    className="w-full h-[70vh] rounded-xl border border-slate-200 bg-white"
                  />
                ) : (
                  <img
                    src={previewDocModal.url}
                    alt={previewDocModal.title}
                    className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-md border border-slate-200"
                    onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                  />
                )}
                <div style={{display:'none'}} className="flex-col items-center gap-3 text-slate-500">
                  <FileText className="w-12 h-12" />
                  <p className="text-sm font-bold">Cannot preview this file type</p>
                  <a href={previewDocModal.url} target="_blank" rel="noreferrer"
                     className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" /> Open Document
                  </a>
                </div>
              </div>

              <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
                <span className="text-slate-500 font-mono text-[11px] truncate max-w-md">
                  {previewDocModal.url}
                </span>
                <button
                  onClick={() => setPreviewDocModal(null)}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold"
                >
                  Close Viewer
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // =========================================================================
  // VIEW 2: VENDOR DIRECTORY & LIST VIEW (ENHANCED CARD DESIGN)
  // =========================================================================
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
            { id: 'rejected', label: 'Rejected', count: vendors.filter(v => v.status === 'rejected').length },
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
            placeholder="Search stores, managers, emails, licences..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

      </div>

      {/* Vendors Grid - REDESIGNED INFORMATIVE CARDS WITH PROFILE PIC */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredVendors.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-200">
            <Store className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-700 text-sm">No vendors found</p>
            <p className="text-xs text-slate-400 mt-1">Try changing your search term or filter status</p>
          </div>
        )}

        {filteredVendors.map(vendor => {
          const isPending = vendor.status === 'pending';
          const isApproved = vendor.status === 'approved';
          const isRejected = vendor.status === 'rejected';
          const profilePhoto = vendor.photos?.profilePic || '';
          const hasLicence = !!vendor.storeLicenceNumber;
          const hasPan = !!vendor.panNumber;
          const hasAadhaar = !!vendor.aadhaarNumber;

          return (
            <div 
              key={vendor.id || vendor._id}
              onClick={() => handleOpenAudit(vendor)}
              className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between space-y-4 group cursor-pointer relative overflow-hidden"
            >
              {/* Subtle top accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                isApproved ? 'bg-emerald-500' : isPending ? 'bg-amber-400' : isRejected ? 'bg-rose-500' : 'bg-slate-300'
              }`} />

              <div className="space-y-3.5 pt-1">
                {/* Card Top: Profile Pic, Store Name, Owner Name & Status Pill */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    {profilePhoto ? (
                      <img
                        src={profilePhoto}
                        alt={vendor.fullName}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-300 shadow-sm shrink-0 group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FFB703] to-[#FB8500] text-slate-950 font-black text-xl flex items-center justify-center shrink-0 shadow-sm">
                        {vendor.storeName?.charAt(0)?.toUpperCase() || 'P'}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-heading font-black text-base text-slate-900 group-hover:text-amber-600 transition-colors truncate">
                          {vendor.storeName}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-700 font-bold truncate">
                        {vendor.fullName}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                        <span>{vendor.location?.city || 'Hyderabad'}, {vendor.location?.state || 'Telangana'}</span>
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 ${
                    isApproved
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300/80'
                      : isPending
                      ? 'bg-amber-100 text-amber-900 border border-amber-300/80 animate-pulse'
                      : isRejected
                      ? 'bg-rose-100 text-rose-800 border border-rose-300/80'
                      : 'bg-slate-100 text-slate-700 border border-slate-300'
                  }`}>
                    {vendor.status}
                  </span>
                </div>

                {/* Direct Contact Pill Bar */}
                <div className="flex items-center gap-2 text-[11px] text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 overflow-hidden">
                  <span className="flex items-center gap-1 truncate font-medium">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{vendor.email}</span>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1 shrink-0 font-medium">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{vendor.phone}</span>
                  </span>
                </div>

                {/* Informative Grid: 4 Metric Blocks */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Take-Rate</span>
                    <span className="font-black text-slate-900 text-xs mt-0.5 block">{vendor.commissionRate}% Commission</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Onboarding Fee</span>
                    <span className="font-bold text-emerald-700 text-xs mt-0.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> ₹{vendor.onboardingFeeAmount || 2499} (UPI)
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Licence Reg</span>
                    <span className="font-mono text-slate-800 font-bold text-[11px] truncate block mt-0.5">
                      {vendor.storeLicenceNumber || 'Not provided'}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Bank Settlement</span>
                    <span className="font-bold text-slate-800 text-[11px] truncate block mt-0.5">
                      {vendor.bankDetails?.bankName ? `${vendor.bankDetails.bankName}` : 'HDFC Bank Ltd.'}
                    </span>
                  </div>
                </div>

                {/* Compliance Verification Badges */}
                <div className="flex items-center gap-1.5 flex-wrap text-[10px] pt-0.5">
                  <span className={`px-2 py-0.5 rounded-md font-bold flex items-center gap-0.5 ${
                    hasLicence ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <FileText className="w-3 h-3" /> Licence
                  </span>
                  <span className={`px-2 py-0.5 rounded-md font-bold flex items-center gap-0.5 ${
                    hasPan ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <ShieldCheck className="w-3 h-3" /> PAN: {vendor.panNumber || 'OK'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md font-bold flex items-center gap-0.5 ${
                    hasAadhaar ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <CheckCircle2 className="w-3 h-3" /> Aadhaar
                  </span>
                </div>
              </div>

              {/* Card Bottom: Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleOpenAudit(vendor); }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Application</span>
                </button>

                <div className="flex items-center gap-2">
                  {isPending && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleOpenAudit(vendor); }}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Review & Approve</span>
                    </button>
                  )}

                  {!isPending && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); toggleVendorStatus(vendor.id || vendor._id); }}
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

    </div>
  );
}
