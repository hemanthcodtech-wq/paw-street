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
  CheckCircle2,
  Truck,
  Plane,
  AlertTriangle,
  X,
  Phone
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
  const mode = product.serviceModes?.length
    ? product.serviceModes
    : product.deliveryMode === 'both'
      ? ['At-Home Service', 'Clinic / Spa Visit']
      : product.deliveryMode === 'home_service'
        ? ['At-Home Service']
        : ['Clinic / Spa Visit'];
  const homeServiceEnabled = mode.includes('At-Home Service');
  const clinicVisitEnabled = mode.includes('Clinic / Spa Visit');
  const category = String(product.category || '').toLowerCase();
  const serviceType = category.includes('veterinary') || category.includes('clinic')
    ? 'clinic'
    : category.includes('boarding') || category.includes('daycare')
      ? 'boarding'
      : 'grooming';
  return {
    id: vendorId || product.vendorName || 'pawnear-services',
    vendorId: vendorId ? vendorId.toString() : '',
    name: vendorStoreName,
    type: serviceType,
    tagline: product.description || 'Certified pet care service near you',
    address: [vendorLocation.address, vendorLocation.city].filter(Boolean).join(', ') || 'Hyderabad',
    rating: product.vendor?.rating || product.rating || 4.8,
    reviewsCount: product.reviewsCount || 0,
    distance: 'Nearby',
    image: product.primaryImage || product.image || vendorPhotos.storeFront || '/images/cat_grooming.jpg',
    homeServiceEnabled,
    clinicVisitEnabled,
    homeVisitingFee: product.visitingFee ?? vendorModes.homeServiceFee ?? 0,
    services: [{
      id: product._id || product.id,
      _id: product._id || product.id,
      vendorId: vendorId ? vendorId.toString() : '',
      vendorName: vendorStoreName,
      name: product.title || product.name,
      desc: product.description || '',
      price: product.price || 0,
      originalPrice: product.mrp || product.price,
      image: product.primaryImage || product.image || '/images/cat_grooming.jpg',
      petType: product.petType || 'Dogs & Cats',
      serviceModes: mode,
      deliveryMode: product.deliveryMode,
      visitingFee: product.visitingFee ?? vendorModes.homeServiceFee ?? 0,
      serviceType
    }]
  };
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

  // Flagship services state
  const [showVanModal, setShowVanModal] = useState(false);
  const [showRelocationModal, setShowRelocationModal] = useState(false);
  const [showLostPetModal, setShowLostPetModal] = useState(false);
  const [relocType, setRelocType] = useState('domestic');
  const [relocOrigin, setRelocOrigin] = useState('Hyderabad');
  const [relocDest, setRelocDest] = useState('Bangalore');
  const [relocWeight, setRelocWeight] = useState(12);
  const [relocSubmitted, setRelocSubmitted] = useState(false);
  const [vanBooked, setVanBooked] = useState(false);
  const [lostPetReported, setLostPetReported] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function loadServices() {
      setIsLoading(true);
      try {
        const res = await api.getProducts('type=service');
        if (!ignore && res?.success && Array.isArray(res.products)) {
          setSalons(res.products.map(serviceToSalonItem));
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
    if (activeCategoryTab === 'grooming') {
      matchesCategory = salon.services.some(service => service.serviceType === 'grooming');
    } else if (activeCategoryTab === 'clinic') {
      matchesCategory = salon.services.some(service => service.serviceType === 'clinic');
    } else if (activeCategoryTab === 'boarding') {
      matchesCategory = salon.services.some(service => service.serviceType === 'boarding');
    }

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

      {/* Flagship Specialty Services Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Mobile Pet Van */}
        <div 
          onClick={() => setShowVanModal(true)}
          className="bg-amber-50 hover:bg-amber-100/80 border border-amber-200 rounded-2xl p-4 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between group"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-black text-slate-900 text-base group-hover:text-amber-700 transition-colors">
              Doorstep Mobile Pet Van
            </h3>
            <p className="text-xs text-slate-600 line-clamp-2">
              Luxury Hydrobath, grooming & mobile vet clinic inside customized AC van at your gate.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[11px] font-black text-amber-800 bg-amber-200/80 px-2.5 py-1 rounded-lg">
              Slot Booking 🚐
            </span>
            <span className="text-xs font-bold text-amber-700">View Packages →</span>
          </div>
        </div>

        {/* Global Pet Relocation */}
        <div 
          onClick={() => setShowRelocationModal(true)}
          className="bg-sky-50 hover:bg-sky-100/80 border border-sky-200 rounded-2xl p-4 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between group"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <Plane className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-black text-slate-900 text-base group-hover:text-sky-700 transition-colors">
              Pet Relocation (Domestic & Global)
            </h3>
            <p className="text-xs text-slate-600 line-clamp-2">
              Air Cargo, dedicated AC pet cabs, IATA approved crates & health certificates.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[11px] font-black text-sky-800 bg-sky-200/80 px-2.5 py-1 rounded-lg">
              Instant Quote ✈️
            </span>
            <span className="text-xs font-bold text-sky-700">Calculate →</span>
          </div>
        </div>

        {/* Community Lost Pet SOS */}
        <div 
          onClick={() => setShowLostPetModal(true)}
          className="bg-rose-50 hover:bg-rose-100/80 border border-rose-200 rounded-2xl p-4 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between group"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-black text-slate-900 text-base group-hover:text-rose-700 transition-colors">
              Lost Pet Community Alert
            </h3>
            <p className="text-xs text-slate-600 line-clamp-2">
              Broadcast lost pet alerts to pet parents & delivery captains within 10km radius.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[11px] font-black text-rose-800 bg-rose-200/80 px-2.5 py-1 rounded-lg">
              Community SOS 🚨
            </span>
            <span className="text-xs font-bold text-rose-700">Browse / Report →</span>
          </div>
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

      {/* Doorstep Van Modal */}
      {showVanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-slate-900 text-lg">Doorstep Pet Van</h3>
                  <p className="text-xs text-slate-500">Luxury Hydrobath, Grooming & Mobile Vet</p>
                </div>
              </div>
              <button onClick={() => setShowVanModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {vanBooked ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-lg text-slate-900">Van Appointment Scheduled!</h4>
                <p className="text-xs text-slate-600">
                  Our mobile AC pet van has been booked for tomorrow. Our certified groomer will call your phone prior to arrival.
                </p>
                <button
                  onClick={() => { setVanBooked(false); setShowVanModal(false); }}
                  className="bg-amber-500 text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-amber-600"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                  <span className="text-[10px] bg-amber-500 text-white font-black px-2 py-0.5 rounded-md uppercase">Zero Travel Stress</span>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">Luxury Doorstep Hydrobath & Grooming</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Warm water bath, ozone disinfection, blowout, nail clip & herbal ear cleaning.</p>
                  <p className="font-black text-amber-700 text-base mt-2">₹1,299 <span className="text-xs text-slate-400 line-through">₹1,799</span></p>
                </div>

                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                  <span className="text-[10px] bg-blue-600 text-white font-black px-2 py-0.5 rounded-md uppercase">Certified Vet</span>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">Mobile Vet Clinical Checkup & 9-in-1 Vaccine</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Full physical examination, annual booster vaccination & digital health certificate.</p>
                  <p className="font-black text-blue-700 text-base mt-2">₹899 <span className="text-xs text-slate-400 line-through">₹1,299</span></p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Select Date & Preferred Slot</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button className="border-2 border-amber-500 bg-amber-50/50 p-2.5 rounded-xl font-bold text-slate-900">
                      Tomorrow (10:00 AM)
                    </button>
                    <button className="border border-slate-200 p-2.5 rounded-xl font-medium text-slate-700 hover:bg-slate-50">
                      Tomorrow (02:30 PM)
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setVanBooked(true)}
                  className="w-full bg-amber-500 text-white font-black py-3 rounded-2xl hover:bg-amber-600 transition-colors"
                >
                  Confirm Doorstep Van Booking
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pet Relocation Modal */}
      {showRelocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center">
                  <Plane className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-slate-900 text-lg">Pet Relocation</h3>
                  <p className="text-xs text-slate-500">Air Cargo & Door-to-Door Travel</p>
                </div>
              </div>
              <button onClick={() => setShowRelocationModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {relocSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-lg text-slate-900">Relocation Inquiry Logged!</h4>
                <p className="text-xs text-slate-600">
                  Our certified IATA pet travel coordinator will contact you shortly with flight options and quarantine paperwork guidance.
                </p>
                <button
                  onClick={() => { setRelocSubmitted(false); setShowRelocationModal(false); }}
                  className="bg-sky-600 text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-sky-700"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setRelocType('domestic')}
                    className={`flex-1 py-1.5 rounded-lg ${relocType === 'domestic' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'}`}
                  >
                    Domestic Intercity
                  </button>
                  <button
                    onClick={() => setRelocType('international')}
                    className={`flex-1 py-1.5 rounded-lg ${relocType === 'international' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'}`}
                  >
                    Global International
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Origin</label>
                    <input
                      type="text"
                      value={relocOrigin}
                      onChange={(e) => setRelocOrigin(e.target.value)}
                      className="w-full border rounded-xl p-2.5 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Destination</label>
                    <input
                      type="text"
                      value={relocDest}
                      onChange={(e) => setRelocDest(e.target.value)}
                      className="w-full border rounded-xl p-2.5 text-xs text-slate-900"
                      placeholder="City or Country"
                    />
                  </div>
                </div>

                <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-slate-400">Estimated Travel Cost</p>
                    <p className="text-xl font-black text-sky-400">
                      ₹{relocType === 'domestic' ? '9,800' : '48,500'}*
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400">Includes IATA crate guidance</span>
                </div>

                <button
                  onClick={() => setRelocSubmitted(true)}
                  className="w-full bg-sky-600 text-white font-black py-3 rounded-2xl hover:bg-sky-700 transition-colors"
                >
                  Request Detailed Itinerary ✈️
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lost Pet SOS Modal */}
      {showLostPetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-slate-900 text-lg">Lost Pet Community SOS</h3>
                  <p className="text-xs text-slate-500">Nearby alerts in your city</p>
                </div>
              </div>
              <button onClick={() => setShowLostPetModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {lostPetReported ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-lg text-slate-900">SOS Alert Broadcasted!</h4>
                <p className="text-xs text-slate-600">
                  Alert has been sent to delivery riders and pet parents active within a 10km radius.
                </p>
                <button
                  onClick={() => { setLostPetReported(false); setShowLostPetModal(false); }}
                  className="bg-rose-600 text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-rose-700"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-rose-700 text-sm">Milo (Beagle) - Lost 2 hrs ago</span>
                    <span className="text-[10px] bg-rose-600 text-white font-bold px-2 py-0.5 rounded-md">₹3,000 REWARD</span>
                  </div>
                  <p className="text-xs text-slate-600">Last seen near KBR Park Gate 2, Jubilee Hills. Friendly, wearing blue collar.</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-slate-700">Owner: +91 98450 12345</span>
                    <button className="text-xs bg-rose-600 text-white px-3 py-1 rounded-lg font-bold">Report Sighting</button>
                  </div>
                </div>

                <div className="border-t pt-3 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Lost Your Pet? Broadcast Alert</h4>
                  <button
                    onClick={() => setLostPetReported(true)}
                    className="w-full bg-rose-600 text-white font-black py-2.5 rounded-xl hover:bg-rose-700 transition-colors text-xs"
                  >
                    + Broadcast Emergency Alert (10km Radius)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
