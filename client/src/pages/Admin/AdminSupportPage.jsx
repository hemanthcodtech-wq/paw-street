import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Headphones, 
  Users, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  UserCheck, 
  UserPlus, 
  MessageSquare, 
  ChevronRight, 
  Phone, 
  Mail, 
  X,
  Send,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminSupportPage() {
  const { 
    supportStaff, 
    supportTickets, 
    addSupportStaff, 
    assignTicketToStaff, 
    updateTicketStatus 
  } = useAdmin();

  const [activeTab, setActiveTab] = useState('tickets'); // 'tickets', 'staff'
  const [ticketStatusFilter, setTicketStatusFilter] = useState('all'); // 'all', 'open', 'in_progress', 'resolved'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals State
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [selectedTicketForAction, setSelectedTicketForAction] = useState(null);
  const [assignStaffId, setAssignStaffId] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Staff Form State
  const [staffForm, setStaffForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Tier 1 Support Specialist'
  });

  const handleCreateStaff = (e) => {
    e.preventDefault();
    addSupportStaff(staffForm);
    setShowAddStaffModal(false);
    setStaffForm({
      name: '',
      email: '',
      phone: '',
      role: 'Tier 1 Support Specialist'
    });
  };

  const handleAssignTicket = (e) => {
    e.preventDefault();
    if (!assignStaffId || !selectedTicketForAction) return;
    assignTicketToStaff(selectedTicketForAction.id, assignStaffId);
    setSelectedTicketForAction(null);
    setAssignStaffId('');
  };

  const handleResolveTicket = (ticketId) => {
    updateTicketStatus(ticketId, 'resolved', resolutionNotes || 'Issue verified and resolved with customer.');
    setSelectedTicketForAction(null);
    setResolutionNotes('');
  };

  const filteredTickets = supportTickets.filter(t => {
    const matchesSearch = 
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.assignedName && t.assignedName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = ticketStatusFilter === 'all' || t.status === ticketStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-rose-100 text-rose-900 border border-rose-300/80 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Support Operations
            </span>
          </div>
          <h1 className="font-heading font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
            Support Team & Resolution Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Create support agents, assign customer and vendor disputes, and track SLA resolutions.
          </p>
        </div>

        <button
          onClick={() => setShowAddStaffModal(true)}
          className="px-4 py-2.5 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95 shrink-0 self-start sm:self-center"
        >
          <UserPlus className="w-4 h-4 stroke-[3]" />
          <span>Add Support Staff</span>
        </button>
      </div>

      {/* Main Switcher & KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] text-slate-400 font-bold block">ACTIVE STAFF</span>
          <p className="text-xl font-black text-slate-900">{supportStaff.length} Agents</p>
          <span className="text-[10px] text-emerald-600 font-semibold">100% Online Roster</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] text-slate-400 font-bold block">OPEN TICKETS</span>
          <p className="text-xl font-black text-rose-600">
            {supportTickets.filter(t => t.status === 'open').length} Unassigned
          </p>
          <span className="text-[10px] text-rose-500 font-semibold">Requires assignment</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] text-slate-400 font-bold block">IN PROGRESS</span>
          <p className="text-xl font-black text-amber-600">
            {supportTickets.filter(t => t.status === 'in_progress').length} Active Tasks
          </p>
          <span className="text-[10px] text-amber-700 font-semibold">Under investigation</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] text-slate-400 font-bold block">RESOLVED TICKETS</span>
          <p className="text-xl font-black text-emerald-600">
            {supportTickets.filter(t => t.status === 'resolved').length} Resolved
          </p>
          <span className="text-[10px] text-emerald-700 font-semibold">Avg 8.4 mins SLA</span>
        </div>
      </div>

      {/* Navigation Tabs (Tickets vs Staff Directory) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'tickets'
              ? 'bg-[#FFB703] text-slate-950 font-black shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Headphones className="w-3.5 h-3.5" />
          <span>Ticket Assignment Queue ({supportTickets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'staff'
              ? 'bg-[#FFB703] text-slate-950 font-black shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Support Staff Directory ({supportStaff.length})</span>
        </button>
      </div>

      {/* VIEW 1: TICKETS QUEUE */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          
          {/* Filter Bar */}
          <div className="bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'All Tasks' },
                { id: 'open', label: 'Unassigned', alert: true },
                { id: 'in_progress', label: 'In Progress' },
                { id: 'resolved', label: 'Resolved' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setTicketStatusFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    ticketStatusFilter === f.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticket ID, user, issue..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-amber-400 font-medium"
              />
            </div>
          </div>

          {/* Tickets List */}
          <div className="space-y-3">
            {filteredTickets.map(ticket => {
              const isOpen = ticket.status === 'open';
              const isInProgress = ticket.status === 'in_progress';
              const isResolved = ticket.status === 'resolved';

              return (
                <div
                  key={ticket.id}
                  className={`bg-white rounded-2xl sm:rounded-3xl border p-4 sm:p-5 shadow-xs transition-all space-y-3 ${
                    isOpen
                      ? 'border-rose-200 bg-rose-50/15'
                      : isInProgress
                      ? 'border-amber-200 bg-amber-50/15'
                      : 'border-slate-200/90'
                  }`}
                >
                  {/* Top Row */}
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono font-black text-xs bg-slate-900 text-white px-2.5 py-1 rounded-xl">
                        {ticket.id}
                      </span>
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {ticket.category}
                      </span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        ticket.priority === 'urgent'
                          ? 'bg-rose-500 text-white animate-pulse'
                          : ticket.priority === 'high'
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {ticket.priority} Priority
                      </span>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      isOpen
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : isInProgress
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Body description */}
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {ticket.description}
                  </p>

                  {/* Assignee & Meta Info */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                    <div className="flex items-center gap-3 text-slate-500">
                      <span>Requester: <strong>{ticket.customerName}</strong> ({ticket.customerPhone})</span>
                      <span>•</span>
                      <span>Logged: {ticket.createdAt}</span>
                    </div>

                    {/* Assigned Staff Agent */}
                    <div className="flex items-center gap-2">
                      {ticket.assignedName ? (
                        <span className="bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-xl font-bold text-xs flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                          <span>Assigned: <strong>{ticket.assignedName}</strong></span>
                        </span>
                      ) : (
                        <span className="text-rose-600 font-bold text-xs">
                          ⚠️ Unassigned Staff Member
                        </span>
                      )}

                      <button
                        onClick={() => setSelectedTicketForAction(ticket)}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                      >
                        {isResolved ? 'View Resolution' : 'Manage Ticket'}
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* VIEW 2: STAFF DIRECTORY */}
      {activeTab === 'staff' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {supportStaff.map(staff => (
            <div
              key={staff.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4 hover:border-amber-300 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={staff.avatar}
                    alt={staff.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="font-heading font-black text-slate-900 text-sm">
                      {staff.name}
                    </h3>
                    <p className="text-[11px] text-amber-700 font-bold">{staff.role}</p>
                  </div>
                </div>

                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" title="Online" />
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Staff ID:</span>
                  <span className="font-mono font-bold text-slate-800">{staff.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Active Ticket Load:</span>
                  <strong className="text-amber-700">{staff.activeTickets} tickets</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Lifetime Resolved:</span>
                  <strong className="text-emerald-600">{staff.resolvedTickets} resolved</strong>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 space-y-1 pt-1 border-t border-slate-100">
                <p className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>{staff.email}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{staff.phone}</span>
                </p>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Add Staff Account Modal */}
      {showAddStaffModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[92vh] sm:max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom duration-300">
            
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-900 text-white">
              <h3 className="font-heading font-black text-sm sm:text-base text-white">
                Create Support Staff Account
              </h3>
              <button onClick={() => setShowAddStaffModal(false)} className="p-1 text-slate-400 hover:text-white rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="p-5 overflow-y-auto overscroll-contain flex-1 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Staff Member Full Name *</label>
                <input
                  type="text"
                  required
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                  placeholder="e.g. Kavita Sharma"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Operational Role & Designation *</label>
                <select
                  value={staffForm.role}
                  onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800"
                >
                  <option value="Tier 1 Support Specialist">🎧 Tier 1 Senior Support Specialist</option>
                  <option value="Vendor Compliance & Dispute Lead">⚖️ Vendor Compliance & Dispute Lead</option>
                  <option value="Veterinary Prescription Auditor">🩺 Veterinary Prescription Auditor</option>
                  <option value="Live Logistics Dispatch Controller">🛵 Live Logistics Dispatch Controller</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={staffForm.email}
                  onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                  placeholder="name@pawnear.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={staffForm.phone}
                  onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                  placeholder="+91 98000 11223"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-black rounded-xl shadow-xs text-xs"
                >
                  Create Account
                </button>
              </div>
            </form>

          </div>
        </div>,
        document.body
      )}

      {/* Ticket Action / Assignment Modal */}
      {selectedTicketForAction && createPortal(
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[92vh] sm:max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom duration-300">
            
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-900 text-white">
              <div>
                <h3 className="font-heading font-black text-sm text-white">
                  Ticket {selectedTicketForAction.id}
                </h3>
                <p className="text-[10px] text-slate-400">{selectedTicketForAction.category}</p>
              </div>
              <button onClick={() => setSelectedTicketForAction(null)} className="p-1 text-slate-400 hover:text-white rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto overscroll-contain flex-1 space-y-4 text-xs">
              
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 block">ISSUE SUMMARY</span>
                <p className="font-bold text-slate-900">{selectedTicketForAction.description}</p>
                <p className="text-[11px] text-slate-500">
                  User: {selectedTicketForAction.customerName} ({selectedTicketForAction.customerPhone})
                </p>
              </div>

              {/* Assign to Staff Member */}
              <form onSubmit={handleAssignTicket} className="space-y-2">
                <label className="block font-bold text-slate-700">
                  Assign / Re-Assign to Staff Member:
                </label>
                <div className="flex gap-2">
                  <select
                    value={assignStaffId}
                    onChange={(e) => setAssignStaffId(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800"
                  >
                    <option value="">-- Select Support Agent --</option>
                    {supportStaff.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.role} - {s.activeTickets} active)
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    disabled={!assignStaffId}
                    className="px-4 py-2 bg-[#FFB703] hover:bg-[#E5A015] disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs"
                  >
                    Assign
                  </button>
                </div>
              </form>

              {/* Resolution Notes */}
              {selectedTicketForAction.status !== 'resolved' && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="block font-bold text-slate-700">
                    Resolution Status & Settlement Notes:
                  </label>
                  <textarea
                    rows={2}
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="e.g. Contacted delivery partner and expedited order dispatch; customer compensation code issued..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleResolveTicket(selectedTicketForAction.id)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark Ticket as Resolved</span>
                  </button>
                </div>
              )}

              {selectedTicketForAction.resolution && (
                <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-emerald-900 text-xs">
                  <span className="font-bold block mb-1">Resolution Summary:</span>
                  <p>{selectedTicketForAction.resolution}</p>
                </div>
              )}

            </div>

            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setSelectedTicketForAction(null)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Close
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
