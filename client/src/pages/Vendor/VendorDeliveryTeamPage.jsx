import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Users, 
  Plus, 
  Phone, 
  Bike, 
  ShieldCheck, 
  Trash2, 
  X, 
  CheckCircle2, 
  Star, 
  Clock, 
  Search,
  Power
} from 'lucide-react';
import { useVendor } from '../../context/VendorContext';

export default function VendorDeliveryTeamPage() {
  const { deliveryBoys, addDeliveryBoy, updateDeliveryBoyStatus, deleteDeliveryBoy } = useVendor();

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    role: 'delivery_rider',
    roleTitle: 'Quick Delivery Partner',
    vehicleType: 'Electric Bike',
    vehicleNumber: '',
    drivingLicence: '',
    bankDetails: {
      accountHolderName: '',
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      upiId: ''
    }
  });

  const isServiceRole = formData.role === 'home_groomer' || formData.role === 'mobile_vet';

  const handleCreateDeliveryBoy = (e) => {
    e.preventDefault();
    const roleTitles = {
      delivery_rider: 'Quick Delivery Partner',
      home_groomer: 'Certified Home Pet Groomer',
      mobile_vet: 'Mobile Doctor / Vet Assistant'
    };
    addDeliveryBoy({
      ...formData,
      roleTitle: roleTitles[formData.role] || 'Delivery Partner'
    });
    setFormData({
      name: '',
      phone: '',
      email: '',
      password: '',
      role: 'delivery_rider',
      roleTitle: 'Quick Delivery Partner',
      vehicleType: 'Electric Bike',
      vehicleNumber: '',
      drivingLicence: '',
      bankDetails: {
        accountHolderName: '',
        accountNumber: '',
        ifscCode: '',
        bankName: '',
        upiId: ''
      }
    });
    setShowAddModal(false);
  };

  const filteredBoys = deliveryBoys.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.phone.includes(searchQuery) ||
    b.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-900 border border-amber-300/80 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Fleet & Logistics
            </span>
          </div>
          <h1 className="font-heading font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
            Delivery Team Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Create and manage delivery riders, home groomers, and field personnel operating under your store.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95 shrink-0 self-start sm:self-center"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Delivery Partner</span>
        </button>
      </div>

      {/* Fleet Summary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold">Total Delivery Team</span>
            <p className="text-xl font-black text-slate-900">{deliveryBoys.length} Partners</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold">Available for Quick Dispatch</span>
            <p className="text-xl font-black text-emerald-600">
              {deliveryBoys.filter(b => b.status === 'available').length} Active
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Bike className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold">Total Deliveries Completed</span>
            <p className="text-xl font-black text-slate-900">
              {deliveryBoys.reduce((sum, b) => sum + (b.totalDeliveries || 0), 0)} Orders
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search delivery partners by name, phone or vehicle plate number..."
          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
        />
      </div>

      {/* Delivery Partner Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBoys.map((boy) => {
          const statusStyles = {
            available: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', label: 'Available' },
            busy: { bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500', label: 'On Active Delivery' },
            offline: { bg: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400', label: 'Offline' }
          };
          const st = statusStyles[boy.status] || statusStyles.available;

          return (
            <div
              key={boy.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-amber-300 transition-all p-4 sm:p-5 space-y-4"
            >
              
              {/* Profile Top Row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={boy.avatar}
                    alt={boy.name}
                    className="w-12 h-12 rounded-2xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                  />
                <div>
                  <h3 className="font-heading font-black text-slate-900 text-sm sm:text-base">
                    {boy.name}
                  </h3>
                  <a
                    href={`tel:${boy.phone}`}
                    className="text-xs text-slate-500 hover:text-emerald-600 flex items-center gap-1 mt-0.5"
                  >
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{boy.phone}</span>
                  </a>
                  {boy.email && (
                    <p className="text-[11px] text-indigo-600 font-bold flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Can Login • {boy.email}</span>
                    </p>
                  )}
                  {!boy.email && (
                    <p className="text-[11px] text-slate-400 mt-0.5">No login credentials</p>
                  )}
                </div>
                </div>

                {/* Status Badge */}
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${st.bg}`}>
                  <span className={`w-2 h-2 rounded-full ${st.dot}`} />
                  <span>{st.label}</span>
                </span>
              </div>

              {/* Vehicle & Licence Details */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">
                    {boy.role === 'home_groomer' ? 'SERVICE KIT' : boy.role === 'mobile_vet' ? 'TRANSPORT' : 'VEHICLE'}
                  </span>
                  <p className="font-bold text-slate-800 truncate">{boy.vehicleType}</p>
                  {boy.vehicleNumber && (
                    <p className="text-[11px] text-slate-500 font-mono">{boy.vehicleNumber}</p>
                  )}
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">
                    {boy.role === 'home_groomer' || boy.role === 'mobile_vet' ? 'CERT / ID' : 'DRIVING LICENCE'}
                  </span>
                  <p className="font-mono text-slate-800 text-[11px] truncate">{boy.drivingLicence || '—'}</p>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                </div>
              </div>

              {/* Bank / UPI Details */}
              {boy.bankDetails && (boy.bankDetails.accountNumber || boy.bankDetails.upiId) && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs space-y-1">
                  <span className="text-[10px] text-emerald-700 font-black block">🏦 PAYOUT ACCOUNT</span>
                  {boy.bankDetails.bankName && (
                    <p className="font-bold text-slate-800">{boy.bankDetails.bankName}
                      {boy.bankDetails.ifscCode && <span className="font-mono text-slate-500 ml-1.5 text-[10px]">{boy.bankDetails.ifscCode}</span>}
                    </p>
                  )}
                  {boy.bankDetails.accountNumber && (
                    <p className="font-mono text-slate-600 text-[11px]">
                      Acc: ••••{boy.bankDetails.accountNumber.slice(-4)}
                    </p>
                  )}
                  {boy.bankDetails.upiId && (
                    <p className="text-[11px] text-emerald-700 font-bold">UPI: {boy.bankDetails.upiId}</p>
                  )}
                </div>
              )}

              {/* Stats & Actions */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-3 text-slate-600">
                  <span className="font-bold">
                    {boy.role === 'home_groomer' ? '✂️' : boy.role === 'mobile_vet' ? '🩺' : '📦'} {boy.totalDeliveries} {boy.role === 'delivery_rider' || !boy.role ? 'Deliveries' : 'Assignments'}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1 font-bold text-slate-800">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{boy.rating}</span>
                  </span>
                </div>

                {/* Status Toggle & Remove */}
                <div className="flex items-center gap-2">
                  <select
                    value={boy.status}
                    onChange={(e) => updateDeliveryBoyStatus(boy.id, e.target.value)}
                    className="bg-slate-100 border border-slate-200 text-slate-800 rounded-lg px-2 py-1 text-[11px] font-bold focus:outline-none focus:border-amber-400"
                  >
                    <option value="available">Available</option>
                    <option value="busy">{boy.role === 'delivery_rider' || !boy.role ? 'On Delivery' : 'On Service'}</option>
                    <option value="offline">Offline</option>
                  </select>

                  <button
                    onClick={() => {
                      if (confirm(`Remove ${boy.name} from store delivery team?`)) {
                        deleteDeliveryBoy(boy.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove Partner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Delivery Partner Modal */}
      {showAddModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[92vh] sm:max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom duration-300">
            
            {/* Mobile Grab Bar */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-2 sm:hidden shrink-0" />

            {/* Header */}
            <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                  <Users className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading font-black text-sm sm:text-base text-slate-900 truncate">
                    Register Delivery Partner
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-400">
                    Add delivery rider, home groomer or field staff
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleCreateDeliveryBoy} className="flex flex-col min-h-0 flex-1">
              <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain flex-1 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Partner Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-400 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Staff Role & Service Specialization *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-400 font-bold text-slate-800"
                  >
                    <option value="delivery_rider">📦 Express Delivery Partner (Package courier)</option>
                    <option value="home_groomer">✂️ Certified Home Pet Groomer (Home visit grooming kit)</option>
                    <option value="mobile_vet">🩺 Mobile Doctor / Vet Assistant (Home health checks)</option>
                  </select>

                  {/* Role-specific info banner */}
                  {formData.role === 'delivery_rider' && (
                    <div className="mt-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-800 font-medium space-y-1">
                      <p className="font-bold flex items-center gap-1">📦 Delivery Partner Responsibilities:</p>
                      <p>• Picks up and delivers <strong>product orders</strong> from your store to customers</p>
                      <p>• Collects <strong>Cash on Delivery (COD)</strong> amounts from customers</p>
                      <p>• Deposits collected cash back to store / platform</p>
                    </div>
                  )}
                  {formData.role === 'home_groomer' && (
                    <div className="mt-2 bg-purple-50 border border-purple-200 rounded-xl p-3 text-[11px] text-purple-800 font-medium space-y-1">
                      <p className="font-bold flex items-center gap-1">✂️ Home Groomer Responsibilities:</p>
                      <p>• Visits customer's home to provide <strong>pet grooming services</strong></p>
                      <p>• Does <strong>NOT</strong> handle product deliveries or COD collection</p>
                      <p>• Assigned only to <strong>At-Home Service</strong> bookings</p>
                    </div>
                  )}
                  {formData.role === 'mobile_vet' && (
                    <div className="mt-2 bg-teal-50 border border-teal-200 rounded-xl p-3 text-[11px] text-teal-800 font-medium space-y-1">
                      <p className="font-bold flex items-center gap-1">🩺 Mobile Vet Responsibilities:</p>
                      <p>• Visits customer's home for <strong>pet health consultations</strong></p>
                      <p>• Does <strong>NOT</strong> handle product deliveries or COD collection</p>
                      <p>• Assigned only to <strong>At-Home Service</strong> bookings</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-400 font-medium"
                  />
                </div>

                {/* Vehicle fields — only for delivery riders */}
                {!isServiceRole && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Vehicle Type *
                      </label>
                      <select
                        value={formData.vehicleType}
                        onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs focus:outline-none focus:border-amber-400"
                      >
                        <option value="Electric Bike">Electric Bike</option>
                        <option value="Motorcycle">Motorcycle</option>
                        <option value="Scooter">Scooter</option>
                        <option value="Electric Scooter">Electric Scooter</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Vehicle Number Plate *
                      </label>
                      <input
                        type="text"
                        required={!isServiceRole}
                        value={formData.vehicleNumber}
                        onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
                        placeholder="TS 09 AB 1234"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs uppercase focus:outline-none focus:border-amber-400 font-mono font-bold"
                      />
                    </div>
                  </div>
                )}

                {/* Service staff transport — groomer/vet */}
                {isServiceRole && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Transport Mode
                    </label>
                    <select
                      value={formData.vehicleType}
                      onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs focus:outline-none focus:border-purple-400"
                    >
                      <option value="Service Scooter with Grooming Kit">Service Scooter with Grooming Kit</option>
                      <option value="Clinic Mobile Van">Clinic Mobile Van</option>
                      <option value="Personal Vehicle">Personal Vehicle</option>
                      <option value="Two-Wheeler">Two-Wheeler</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isServiceRole ? 'ID / Registration Number' : 'Driving Licence Number *'}
                  </label>
                  <input
                    type="text"
                    required={!isServiceRole}
                    value={formData.drivingLicence}
                    onChange={(e) => setFormData({ ...formData, drivingLicence: e.target.value.toUpperCase() })}
                    placeholder={isServiceRole ? 'e.g. Professional Certificate No.' : 'DL-0420230099881'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs uppercase focus:outline-none focus:border-amber-400 font-mono font-bold"
                  />
                </div>

                {/* ── BANK DETAILS SECTION ── */}
                <div className="border-t border-slate-200 pt-4 space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">🏦</span>
                    <span className="font-black text-slate-800 text-xs">Bank / UPI Details (for Payout)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 -mt-1">
                    Used to reconcile COD collections and process salary/payout for this staff member.
                  </p>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Account Holder Name</label>
                    <input
                      type="text"
                      value={formData.bankDetails.accountHolderName}
                      onChange={(e) => setFormData({ ...formData, bankDetails: { ...formData.bankDetails, accountHolderName: e.target.value } })}
                      placeholder="Full name as on bank account"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-400 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Bank Name</label>
                      <input
                        type="text"
                        value={formData.bankDetails.bankName}
                        onChange={(e) => setFormData({ ...formData, bankDetails: { ...formData.bankDetails, bankName: e.target.value } })}
                        placeholder="e.g. SBI, HDFC"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-400 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">IFSC Code</label>
                      <input
                        type="text"
                        value={formData.bankDetails.ifscCode}
                        onChange={(e) => setFormData({ ...formData, bankDetails: { ...formData.bankDetails, ifscCode: e.target.value.toUpperCase() } })}
                        placeholder="SBIN0001234"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs uppercase focus:outline-none focus:border-emerald-400 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Account Number</label>
                    <input
                      type="text"
                      value={formData.bankDetails.accountNumber}
                      onChange={(e) => setFormData({ ...formData, bankDetails: { ...formData.bankDetails, accountNumber: e.target.value } })}
                      placeholder="Enter bank account number"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-400 font-mono font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">UPI ID (Optional)</label>
                    <input
                      type="text"
                      value={formData.bankDetails.upiId}
                      onChange={(e) => setFormData({ ...formData, bankDetails: { ...formData.bankDetails, upiId: e.target.value } })}
                      placeholder="e.g. ramesh@upi or 9876543210@paytm"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-400 font-medium"
                    />
                  </div>
                </div>

                {/* Login Credentials Section */}
                <div className="border-t border-slate-200 pt-4 space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span className="font-black text-slate-800 text-xs">Portal Login Credentials (Optional)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 -mt-1">
                    Set an email and password so this staff member can log in to the Rider Portal at <strong>/delivery/login</strong> and see their assigned orders.
                  </p>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isServiceRole ? 'Staff Email (for login)' : 'Rider Email (for login)'}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="staff@example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-indigo-400 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Login Password
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Min 6 characters"
                      minLength={formData.email ? 6 : 0}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-indigo-400 font-medium"
                    />
                    {formData.email && !formData.password && (
                      <p className="text-[11px] text-amber-600 font-bold mt-1">⚠️ Password is required when email is set</p>
                    )}
                    {formData.email && formData.password && formData.password.length >= 6 && (
                      <p className="text-[11px] text-emerald-600 font-bold mt-1">✅ Staff will be able to log into the portal</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200 transition-colors text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:flex-initial px-6 py-2.5 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-black rounded-xl shadow-xs transition-all active:scale-95 text-xs text-center"
                >
                  Create Account
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
