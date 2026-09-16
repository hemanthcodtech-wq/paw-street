import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Store, 
  ShieldCheck, 
  MapPin, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Camera, 
  ExternalLink, 
  Sparkles,
  Phone,
  Mail,
  Building,
  DollarSign
} from 'lucide-react';
import { useVendor } from '../../context/VendorContext';

export default function VendorStoreProfilePage() {
  const { vendor, setApprovalStatus, toggleStoreOpen } = useVendor();
  const isApproved = vendor.status === 'approved';

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 border-2 border-amber-400 p-1 shrink-0">
              <img src={vendor.photos?.logo || '/images/store_vet.jpg'} alt={vendor.storeName} className="w-full h-full object-cover rounded-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
                  {vendor.storeName}
                </h1>
                {isApproved ? (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Verified Store
                  </span>
                ) : (
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-600" />
                    Review Pending
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {(vendor.businessTypes || ['Pet Store & Retail', 'Pet Grooming & Spa', 'Veterinary Clinic & Hospital']).map((t, idx) => (
                  <span key={idx} className="bg-amber-100 text-amber-900 font-bold text-[10px] px-2 py-0.5 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-600 flex items-center gap-1 mt-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{vendor.location?.address}, {vendor.location?.city}</span>
              </p>
            </div>
          </div>

          {/* Store Open Toggle */}
          <div className="flex flex-col sm:items-end gap-2">
            <button
              onClick={toggleStoreOpen}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                vendor.isStoreOpen
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${vendor.isStoreOpen ? 'bg-white animate-ping' : 'bg-slate-500'}`} />
              <span>{vendor.isStoreOpen ? 'Store is Accepting Orders' : 'Store is Closed'}</span>
            </button>
            <span className="text-[10px] text-slate-400">Commission Rate: {vendor.commissionRate}% per order</span>
          </div>
        </div>
      </div>

      {/* Service Delivery Channels (Home Service vs In-Clinic Visit) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-heading font-black text-base text-slate-900 flex items-center gap-2">
              <span>🏡 Service Delivery Channels (Home Service vs Clinic Visit)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Control whether pet parents can book at-home grooming/vet sessions or schedule in-clinic appointments.
            </p>
          </div>
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
            Active Multi-Channel
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <span>🏠 At-Home Services</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                Enabled
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Staff travels to customer residence with grooming van & clinical health check equipment.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-700 font-medium pt-1">
              <span>Visiting Fee: <strong>₹{vendor.serviceDeliveryModes?.homeServiceFee || 99}</strong></span>
              <span>•</span>
              <span>Max Distance: <strong>{vendor.serviceDeliveryModes?.homeServiceRadiusKm || 8} km</strong></span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <span>🏥 In-Clinic / At-Store Appointments</span>
              </span>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                Enabled
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Pet parents bring their dogs & cats directly to your Banjara Hills center for salon styling & doctor consultation.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-700 font-medium pt-1">
              <span>Appointment Slots: <strong>10:00 AM - 07:00 PM</strong></span>
            </div>
          </div>

        </div>
      </div>

      {/* Grid: Credentials & Real-Time Location */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Verification Credentials & Licences (Section 4.1 Data) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-heading font-black text-base text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-500" />
              <span>Verification Documents & Licences</span>
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md">
              Section 4.1
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold">STORE TRADE LICENCE</span>
                <span className="font-mono font-bold text-slate-900 text-xs">{vendor.storeLicenceNumber || 'DL-PET-2024-88492'}</span>
              </div>
              <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold">INDIVIDUAL PAN CARD</span>
                <span className="font-mono font-bold text-slate-900 text-xs">{vendor.panNumber || 'ABCPS1234D'}</span>
              </div>
              <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> KYC Verified
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold">AADHAAR NUMBER</span>
                <span className="font-mono font-bold text-slate-900 text-xs">{vendor.aadhaarNumber || 'XXXX-XXXX-8921'}</span>
              </div>
              <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> UIDAI Linked
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold">GSTIN NUMBER</span>
                <span className="font-mono font-bold text-slate-900 text-xs">{vendor.gstin || '36AABCP1234F1Z8'}</span>
              </div>
              <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> GST Compliant
              </span>
            </div>
          </div>
        </div>

        {/* Settlement & Banking Information */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-heading font-black text-base text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span>Settlement &amp; Payout Banking Account</span>
            </h3>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md border border-emerald-200">
              Payout Active
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold">ACCOUNT HOLDER NAME</span>
                <span className="font-bold text-slate-900 text-xs">{vendor.bankDetails?.accountHolderName || vendor.fullName}</span>
              </div>
              <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Beneficiary
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold">BANK NAME</span>
                <span className="font-bold text-slate-900 text-xs">{vendor.bankDetails?.bankName || 'HDFC Bank Ltd.'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold">ACCOUNT NUMBER</span>
                <span className="font-mono font-bold text-slate-900 text-xs">
                  {vendor.bankDetails?.accountNumber
                    ? `•••• •••• ${vendor.bankDetails.accountNumber.slice(-4)}`
                    : '•••• •••• 4920'}
                </span>
              </div>
              <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold">IFSC CODE &amp; UPI VPA</span>
                <span className="font-mono font-bold text-slate-900 text-xs">
                  {vendor.bankDetails?.ifscCode || 'HDFC0001248'} • {vendor.bankDetails?.upiId || `${vendor.email?.replace('@', '@ok') || 'ramarajukoyyalagadda123@okhdfcbank'}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Store Geolocation & Map Display */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-heading font-black text-base text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-500" />
              <span>Real-Time Store Geolocation</span>
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md">
              Google Maps GPS
            </span>
          </div>

          {/* Map Simulation Container */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 h-44 flex items-center justify-center">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-slate-700" />
            <div className="absolute top-0 bottom-0 left-1/2 w-1.5 bg-slate-700" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg font-bold border-2 border-white">
                🐾
              </div>
              <div className="bg-slate-950/90 text-white px-2 py-0.5 rounded-md text-[10px] font-bold mt-1 shadow-sm">
                {vendor.storeName}
              </div>
            </div>

            <div className="absolute bottom-2 left-2 bg-slate-950/80 px-2.5 py-1 rounded-lg text-[10px] font-mono text-slate-300">
              Lat: {vendor.location?.lat}, Lng: {vendor.location?.lng}
            </div>
          </div>

          <div className="text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-900">Address on Customer Invoice:</p>
            <p>{vendor.location?.address}, {vendor.location?.city} - {vendor.location?.pincode}</p>
            <p className="text-[11px] text-slate-400">Landmark: {vendor.location?.landmark}</p>
          </div>
        </div>

      </div>

      {/* Store Photographs Gallery */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <h3 className="font-heading font-black text-base text-slate-900 flex items-center gap-2">
          <Camera className="w-4 h-4 text-amber-500" />
          <span>Storefront & Inventory Gallery (Submitted for Review)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <div className="aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs">
              <img src={vendor.photos?.storeFront || '/images/promo_banner_main.jpg'} alt="Storefront" className="w-full h-full object-cover" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 block text-center">Store Exterior & Signboard</span>
          </div>

          <div className="space-y-1.5">
            <div className="aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs">
              <img src={vendor.photos?.interior || '/images/promo_puppy.jpg'} alt="Interior" className="w-full h-full object-cover" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 block text-center">Store Interior & Shelves</span>
          </div>

          <div className="space-y-1.5">
            <div className="aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs flex items-center justify-center p-4">
              <img src={vendor.photos?.logo || '/images/store_vet.jpg'} alt="Logo" className="w-20 h-20 rounded-full object-cover border border-slate-300" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 block text-center">Store Brand Logo</span>
          </div>
        </div>
      </div>

    </div>
  );
}
