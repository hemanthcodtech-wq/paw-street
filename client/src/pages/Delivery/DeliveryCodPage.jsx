import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Banknote, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Clock, 
  Key, 
  CreditCard, 
  QrCode, 
  FileText, 
  Plus,
  RefreshCw,
  Building2,
  DollarSign,
  Inbox
} from 'lucide-react';
import { useDelivery } from '../../context/DeliveryContext';
import { api } from '../../services/api';

export default function DeliveryCodPage() {
  const navigate = useNavigate();
  const { 
    rider, 
    assignments, 
    codTransactions: ctxTransactions,
    setCodTransactions,
    collectCodPayment, 
    updateDeliveryStatus, 
    reconcileCashDeposit 
  } = useDelivery();

  // Real COD data from backend
  const [realTransactions, setRealTransactions] = useState([]);
  const [realCashInHand, setRealCashInHand] = useState(null);
  const [loadingCod, setLoadingCod] = useState(true);

  const fetchCodData = async () => {
    try {
      const res = await api.getCodTransactions();
      if (res?.success) {
        setRealTransactions(res.transactions || []);
        if (typeof res.cashInHand === 'number') setRealCashInHand(res.cashInHand);
      }
    } catch (err) {
      console.warn('COD fetch notice:', err.message);
    } finally {
      setLoadingCod(false);
    }
  };

  useEffect(() => {
    fetchCodData();
  }, []);

  // Merge real transactions + any new ones added this session via collectCodPayment
  const allTransactions = realTransactions.length > 0 ? realTransactions : ctxTransactions;
  const cashInHand = realCashInHand !== null ? realCashInHand : rider.cashInHand;

  // Find active COD orders awaiting collection (from real assignments)
  const pendingCodOrders = assignments.filter(a => a.paymentType === 'COD' && !a.isCodCollected && a.status !== 'delivered');
  const selectedCodOrder = pendingCodOrders[0] || null;

  // Form State for Active COD Collection
  const [tenderedCash, setTenderedCash] = useState(selectedCodOrder ? selectedCodOrder.codAmount.toString() : '');
  const [enteredOtp, setEnteredOtp] = useState(selectedCodOrder ? selectedCodOrder.customerOtp : '');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [collectionSuccess, setCollectionSuccess] = useState(false);

  // Form State for Platform Cash Deposit Reconciliation
  const [depositAmount, setDepositAmount] = useState(cashInHand.toString());
  const [depositRefNumber, setDepositRefNumber] = useState('');
  const [depositMethod, setDepositMethod] = useState('UPI Platform Transfer');
  const [depositSuccessMsg, setDepositSuccessMsg] = useState(false);

  const orderAmount = selectedCodOrder ? selectedCodOrder.codAmount : 0;
  const changeToReturn = Math.max(0, (parseFloat(tenderedCash) || 0) - orderAmount);

  // Handle Collecting COD Payment
  const handleCollectPayment = async (e) => {
    e.preventDefault();
    if (!selectedCodOrder) return;

    const collected = await collectCodPayment(selectedCodOrder.id, orderAmount, paymentMode);
    if (!collected) return;
    updateDeliveryStatus(selectedCodOrder.id, 'delivered');
    setCollectionSuccess(true);
    setTimeout(() => {
      setCollectionSuccess(false);
      fetchCodData(); // refresh ledger
    }, 3000);
  };

  // Handle Deposit & Reconciliation
  const handleReconcileDeposit = async (e) => {
    e.preventDefault();
    const numericAmount = parseFloat(depositAmount) || 0;
    if (numericAmount <= 0) return;

    await reconcileCashDeposit(depositAmount, depositRefNumber || `REF-${Math.floor(100000 + Math.random() * 900000)}`, depositMethod);
    setDepositSuccessMsg(true);
    setDepositRefNumber('');
    setTimeout(() => {
      setDepositSuccessMsg(false);
      fetchCodData(); // refresh after reconciliation
    }, 3000);
  };

  // Held / Reconciled summary
  const totalHeld = allTransactions.filter(t => t.status === 'held_by_rider').reduce((s, t) => s + t.amount, 0);
  const totalReconciled = allTransactions.filter(t => t.status === 'reconciled_with_platform').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-900 border border-amber-300/80 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Cash on Delivery & Reconciliation
            </span>
          </div>
          <h1 className="font-heading font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
            COD Payment Collection & Wallet
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Mandatory cash collection before completing COD orders and real-time cash-in-hand reconciliation.
          </p>
        </div>

        {/* Live Cash Held Counter */}
        <div className="bg-slate-900 text-white p-3.5 px-5 rounded-2xl shadow-md flex items-center gap-3 border border-slate-800 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0">
            <Banknote className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
              Cash-in-Hand Balance
            </span>
            <p className="font-heading font-black text-xl text-white">
              ₹{cashInHand.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      {/* Summary chips */}
      {allTransactions.length > 0 && (
        <div className="flex flex-wrap gap-3">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2.5 text-xs space-y-0.5">
            <span className="text-[10px] text-amber-700 font-bold uppercase block">Pending Deposit</span>
            <span className="font-black text-amber-900 text-base">₹{totalHeld.toLocaleString('en-IN')}</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2.5 text-xs space-y-0.5">
            <span className="text-[10px] text-emerald-700 font-bold uppercase block">Reconciled Today</span>
            <span className="font-black text-emerald-900 text-base">₹{totalReconciled.toLocaleString('en-IN')}</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs space-y-0.5">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Total COD Orders</span>
            <span className="font-black text-slate-900 text-base">{allTransactions.length}</span>
          </div>
          <button onClick={fetchCodData} className="ml-auto flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 bg-white border border-slate-200 px-3 py-2 rounded-xl transition-colors">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      )}

      {/* Main Grid: Active COD Collection on Left + Platform Reconciliation on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Active COD Order Payment Collection */}
        <div className="lg:col-span-2 space-y-4">
          
          {selectedCodOrder ? (
            <div className="bg-white rounded-3xl border-2 border-amber-400 p-5 sm:p-6 shadow-md space-y-5">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                    💵 Active COD Collection
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-500">
                    Order #{selectedCodOrder.orderId}
                  </span>
                </div>
                <span className="text-sm font-black text-rose-700 bg-rose-50 px-3 py-1 rounded-xl">
                  Collect ₹{selectedCodOrder.codAmount}
                </span>
              </div>

              {/* Customer & Store Details */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Customer Details</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedCodOrder.customer.name}</p>
                  <p className="text-slate-500">{selectedCodOrder.customer.address}</p>
                  <p className="text-slate-600 font-semibold mt-1">📞 {selectedCodOrder.customer.phone}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Package Items</span>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedCodOrder.items.map(i => i.name).join(', ')}</p>
                  <p className="text-slate-500">From: {selectedCodOrder.store.name}</p>
                </div>
              </div>

              {/* Payment Collection Form */}
              <form onSubmit={handleCollectPayment} className="space-y-4 text-xs">
                
                {/* Payment Mode Selector */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Select Received Payment Method:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMode('Cash')}
                      className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${
                        paymentMode === 'Cash'
                          ? 'bg-[#FFB703] text-slate-950 border-amber-400 font-black shadow-2xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Banknote className="w-4 h-4" />
                      <span>Physical Cash</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMode('UPI Dynamic QR')}
                      className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${
                        paymentMode === 'UPI Dynamic QR'
                          ? 'bg-[#FFB703] text-slate-950 border-amber-400 font-black shadow-2xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Instant UPI QR</span>
                    </button>
                  </div>
                </div>

                {/* Cash Calculator (Tendered vs Change) */}
                {paymentMode === 'Cash' && (
                  <div className="grid grid-cols-2 gap-3 bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Cash Tendered by Customer (₹):
                      </label>
                      <input
                        type="number"
                        value={tenderedCash}
                        onChange={(e) => setTenderedCash(e.target.value)}
                        className="w-full bg-white border border-amber-300 rounded-xl p-2.5 font-black text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFB703]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Change to Return:
                      </label>
                      <div className="bg-white border border-amber-300 rounded-xl p-2.5 font-black text-emerald-700 text-sm flex items-center justify-between">
                        <span>₹{changeToReturn}</span>
                        <span className="text-[10px] text-slate-400 font-normal">Exact change</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Customer Delivery OTP */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-700">
                      Customer Delivery Confirmation OTP:
                    </label>
                    <span className="text-[10px] font-bold text-amber-600">Customer OTP: {selectedCodOrder.customerOtp}</span>
                  </div>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={4}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      placeholder="Enter 4-digit code"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 font-mono font-bold text-slate-900 tracking-widest text-sm focus:outline-none focus:ring-2 focus:ring-[#FFB703]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm active:scale-98"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Payment Collection & Complete Delivery (₹{selectedCodOrder.codAmount})</span>
                </button>
              </form>

            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-8 text-center shadow-xs space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="font-heading font-black text-base text-slate-900">
                No Pending COD Collections!
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                All Cash-on-Delivery orders assigned in this shift have been paid and verified.
              </p>
            </div>
          )}

          {collectionSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Payment recorded successfully! Order marked as Delivered.</span>
            </div>
          )}

          {/* COD Collections Transaction Log */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-black text-base text-slate-900">
                  Cash Collections Ledger
                </h3>
                <p className="text-xs text-slate-500">Real COD orders assigned to you from the store.</p>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                {allTransactions.length} Entries
              </span>
            </div>

            {loadingCod ? (
              <div className="text-center py-6 text-slate-400 text-xs animate-pulse">Loading COD ledger...</div>
            ) : allTransactions.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-slate-400 space-y-2">
                <Inbox className="w-10 h-10 text-slate-300" />
                <p className="font-bold text-slate-600 text-sm">No COD orders yet</p>
                <p className="text-xs text-center max-w-xs">When a vendor assigns a COD delivery order to you, it will appear here.</p>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                {allTransactions.map(txn => {
                  const isReconciled = txn.status === 'reconciled_with_platform';
                  return (
                    <div
                      key={txn.id}
                      className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black shrink-0 ${
                          isReconciled ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
                        }`}>
                          <Banknote className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">
                            {txn.customerName} • Order #{txn.orderId}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {txn.collectedAt} • {txn.paymentMode}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-black text-slate-900 block text-sm">
                          ₹{txn.amount.toLocaleString('en-IN')}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                          isReconciled 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-900 animate-pulse'
                        }`}>
                          {isReconciled ? 'Reconciled' : 'Held in Hand'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right 1 Col: Platform Cash Deposit & Reconciliation Hub */}
        <div className="space-y-4">
          
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Deposit & Reconcile</h3>
                <span className="text-[10px] text-slate-400">Settle Cash-in-Hand</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Deposit collected cash to PAW NEAR platform bank account or via instant UPI to clear your cash liability.
            </p>

            {/* Platform Deposit Account Box */}
            <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[10px] font-bold uppercase">Platform Settlement VPA</span>
                <span className="text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Auto-Verified
                </span>
              </div>
              <p className="font-mono font-bold text-amber-400 text-sm">settle.pawnear@icici</p>
              <div className="text-[11px] text-slate-300 pt-1 border-t border-slate-800 flex justify-between">
                <span>Account Name:</span>
                <strong className="text-white">PawNear Logistics Pvt Ltd</strong>
              </div>
            </div>

            {/* Reconciliation Deposit Form */}
            <form onSubmit={handleReconcileDeposit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Amount to Settle / Deposit (₹):
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FFB703]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Deposit Method:
                </label>
                <select
                  value={depositMethod}
                  onChange={(e) => setDepositMethod(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-800 text-xs"
                >
                  <option value="UPI Platform Transfer">UPI Transfer (GooglePay / PhonePe)</option>
                  <option value="Cash Deposit at Hub">Cash Drop at Hub Counter</option>
                  <option value="Bank IMPS Transfer">Bank IMPS / NEFT</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Bank / UPI Reference Number (UTR):
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 402918829102"
                  value={depositRefNumber}
                  onChange={(e) => setDepositRefNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#FFB703]"
                />
              </div>

              <button
                type="submit"
                disabled={cashInHand <= 0}
                className={`w-full py-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-98 ${
                  cashInHand > 0
                    ? 'bg-[#FFB703] hover:bg-[#E5A015] text-slate-950'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Submit Cash Reconciliation</span>
              </button>
            </form>

            {depositSuccessMsg && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Deposit reconciled! Cash-in-hand balance updated.</span>
              </div>
            )}
          </div>

          {/* Cash Safety Policy Card */}
          <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200/90 text-xs space-y-2 text-slate-600">
            <span className="font-bold text-slate-900 block">⚠️ Daily Cash Limit Policy:</span>
            <p>
              Maximum allowed cash held by rider is <strong>₹5,000</strong>. New COD orders will be restricted until existing cash is reconciled.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
