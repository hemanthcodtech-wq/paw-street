import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { 
  X, 
  Clock, 
  Home, 
  Store, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar,
  CreditCard,
  ShieldCheck,
  Plus,
  Building,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useVendor } from '../../context/VendorContext';
import { useOrders } from '../../context/OrderContext';

export default function BookingModal({ salon, isOpen, onClose }) {
  const { user, pets, setIsAuthModalOpen } = useAuth();
  const { addOrder, fetchVendorData } = useVendor();
  const { placeOrder } = useOrders();
  
  const [selectedPet, setSelectedPet] = useState(pets[0]?.id || 'pet-1');
  const [selectedService, setSelectedService] = useState(salon?.services[0]?.id || null);
  const [serviceType, setServiceType] = useState('home'); // 'home' | 'clinic'
  const [selectedDate, setSelectedDate] = useState('Today, 5 Sep');
  const [selectedSlot, setSelectedSlot] = useState('03:00 PM');
  const [homeAddress, setHomeAddress] = useState('Villa 14, Rainbow Meadows, Jubilee Hills');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'cod'
  const [specialNotes, setSpecialNotes] = useState('');
  
  const [bookingComplete, setBookingComplete] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);

  if (!isOpen || !salon) return null;

  const dates = [
    { label: 'Today', date: '5 Sep' },
    { label: 'Tomorrow', date: '6 Sep' },
    { label: 'Sunday', date: '7 Sep' },
    { label: 'Monday', date: '8 Sep' }
  ];

  const slots = [
    '09:30 AM', '11:00 AM', '01:30 PM', '03:00 PM', '04:30 PM', '06:00 PM'
  ];

  const addOnOptions = [
    { id: 'add-1', name: 'Anti-Tick & Flea Herbal Soak', price: 299 },
    { id: 'add-2', name: 'Nail Clipping & Paw Pad Balm', price: 199 },
    { id: 'add-3', name: 'Dental Mouth Wash & Tartar Gel', price: 249 }
  ];

  const activeServiceObj = salon.services?.find(s => s.id === selectedService) || salon.services?.[0] || {
    id: 's-def',
    name: 'Standard Pet Care Service',
    price: 899
  };

  const activePetObj = pets.find(p => p.id === selectedPet) || {
    id: 'pet-1',
    name: 'Bruno',
    breed: 'Golden Retriever (2 yrs)'
  };

  const visitingFee = serviceType === 'home' ? (salon.homeVisitingFee || 99) : 0;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const finalTotal = (activeServiceObj?.price || 0) + visitingFee + addonsTotal;

  const toggleAddon = (addon) => {
    if (selectedAddons.some(a => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();

    if (!user?.isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }

    const isClinicVisit = serviceType === 'clinic';
    const vendorId = salon.vendorId || salon.vendor || activeServiceObj.vendorId || activeServiceObj.vendor || '';
    const serviceId = activeServiceObj._id || activeServiceObj.id;
    
    const bookingPayload = {
      id: `BKG-${Math.floor(100000 + Math.random() * 900000)}`,
      orderType: serviceType === 'home' ? 'home_service' : 'clinic_visit',
      serviceCategory: salon.type === 'clinic' ? 'Veterinary' : 'Grooming',
      serviceName: activeServiceObj.name,
      petName: `${activePetObj.name} (${activePetObj.breed})`,
      customerName: 'Hemanth (Pet Parent)',
      customerPhone: '+91 98450 11223',
      customerAddress: serviceType === 'home' 
        ? homeAddress 
        : `In-Clinic Visit (${salon.name}, ${salon.address})`,
      scheduledSlot: `${selectedDate}, ${selectedSlot}`,
      items: [
        {
          id: serviceId,
          product: serviceId,
          name: activeServiceObj.name,
          quantity: 1,
          price: activeServiceObj.price,
          image: activeServiceObj.image || salon.image || '/images/cat_grooming.jpg',
          type: 'service',
          isService: true,
          vendorId,
          vendorName: salon.name,
          storeName: salon.name,
          serviceMode: isClinicVisit ? 'Clinic Visit' : 'At-Home Service',
          selectedSize: isClinicVisit ? 'Clinic Visit' : 'At-Home Service'
        },
        ...selectedAddons.map(a => ({
          id: a.id,
          name: a.name,
          quantity: 1,
          price: a.price,
          image: salon.image || '/images/cat_grooming.jpg',
          type: 'service',
          vendorId,
          vendorName: salon.name,
          serviceMode: 'Add-on'
        }))
      ],
      totalAmount: finalTotal,
      paymentMethod: paymentMethod === 'upi' ? 'Prepaid (UPI - GPay)' : paymentMethod === 'card' ? 'Prepaid (Credit Card)' : 'Pay on Arrival / Clinic Counter',
      paymentStatus: paymentMethod === 'cod' ? 'Pay on Arrival' : 'Paid',
      orderStatus: 'new',
      assignedDeliveryBoyId: null,
      placedAt: new Date().toISOString(),
      notes: specialNotes || (serviceType === 'home' ? 'Doorstep home service appointment.' : 'In-clinic scheduled visit.')
    };

    try {
      const saved = await placeOrder({
        deliveryAddress: {
          name: user?.name || 'Pet Parent',
          phone: user?.phone || bookingPayload.customerPhone,
          addressLine1: serviceType === 'home' ? homeAddress : `${salon.name}, ${salon.address || 'Hyderabad'}`,
          city: 'Hyderabad',
          pincode: '500034'
        },
        deliverySpeed: bookingPayload.scheduledSlot,
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online (Razorpay / UPI / Cards)',
        customerEmail: user?.email || '',
        customerPhone: user?.phone || bookingPayload.customerPhone,
        items: bookingPayload.items,
        itemsTotal: finalTotal,
        couponDiscount: 0,
        deliveryFee: 0,
        platformFee: 0,
        finalTotal,
        appointment: {
          mode: bookingPayload.orderType,
          scheduledSlot: bookingPayload.scheduledSlot,
          petName: bookingPayload.petName,
          serviceCategory: bookingPayload.serviceCategory,
          serviceName: bookingPayload.serviceName,
          notes: bookingPayload.notes
        }
      });
      bookingPayload.id = saved?.id || bookingPayload.id;
      bookingPayload._id = saved?._id;
    } catch (err) {
      console.warn('Appointment booking saved locally only:', err);
    }

    if (addOrder) {
      addOrder(bookingPayload);
    }
    if (fetchVendorData && vendorId) {
      fetchVendorData();
    }
    setCreatedBooking(bookingPayload);
    setBookingComplete(true);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-slate-950/75 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      
      {/* Backdrop Click to Close */}
      <div 
        className="absolute inset-0" 
        onClick={() => {
          setBookingComplete(false);
          onClose();
        }} 
      />

      {/* Modal / Drawer Content */}
      <div className="relative z-10 bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg shadow-2xl border border-amber-100/80 overflow-hidden max-h-[92vh] sm:max-h-[88vh] flex flex-col animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-2 duration-300">
        
        {/* Mobile Drag Indicator */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center bg-amber-50/60">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Modal Sticky Header */}
        <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-amber-50/60 shrink-0">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
              {salon.type === 'clinic' ? '🩺 Book Medical & Veterinary Visit' : '✂️ Book Pet Grooming & Spa'}
            </span>
            <h3 className="font-heading font-black text-slate-900 text-base sm:text-lg truncate max-w-[280px]">
              {salon.name}
            </h3>
          </div>
          <button
            onClick={() => {
              setBookingComplete(false);
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center shadow-xs border border-slate-200/80 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {bookingComplete ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="font-heading font-black text-slate-900 text-xl">Booking Confirmed!</h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1">
                  Your <span className="font-bold text-slate-800">{createdBooking?.serviceName}</span> for{' '}
                  <span className="font-bold text-amber-600">{activePetObj?.name}</span> has been confirmed.
                </p>
              </div>

              {/* Booking Summary Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Booking ID:</span>
                  <span className="font-mono font-bold text-slate-800">{createdBooking?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Channel Mode:</span>
                  <span className="font-bold text-amber-800">
                    {serviceType === 'home' ? '🏡 At-Home Doorstep Service' : '🏥 In-Clinic / Salon Visit'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date & Slot:</span>
                  <span className="font-bold text-slate-800">{createdBooking?.scheduledSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Service Location:</span>
                  <span className="font-medium text-slate-800 text-right truncate max-w-[220px]">
                    {createdBooking?.customerAddress}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-700">Total Amount:</span>
                  <span className="font-extrabold text-[#E5A015] text-base">₹{createdBooking?.totalAmount}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <Link
                  to="/vendor/orders"
                  onClick={onClose}
                  className="w-full py-3 bg-[#E5A015] hover:bg-[#D49010] text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>View in Vendor Orders & Dispatch</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => {
                    setBookingComplete(false);
                    onClose();
                  }}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              
              {/* Step 1: Select Pet */}
              <div>
                <label className="block text-[11px] font-black text-slate-800 uppercase tracking-wider mb-2">
                  1. Select Your Pet
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {pets.map((pet) => {
                    const isSelected = selectedPet === pet.id;
                    return (
                      <div
                        key={pet.id}
                        onClick={() => setSelectedPet(pet.id)}
                        className={`p-2.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-2 ${
                          isSelected
                            ? 'border-[#E5A015] bg-amber-50/70 shadow-xs ring-2 ring-[#E5A015]'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <img
                          src={pet.image}
                          alt={pet.name}
                          className="w-9 h-9 rounded-xl object-cover"
                        />
                        <div className="min-w-0">
                          <div className="font-heading font-black text-xs text-slate-900 truncate">{pet.name}</div>
                          <div className="text-[10px] text-slate-500 truncate">{pet.breed}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Choose Service Location Mode (Home Service vs In-Clinic Visit) */}
              <div>
                <label className="block text-[11px] font-black text-slate-800 uppercase tracking-wider mb-2">
                  2. Choose Service Delivery Channel *
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setServiceType('home')}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                      serviceType === 'home'
                        ? 'border-[#E5A015] bg-[#E5A015] text-slate-950 shadow-sm ring-2 ring-amber-300'
                        : 'border-slate-200 bg-slate-50/80 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Home className={`w-5 h-5 mt-0.5 shrink-0 ${serviceType === 'home' ? 'text-slate-950' : 'text-slate-500'}`} />
                    <div>
                      <div className="text-xs font-black">🏡 At-Home Doorstep</div>
                      <div className={`text-[10px] leading-tight mt-0.5 ${serviceType === 'home' ? 'text-slate-950 font-bold' : 'text-slate-500'}`}>
                        Mobile Van / Doctor visits your doorstep (+₹{salon.homeVisitingFee || 99})
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceType('clinic')}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                      serviceType === 'clinic'
                        ? 'border-blue-500 bg-blue-500 text-white shadow-sm ring-2 ring-blue-300'
                        : 'border-slate-200 bg-slate-50/80 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Building className={`w-5 h-5 mt-0.5 shrink-0 ${serviceType === 'clinic' ? 'text-white' : 'text-slate-500'}`} />
                    <div>
                      <div className="text-xs font-black">🏥 In-Clinic Visit</div>
                      <div className={`text-[10px] leading-tight mt-0.5 ${serviceType === 'clinic' ? 'text-blue-100 font-medium' : 'text-slate-500'}`}>
                        Visit salon / hospital room (₹0 Visiting fee)
                      </div>
                    </div>
                  </button>
                </div>

                {/* If Home Service: Address Input */}
                {serviceType === 'home' && (
                  <div className="mt-2 bg-amber-50/80 p-3 rounded-xl border border-amber-200/80 text-xs space-y-1">
                    <label className="block font-bold text-amber-950 text-[11px]">
                      Doorstep Service Address:
                    </label>
                    <input
                      type="text"
                      value={homeAddress}
                      onChange={(e) => setHomeAddress(e.target.value)}
                      placeholder="Enter flat / house, street & landmark"
                      className="w-full bg-white border border-amber-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-amber-400 font-medium"
                    />
                  </div>
                )}
              </div>

              {/* Step 3: Select Service Package */}
              <div>
                <label className="block text-[11px] font-black text-slate-800 uppercase tracking-wider mb-2">
                  3. Select Service Package
                </label>
                <div className="space-y-2">
                  {salon.services.map((svc) => {
                    const isSelected = selectedService === svc.id;
                    return (
                      <div
                        key={svc.id}
                        onClick={() => setSelectedService(svc.id)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-[#E5A015] bg-amber-50/70 shadow-xs ring-1 ring-[#E5A015]'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="text-xs font-black text-slate-900">{svc.name}</div>
                          {svc.desc && <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{svc.desc}</p>}
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-sm font-black text-slate-900">₹{svc.price}</span>
                          {svc.originalPrice && (
                            <span className="text-[10px] text-slate-400 line-through block">
                              ₹{svc.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Add-Ons */}
              <div>
                <label className="block text-[11px] font-black text-slate-800 uppercase tracking-wider mb-2">
                  4. Optional Add-ons
                </label>
                <div className="space-y-1.5">
                  {addOnOptions.map((addon) => {
                    const isChecked = selectedAddons.some(a => a.id === addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon)}
                        className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                          isChecked
                            ? 'border-amber-400 bg-amber-50/60'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="rounded text-amber-500 pointer-events-none"
                          />
                          <span className="text-xs font-bold text-slate-800">{addon.name}</span>
                        </div>
                        <span className="text-xs font-black text-slate-900">+₹{addon.price}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 5: Choose Date and Slot */}
              <div>
                <label className="block text-[11px] font-black text-slate-800 uppercase tracking-wider mb-2">
                  5. Choose Date & Time Slot
                </label>
                
                {/* Dates */}
                <div className="grid grid-cols-4 gap-2 mb-2.5">
                  {dates.map((d) => {
                    const dateStr = `${d.label}, ${d.date}`;
                    const isSelected = selectedDate === dateStr;
                    return (
                      <button
                        key={d.date}
                        type="button"
                        onClick={() => setSelectedDate(dateStr)}
                        className={`py-2 px-1 rounded-xl text-center transition-all border ${
                          isSelected
                            ? 'border-[#E5A015] bg-[#E5A015] text-slate-950 font-black shadow-xs'
                            : 'border-slate-200 bg-slate-50/80 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="text-[9px] uppercase font-bold tracking-tight">{d.label}</div>
                        <div className="text-xs font-black">{d.date}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Slots */}
                <div className="grid grid-cols-3 gap-2">
                  {slots.map((s) => {
                    const isSelected = selectedSlot === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSlot(s)}
                        className={`py-2 text-xs font-bold rounded-xl transition-all border ${
                          isSelected
                            ? 'border-[#E5A015] bg-amber-50 text-slate-950 ring-1 ring-[#E5A015]'
                            : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 6: Payment Method */}
              <div>
                <label className="block text-[11px] font-black text-slate-800 uppercase tracking-wider mb-2">
                  6. Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'upi', label: 'UPI (GPay/PhonePe)', icon: '⚡' },
                    { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
                    { id: 'cod', label: serviceType === 'home' ? 'Pay on Delivery' : 'Pay at Clinic', icon: '💵' }
                  ].map(pm => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        paymentMethod === pm.id
                          ? 'border-amber-500 bg-amber-50 text-slate-950 font-black ring-1 ring-amber-300'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-sm">{pm.icon}</span>
                      <span className="text-[10px] leading-tight">{pm.label}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Modal Sticky Bottom CTA Bar */}
        {!bookingComplete && (
          <div className="p-4 bg-white border-t border-slate-100 shrink-0">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-500">Service + {serviceType === 'home' ? 'Visiting Fee (₹99)' : 'In-Clinic (₹0)'} + Addons:</span>
              <span className="font-extrabold text-slate-900 text-sm">Total: ₹{finalTotal}</span>
            </div>
            <button
              onClick={handleConfirm}
              className="w-full py-3.5 bg-[#E5A015] hover:bg-[#D49010] active:scale-98 text-slate-950 font-black text-sm rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Confirm & Book Appointment (₹{finalTotal})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>,
    document.body
  );
}
