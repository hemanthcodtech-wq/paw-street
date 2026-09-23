import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bike, 
  MapPin, 
  Navigation, 
  Banknote, 
  TrendingUp, 
  Clock, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ChevronRight, 
  Store, 
  User, 
  ShieldCheck, 
  Sparkles,
  Package,
  Layers,
  Power,
  RefreshCw,
  Inbox
} from 'lucide-react';
import { useDelivery } from '../../context/DeliveryContext';

export default function DeliveryDashboardPage() {
  const navigate = useNavigate();
  const { 
    rider, 
    toggleOnlineStatus, 
    assignments, 
    activeOrder, 
    acceptOrder, 
    declineOrder,
    ordersLoaded,
    refreshOrders
  } = useDelivery();

  const [alertDismissed, setAlertDismissed] = useState(false);

  // Filter new unaccepted assignments
  const pendingAssignments = assignments.filter(a => a.status === 'assigned');
  const incomingOrder = pendingAssignments[0] || null;

  return (
    <div className="space-y-5">
      
      {/* Rider Duty Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 ${
                rider.onlineStatus 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                <span className={`w-2 h-2 rounded-full ${rider.onlineStatus ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                <span>{rider.onlineStatus ? 'DUTY ACTIVE • RECEIVING ORDERS' : 'SHIFT OFFLINE • NO ORDERS'}</span>
              </span>
              {rider.vendorStoreName && (
                <span className="text-amber-300 text-xs font-bold flex items-center gap-1">
                  <Store className="w-3.5 h-3.5" />
                  {rider.vendorStoreName}
                </span>
              )}
              {!rider.vendorStoreName && (
                <span className="text-slate-400 text-xs hidden sm:inline">
                  • {rider.currentZone}
                </span>
              )}
            </div>
            <h1 className="font-heading font-black text-xl sm:text-2xl lg:text-3xl text-white tracking-tight">
              Welcome, Captain {(rider.name || 'Rider').split(' ')[0]} 🛵
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Stay safe on the road. Always verify pet food packaging seals and collect COD amounts before delivery.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleOnlineStatus}
              className={`px-4 py-2.5 rounded-2xl font-black text-xs transition-all flex items-center gap-2 active:scale-95 shadow-md ${
                rider.onlineStatus
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>{rider.onlineStatus ? 'End Shift (Go Offline)' : 'Start Shift (Go Online)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Incoming Order Alert Banner (Simulated Swiggy-style sound/pulse prompt) */}
      {rider.onlineStatus && incomingOrder && !alertDismissed && (
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-5 sm:p-6 text-slate-950 shadow-xl border-2 border-amber-300 animate-in zoom-in-95 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-slate-950 text-[#FFB703] flex items-center justify-center font-black shrink-0 shadow-md animate-bounce">
                <Bike className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-slate-950 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    ⚡ New Trip Request
                  </span>
                  <span className="text-xs font-bold text-slate-950 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Auto-assign in 45s
                  </span>
                </div>
                <h3 className="font-heading font-black text-base sm:text-lg text-slate-950">
                  Pickup: {incomingOrder.store.name}
                </h3>
                <p className="text-xs font-bold text-slate-900">
                  Drop: {incomingOrder.customer.name} ({incomingOrder.customer.address})
                </p>
                <div className="flex items-center gap-2 text-xs font-bold pt-1">
                  <span className="bg-white/80 px-2 py-0.5 rounded-lg">📍 {incomingOrder.distanceKm} km</span>
                  <span className="bg-white/80 px-2 py-0.5 rounded-lg">⏱️ ~{incomingOrder.durationMins} mins</span>
                  <span className="bg-slate-950 text-[#FFB703] px-2.5 py-0.5 rounded-lg font-black">
                    Payout: ₹{incomingOrder.estimatedPayout}
                  </span>
                  {incomingOrder.paymentType === 'COD' && (
                    <span className="bg-rose-900 text-white px-2 py-0.5 rounded-lg font-bold">
                      COD ₹{incomingOrder.codAmount}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => declineOrder(incomingOrder.id)}
                className="px-4 py-2.5 bg-white/40 hover:bg-white/60 text-slate-950 font-black text-xs rounded-2xl transition-colors"
              >
                Decline
              </button>
              <button
                onClick={() => {
                  acceptOrder(incomingOrder.id);
                  navigate('/delivery/navigation');
                }}
                className="px-5 py-2.5 bg-slate-950 hover:bg-slate-900 text-white font-black text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2 active:scale-95"
              >
                <span>Accept Order (₹{incomingOrder.estimatedPayout})</span>
                <ArrowRight className="w-4 h-4 text-[#FFB703]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rider Key Shift Performance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Today's Completed Trips */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Today's Completed</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">
            {rider.todayTrips} Deliveries
          </p>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <span>+{rider.todayTrips} trips</span>
            <span className="text-slate-400 font-normal">in this shift</span>
          </div>
        </div>

        {/* Cash on Delivery in Hand */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Cash Held in Hand</span>
            <span className="p-1.5 bg-rose-50 text-rose-600 rounded-xl">
              <Banknote className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">
            ₹{rider.cashInHand.toLocaleString('en-IN')}
          </p>
          <Link to="/delivery/cod" className="text-[11px] font-bold text-rose-600 hover:underline flex items-center gap-0.5">
            <span>Reconcile & Deposit</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Overall Rating & Deliveries */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Rating & Trust</span>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-xl">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">
            ⭐ {rider.rating}
          </p>
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
            <span>{rider.totalDeliveries}</span>
            <span className="text-slate-400 font-normal">all-time deliveries</span>
          </div>
        </div>

      </div>

      {/* Active Ongoing Order Card */}
      {activeOrder && (
        <div className="bg-white rounded-3xl border-2 border-emerald-400 p-5 sm:p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                🟢 Live In-Progress Delivery
              </span>
              <span className="text-xs font-mono text-slate-500 font-bold">
                #{activeOrder.orderId}
              </span>
            </div>

            <Link
              to="/delivery/navigation"
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Open Swiggy-Style GPS Map</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Pickup Store Info */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/90 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Store className="w-3.5 h-3.5 text-amber-600" />
                  <span>1. Pickup Store</span>
                </span>
                <a 
                  href={`tel:${activeOrder.store.phone}`}
                  className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 font-bold text-slate-800 rounded-lg flex items-center gap-1 text-[11px]"
                >
                  <Phone className="w-3 h-3 text-amber-600" />
                  <span>Call Store</span>
                </a>
              </div>
              <p className="font-bold text-slate-900 text-sm">{activeOrder.store.name}</p>
              <p className="text-slate-500">{activeOrder.store.address} • {activeOrder.store.landmark}</p>
            </div>

            {/* Customer Drop Info */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/90 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>2. Customer Dropoff</span>
                </span>
                <a 
                  href={`tel:${activeOrder.customer.phone}`}
                  className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 font-bold text-slate-800 rounded-lg flex items-center gap-1 text-[11px]"
                >
                  <Phone className="w-3 h-3 text-emerald-600" />
                  <span>Call Customer</span>
                </a>
              </div>
              <p className="font-bold text-slate-900 text-sm">{activeOrder.customer.name}</p>
              <p className="text-slate-500">{activeOrder.customer.address}</p>
              {activeOrder.customer.deliveryInstructions && (
                <p className="text-[11px] text-amber-800 bg-amber-50/80 p-1.5 rounded-lg border border-amber-200 font-medium">
                  📝 "{activeOrder.customer.deliveryInstructions}"
                </p>
              )}
            </div>
          </div>

          {/* Quick Action Navigation Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="text-slate-500">Payment Mode:</span>
              {activeOrder.paymentType === 'COD' ? (
                <span className="bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded-md font-black">
                  💵 Collect COD ₹{activeOrder.codAmount}
                </span>
              ) : (
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-md font-black">
                  ✅ Prepaid Online
                </span>
              )}
            </div>

            <Link
              to="/delivery/navigation"
              className="w-full sm:w-auto px-5 py-2.5 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span>Continue Navigation & Updates</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Available Task Queue & Shift History */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-black text-base sm:text-lg text-slate-900">
              Shift Delivery Tasks
            </h2>
            <p className="text-xs text-slate-500">
              Assigned pet food, grooming supplies and prescription medicine orders in your zone.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshOrders}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              title="Refresh Orders"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">
              {assignments.length} Total Trips
            </span>
          </div>
        </div>

        {/* Empty State */}
        {assignments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
              <Inbox className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <p className="font-bold text-slate-700 text-sm">No orders assigned yet</p>
              <p className="text-xs text-slate-400 mt-1">
                {rider.vendorStoreName
                  ? `Waiting for ${rider.vendorStoreName} to assign orders to you`
                  : 'Stay online and the vendor will assign orders to you soon'}
              </p>
            </div>
            <button
              onClick={refreshOrders}
              className="flex items-center gap-2 text-xs font-bold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-xl transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Check for new orders</span>
            </button>
          </div>
        )}

        <div className="space-y-3">
          {assignments.map(item => {
            const isDelivered = item.status === 'delivered';
            const isAssigned = item.status === 'assigned';
            return (
              <div 
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                  isDelivered 
                    ? 'bg-slate-50/60 border-slate-200/70 text-slate-500'
                    : isAssigned
                    ? 'bg-amber-50/50 border-amber-200'
                    : 'bg-white border-slate-200 shadow-2xs hover:border-amber-300'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black shrink-0 ${
                    isDelivered 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {isDelivered ? <CheckCircle2 className="w-5 h-5" /> : <Bike className="w-5 h-5" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm truncate">
                        {item.store.name} ➔ {item.customer.name}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        isDelivered 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        {item.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-slate-500 mt-0.5 truncate">
                      📍 {item.customer.address} • Payout: <strong className="text-emerald-700">₹{item.estimatedPayout}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {isAssigned && (
                    <button
                      onClick={() => {
                        acceptOrder(item.id);
                        navigate('/delivery/navigation');
                      }}
                      className="px-3.5 py-1.5 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-black rounded-xl shadow-xs"
                    >
                      Accept (₹{item.estimatedPayout})
                    </button>
                  )}
                  {!isAssigned && !isDelivered && (
                    <Link
                      to="/delivery/navigation"
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center gap-1"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Navigate</span>
                    </Link>
                  )}
                  {isDelivered && (
                    <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
