import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Camera,
  CheckCircle2,
  ArrowRight,
  Upload,
  Store,
  Stethoscope,
  Scissors,
  Home,
  User,
  Phone,
  Mail,
  ArrowLeft,
  Compass,
  FileText,
  ShieldCheck,
  Eye,
  Check,
  Sparkles,
  AlertCircle,
  Clock,
  CreditCard
} from 'lucide-react';
import { useVendor } from '../../context/VendorContext';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const customIcon = new L.DivIcon({
  html: `<div class="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FFB703] to-[#FB8500] text-slate-950 flex items-center justify-center shadow-xl border-2 border-white"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-store"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h2V14h8v8h2a2 2 0 0 0 2-2v-8"/><path d="M2 7h20v2l-1.6 4a2 2 0 0 1-1.8 1.4H5.4a2 2 0 0 1-1.8-1.4L2 9z"/></svg></div>`,
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return position === null ? null : (
    <Marker position={position} icon={customIcon} />
  );
}
import Logo from '../../components/common/Logo';

export default function VendorOnboardingPage() {
  const navigate = useNavigate();
  const { vendor, submitOnboardingApplication, setApprovalStatus } = useVendor();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(vendor.status === 'pending');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsSuccess, setGpsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // 1. Owner & Basic
    fullName: '',
    email: '',
    phone: '',
    password: '',
    // 2. Store Details & Multi-Service Selection
    businessTypes: [],
    businessType: '',
    storeName: '',
    storeCategory: '',
    serviceDeliveryModes: {
      homeServiceEnabled: false,
      clinicVisitEnabled: false,
      homeServiceFee: 0,
      homeServiceRadiusKm: 0
    },
    // 3. Store Licence, PAN & Aadhaar (Section 4.1)
    storeLicenceNumber: '',
    licenceType: '',
    gstin: '',
    panNumber: '',
    aadhaarNumber: '',
    kycDocs: {
      tradeLicenceUrl: '',
      panCardUrl: '',
      aadhaarUrl: ''
    },
    // 4. Banking & Payout Settlement Details
    bankDetails: {
      accountHolderName: '',
      bankName: '',
      accountNumber: '',
      confirmAccountNumber: '',
      ifscCode: '',
      upiId: ''
    },
    // 5. Real-time store location capture (via Google Maps / GPS)
    location: {
      address: '',
      city: '',
      pincode: '',
      lat: 17.4156,
      lng: 78.4350,
      landmark: ''
    },
    // 6. Store Photographs
    photos: {
      storeFront: '',
      interior: '',
      logo: '',
      profilePic: ''
    }
  });

  const toggleBusinessType = (typeId) => {
    setFormData(prev => {
      const exists = prev.businessTypes.includes(typeId);
      const updated = exists
        ? prev.businessTypes.filter(t => t !== typeId)
        : [...prev.businessTypes, typeId];
      // Keep at least one
      const finalTypes = updated.length > 0 ? updated : [typeId];
      return {
        ...prev,
        businessTypes: finalTypes,
        businessType: finalTypes.join(', ')
      };
    });
  };

  const toggleDeliveryMode = (mode) => {
    setFormData(prev => ({
      ...prev,
      serviceDeliveryModes: {
        ...prev.serviceDeliveryModes,
        [mode]: !prev.serviceDeliveryModes[mode]
      }
    }));
  };

  const handleDeliveryModeSetting = (key, value) => {
    setFormData(prev => ({
      ...prev,
      serviceDeliveryModes: {
        ...prev.serviceDeliveryModes,
        [key]: value
      }
    }));
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBankChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails,
        [field]: value
      }
    }));
  };

  const handleLocationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  };

  const tradeRef = useRef(null);
  const panRef = useRef(null);
  const aadhaarRef = useRef(null);
  const storeFrontRef = useRef(null);
  const interiorRef = useRef(null);
  const logoRef = useRef(null);
  const profilePicRef = useRef(null);
  const [uploadingDoc, setUploadingDoc] = useState(null);

  const handleFileUpload = async (e, docType, isKyc = true) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDoc(docType);
    try {
      const { api } = await import('../../services/api');
      const res = await api.uploadImage(file, 'pawnear/vendors/uploads');
      if (res.success) {
        setFormData(prev => {
          if (isKyc) {
            return { ...prev, kycDocs: { ...prev.kycDocs, [docType]: res.url } };
          } else {
            return { ...prev, photos: { ...prev.photos, [docType]: res.url } };
          }
        });
      } else {
        alert(res.message || 'Upload failed');
      }
    } catch (err) {
      alert('Upload error: ' + err.message);
    } finally {
      setUploadingDoc(null);
    }
  };

  // Real-time GPS Location Trigger
  const handleCaptureGPS = () => {
    setGpsLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              lat: Number(position.coords.latitude.toFixed(6)),
              lng: Number(position.coords.longitude.toFixed(6))
            }
          }));
          setGpsLoading(false);
          setGpsSuccess(true);
        },
        () => {
          // Accurate default fallback
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              lat: 17.4156,
              lng: 78.4350
            }
          }));
          setGpsLoading(false);
          setGpsSuccess(true);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setGpsLoading(false);
      setGpsSuccess(true);
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.fullName || !formData.email || !formData.phone || !formData.storeName || formData.businessTypes.length === 0) {
          alert('Please fill all required fields in Step 1 (Full Name, Email, Phone, Store Name, and Business Type).');
          return false;
        }
        return true;
      case 2:
        if (!formData.storeLicenceNumber || !formData.panNumber || !formData.aadhaarNumber || !formData.kycDocs.tradeLicenceUrl || !formData.kycDocs.panCardUrl || !formData.kycDocs.aadhaarUrl) {
          alert('Please fill all required fields and upload all KYC documents in Step 2.');
          return false;
        }
        return true;
      case 3:
        if (!formData.bankDetails?.accountHolderName || !formData.bankDetails?.bankName || !formData.bankDetails?.accountNumber || !formData.bankDetails?.ifscCode) {
          alert('Please fill all required Bank details (Account Holder Name, Bank Name, Account Number, and IFSC Code) in Step 3.');
          return false;
        }
        if (formData.bankDetails.confirmAccountNumber && formData.bankDetails.accountNumber !== formData.bankDetails.confirmAccountNumber) {
          alert('Bank Account Number and Confirm Account Number do not match.');
          return false;
        }
        return true;
      case 4:
        if (!formData.location.address || !formData.location.city || !formData.location.pincode) {
          alert('Please fill all required address fields in Step 4.');
          return false;
        }
        return true;
      case 5:
        if (!formData.photos.storeFront || !formData.photos.interior) {
          alert('Please upload Storefront and Interior photos in Step 5.');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNextStep = (nextStep) => {
    if (nextStep > currentStep) {
      for (let i = currentStep; i < nextStep; i++) {
        if (!validateStep(i)) return;
      }
    }
    setCurrentStep(nextStep);
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    
    // Final check for all steps
    for (let i = 1; i <= 5; i++) {
      if (!validateStep(i)) {
        setCurrentStep(i);
        return;
      }
    }
    
    submitOnboardingApplication(formData);
    setIsSubmitted(true);
  };

  const steps = [
    { number: 1, title: 'Store & Owner', desc: 'Basic info & contact', icon: Store },
    { number: 2, title: 'Licences & ID', desc: 'Licence, PAN & Aadhaar', icon: FileText },
    { number: 3, title: 'Bank & Payout', desc: 'Settlement account & UPI', icon: CreditCard },
    { number: 4, title: 'Store Geolocation', desc: 'Google Maps GPS capture', icon: MapPin },
    { number: 5, title: 'Store Photos', desc: 'Exterior & interior gallery', icon: Camera },
    { number: 6, title: 'Review & Submit', desc: 'Admin review submission', icon: CheckCircle2 }
  ];

  // SUBMITTED STATE: Under Admin Review
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center font-sans">
        <div className="max-w-2xl w-full bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-300">

          {/* Animated Status Icon */}
          <div className="w-20 h-20 rounded-full bg-amber-50 border-4 border-amber-200 text-amber-500 flex items-center justify-center mx-auto shadow-inner">
            <Clock className="w-10 h-10 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300/80 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              Under Admin Review
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Application Submitted for Admin Approval!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              Thank you, <strong>{formData.fullName || 'Store Manager'}</strong>. Your onboarding application for{' '}
              <strong>{formData.storeName || 'Your Pet Store'}</strong> is under verification by the PAW NEAR compliance team.
            </p>
          </div>

          {/* Verification Pipeline Stepper */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 text-left space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Verification Pipeline
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-2xs">
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Step 1
                </span>
                <p className="font-bold text-slate-900 text-xs mt-0.5">Submitted</p>
                <p className="text-[10px] text-slate-400">Application logged</p>
              </div>

              <div className="bg-amber-50 p-3 rounded-xl border border-amber-300 shadow-2xs">
                <span className="text-[10px] font-bold text-amber-700 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Step 2
                </span>
                <p className="font-bold text-slate-900 text-xs mt-0.5">KYC Check</p>
                <p className="text-[10px] text-slate-600">PAN & Aadhaar match</p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 opacity-60">
                <span className="text-[10px] font-bold text-slate-400">Step 3</span>
                <p className="font-bold text-slate-700 text-xs mt-0.5">Licence Audit</p>
                <p className="text-[10px] text-slate-400">Trade permit verify</p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 opacity-60">
                <span className="text-[10px] font-bold text-slate-400">Step 4</span>
                <p className="font-bold text-slate-700 text-xs mt-0.5">Store Live</p>
                <p className="text-[10px] text-slate-400">Accept orders</p>
              </div>
            </div>
          </div>

          {/* Submission Key Details */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 text-left space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Tracking Reference ID:</span>
              <span className="font-mono font-bold text-slate-900">APP-HYD-884920</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Store Licence & PAN:</span>
              <span className="font-bold text-slate-800">{formData.storeLicenceNumber || 'DL-PET-2024-88492'} • {formData.panNumber || 'ABCPS1234D'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Google Maps Geolocation:</span>
              <span className="font-mono text-slate-800 font-bold">{formData.location.lat}, {formData.location.lng}</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/"
              className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center"
            >
              Return to Customer App
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-6 sm:py-10 px-4 sm:px-6 lg:px-8 text-slate-900 font-sans selection:bg-[#FFB703] selection:text-slate-950">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Top Navbar */}
        <header className="flex items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
          <div className="flex items-center gap-2">
            <Logo to="/" size="md" />
            <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider hidden xs:inline-block">
              Partner Onboarding
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                localStorage.removeItem('paw_vendor_profile');
                window.location.reload();
              }}
              className="text-[10px] font-bold text-slate-500 hover:text-slate-700 bg-slate-100 px-2 py-1 rounded-md"
            >
              Reset Form
            </button>
            <Link
              to="/vendor/login"
              className="text-xs font-bold text-amber-600 hover:text-amber-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs flex items-center gap-1.5 transition-all hover:bg-slate-50"
            >
              <span>Already approved? Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Page Hero Title */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Store Registration
            </span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Vendor Partner Application
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Apply to list your pet store, veterinary clinic or grooming center on PAW NEAR
          </p>
        </div>

        {/* Multi-Step Indicator Progress Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900">
              Step {currentStep} of 5: <span className="text-amber-600">{steps[currentStep - 1].title}</span>
            </span>
            <span className="text-slate-400 font-semibold">{Math.round((currentStep / 5) * 100)}% Completed</span>
          </div>

          {/* Progress bar line */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-[#FB8500] transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>

          {/* Steps Pills */}
          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {steps.map((s) => {
              const Icon = s.icon;
              const isDone = currentStep > s.number;
              const isCurrent = currentStep === s.number;
              return (
                <button
                  key={s.number}
                  type="button"
                  onClick={() => handleNextStep(s.number)}
                  className={`flex flex-col items-center gap-1 p-1.5 sm:p-2 rounded-2xl transition-all text-center ${isCurrent
                    ? 'bg-amber-50 border border-amber-300 text-amber-950 font-bold'
                    : isDone
                      ? 'text-emerald-700 font-semibold hover:bg-slate-50'
                      : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-transform ${isCurrent
                    ? 'bg-[#FFB703] text-slate-950 shadow-xs scale-105'
                    : isDone
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-500'
                    }`}>
                    {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : <Icon className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-[10px] hidden sm:block truncate w-full font-bold">{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Wizard Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200/90 shadow-xl shadow-slate-200/50">

          {/* STEP 1: Store & Owner Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-heading font-black text-lg sm:text-xl text-slate-900">
                  Step 1: Store & Owner Information
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Provide your official business identity and registered authorized manager contact.
                </p>
              </div>

              {/* Multi-Select Business Types & Services */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    Select Your Business Types & Offered Services * (Select Multiple)
                  </label>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                    {formData.businessTypes.length} Selected
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'Pet Store & Retail', name: 'Pet Store', icon: Store, desc: 'Food & Accessories' },
                    { id: 'Veterinary Clinic & Hospital', name: 'Veterinary Clinic', icon: Stethoscope, desc: 'Doctor & Medical Check' },
                    { id: 'Pet Grooming & Spa', name: 'Pet Grooming', icon: Scissors, desc: 'Wash, Cut & Spa' },
                    { id: 'Pet Boarding & Daycare', name: 'Pet Boarding', icon: Home, desc: 'Hostel & Sitting' }
                  ].map(bt => {
                    const Icon = bt.icon;
                    const isSelected = formData.businessTypes.includes(bt.id);
                    return (
                      <div
                        key={bt.id}
                        onClick={() => toggleBusinessType(bt.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer text-center flex flex-col items-center gap-1.5 transition-all select-none relative ${isSelected
                          ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-300 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                          }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">
                            ✓
                          </div>
                        )}
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-xs text-slate-900 leading-tight">{bt.name}</span>
                        <span className="text-[10px] text-slate-500">{bt.desc}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Service Delivery Modes (Home Service vs In-Clinic Visit) */}
              {(formData.businessTypes.includes('Pet Grooming & Spa') || formData.businessTypes.includes('Veterinary Clinic & Hospital')) && (
                <div className="bg-gradient-to-r from-amber-50/70 via-orange-50/60 to-amber-50/70 border border-amber-200/80 rounded-2xl p-4 sm:p-5 space-y-3.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-heading font-black text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                        <span>🏡 Service Delivery Channels (Home Service vs In-Clinic)</span>
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Configure whether your staff can visit customer homes or customers visit your clinic/salon.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">

                    {/* At-Home Service Option */}
                    <div
                      onClick={() => toggleDeliveryMode('homeServiceEnabled')}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${formData.serviceDeliveryModes.homeServiceEnabled
                        ? 'bg-white border-amber-400 ring-1 ring-amber-300 shadow-2xs'
                        : 'bg-white/60 border-slate-200 opacity-70'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.serviceDeliveryModes.homeServiceEnabled}
                        onChange={() => { }}
                        className="mt-0.5 rounded border-slate-300 text-amber-500 focus:ring-amber-400 accent-amber-500"
                      />
                      <div className="space-y-1">
                        <span className="font-bold text-xs text-slate-900 block">🏠 At-Home Service Available</span>
                        <p className="text-[11px] text-slate-500 leading-tight">
                          Your groomers / mobile vets visit customer homes with kits for grooming & health checks.
                        </p>
                      </div>
                    </div>

                    {/* In-Clinic / Salon Visit Option */}
                    <div
                      onClick={() => toggleDeliveryMode('clinicVisitEnabled')}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${formData.serviceDeliveryModes.clinicVisitEnabled
                        ? 'bg-white border-amber-400 ring-1 ring-amber-300 shadow-2xs'
                        : 'bg-white/60 border-slate-200 opacity-70'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.serviceDeliveryModes.clinicVisitEnabled}
                        onChange={() => { }}
                        className="mt-0.5 rounded border-slate-300 text-amber-500 focus:ring-amber-400 accent-amber-500"
                      />
                      <div className="space-y-1">
                        <span className="font-bold text-xs text-slate-900 block">🏥 In-Clinic / At-Store Visit</span>
                        <p className="text-[11px] text-slate-500 leading-tight">
                          Pet parents bring their pets to your physical clinic, salon or daycare facility.
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Home Service Config Params */}
                  {formData.serviceDeliveryModes.homeServiceEnabled && (
                    <div className="grid grid-cols-2 gap-3 pt-1 border-t border-amber-200/60">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">
                          Home Visiting Charge (₹)
                        </label>
                        <input
                          type="number"
                          value={formData.serviceDeliveryModes.homeServiceFee}
                          onChange={(e) => handleDeliveryModeSetting('homeServiceFee', Number(e.target.value))}
                          className="w-full bg-white border border-amber-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">
                          Max Home Service Radius (km)
                        </label>
                        <input
                          type="number"
                          value={formData.serviceDeliveryModes.homeServiceRadiusKm}
                          onChange={(e) => handleDeliveryModeSetting('homeServiceRadiusKm', Number(e.target.value))}
                          className="w-full bg-white border border-amber-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  )}

                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="sm:col-span-2 flex items-center gap-4">
                  <div 
                    onClick={() => profilePicRef.current?.click()}
                    className="w-16 h-16 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-amber-400 overflow-hidden relative shrink-0"
                  >
                    {uploadingDoc === 'profilePic' ? (
                      <span className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                    ) : formData.photos.profilePic ? (
                      <img src={formData.photos.profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <input type="file" ref={profilePicRef} onChange={(e) => handleFileUpload(e, 'profilePic', false)} className="hidden" accept="image/*" />
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Vendor Profile Picture
                    </label>
                    <p className="text-[10px] text-slate-500">Upload a clear photo of the store owner/manager.</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Store Owner / Manager Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      placeholder="Full Name"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Pet Store / Business Name *
                  </label>
                  <div className="relative">
                    <Store className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={formData.storeName}
                      onChange={(e) => handleChange('storeName', e.target.value)}
                      placeholder="Store Name"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Contact Phone Number (For order alerts) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="Phone Number"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Official Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="Email Address"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleNextStep(2)}
                  className="px-6 py-2.5 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-2 active:scale-95"
                >
                  <span>Proceed to Licence & ID (PAN/Aadhaar)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Store Licence, PAN & Aadhaar (Section 4.1) */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-black text-lg sm:text-xl text-slate-900">
                    Step 2: Store Licence Details, PAN & Aadhaar
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Required verification documents for compliant payouts and municipal trade approvals.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Store Licence / Trade Certificate No. *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.storeLicenceNumber}
                    onChange={(e) => handleChange('storeLicenceNumber', e.target.value)}
                    placeholder="DL-PET-2024-88492"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    GSTIN Number (Optional/If Registered)
                  </label>
                  <input
                    type="text"
                    value={formData.gstin}
                    onChange={(e) => handleChange('gstin', e.target.value.toUpperCase())}
                    placeholder="36AABCP1234F1Z8"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400 uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Individual PAN Card Number *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={formData.panNumber}
                    onChange={(e) => handleChange('panNumber', e.target.value.toUpperCase())}
                    placeholder="ABCPS1234D"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400 uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Owner Aadhaar Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.aadhaarNumber}
                    onChange={(e) => handleChange('aadhaarNumber', e.target.value)}
                    placeholder="XXXX-XXXX-8921"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              {/* Upload Dropzones */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-700">
                  Supporting Verification Proofs
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Trade Licence */}
                  <div
                    onClick={() => tradeRef.current?.click()}
                    className="bg-slate-50 hover:bg-amber-50/50 border-2 border-dashed border-slate-300 hover:border-amber-400 rounded-2xl p-4 text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer relative"
                  >
                    <input type="file" ref={tradeRef} onChange={(e) => handleFileUpload(e, 'tradeLicenceUrl', true)} className="hidden" accept=".pdf,image/*" />
                    {uploadingDoc === 'tradeLicenceUrl' ? (
                      <span className="inline-block w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <FileText className="w-6 h-6 text-amber-600" />
                        <span className="text-xs font-bold text-slate-900">Trade Licence PDF</span>
                        {formData.kycDocs.tradeLicenceUrl ? (
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3" /> Uploaded</span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-bold">Click to upload</span>
                        )}
                      </>
                    )}
                  </div>

                  {/* PAN Card */}
                  <div
                    onClick={() => panRef.current?.click()}
                    className="bg-slate-50 hover:bg-amber-50/50 border-2 border-dashed border-slate-300 hover:border-amber-400 rounded-2xl p-4 text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer relative"
                  >
                    <input type="file" ref={panRef} onChange={(e) => handleFileUpload(e, 'panCardUrl', true)} className="hidden" accept="image/*" />
                    {uploadingDoc === 'panCardUrl' ? (
                      <span className="inline-block w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-6 h-6 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-900">PAN Card Image</span>
                        {formData.kycDocs.panCardUrl ? (
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3" /> Uploaded</span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-bold">Click to upload</span>
                        )}
                      </>
                    )}
                  </div>

                  {/* Aadhaar */}
                  <div
                    onClick={() => aadhaarRef.current?.click()}
                    className="bg-slate-50 hover:bg-amber-50/50 border-2 border-dashed border-slate-300 hover:border-amber-400 rounded-2xl p-4 text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer relative"
                  >
                    <input type="file" ref={aadhaarRef} onChange={(e) => handleFileUpload(e, 'aadhaarUrl', true)} className="hidden" accept=".pdf,image/*" />
                    {uploadingDoc === 'aadhaarUrl' ? (
                      <span className="inline-block w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-blue-600" />
                        <span className="text-xs font-bold text-slate-900">Aadhaar Document</span>
                        {formData.kycDocs.aadhaarUrl ? (
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3" /> Uploaded</span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-bold">Click to upload</span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleNextStep(1)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNextStep(3)}
                  className="px-6 py-2.5 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-black text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2 active:scale-95"
                >
                  <span>Proceed to Banking & Payout Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Bank Account & UPI Settlement Information (Section 4.1) */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-amber-500" />
                  <h3 className="font-heading font-black text-lg sm:text-xl text-slate-900">
                    Step 3: Bank Account & Payout Settlement Information
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Provide your verified bank details and UPI ID for automated disbursements of customer orders.
                </p>
              </div>

              {/* Quick Bank Selector Pills */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Quick Select Common Banks
                </label>
                <div className="flex flex-wrap gap-2">
                  {['HDFC Bank Ltd.', 'State Bank of India', 'ICICI Bank Ltd.', 'Axis Bank', 'Kotak Mahindra Bank', 'Punjab National Bank'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => handleBankChange('bankName', b)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        formData.bankDetails.bankName === b
                          ? 'bg-[#FFB703] border-amber-400 text-slate-950 shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Account Holder Name (As per Bank Records) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.bankDetails.accountHolderName || formData.fullName}
                    onChange={(e) => handleBankChange('accountHolderName', e.target.value)}
                    placeholder="e.g. Venkata Ramaraju"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.bankDetails.bankName}
                    onChange={(e) => handleBankChange('bankName', e.target.value)}
                    placeholder="e.g. HDFC Bank Ltd."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Bank Account Number *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.bankDetails.accountNumber}
                    onChange={(e) => handleBankChange('accountNumber', e.target.value)}
                    placeholder="Enter Bank Account Number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Re-Enter Account Number (Confirm) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.bankDetails.confirmAccountNumber || ''}
                    onChange={(e) => handleBankChange('confirmAccountNumber', e.target.value)}
                    placeholder="Re-enter to confirm account number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Bank IFSC Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={11}
                    value={formData.bankDetails.ifscCode}
                    onChange={(e) => handleBankChange('ifscCode', e.target.value.toUpperCase())}
                    placeholder="e.g. HDFC0001248"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400 uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    UPI VPA ID (For Instant Settlements)
                  </label>
                  <input
                    type="text"
                    value={formData.bankDetails.upiId}
                    onChange={(e) => handleBankChange('upiId', e.target.value)}
                    placeholder="e.g. yourname@okhdfcbank"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400 font-medium"
                  />
                </div>
              </div>

              {/* Bank Security Notice */}
              <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <p className="text-xs text-emerald-800 leading-relaxed">
                  <strong>Direct Bank Settlement Guarantee:</strong> Order revenue minus platform commission is disbursed directly to this verified bank account via automated IMPS / NEFT batch cycles.
                </p>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleNextStep(2)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNextStep(4)}
                  className="px-6 py-2.5 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-black text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2 active:scale-95"
                >
                  <span>Proceed to Real-Time Location Capture</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Real-Time Store Location Capture (Google Maps GPS) */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-black text-lg sm:text-xl text-slate-900">
                    Step 4: Real-Time Store Location Capture (Google Maps / GPS)
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Pinpoint your exact store GPS coordinates for superfast 15-20 min quick delivery calculations.
                </p>
              </div>

              {/* Real-time GPS Trigger Banner */}
              <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFB703] text-slate-950 flex items-center justify-center font-bold shadow-xs">
                    <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Real-Time Store Geolocation</h4>
                    <p className="text-[11px] text-slate-600">
                      Latitude: <span className="font-mono text-slate-900 font-bold">{formData.location.lat}</span> | Longitude: <span className="font-mono text-slate-900 font-bold">{formData.location.lng}</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCaptureGPS}
                  disabled={gpsLoading}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95 shrink-0"
                >
                  {gpsLoading ? (
                    <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{gpsSuccess ? 'Re-capture GPS Location' : 'Capture Live GPS Location'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Interactive Visual Map Simulation -> Now Real Leaflet Map */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 h-56 sm:h-64 flex items-center justify-center shadow-inner z-0">
                <MapContainer
                  center={[formData.location.lat || 17.4156, formData.location.lng || 78.435]}
                  zoom={13}
                  style={{ width: '100%', height: '100%' }}
                  className="z-0"
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  />
                  <LocationMarker
                    position={formData.location.lat ? { lat: formData.location.lat, lng: formData.location.lng } : null}
                    setPosition={(pos) => {
                      handleLocationChange('lat', pos.lat);
                      handleLocationChange('lng', pos.lng);
                    }}
                  />
                </MapContainer>

                <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-[11px] font-mono text-slate-300 z-[1000] pointer-events-none">
                  📍 {formData.location.lat}, {formData.location.lng}
                </div>

                <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-xs z-[1000] pointer-events-none">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Interactive Map</span>
                </div>
              </div>

              {/* Address Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Store Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location.address}
                    onChange={(e) => handleLocationChange('address', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location.city}
                    onChange={(e) => handleLocationChange('city', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location.pincode}
                    onChange={(e) => handleLocationChange('pincode', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Landmark /store location
                  </label>
                  <input
                    type="text"
                    value={formData.location.landmark}
                    onChange={(e) => handleLocationChange('landmark', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleNextStep(3)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNextStep(5)}
                  className="px-6 py-2.5 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-black text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2 active:scale-95"
                >
                  <span>Proceed to Store Photographs</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Store Photographs */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-heading font-black text-lg sm:text-xl text-slate-900">
                  Step 5: Store Photographs & Branding
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  High-quality photographs of your storefront and shelves build trust with nearby pet parents.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                {/* Storefront */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Storefront Exterior (Signboard) *
                  </label>
                  <div 
                    onClick={() => storeFrontRef.current?.click()}
                    className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-xs cursor-pointer flex items-center justify-center"
                  >
                    {uploadingDoc === 'storeFront' ? (
                      <span className="inline-block w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
                    ) : formData.photos.storeFront ? (
                      <img
                        src={formData.photos.storeFront}
                        alt="Storefront"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-slate-400">
                        <Upload className="w-8 h-8 mb-2" />
                        <span className="text-xs font-bold">Upload Image</span>
                      </div>
                    )}
                  </div>
                  <input type="file" ref={storeFrontRef} onChange={(e) => handleFileUpload(e, 'storeFront', false)} className="hidden" accept="image/*" />
                  {formData.photos.storeFront && (
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Photo Attached
                    </span>
                  )}
                </div>

                {/* Interior */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Store Interior & Shelves *
                  </label>
                  <div 
                    onClick={() => interiorRef.current?.click()}
                    className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-xs cursor-pointer flex items-center justify-center"
                  >
                    {uploadingDoc === 'interior' ? (
                      <span className="inline-block w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
                    ) : formData.photos.interior ? (
                      <img
                        src={formData.photos.interior}
                        alt="Interior"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-slate-400">
                        <Upload className="w-8 h-8 mb-2" />
                        <span className="text-xs font-bold">Upload Image</span>
                      </div>
                    )}
                  </div>
                  <input type="file" ref={interiorRef} onChange={(e) => handleFileUpload(e, 'interior', false)} className="hidden" accept="image/*" />
                  {formData.photos.interior && (
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Photo Attached
                    </span>
                  )}
                </div>

                {/* Logo */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Store Brand Logo Icon
                  </label>
                  <div 
                    onClick={() => logoRef.current?.click()}
                    className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 group shadow-xs cursor-pointer flex items-center justify-center"
                  >
                    {uploadingDoc === 'logo' ? (
                      <span className="inline-block w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
                    ) : formData.photos.logo ? (
                      <img
                        src={formData.photos.logo}
                        alt="Logo"
                        className="w-full h-full object-cover border-2 border-amber-400 group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-slate-400">
                        <Upload className="w-8 h-8 mb-2" />
                        <span className="text-xs font-bold">Upload Logo</span>
                      </div>
                    )}
                  </div>
                  <input type="file" ref={logoRef} onChange={(e) => handleFileUpload(e, 'logo', false)} className="hidden" accept="image/*" />
                  {formData.photos.logo && (
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Logo Attached
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleNextStep(4)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNextStep(6)}
                  className="px-6 py-2.5 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-black text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2 active:scale-95"
                >
                  <span>Review Application Summary</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Final Review & Application Submission */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-heading font-black text-lg sm:text-xl text-slate-900">
                  Step 6: Final Review & Submission for Admin Approval
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Verify your submitted credentials before transmitting to the PAW NEAR admin team.
                </p>
              </div>

              {/* Comprehensive Summary Card */}
              <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200 space-y-6 text-xs sm:text-sm">

                {/* Header: Owner & Store */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-200 shrink-0 bg-white shadow-xs flex items-center justify-center">
                    {formData.photos.profilePic ? (
                      <img src={formData.photos.profilePic} alt="Owner" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-slate-300" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-lg">{formData.storeName || 'Unnamed Store'}</h4>
                    <p className="font-bold text-slate-600">{formData.fullName || 'No Owner Name'}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{formData.phone || 'No Phone'} • {formData.email || 'No Email'}</p>
                  </div>
                </div>

                {/* Services & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-4 border-b border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[11px] font-bold mb-1.5">OFFERED SERVICES</span>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {formData.businessTypes.length > 0 ? formData.businessTypes.map((t, idx) => (
                        <span key={idx} className="bg-amber-100 text-amber-900 font-bold text-[10px] px-2 py-0.5 rounded-full">
                          {t}
                        </span>
                      )) : <span className="text-slate-500 text-xs">None selected</span>}
                    </div>
                    <div className="text-[11px] text-slate-600 space-y-0.5">
                      {formData.serviceDeliveryModes.homeServiceEnabled && (
                        <p className="text-emerald-700 font-medium">✓ 🏠 At-Home Service (₹{formData.serviceDeliveryModes.homeServiceFee}, {formData.serviceDeliveryModes.homeServiceRadiusKm}km)</p>
                      )}
                      {formData.serviceDeliveryModes.clinicVisitEnabled && (
                        <p className="text-blue-700 font-medium">✓ 🏥 In-Clinic / Store Appointments</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-bold mb-1.5">GPS LOCATION & ADDRESS</span>
                    <p className="text-slate-800 font-medium leading-tight">
                      {formData.location.address || 'No Address'}, {formData.location.landmark && `${formData.location.landmark}, `}{formData.location.city || 'No City'} - {formData.location.pincode || 'No Pincode'}
                    </p>
                    <p className="font-mono text-slate-500 text-[11px] mt-1">
                      Lat: {formData.location.lat} | Lng: {formData.location.lng}
                    </p>
                  </div>
                </div>

                {/* KYC & Licences */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-4 border-b border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[11px] font-bold mb-1.5">REGISTRATION & KYC</span>
                    <div className="space-y-1.5 text-xs font-mono">
                      <p><span className="text-slate-500 font-sans">Licence:</span> <span className="font-bold">{formData.storeLicenceNumber || 'N/A'}</span></p>
                      <p><span className="text-slate-500 font-sans">PAN:</span> <span className="font-bold text-emerald-700">{formData.panNumber || 'N/A'}</span></p>
                      <p><span className="text-slate-500 font-sans">Aadhaar:</span> <span className="font-bold text-blue-700">{formData.aadhaarNumber || 'N/A'}</span></p>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-bold mb-1.5">UPLOADED DOCUMENTS</span>
                    <div className="flex flex-wrap gap-2">
                      {formData.kycDocs.tradeLicenceUrl && <a href={formData.kycDocs.tradeLicenceUrl} target="_blank" rel="noreferrer" className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-md font-bold flex items-center gap-1"><FileText className="w-3 h-3"/> Licence</a>}
                      {formData.kycDocs.panCardUrl && <a href={formData.kycDocs.panCardUrl} target="_blank" rel="noreferrer" className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-md font-bold flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> PAN</a>}
                      {formData.kycDocs.aadhaarUrl && <a href={formData.kycDocs.aadhaarUrl} target="_blank" rel="noreferrer" className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-md font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Aadhaar</a>}
                      {!formData.kycDocs.tradeLicenceUrl && !formData.kycDocs.panCardUrl && !formData.kycDocs.aadhaarUrl && <span className="text-slate-500 text-xs">No documents uploaded</span>}
                    </div>
                  </div>
                </div>

                {/* Bank Account & Settlement Summary */}
                <div className="pb-4 border-b border-slate-200">
                  <span className="text-slate-400 block text-[11px] font-bold mb-1.5">BANK ACCOUNT & SETTLEMENT</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <p><span className="text-slate-500 font-sans">Account Holder:</span> <span className="font-bold text-slate-900">{formData.bankDetails?.accountHolderName || formData.fullName}</span></p>
                    <p><span className="text-slate-500 font-sans">Bank Name:</span> <span className="font-bold text-slate-900">{formData.bankDetails?.bankName || 'N/A'}</span></p>
                    <p><span className="text-slate-500 font-sans">Account No:</span> <span className="font-mono font-bold text-slate-900">••••{formData.bankDetails?.accountNumber?.slice(-4) || 'N/A'}</span></p>
                    <p><span className="text-slate-500 font-sans">IFSC Code:</span> <span className="font-mono font-bold text-emerald-700">{formData.bankDetails?.ifscCode || 'N/A'}</span></p>
                    <p className="sm:col-span-2"><span className="text-slate-500 font-sans">UPI ID:</span> <span className="font-mono font-bold text-blue-700">{formData.bankDetails?.upiId || 'N/A'}</span></p>
                  </div>
                </div>

                {/* Store Photos */}
                <div>
                  <span className="text-slate-400 block text-[11px] font-bold mb-2">STORE PHOTOGRAPHS & BRANDING</span>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {formData.photos.storeFront && (
                      <div className="w-24 h-16 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                        <img src={formData.photos.storeFront} alt="Storefront" className="w-full h-full object-cover" />
                      </div>
                    )}
                    {formData.photos.interior && (
                      <div className="w-24 h-16 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                        <img src={formData.photos.interior} alt="Interior" className="w-full h-full object-cover" />
                      </div>
                    )}
                    {formData.photos.logo && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 shrink-0 p-1 bg-white">
                        <img src={formData.photos.logo} alt="Logo" className="w-full h-full object-contain" />
                      </div>
                    )}
                    {!formData.photos.storeFront && !formData.photos.interior && !formData.photos.logo && <span className="text-slate-500 text-xs">No photos uploaded</span>}
                  </div>
                </div>

              </div>

              {/* Declaration */}
              <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-300 text-amber-500 focus:ring-amber-400 w-4 h-4 mt-0.5 accent-amber-500"
                />
                <span>
                  I declare that the store details, licences, bank account, tax PAN/Aadhaar and location provided above are genuine and accurate as per local municipal trade regulations.
                </span>
              </label>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleSubmitApplication}
                  className="px-8 py-3 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/10 transition-all flex items-center gap-2 active:scale-95"
                >
                  <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                  <span>Submit Application for Admin Review</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
