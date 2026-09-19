import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Sparkles, 
  MapPin, 
  Star, 
  Calendar, 
  Scissors, 
  HeartHandshake, 
  ShieldCheck,
  Building,
  Filter,
  Home,
  Stethoscope,
  Clock,
  Search,
  CheckCircle2
} from 'lucide-react';
import { SALONS, SERVICE_FILTER_PILLS } from '../../data/services';
import SalonCard from '../../components/service/SalonCard';
import BookingModal from '../../components/service/BookingModal';
import { api } from '../../services/api';

function serviceToSalonItem(product) {
  const vendorId = product.vendor?._id || product.vendor || product.vendorId || '';
  const vendorStoreName = product.vendor?.storeName || product.vendorName || 'PAW NEAR Service Partner';
  const vendorLocation = product.vendor?.location || {};
  const vendorPhotos = product.vendor?.photos || {};
  const vendorModes = product.vendor?.serviceDeliveryModes || {};
  const mode = product.serviceModes || [];
  return {
    id: vendorId || product.vendorName || 'pawnear-services',
    vendorId: vendorId ? vendorId.toString() : '',
    name: vendorStoreName,
    type: (product.category || '').toLowerCase().includes('veterinary') ? 'clinic' : 'grooming',
    tagline: product.description || 'Certified pet care service near you',
    address: [vendorLocation.address, vendorLocation.city].filter(Boolean).join(', ') || 'Hyderabad',
    rating: product.vendor?.rating || product.rating || 4.8,
    reviewsCount: product.reviewsCount || 0,
    distance: 'Nearby',
    image: product.primaryImage || product.image || vendorPhotos.storeFront || '/images/cat_grooming.jpg',
    homeServiceEnabled: vendorModes.homeServiceEnabled !== false && (mode.includes('At-Home Service') || product.deliveryMode === 'home_service'),
    clinicVisitEnabled: vendorModes.clinicVisitEnabled !== false && (mode.includes('Clinic / Spa Visit') || product.deliveryMode === 'clinic_visit'),
    homeVisitingFee: vendorModes.homeServiceFee ?? 99,
    services: [{
      id: product._id || product.id,
      _id: product._id || product.id,
      vendorId: vendorId ? vendorId.toString() : '',
      vendorName: vendorStoreName,
      name: product.title || product.name,
      desc: product.description || '',
      price: product.price || 0,
      originalPrice: product.mrp || product.price,
      image: product.primaryImage || product.image || '/images/cat_grooming.jpg'
    }]
  };
}

function groupServicesByVendor(products) {
  const grouped = new Map();
  products.forEach(product => {
    const salon = serviceToSalonItem(product);
    const key = salon.vendorId || salon.name;
    if (!grouped.has(key)) {
      grouped.set(key, salon);
    } else {
      const existing = grouped.get(key);
      existing.services.push(...salon.services);
      existing.homeServiceEnabled = existing.homeServiceEnabled || salon.homeServiceEnabled;
      existing.clinicVisitEnabled = existing.clinicVisitEnabled || salon.clinicVisitEnabled;
      if (salon.type === 'clinic') existing.type = 'clinic';
    }
  });
  return Array.from(grouped.values());
}

export default function ServicesPage() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'grooming';

  // Main Category Tab: 'grooming' | 'clinic' | 'boarding'
  const [activeCategoryTab, setActiveCategoryTab] = useState(
    initialTab === 'clinic' ? 'clinic' : initialTab === 'boarding' ? 'boarding' : 'grooming'
  );

  // Delivery Channel Filter: 'all' | 'home' | 'clinic'
  const [locationChannelFilter, setLocationChannelFilter] = useState('all');

  // Sub-filter pill
  const [activeSubPill, setActiveSubPill] = useState('all');
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [salons, setSalons] = useState(SALONS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function loadServices() {
      setIsLoading(true);
      try {
        const res = await api.getProducts('type=service');
        if (!ignore && res?.success && Array.isArray(res.products)) {
          setSalons(groupServicesByVendor(res.products));
        }
      } catch (err) {
        if (!ignore) setSalons(SALONS);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }
    loadServices();
    return () => {
      ignore = true;
    };
  }, []);

  const filteredSalons = salons.filter(salon => {
    // 1. Main Category filter
    let matchesCategory = false;
    if (activeCategoryTab === 'grooming') matchesCategory = salon.type === 'grooming';
    else if (activeCategoryTab === 'clinic') matchesCategory = salon.type === 'clinic';
    else if (activeCategoryTab === 'boarding') matchesCategory = salon.type === 'boarding';

    // 2. Channel mode filter (Home Service vs Clinic Visit)
    let matchesChannel = true;
    if (locationChannelFilter === 'home') {
      matchesChannel = salon.homeServiceEnabled === true;
    } else if (locationChannelFilter === 'clinic') {
      matchesChannel = salon.clinicVisitEnabled === true;
    }

    // 3. Sub-pill filter
    let matchesSub = true;
    if (activeSubPill !== 'all') {
      matchesSub = salon.services.some(s => s.name.toLowerCase().includes(activeSubPill.toLowerCase()));
    }

    return matchesCategory && matchesChannel && matchesSub;
  });

  const groomingSubPills = [
    { id: 'all', label: 'All Grooming' },
    { id: 'bath', label: 'Bath & Wash' },
    { id: 'haircut', label: 'Hair Cut & Styling' },
    { id: 'nail', label: 'Nail Care' },
    { id: 'spa', label: 'Aromatic Spa' },
    { id: 'tick', label: 'Anti-Tick Medicated' }
  ];

  const clinicSubPills = [
    { id: 'all', label: 'All Medical Care' },
    { id: 'consultation', label: 'Doctor Consultation' },
    { id: 'vaccination', label: 'Puppy & Adult Vaccine' },
    { id: 'dental', label: 'Dental Scaling' },
    { id: 'ultrasound', label: 'Ultrasound & Diagnostics' },
    { id: 'skin', label: 'Skin & Allergy Exam' }
  ];

  const currentSubPills = activeCategoryTab === 'clinic' ? clinicSubPills : groomingSubPills;

  return (
    <div className="space-y-4 sm:space-y-6 pb-12">
      
      {/* Title & Service Category Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-slate-900 text-xl sm:text-2xl md:text-3xl">
            {activeCategoryTab === 'clinic' 
              ? 'Veterinary & Medical Checkup' 
              : activeCategoryTab === 'boarding'
              ? 'Pet Boarding & Daycare'
              : 'Pet Grooming & Spa'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Book professional at-home doorstep services or schedule in-clinic appointments near you.
          </p>
        </div>

        {/* Top Category Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0 self-start sm:self-center">
          <button
            onClick={() => {
              setActiveCategoryTab('grooming');
              setActiveSubPill('all');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeCategoryTab === 'grooming'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scissors className="w-3.5 h-3.5 text-amber-500" />
            <span>Pet Grooming</span>
          </button>

          <button
            onClick={() => {
              setActiveCategoryTab('clinic');
              setActiveSubPill('all');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeCategoryTab === 'clinic'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-blue-500" />
            <span>Vet & Checkup</span>
          </button>

          <button
            onClick={() => {
              setActiveCategoryTab('boarding');
              setActiveSubPill('all');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeCategoryTab === 'boarding'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-emerald-500" />
            <span>Boarding</span>
          </button>
        </div>
      </div>

      {/* Hero Promotional Banner */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-amber-100/90 via-orange-50 to-amber-50 border border-amber-200/80 p-5 sm:p-7 flex items-center justify-between gap-4 shadow-xs">
        <div className="space-y-2 z-10 max-w-[65%]">
          <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
            {activeCategoryTab === 'clinic' ? 'Doctor at Home or Clinic' : 'Doorstep Van or Salon'}
          </span>
          <h2 className="font-heading font-black text-base sm:text-xl md:text-2xl text-slate-900 leading-tight">
            {activeCategoryTab === 'clinic'
              ? 'Expert Veterinary Doctors & Medical Tests at Your Doorstep or Clinic'
              : 'Book Pampering Grooming at Top-Rated Salons or in Mobile Vans'}
          </h2>
          <p className="text-xs text-slate-600 hidden sm:block">
            Sanitized kits, 100% gentle certified handlers, and stress-free pet care with verified reviews.
          </p>
        </div>

        {/* Hero image banner */}
        <div className="relative w-28 h-24 sm:w-44 sm:h-32 rounded-2xl overflow-hidden shadow-sm shrink-0 border border-white/60">
          <img
            src={
              activeCategoryTab === 'clinic'
                ? 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=500&q=80'
                : 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=500&q=80'
            }
            alt="Pet Care Service"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Delivery Mode Toggle (Home Service vs In-Clinic Visit) */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
        
        {/* Channel selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider hidden sm:inline">
            Channel:
          </span>
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            {[
              { id: 'all', label: 'All Options' },
              { id: 'home', label: '🏡 At-Home Doorstep Only' },
              { id: 'clinic', label: '🏥 In-Clinic Visit Only' }
            ].map(channel => (
              <button
                key={channel.id}
                onClick={() => setLocationChannelFilter(channel.id)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  locationChannelFilter === channel.id
                    ? 'bg-[#E5A015] text-slate-950 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {channel.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-Service Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {currentSubPills.map((pill) => {
            const isActive = activeSubPill === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => setActiveSubPill(pill.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all select-none ${
                  isActive
                    ? 'bg-slate-900 text-white font-black shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Salons & Clinics List */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-slate-500 font-medium">
            {isLoading ? 'Loading certified pet care centers...' : <>Showing <span className="font-bold text-slate-900">{filteredSalons.length}</span> certified pet care centers</>}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {filteredSalons.map((salon) => (
            <SalonCard
              key={salon.id}
              salon={salon}
              onBook={(s) => setSelectedSalon(s)}
            />
          ))}

          {filteredSalons.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 text-slate-500 space-y-2">
              <p className="font-bold text-slate-800 text-sm">No pet care facilities found for this filter.</p>
              <p className="text-xs">Try selecting 'All Options' or changing the category tab.</p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Appointment Modal */}
      {selectedSalon && (
        <BookingModal
          salon={selectedSalon}
          isOpen={!!selectedSalon}
          onClose={() => setSelectedSalon(null)}
        />
      )}
    </div>
  );
}
