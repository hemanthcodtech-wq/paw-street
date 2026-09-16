import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Users, 
  UserCheck, 
  ArrowRight, 
  AlertCircle, 
  X, 
  Search, 
  Filter, 
  Zap, 
  ChevronRight,
  Receipt,
  Bike
} from 'lucide-react';
import { useVendor } from '../../context/VendorContext';

export default function VendorOrdersPage() {
  const { orders, deliveryBoys, assignDeliveryBoy, updateOrderStatus } = useVendor();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Assignment Modal
  const [selectedOrderForAssignment, setSelectedOrderForAssignment] = useState(null);
  const [selectedDeliveryBoyId, setSelectedDeliveryBoyId] = useState('');

  useEffect(() => {
    const orderIdParam = searchParams.get('orderId');
    if (orderIdParam) {
      const matched = orders.find(o => o.id === orderIdParam);
      if (matched) {
        setSelectedOrderForAssignment(matched);
      }
    }
  }, [searchParams, orders]);

  const handleOpenAssign = (order) => {
    setSelectedOrderForAssignment(order);
    setSelectedDeliveryBoyId(order.assignedDeliveryBoyId || '');
  };

  const handleConfirmAssignment = (e) => {
    e.preventDefault();
    if (selectedOrderForAssignment && selectedDeliveryBoyId) {
      assignDeliveryBoy(selectedOrderForAssignment.id, selectedDeliveryBoyId);
      // Automatically advance status to out_for_delivery if it was ready
      if (selectedOrderForAssignment.orderStatus === 'ready' || selectedOrderForAssignment.orderStatus === 'new') {
        updateOrderStatus(selectedOrderForAssignment.id, 'out_for_delivery');
      }
      setSelectedOrderForAssignment(null);
    }
  };

  const [orderTypeFilter, setOrderTypeFilter] = useState('all'); // 'all' | 'product_delivery' | 'home_service' | 'clinic_visit'

  const filteredOrders = orders.filter(o => {
    const matchesTab = activeTab === 'all' || o.orderStatus === activeTab;
    const matchesType = orderTypeFilter === 'all' || (o.orderType || 'product_delivery') === orderTypeFilter;
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.customerPhone.includes(searchQuery) ||
                          (o.serviceName && o.serviceName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesType && matchesSearch;
  });

  const availableBoys = deliveryBoys.filter(b => b.status === 'available');

  const statusConfig = {
    new: { label: 'New Request', color: 'bg-rose-100 text-rose-800 border-rose-200' },
    preparing: { label: 'Preparing / In-Slot', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    ready: { label: 'Ready / Staff Dispatched', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    out_for_delivery: { label: 'En Route / Ongoing', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    delivered: { label: 'Completed', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    cancelled: { label: 'Cancelled', color: 'bg-slate-100 text-slate-700 border-slate-200' }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
            Store Orders, Home Services & Clinic Appointments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage instant delivery packages, at-home grooming/vet visits, and in-clinic pet appointments.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 self-start sm:self-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{availableBoys.length} Staff / Riders Available</span>
        </div>
      </div>

      {/* Order Type Category Switcher */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { id: 'all', label: 'All Orders & Bookings', icon: ShoppingBag, count: orders.length },
          { id: 'product_delivery', label: '📦 Product Delivery', count: orders.filter(o => (o.orderType || 'product_delivery') === 'product_delivery').length },
          { id: 'home_service', label: '🏠 At-Home Services', count: orders.filter(o => o.orderType === 'home_service').length },
          { id: 'clinic_visit', label: '🏥 In-Clinic Visits', count: orders.filter(o => o.orderType === 'clinic_visit').length }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setOrderTypeFilter(cat.id)}
            className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
              orderTypeFilter === cat.id
                ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300/60 shadow-xs'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="font-bold text-xs text-slate-900 truncate">{cat.label}</span>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${orderTypeFilter === cat.id ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'}`}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Status Filter Tabs & Search */}
      <div className="space-y-3">
        <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Status' },
            { id: 'new', label: 'New' },
            { id: 'preparing', label: 'Preparing / In-Clinic' },
            { id: 'ready', label: 'Ready / Staff Assigned' },
            { id: 'out_for_delivery', label: 'En-route' },
            { id: 'delivered', label: 'Completed' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, customer name, service type or phone number..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map(order => {
          const assignedBoy = deliveryBoys.find(b => b.id === order.assignedDeliveryBoyId);
          const st = statusConfig[order.orderStatus] || statusConfig.new;
          const isHomeService = order.orderType === 'home_service';
          const isClinicVisit = order.orderType === 'clinic_visit';

          return (
            <div 
              key={order.id}
              className={`bg-white rounded-3xl border shadow-xs hover:border-amber-300 transition-all p-4 sm:p-6 space-y-4 ${
                isHomeService ? 'border-amber-200 bg-amber-50/10' : isClinicVisit ? 'border-blue-200 bg-blue-50/10' : 'border-slate-200/90'
              }`}
            >
              
              {/* Top Row: ID, Service Badge, Status, Amount */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-black text-slate-900 text-sm sm:text-base">
                    {order.id}
                  </span>

                  {/* Order / Booking Type Badge */}
                  {isHomeService && (
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <span>🏠 At-Home Service</span>
                    </span>
                  )}
                  {isClinicVisit && (
                    <span className="bg-blue-100 text-blue-900 border border-blue-300 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <span>🏥 In-Clinic Visit</span>
                    </span>
                  )}
                  {!isHomeService && !isClinicVisit && (
                    <span className="bg-slate-100 text-slate-800 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      📦 Product Order
                    </span>
                  )}

                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${st.color}`}>
                    {st.label}
                  </span>
                  
                  {order.scheduledSlot && (
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Slot: {order.scheduledSlot}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-black text-slate-900 text-base sm:text-lg">
                      ₹{order.totalAmount}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {order.paymentMethod} • <strong className="text-emerald-600">{order.paymentStatus}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle Row: Customer Info & Ordered Items / Pet Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                {/* Customer Details */}
                <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-xs sm:text-sm block">{order.customerName}</span>
                      {order.petName && (
                        <span className="text-[11px] font-bold text-amber-700">Pet: {order.petName}</span>
                      )}
                    </div>
                    <a 
                      href={`tel:${order.customerPhone}`} 
                      className="text-[11px] font-bold text-emerald-600 hover:underline flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{order.customerPhone}</span>
                    </a>
                  </div>
                  
                  <p className="text-slate-600 text-[11px] flex items-start gap-1 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{order.customerAddress}</span>
                  </p>
                  {order.notes && (
                    <p className="text-[10px] text-amber-800 bg-amber-50 px-2 py-1 rounded-md font-medium mt-1">
                      Instructions: {order.notes}
                    </p>
                  )}
                </div>

                {/* Ordered Items or Booked Service */}
                <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    {isHomeService ? 'Booked Home Grooming / Healthcare' : isClinicVisit ? 'In-Clinic Appointment Details' : `Ordered Products (${order.items.length})`}
                  </span>
                  <div className="space-y-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-800">
                          <strong className="text-slate-900 font-bold">{item.quantity}x</strong> {item.name}
                        </span>
                        <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Bottom Row: Staff / Rider Assignment & Order State Transition Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
                
                {/* Assigned Staff / Rider */}
                <div className="flex items-center gap-2">
                  {assignedBoy ? (
                    <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                      <img src={assignedBoy.avatar} alt={assignedBoy.name} className="w-6 h-6 rounded-full object-cover" />
                      <div className="text-xs">
                        <span className="font-bold text-slate-900">{assignedBoy.name}</span>
                        <span className="text-[10px] text-slate-500 ml-1">({assignedBoy.roleTitle || assignedBoy.vehicleType})</span>
                      </div>
                      <button
                        onClick={() => handleOpenAssign(order)}
                        className="text-[10px] font-bold text-amber-700 hover:underline ml-2 bg-amber-100 px-2 py-0.5 rounded-md"
                      >
                        Re-assign
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenAssign(order)}
                      className="px-3.5 py-1.5 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      <Bike className="w-3.5 h-3.5" />
                      <span>{isHomeService ? 'Assign Home Groomer / Vet' : isClinicVisit ? 'Assign Doctor / Station' : 'Assign Delivery Boy'}</span>
                    </button>
                  )}
                </div>

                {/* Status Advancement Actions */}
                <div className="flex items-center gap-2">
                  {order.orderStatus === 'new' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
                    >
                      {isClinicVisit ? 'Confirm Appointment Slot' : isHomeService ? 'Accept Home Booking' : 'Accept & Start Packing'}
                    </button>
                  )}

                  {order.orderStatus === 'preparing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors"
                    >
                      {isClinicVisit ? 'Mark Patient Checked-In' : isHomeService ? 'Mark Groomer Kit Ready' : 'Mark Ready for Dispatch'}
                    </button>
                  )}

                  {order.orderStatus === 'ready' && assignedBoy && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
                    >
                      <span>{isHomeService ? `Dispatch ${assignedBoy.name.split(' ')[0]} to Home` : `Handover to ${assignedBoy.name.split(' ')[0]}`}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}

                  {order.orderStatus === 'out_for_delivery' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isHomeService || isClinicVisit ? 'Complete Service Session' : 'Confirm Delivered'}</span>
                    </button>
                  )}
                </div>

              </div>

            </div>
          );
        })}

        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
            <ShoppingBag className="w-10 h-10 mx-auto mb-2.5 text-slate-300 stroke-[1.5]" />
            <p className="font-bold text-slate-700 text-sm">No store orders or bookings found</p>
            <p className="text-xs text-slate-400 mt-1">When pet parents place orders or schedule appointments with your store, they will stream in here in real time.</p>
          </div>
        )}
      </div>

      {/* Assign Delivery Boy / Staff Modal */}
      {selectedOrderForAssignment && createPortal(
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[92vh] sm:max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom duration-300">
            
            {/* Mobile Grab Bar */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-2 sm:hidden shrink-0" />

            {/* Modal Header */}
            <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-xs">
                  {selectedOrderForAssignment.orderType === 'home_service' ? '🏡' : selectedOrderForAssignment.orderType === 'clinic_visit' ? '🏥' : <Bike className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading font-black text-sm sm:text-base text-slate-900 truncate">
                    {selectedOrderForAssignment.orderType === 'home_service' ? 'Assign Home Groomer / Vet' : selectedOrderForAssignment.orderType === 'clinic_visit' ? 'Assign In-Clinic Doctor / Room' : 'Assign Delivery Partner'}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono">
                    ID: {selectedOrderForAssignment.id} • {selectedOrderForAssignment.petName || `₹${selectedOrderForAssignment.totalAmount}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrderForAssignment(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleConfirmAssignment} className="flex flex-col min-h-0 flex-1">
              <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain flex-1 space-y-4 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
                  <p className="font-bold text-slate-900">
                    {selectedOrderForAssignment.orderType === 'home_service' ? 'Service Destination Residence:' : 'Delivery / Destination:'}
                  </p>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{selectedOrderForAssignment.customerAddress}</p>
                  {selectedOrderForAssignment.scheduledSlot && (
                    <p className="text-[10px] font-bold text-amber-700 mt-1">Scheduled Slot: {selectedOrderForAssignment.scheduledSlot}</p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-2">
                    Select Staff Member based on Role & Availability *
                  </label>

                  <div className="space-y-2 max-h-56 sm:max-h-60 overflow-y-auto pr-1">
                    {deliveryBoys.map(boy => {
                      const isAvail = boy.status === 'available';
                      const isSelected = selectedDeliveryBoyId === boy.id;

                      return (
                        <div
                          key={boy.id}
                          onClick={() => setSelectedDeliveryBoyId(boy.id)}
                          className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                            isSelected
                              ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-300 shadow-2xs'
                              : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img src={boy.avatar} alt={boy.name} className="w-9 h-9 rounded-full object-cover border border-amber-300" />
                            <div>
                              <p className="font-bold text-slate-900 text-xs">{boy.name}</p>
                              <p className="text-[10px] text-amber-700 font-bold">{boy.roleTitle || boy.vehicleType}</p>
                              <p className="text-[9px] text-slate-400">{boy.vehicleNumber}</p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isAvail ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isAvail ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                              {isAvail ? 'Available' : boy.status === 'busy' ? 'On Duty' : 'Offline'}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
                              {boy.totalDeliveries} done • ★ {boy.rating}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sticky Action Footer */}
              <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForAssignment(null)}
                  className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200 transition-colors text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedDeliveryBoyId}
                  className="flex-1 sm:flex-initial px-5 py-2.5 bg-[#FFB703] hover:bg-[#E5A015] disabled:opacity-50 text-slate-950 font-black rounded-xl shadow-xs transition-all active:scale-95 text-xs text-center"
                >
                  {selectedOrderForAssignment.orderType === 'home_service' ? 'Confirm & Dispatch Staff' : 'Confirm Assignment'}
                </button>
              </div>

            </form>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
