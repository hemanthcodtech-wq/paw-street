import React, { createContext, useContext, useState, useEffect } from 'react';

const DeliveryContext = createContext();

export function useDelivery() {
  const context = useContext(DeliveryContext);
  if (!context) {
    throw new Error('useDelivery must be used within a DeliveryProvider');
  }
  return context;
}

export function DeliveryProvider({ children }) {
  // ----------------------------------------------------
  // RIDER PROFILE & SHIFT STATE
  // ----------------------------------------------------
  const [rider, setRider] = useState({
    id: 'RDR-702',
    name: 'Raju Kumar',
    phone: '+91 98451 22334',
    email: 'raju@pawnear.com',
    avatar: '/images/promo_puppy.jpg',
    vehicleNumber: 'TS 09 EQ 4421',
    vehicleType: 'EV Bike (Ather 450X)',
    rating: 4.92,
    totalDeliveries: 412,
    todayTrips: 8,
    todayEarnings: 760,
    onlineStatus: true, // true = Available on Duty, false = Offline
    cashInHand: 1450, // Total COD cash collected today awaiting reconciliation
    currentZone: 'Jubilee Hills & Banjara Hills, Hyderabad'
  });

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // ----------------------------------------------------
  // 5.1 LIVE DELIVERY ASSIGNMENTS & PIPELINE
  // ----------------------------------------------------
  const [assignments, setAssignments] = useState([
    {
      id: 'DEL-9901',
      orderId: 'ORD-8821',
      status: 'on_the_way_to_customer', // 'assigned', 'accepted', 'arrived_at_store', 'picked_up', 'on_the_way_to_customer', 'arrived_at_doorstep', 'delivered'
      paymentType: 'COD', // 'COD' or 'PREPAID'
      codAmount: 1249,
      isCodCollected: false,
      customerOtp: '4821',
      estimatedPayout: 95, // Rider earning for this trip
      distanceKm: 2.8,
      durationMins: 9,
      timestamp: '10:45 AM',
      // Pickup Store Information
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
      // Customer Drop-off Information
      customer: {
        name: 'Meera Nambiar',
        phone: '+91 99881 22345',
        address: 'Flat 402, Oakwood Heights, Rd 36, Jubilee Hills',
        landmark: 'Near Peddamma Temple Metro Pillar 18',
        lat: 17.4319,
        lng: 78.4073,
        deliveryInstructions: 'Call upon arrival. Security gate pass pre-approved.'
      },
      // Items manifest checklist
      items: [
        { name: 'Royal Canin Maxi Adult Dog Food (15kg)', qty: 1, price: 6899, verified: true },
        { name: 'Natural Rubber Chew Bone Toy', qty: 2, price: 598, verified: true }
      ],
      // Simulated live route coordinates (Store -> Customer)
      currentRiderPos: {
        lat: 17.4245,
        lng: 78.4210,
        heading: 285
      },
      // Real-time navigation step instructions
      navigationSteps: [
        { instruction: 'Head north on Road No. 12 toward Rd No. 10', distance: '400 m', icon: 'straight' },
        { instruction: 'Turn left onto Jubilee Hills Checkpost Road', distance: '1.2 km', icon: 'turn-left' },
        { instruction: 'Continue straight past Metro Pillar 14', distance: '800 m', icon: 'straight' },
        { instruction: 'Turn right at Oakwood Heights Gate 1', distance: '400 m', icon: 'turn-right' }
      ],
      currentStepIndex: 1
    },
    {
      id: 'DEL-9902',
      orderId: 'ORD-8824',
      status: 'assigned', // New pending assignment
      paymentType: 'PREPAID',
      codAmount: 0,
      isCodCollected: true,
      customerOtp: '9133',
      estimatedPayout: 80,
      distanceKm: 3.4,
      durationMins: 12,
      timestamp: '11:15 AM',
      store: {
        id: 'VND-103',
        name: 'CityCare Animal Hospital & Pharmacy',
        address: 'Shop 14, High Street, Jubilee Hills',
        landmark: 'Next to Apollo Diagnostics',
        phone: '+91 99445 67890',
        lat: 17.4319,
        lng: 78.4073,
        contactPerson: 'Dr. Arjun Varma'
      },
      customer: {
        name: 'Kavita Reddy',
        phone: '+91 98760 11223',
        address: 'Villa 12, Silver Oaks Enclave, Madhapur',
        landmark: 'Near Inorbit Mall Backgate',
        lat: 17.4399,
        lng: 78.3842,
        deliveryInstructions: 'Leave package with security if no answer.'
      },
      items: [
        { name: 'Pet Derma Medicated Anti-Tick Shampoo (250ml)', qty: 1, price: 449, verified: false },
        { name: 'Calcium & Bone Strength Tablets (60 tabs)', qty: 1, price: 399, verified: false }
      ],
      currentRiderPos: {
        lat: 17.4300,
        lng: 78.4100,
        heading: 45
      },
      navigationSteps: [
        { instruction: 'Head west on High Street toward CityCare Clinic', distance: '300 m', icon: 'straight' }
      ],
      currentStepIndex: 0
    }
  ]);

  // Active primary order being navigated
  const activeOrder = assignments.find(a => 
    ['accepted', 'arrived_at_store', 'picked_up', 'on_the_way_to_customer', 'arrived_at_doorstep'].includes(a.status)
  ) || null;

  // ----------------------------------------------------
  // 5.2 CASH-ON-DELIVERY (COD) TRANSACTION LEDGER
  // ----------------------------------------------------
  const [codTransactions, setCodTransactions] = useState([
    {
      id: 'TXN-COD-01',
      orderId: 'ORD-8815',
      deliveryId: 'DEL-9890',
      customerName: 'Aditya Sen',
      amount: 850,
      collectedAt: 'Today at 09:30 AM',
      paymentMode: 'Cash Collected',
      status: 'held_by_rider' // 'held_by_rider', 'reconciled_with_platform'
    },
    {
      id: 'TXN-COD-02',
      orderId: 'ORD-8817',
      deliveryId: 'DEL-9892',
      customerName: 'Sunita Rao',
      amount: 600,
      collectedAt: 'Today at 10:10 AM',
      paymentMode: 'Cash Collected',
      status: 'held_by_rider'
    },
    {
      id: 'TXN-COD-03',
      orderId: 'ORD-8799',
      deliveryId: 'DEL-9870',
      customerName: 'Vikram Mehta',
      amount: 1450,
      collectedAt: 'Yesterday at 07:45 PM',
      paymentMode: 'Deposited to Platform UPI',
      status: 'reconciled_with_platform',
      referenceId: 'UPI-REF-99214481'
    }
  ]);

  // ----------------------------------------------------
  // MUTATION ACTIONS
  // ----------------------------------------------------

  // 1. Toggle Online/Offline Duty
  const toggleOnlineStatus = () => {
    setRider(prev => ({
      ...prev,
      onlineStatus: !prev.onlineStatus
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
  const collectCodPayment = (deliveryId, receivedAmount, paymentMode = 'Cash') => {
    const order = assignments.find(a => a.id === deliveryId);
    if (!order) return;

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
  const reconcileCashDeposit = (depositAmount, referenceNumber, paymentMethod = 'UPI Deposit') => {
    const numericAmount = parseFloat(depositAmount) || 0;
    if (numericAmount <= 0) return;

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

  return (
    <DeliveryContext.Provider
      value={{
        rider,
        setRider,
        isAuthenticated,
        setIsAuthenticated,
        assignments,
        activeOrder,
        codTransactions,
        toggleOnlineStatus,
        acceptOrder,
        declineOrder,
        updateDeliveryStatus,
        toggleItemVerified,
        collectCodPayment,
        reconcileCashDeposit
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
}
