import React from 'react';
import { 
  DollarSign, 
  CreditCard, 
  Clock
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminRevenuePage() {
  const { 
    revenueMetrics, 
    payoutQueue,
    paymentHistory,
    processPayout
  } = useAdmin();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-900 border border-emerald-300/80 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Revenue & Commission Controls
            </span>
          </div>
          <h1 className="font-heading font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
            Revenue & Pricing Controls
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Configure category commission rates, delivery fee parameters, vendor registration fees and payout queues.
          </p>
        </div>
      </div>

      {/* Financial Health Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 p-5 rounded-3xl shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-950">Total Net Platform Profit</span>
            <DollarSign className="w-5 h-5 text-slate-950" />
          </div>
          <p className="text-2xl sm:text-3xl font-black">
            ₹{revenueMetrics.totalNetPlatformProfit.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-amber-950 font-semibold">
            Platform commissions & onboarding tech fees collected
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Disbursed to Vendors</span>
            <span className="p-1.5 bg-slate-100 text-slate-700 rounded-xl">
              <CreditCard className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">
            ₹{revenueMetrics.totalVendorPayoutsDisbursed.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-slate-400">
            Reconciled via automated bank settlement transfers
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Pending Settlement Queue</span>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600">
            ₹{revenueMetrics.pendingPayoutsQueue.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-slate-400">
            Scheduled for this week's settlement cycle
          </p>
        </div>
      </div>

      {/* Vendor Payout Reconciliation Queue */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-heading font-black text-base text-slate-900">
              Vendor Settlement & Payout Reconciliation Queue
            </h3>
            <p className="text-xs text-slate-500">
              Bi-weekly net earnings disbursed directly to vendor verified bank accounts.
            </p>
          </div>
          <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-xl shrink-0 self-start sm:self-center">
            {payoutQueue.filter(p => p.status === 'pending').length} Settlements Pending
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 text-[11px] font-bold">
                <th className="py-2.5 px-3">PAYOUT ID</th>
                <th className="py-2.5 px-3">STORE / VENDOR</th>
                <th className="py-2.5 px-3">BILLING PERIOD</th>
                <th className="py-2.5 px-3">ORDERS</th>
                <th className="py-2.5 px-3">NET AMOUNT</th>
                <th className="py-2.5 px-3">BANK ACCOUNT</th>
                <th className="py-2.5 px-3">STATUS</th>
                <th className="py-2.5 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payoutQueue.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{po.id}</td>
                  <td className="py-3 px-3 font-bold text-slate-800">{po.vendorName}</td>
                  <td className="py-3 px-3 text-slate-600">{po.period}</td>
                  <td className="py-3 px-3 font-semibold text-slate-700">{po.ordersCount} orders</td>
                  <td className="py-3 px-3 font-black text-emerald-600">₹{po.amount.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">{po.bankAccount}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      po.status === 'processed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      {po.status === 'processed' ? 'Settled' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {po.status === 'pending' ? (
                      <button
                        onClick={() => processPayout(po.id)}
                        className="px-3 py-1 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-black rounded-lg text-xs shadow-2xs transition-all active:scale-95"
                      >
                        pay
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[11px] font-semibold">✓ Complete</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Payment History */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-heading font-black text-base text-slate-900">
              Order Payment History & Vendor Earnings
            </h3>
            <p className="text-xs text-slate-500">
              Full paid-order ledger with customer payment, commission, vendor net amount, and payout status.
            </p>
          </div>
          <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-xl shrink-0 self-start sm:self-center">
            {paymentHistory?.length || 0} Paid Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 text-[11px] font-bold">
                <th className="py-2.5 px-3">ORDER</th>
                <th className="py-2.5 px-3">CUSTOMER</th>
                <th className="py-2.5 px-3">VENDOR</th>
                <th className="py-2.5 px-3">PAYMENT</th>
                <th className="py-2.5 px-3">GROSS</th>
                <th className="py-2.5 px-3">COMMISSION</th>
                <th className="py-2.5 px-3">VENDOR NET</th>
                <th className="py-2.5 px-3">PAYOUT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(paymentHistory || []).slice(0, 25).map((payment) => (
                <tr key={`${payment.orderId}-${payment.vendorId}`} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{payment.orderId}</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-800 block">{payment.customerName}</span>
                    <span className="text-[10px] text-slate-400">{payment.customerPhone}</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-800">{payment.vendorName}</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-700 block">{payment.paymentMethod}</span>
                    <span className="text-[10px] text-emerald-600 font-bold">{payment.paymentStatus}</span>
                  </td>
                  <td className="py-3 px-3 font-black text-slate-900">₹{Number(payment.grossAmount || 0).toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-rose-600 font-bold">
                    ₹{Number(payment.platformCommission || 0).toLocaleString('en-IN')}
                    <span className="text-[10px] text-slate-400 ml-1">({payment.commissionRate}%)</span>
                  </td>
                  <td className="py-3 px-3 font-black text-emerald-600">₹{Number(payment.vendorNetAmount || 0).toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      payment.settlementStatus === 'processed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      {payment.settlementStatus === 'processed' ? 'Paid to Vendor' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
              {(!paymentHistory || paymentHistory.length === 0) && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 font-bold">
                    No paid order records yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
