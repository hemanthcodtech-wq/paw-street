import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const DeliveryContext = createContext();

export function useDelivery() {
  const context = useContext(DeliveryContext);
  if (!context) {
    throw new Error('useDelivery must be used within a DeliveryProvider');
  }
  return context;
}

// Static fallback assignments shown when not authenticated / API unreachable
const DEMO_ASSIGNMENTS = [
  {
    id: 'DEL-9901',
    orderId: 'ORD-8821',
    status: 'on_the_way_to_customer',
    paymentType: 'COD',
    codAmount: 1249,
    isCodCollected: false,
    customerOtp: '4821',
    estimatedPayout: 95,
    distanceKm: 2.8,
    durationMins: 9,
    timestamp: '10:45 AM',
    store: {
      id: 'VND-101',
      name: 'Paws & Whiskers Supermart',
      address: 'Plot 42, Road No. 12, Banjara Hills',
      landmark: 'Opposite City Center Mall',
      phone: '+91 98765 43210',
      lat: 17.4156,
      lng: 78.4350,
      contactPerson: 'Rajesh (Store Manager)'
    },
    customer: {
      name: 'Meera Nambiar',
      phone: '+91 99881 22345',
      address: 'Flat 402, Oakwood Heights, Rd 36, Jubilee Hills',
      landmark: 'Near Peddamma Temple Metro Pillar 18',
      lat: 17.4319,
      lng: 78.4073,
      deliveryInstructions: 'Call upon arrival. Security gate pass pre-approved.'
    },
    items: [
      { name: 'Royal Canin Maxi Adult Dog Food (15kg)', qty: 1, price: 6899, verified: true },
      { name: 'Natural Rubber Chew Bone Toy', qty: 2, price: 598, verified: true }
    ],
    currentRiderPos: { lat: 17.4245, lng: 78.4210, heading: 285 },
    navigationSteps: [
      { instruction: 'Head north on Road No. 12 toward Rd No. 10', distance: '400 m', icon: 'straight' },
      { instruction: 'Turn left onto Jubilee Hills Checkpost Road', distance: '1.2 km', icon: 'turn-left' },
      { instruction: 'Turn right at Oakwood Heights Gate 1', distance: '400 m', icon: 'turn-right' }
    ],
    currentStepIndex: 1
  }
];

export function DeliveryProvider({ children }) {
  // ----------------------------------------------------
  // RIDER PROFILE & SHIFT STATE
  // ----------------------------------------------------
  const [rider, setRider] = useState({
    id: '',
    name: 'Delivery Captain',
    phone: '',
    email: '',
    avatar: '/images/promo_puppy.jpg',
    vehicleNumber: '',
    vehicleType: 'EV Bike',
    rating: 4.9,
    totalDeliveries: 0,
    todayTrips: 0,
    todayEarnings: 0,
    onlineStatus: true,
    cashInHand: 0,
    currentZone: 'Hyderabad',
    vendorStoreName: null, // Store the rider serves
    vendorStoreId: null
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('paw_rider_token'));
  const [ordersLoaded, setOrdersLoaded] = useState(false);

  // ----------------------------------------------------
  // LIVE DELIVERY ASSIGNMENTS
  // ----------------------------------------------------
  const [assignments, setAssignments] = useState([]);

  // Fetch Live Delivery Profile from Backend
  const fetchDeliveryData = useCallback(async () => {
    try {
      if (!localStorage.getItem('paw_rider_token')) return;
      const res = await api.getDeliveryProfile();
      if (res && res.success && res.rider) {
        setRider(prev => ({
          ...prev,
          ...res.rider,
          id: res.rider._id || res.rider.id || prev.id,
          vendorStoreName: res.rider.vendorStoreName || prev.vendorStoreName,
          vendorStoreId: res.rider.vendorStoreId || prev.vendorStoreId
        }));
      }
    } catch (err) {
      console.warn('Live delivery profile load notice:', err.message);
    }
  }, []);

  // Fetch real assigned orders for this rider
  const fetchMyOrders = useCallback(async () => {
    try {
      if (!localStorage.getItem('paw_rider_token')) return;
      const res = await api.getDeliveryOrders();
      if (res && res.success && Array.isArray(res.assignments)) {
        if (res.assignments.length > 0) {
          setAssignments(res.assignments);
        }
        // If no real orders yet, keep current assignments (could be demo)
        setOrdersLoaded(true);
      }
    } catch (err) {
      console.warn('Live delivery orders load notice:', err.message);
      setOrdersLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDeliveryData();
      fetchMyOrders();
    }
  }, [isAuthenticated, fetchDeliveryData, fetchMyOrders]);

  // Active primary order being navigated
  const activeOrder = assignments.find(a =>
    ['accepted', 'arrived_at_store', 'picked_up', 'on_the_way_to_customer', 'arrived_at_doorstep'].includes(a.status)
  ) || null;

  // ----------------------------------------------------
  // CASH-ON-DELIVERY (COD) TRANSACTION LEDGER
  // ----------------------------------------------------
  const [codTransactions, setCodTransactions] = useState([]);

  // ----------------------------------------------------
  // MUTATION ACTIONS
  // ----------------------------------------------------

  // 1. Toggle Online/Offline Duty
  const toggleOnlineStatus = async () => {
    const nextStatus = !rider.onlineStatus;
    try {
      api.toggleDeliveryDuty(nextStatus).catch(e => console.log('Duty toggled locally'));
    } catch (err) {
      // offline fallback
    }

    setRider(prev => ({
      ...prev,
      onlineStatus: nextStatus
    }));
  };

  // 2. Accept or Reject New Order Assignment
  const acceptOrder = (deliveryId) => {
    setAssignments(prev => prev.map(a => {
      if (a.id === deliveryId) {
        return { ...a, status: 'accepted' };
      }
      return a;
    }));
  };

  const declineOrder = (deliveryId) => {
    setAssignments(prev => prev.filter(a => a.id !== deliveryId));
  };

  // 3. Update Delivery Milestone Status
  const updateDeliveryStatus = (deliveryId, nextStatus) => {
    setAssignments(prev => prev.map(a => {
      if (a.id === deliveryId) {
        if (nextStatus === 'delivered') {
          setRider(r => ({
            ...r,
            todayTrips: r.todayTrips + 1,
            todayEarnings: r.todayEarnings + a.estimatedPayout,
            totalDeliveries: r.totalDeliveries + 1
          }));
        }
        return { ...a, status: nextStatus };
      }
      return a;
    }));
  };

  // 4. Toggle Item Verified at Store Pickup
  const toggleItemVerified = (deliveryId, itemIndex) => {
    setAssignments(prev => prev.map(a => {
      if (a.id === deliveryId) {
        const updatedItems = [...a.items];
        updatedItems[itemIndex].verified = !updatedItems[itemIndex].verified;
        return { ...a, items: updatedItems };
      }
      return a;
    }));
  };

  // 5. Collect COD Payment (Mandatory before marking delivered)
  const collectCodPayment = async (deliveryId, receivedAmount, paymentMode = 'Cash') => {
    const order = assignments.find(a => a.id === deliveryId);
    if (!order) return;

    try {
      api.collectCodPayment(order.orderId, receivedAmount).catch(e => console.log('COD collected locally'));
    } catch (err) {
      // offline fallback
    }

    setAssignments(prev => prev.map(a => {
      if (a.id === deliveryId) {
        return { ...a, isCodCollected: true };
      }
      return a;
    }));

    setRider(r => ({
      ...r,
      cashInHand: r.cashInHand + (order.codAmount || receivedAmount)
    }));

    const newTxn = {
      id: `TXN-COD-0${codTransactions.length + 1}`,
      orderId: order.orderId,
      deliveryId: order.id,
      customerName: order.customer.name,
      amount: order.codAmount || receivedAmount,
      collectedAt: 'Just Now',
      paymentMode: `${paymentMode} Collected`,
      status: 'held_by_rider'
    };

    setCodTransactions(prev => [newTxn, ...prev]);
  };

  // 6. Deposit and Reconcile Cash with Platform
  const reconcileCashDeposit = async (depositAmount, referenceNumber, paymentMethod = 'UPI Deposit') => {
    const numericAmount = parseFloat(depositAmount) || 0;
    if (numericAmount <= 0) return;

    try {
      api.reconcileCashDeposit({ depositAmount: numericAmount, referenceNumber, paymentMethod }).catch(e => console.log('Deposit reconciled locally'));
    } catch (err) {
      // offline fallback
    }

    setRider(r => ({
      ...r,
      cashInHand: Math.max(0, r.cashInHand - numericAmount)
    }));

    setCodTransactions(prev => {
      let remainingToReconcile = numericAmount;
      return prev.map(t => {
        if (t.status === 'held_by_rider' && remainingToReconcile >= t.amount) {
          remainingToReconcile -= t.amount;
          return {
            ...t,
            status: 'reconciled_with_platform',
            referenceId: referenceNumber,
            paymentMode: `Reconciled via ${paymentMethod}`
          };
        }
        return t;
      });
    });
  };

  // 7. Refresh orders from backend
  const refreshOrders = () => {
    fetchMyOrders();
  };

  return (
    <DeliveryContext.Provider
      value={{
        rider,
        setRider,
        isAuthenticated,
        setIsAuthenticated,
        assignments,
        setAssignments,
        activeOrder,
        ordersLoaded,
        codTransactions,
        toggleOnlineStatus,
        acceptOrder,
        declineOrder,
        updateDeliveryStatus,
        toggleItemVerified,
        collectCodPayment,
        reconcileCashDeposit,
        refreshOrders,
        DEMO_ASSIGNMENTS
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
}
