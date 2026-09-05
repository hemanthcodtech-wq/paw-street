import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  Bike, 
  Award, 
  Sparkles, 
  ArrowUpRight, 
  CreditCard, 
  Building2, 
  ChevronRight,
  Clock
} from 'lucide-react';
import { useDelivery } from '../../context/DeliveryContext';

export default function DeliveryEarningsPage() {
  const { rider, assignments } = useDelivery();
  const [activeTimeframe, setActiveTimeframe] = useState('today'); // 'today', 'week', 'month'

  const completedTrips = assignments.filter(a => a.status === 'delivered');

  const earningsData = {
    today: {
      total: rider.todayEarnings,
      tripsCount: rider.todayTrips,
      basePay: rider.todayEarnings * 0.7,
      distanceSurge: rider.todayEarnings * 0.2,
      tips: rider.todayEarnings * 0.1,
      targetIncentive: 150
    },
    week: {
      total: 4850,
      tripsCount: 42,
      basePay: 3400,
      distanceSurge: 950,
      tips: 500,
      targetIncentive: 600
    },
    month: {
      total: 21400,
      tripsCount: 188,
      basePay: 15200,
      distanceSurge: 4200,
      tips: 2000,
      targetIncentive: 2500
    }
  };

  const currentStats = earningsData[activeTimeframe];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-900 border border-emerald-300/80 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Shift Payouts & Incentives
            </span>
          </div>
          <h1 className="font-heading font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
            Rider Earnings & Trip Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track daily delivery fares, fuel allowances, customer tips, and weekly bank settlements.
          </p>
        </div>

        {/* Timeframe Switcher */}
        <div className="bg-white border border-slate-200/90 p-1 rounded-2xl flex items-center gap-1 shrink-0 shadow-xs">
          {['today', 'week', 'month'].map(tf => (
            <button
              key={tf}
              onClick={() => setActiveTimeframe(tf)}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs capitalize transition-all ${
                activeTimeframe === tf
                  ? 'bg-[#FFB703] text-slate-950 font-black shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tf === 'today' ? "Today's Shift" : tf === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Hero Earnings Highlight */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              Total Net Earnings ({activeTimeframe === 'today' ? "Today" : activeTimeframe === 'week' ? "This Week" : "This Month"})
            </span>
            <div className="flex items-baseline gap-3">
              <span className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
                ₹{Math.round(currentStats.total).toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" /> +18.4% vs last {activeTimeframe}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Completed <strong>{currentStats.tripsCount} trips</strong> across active delivery shifts.
            </p>
          </div>

          {/* Quick Bank Transfer Badge */}
          <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 space-y-2 text-xs shrink-0 max-w-xs w-full">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold text-[10px] uppercase">Direct Bank Payout</span>
              <span className="text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Auto-Weekly
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="min-w-0">
                <p className="font-bold text-white text-xs truncate">HDFC Bank •• 8912</p>
                <span className="text-[10px] text-slate-400">Next payout: Monday 09:00 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 block">Base Trip Fares</span>
          <p className="text-xl sm:text-2xl font-black text-slate-900">
            ₹{Math.round(currentStats.basePay).toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-400 block font-normal">Fixed ₹45-₹65/trip</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 block">Distance & Peak Surge</span>
          <p className="text-xl sm:text-2xl font-black text-amber-600">
            ₹{Math.round(currentStats.distanceSurge).toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-amber-700 block font-semibold">+₹12/km beyond 2km</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 block">Customer Tips</span>
          <p className="text-xl sm:text-2xl font-black text-emerald-600">
            ₹{Math.round(currentStats.tips).toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-emerald-700 block font-semibold">100% kept by rider</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 block">Target Bonus Incentive</span>
          <p className="text-xl sm:text-2xl font-black text-slate-900">
            ₹{Math.round(currentStats.targetIncentive).toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-400 block font-normal">8+ trips milestone bonus</span>
        </div>

      </div>

      {/* Target Incentive Progress Tracker */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-heading font-black text-base text-slate-900">
              Daily Shift Target Milestone: Complete 10 Orders
            </h3>
          </div>
          <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-xl">
            {rider.todayTrips}/10 Trips Done
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-amber-400 to-[#FFB703] h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (rider.todayTrips / 10) * 100)}%` }}
          />
        </div>
        <p className="text-xs text-slate-500">
          Complete 2 more deliveries before 11:00 PM to unlock <strong>₹250 Extra Peak Bonus</strong>!
        </p>
      </div>

    </div>
  );
}
