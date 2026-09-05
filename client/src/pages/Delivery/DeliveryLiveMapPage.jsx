import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Navigation, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Bike, 
  Store, 
  User, 
  AlertCircle, 
  ExternalLink, 
  Banknote, 
  ShieldCheck, 
  Package, 
  Check, 
  ArrowRight,
  Compass,
  Play,
  RotateCcw
} from 'lucide-react';
import { useDelivery } from '../../context/DeliveryContext';

export default function DeliveryLiveMapPage() {
  const navigate = useNavigate();
  const { 
    activeOrder, 
    assignments, 
    updateDeliveryStatus, 
    toggleItemVerified 
  } = useDelivery();

  // If no active in-progress order, fallback to first assigned
  const currentOrder = activeOrder || assignments[0];
  const [showItemChecklist, setShowItemChecklist] = useState(false);
  const [simulatedProgress, setSimulatedProgress] = useState(65); // 0% = Store, 100% = Customer

  if (!currentOrder) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/90 shadow-xs space-y-3">
        <Bike className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="font-heading font-black text-lg text-slate-900">No Active Delivery in Progress</h2>
        <p className="text-xs text-slate-500">Accept an assigned order from your dashboard to begin live navigation.</p>
        <Link
          to="/delivery/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FFB703] text-slate-950 font-black text-xs rounded-xl"
        >
          <span>Go to Tasks Roster</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const isStoreStage = ['assigned', 'accepted', 'arrived_at_store'].includes(currentOrder.status);
  const isEnRouteStage = ['picked_up', 'on_the_way_to_customer'].includes(currentOrder.status);
  const isDoorstepStage = currentOrder.status === 'arrived_at_doorstep';
  const isDelivered = currentOrder.status === 'delivered';

  // Advance status pipeline
  const handleNextStage = () => {
    if (currentOrder.status === 'accepted') {
      updateDeliveryStatus(currentOrder.id, 'arrived_at_store');
      setSimulatedProgress(10);
    } else if (currentOrder.status === 'arrived_at_store') {
      updateDeliveryStatus(currentOrder.id, 'picked_up');
      setSimulatedProgress(40);
    } else if (currentOrder.status === 'picked_up') {
      updateDeliveryStatus(currentOrder.id, 'on_the_way_to_customer');
      setSimulatedProgress(75);
    } else if (currentOrder.status === 'on_the_way_to_customer') {
      updateDeliveryStatus(currentOrder.id, 'arrived_at_doorstep');
      setSimulatedProgress(95);
    } else if (currentOrder.status === 'arrived_at_doorstep') {
      if (currentOrder.paymentType === 'COD' && !currentOrder.isCodCollected) {
        navigate('/delivery/cod');
      } else {
        updateDeliveryStatus(currentOrder.id, 'delivered');
        setSimulatedProgress(100);
      }
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#FFB703] text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
              Live Navigation & Dispatch
            </span>
            <span className="font-mono text-xs font-bold text-slate-500">Order #{currentOrder.orderId}</span>
          </div>
          <h1 className="font-heading font-black text-lg sm:text-xl text-slate-900 mt-1">
            {isStoreStage ? `Pickup: ${currentOrder.store.name}` : `Delivery: ${currentOrder.customer.name}`}
          </h1>
        </div>

        {/* 1-Tap Quick Action Calling Buttons */}
        <div className="flex items-center gap-2">
          <a
            href={`tel:${isStoreStage ? currentOrder.store.phone : currentOrder.customer.phone}`}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isStoreStage ? 'Call Store' : 'Call Customer'}</span>
          </a>

          <a
            href={`https://maps.google.com/?q=${isStoreStage ? currentOrder.store.lat : currentOrder.customer.lat},${isStoreStage ? currentOrder.store.lng : currentOrder.customer.lng}`}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>Google Maps GPS</span>
          </a>
        </div>
      </div>

      {/* Main Swiggy-Style Interactive Vector Map Container */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden relative shadow-xl min-h-[380px] sm:min-h-[460px] flex flex-col justify-between p-4">
        
        {/* Top Floating Turn-by-Turn Instruction Card */}
        <div className="relative z-10 max-w-md w-full bg-slate-900/95 backdrop-blur-md border border-slate-700/80 text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#FFB703] text-slate-950 flex items-center justify-center font-black shrink-0 shadow-xs">
              <Navigation className="w-5 h-5 rotate-45" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                Next Maneuver • In 400m
              </span>
              <p className="font-bold text-xs sm:text-sm text-white truncate">
                {currentOrder.navigationSteps[currentOrder.currentStepIndex]?.instruction || 'Continue on route toward destination'}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0 border-l border-slate-700 pl-3">
            <span className="text-xs font-black text-emerald-400 block">6 mins</span>
            <span className="text-[10px] text-slate-400">{currentOrder.distanceKm} km</span>
          </div>
        </div>

        {/* Interactive Simulated Vector Map Rendering */}
        <div className="absolute inset-0 bg-[#0F172A] opacity-90 flex items-center justify-center pointer-events-none">
          {/* Map Grid Roads Texture */}
          <svg className="w-full h-full absolute inset-0 stroke-slate-800/80" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            
            {/* Major Arterial Roads */}
            <path d="M 0 140 Q 200 180 500 120 T 1200 240" fill="none" stroke="#1E293B" strokeWidth="14" />
            <path d="M 220 0 Q 300 220 400 500" fill="none" stroke="#1E293B" strokeWidth="12" />
            
            {/* Live Dynamic Delivery Route Polyline */}
            <path 
              d="M 120 300 Q 260 220 380 260 T 680 180" 
              fill="none" 
              stroke="#FFB703" 
              strokeWidth="6" 
              strokeDasharray="8 6"
              className="animate-pulse"
            />
          </svg>

          {/* 1. Pickup Store Map Pin */}
          <div className="absolute left-[12%] top-[62%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto">
            <div className="bg-amber-500 text-slate-950 p-2 rounded-2xl shadow-xl border-2 border-white flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <span className="mt-1 bg-slate-900/90 text-amber-300 font-bold text-[10px] px-2 py-0.5 rounded-md border border-slate-700 whitespace-nowrap shadow-md">
              🏪 {currentOrder.store.name.split(' ')[0]}
            </span>
          </div>

          {/* 2. Live Rider Bike GPS Pin */}
          <div 
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-700 pointer-events-auto z-20"
            style={{
              left: `${12 + (simulatedProgress * 0.58)}%`,
              top: `${62 - (simulatedProgress * 0.28)}%`
            }}
          >
            {/* Pulsing GPS Radar Ring */}
            <div className="w-12 h-12 rounded-full bg-amber-400/20 animate-ping absolute -inset-0 m-auto pointer-events-none" />
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FFB703] to-[#FB8500] text-slate-950 p-2 shadow-2xl border-2 border-white flex items-center justify-center transform -rotate-12">
              <Bike className="w-5 h-5 font-black" />
            </div>
            <span className="mt-1 bg-slate-950 text-white font-black text-[9px] px-2 py-0.5 rounded-full border border-amber-400 whitespace-nowrap shadow-xl">
              🛵 You ({currentOrder.distanceKm} km away)
            </span>
          </div>

          {/* 3. Customer Destination Map Pin */}
          <div className="absolute left-[70%] top-[34%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto">
            <div className="bg-emerald-500 text-white p-2 rounded-2xl shadow-xl border-2 border-white flex items-center justify-center animate-bounce">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="mt-1 bg-slate-900/90 text-emerald-300 font-bold text-[10px] px-2 py-0.5 rounded-md border border-slate-700 whitespace-nowrap shadow-md">
              📍 {currentOrder.customer.name.split(' ')[0]}'s Doorstep
            </span>
          </div>
        </div>

        {/* Live Simulation & GPS Telemetry Toolbar */}
        <div className="relative z-10 self-end bg-slate-900/90 backdrop-blur-md border border-slate-800 text-white p-2 rounded-2xl flex items-center gap-2 text-xs">
          <span className="text-[10px] text-slate-400 font-bold pl-1">Simulate GPS:</span>
          <button
            onClick={() => setSimulatedProgress(prev => Math.min(95, prev + 15))}
            className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-[11px] rounded-lg border border-amber-500/40 flex items-center gap-1 active:scale-95"
          >
            <Play className="w-3 h-3" />
            <span>Move +300m</span>
          </button>
          <button
            onClick={() => setSimulatedProgress(20)}
            className="p-1 text-slate-400 hover:text-white rounded-lg"
            title="Reset Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Interactive Delivery Step Milestone Pipeline & Action Drawer */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        
        {/* Milestone Steps Bar */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className={`p-2.5 rounded-2xl border ${
            ['accepted', 'arrived_at_store', 'picked_up', 'on_the_way_to_customer', 'arrived_at_doorstep', 'delivered'].includes(currentOrder.status)
              ? 'bg-amber-50 border-amber-300 text-slate-950 font-bold'
              : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}>
            <span className="block text-[10px] opacity-75">1. Store</span>
            <span className="font-black truncate block">Pickup</span>
          </div>

          <div className={`p-2.5 rounded-2xl border ${
            ['picked_up', 'on_the_way_to_customer', 'arrived_at_doorstep', 'delivered'].includes(currentOrder.status)
              ? 'bg-amber-50 border-amber-300 text-slate-950 font-bold'
              : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}>
            <span className="block text-[10px] opacity-75">2. Packaging</span>
            <span className="font-black truncate block">Verified</span>
          </div>

          <div className={`p-2.5 rounded-2xl border ${
            ['on_the_way_to_customer', 'arrived_at_doorstep', 'delivered'].includes(currentOrder.status)
              ? 'bg-amber-50 border-amber-300 text-slate-950 font-bold'
              : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}>
            <span className="block text-[10px] opacity-75">3. Live GPS</span>
            <span className="font-black truncate block">On The Way</span>
          </div>

          <div className={`p-2.5 rounded-2xl border ${
            currentOrder.status === 'delivered'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
              : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}>
            <span className="block text-[10px] opacity-75">4. Dropoff</span>
            <span className="font-black truncate block">Delivered</span>
          </div>
        </div>

        {/* Item Checklist Toggle at Pickup */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-600" />
              <span className="font-bold text-xs text-slate-900">
                Package Item Verification Manifest ({currentOrder.items.length} items)
              </span>
            </div>
            <button
              onClick={() => setShowItemChecklist(!showItemChecklist)}
              className="text-xs font-bold text-amber-600 hover:underline"
            >
              {showItemChecklist ? 'Hide Checklist' : 'View Checklist'}
            </button>
          </div>

          {showItemChecklist && (
            <div className="space-y-2 pt-2 border-t border-slate-200/70 text-xs">
              {currentOrder.items.map((it, idx) => (
                <div 
                  key={idx}
                  onClick={() => toggleItemVerified(currentOrder.id, idx)}
                  className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-amber-400 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                      it.verified 
                        ? 'bg-emerald-600 border-emerald-600 text-white' 
                        : 'border-slate-300 bg-slate-50'
                    }`}>
                      {it.verified && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">{it.name}</span>
                      <span className="text-[11px] text-slate-500">Qty: {it.qty} • ₹{it.price}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    it.verified ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {it.verified ? 'Verified' : 'Tap to Check'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Primary Milestone Progress Action Button */}
        <div className="pt-2">
          {currentOrder.status === 'accepted' && (
            <button
              onClick={handleNextStage}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <Store className="w-4 h-4 text-amber-400" />
              <span>1. I Have Arrived at Store ({currentOrder.store.name.split(' ')[0]})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {currentOrder.status === 'arrived_at_store' && (
            <button
              onClick={handleNextStage}
              className="w-full py-3.5 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <Package className="w-4 h-4" />
              <span>2. Order Package Picked Up &amp; Verified</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {currentOrder.status === 'picked_up' && (
            <button
              onClick={handleNextStage}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <Navigation className="w-4 h-4 text-amber-400" />
              <span>3. Start Journey to Customer Doorstep</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {currentOrder.status === 'on_the_way_to_customer' && (
            <button
              onClick={handleNextStage}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <MapPin className="w-4 h-4" />
              <span>4. I Have Arrived at Customer Doorstep</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {currentOrder.status === 'arrived_at_doorstep' && (
            <div className="space-y-3">
              {currentOrder.paymentType === 'COD' && !currentOrder.isCodCollected ? (
                <div className="bg-rose-50 border-2 border-rose-300 p-4 rounded-2xl text-xs space-y-2">
                  <div className="flex items-center gap-2 text-rose-800 font-black">
                    <Banknote className="w-4 h-4" />
                    <span>MANDATORY CASH-ON-DELIVERY COLLECTION: ₹{currentOrder.codAmount}</span>
                  </div>
                  <p className="text-slate-600">
                    You must record payment collection before marking this order as delivered.
                  </p>
                  <Link
                    to="/delivery/cod"
                    className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
                  >
                    <Banknote className="w-4 h-4" />
                    <span>Collect COD Cash (₹{currentOrder.codAmount}) &amp; Enter OTP</span>
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleNextStage}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-98 transition-all"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>5. Mark Order as Successfully Delivered</span>
                </button>
              )}
            </div>
          )}

          {currentOrder.status === 'delivered' && (
            <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-slate-900 text-sm">Delivery Completed Successfully! 🎉</h3>
              <p className="text-xs text-slate-500">Trip earnings of ₹{currentOrder.estimatedPayout} added to your shift wallet.</p>
              <Link
                to="/delivery/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl mt-1"
              >
                <span>Return to Duty Tasks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
