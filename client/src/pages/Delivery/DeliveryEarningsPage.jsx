import React, { useState, useEffect } from 'react';
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
  Clock,
  RefreshCw
} from 'lucide-react';
import { useDelivery } from '../../context/DeliveryContext';
import { api } from '../../services/api';

export default function DeliveryEarningsPage() {
  const { rider } = useDelivery();
  const [activeTimeframe, setActiveTimeframe] = useState('today'); // 'today', 'week', 'month'

  const [earningsData, setEarningsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const res = await api.getDeliveryEarnings();
      if (res?.success) {
        setEarningsData(res);
      }
    } catch (err) {
      console.error("Failed to fetch earnings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fallbackData = {
    today: { total: 0, tripsCount: 0, basePay: 0, distanceSurge: 0, tips: 0, targetIncentive: 0 },
    week: { total: 0, tripsCount: 0, basePay: 0, distanceSurge: 0, tips: 0, targetIncentive: 0 },
    month: { total: 0, tripsCount: 0, basePay: 0, distanceSurge: 0, tips: 0, targetIncentive: 0 }
  };

  const currentStats = earningsData?.[activeTimeframe] || fallbackData[activeTimeframe];
  const tripsCount = currentStats.tripsCount || 0;
  
  // Progress tracker logic
  const dailyTarget = 10;
  const progressPercent = Math.min(100, (tripsCount / dailyTarget) * 100);
  const remainingTrips = Math.max(0, dailyTarget - tripsCount);

  // Bank Info
  const bankAccountStr = earningsData?.bankAccount 
    ? `${earningsData.bankAccount.bankName} •• ${earningsData.bankAccount.accountNumber?.slice(-4) || '****'}`
    : 'Add bank details via Vendor';

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
        <div className="flex items-center gap-3">
          <button onClick={fetchEarnings} className="p-2 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded-xl transition-colors" title="Refresh Earnings">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-500' : ''}`} />
          </button>
          
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
      </div>

      {loading && !earningsData ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center text-slate-400">
           <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-amber-400" />
           <p className="font-bold text-sm">Calculating your earnings...</p>
        </div>
      ) : (
        <>
          {/* Main Hero Earnings Highlight */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Total Net Earnings ({activeTimeframe === 'today' ? "Today" : activeTimeframe === 'week' ? "This Week" : "This Month"})
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
                    ₹{Math.round(currentStats.total || 0).toLocaleString('en-IN')}
                  </span>
                  {currentStats.total > 0 && (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <ArrowUpRight className="w-4 h-4" /> Calculated via trips
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  Completed <strong>{tripsCount} trips</strong> across active delivery shifts.
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
                    <p className="font-bold text-white text-xs truncate">{bankAccountStr}</p>
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
                ₹{Math.round(currentStats.basePay || 0).toLocaleString('en-IN')}
              </p>
              <span className="text-[11px] text-slate-400 block font-normal">Fixed component</span>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-500 block">Distance & Peak Surge</span>
              <p className="text-xl sm:text-2xl font-black text-amber-600">
                ₹{Math.round(currentStats.distanceSurge || 0).toLocaleString('en-IN')}
              </p>
              <span className="text-[11px] text-amber-700 block font-semibold">Variable distance payout</span>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-500 block">Customer Tips</span>
              <p className="text-xl sm:text-2xl font-black text-emerald-600">
                ₹{Math.round(currentStats.tips || 0).toLocaleString('en-IN')}
              </p>
              <span className="text-[11px] text-emerald-700 block font-semibold">100% kept by rider</span>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-500 block">Target Bonus Incentive</span>
              <p className="text-xl sm:text-2xl font-black text-slate-900">
                ₹{Math.round(currentStats.targetIncentive || 0).toLocaleString('en-IN')}
              </p>
              <span className="text-[11px] text-slate-400 block font-normal">Trip milestone bonus</span>
            </div>

          </div>

          {/* Target Incentive Progress Tracker */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="font-heading font-black text-base text-slate-900">
                  Daily Shift Target Milestone: Complete {dailyTarget} Orders
                </h3>
              </div>
              <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-xl">
                {tripsCount}/{dailyTarget} Trips Done
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-400 to-[#FFB703] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {remainingTrips > 0 ? (
              <p className="text-xs text-slate-500">
                Complete {remainingTrips} more deliveries before 11:00 PM to unlock <strong>₹250 Extra Peak Bonus</strong>!
              </p>
            ) : (
              <p className="text-xs text-emerald-600 font-bold">
                🎉 Congratulations! You have unlocked your daily target bonus!
              </p>
            )}
          </div>
        </>
      )}

    </div>
  );
}
