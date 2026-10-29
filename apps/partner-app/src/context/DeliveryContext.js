import React, { createContext, useContext, useState } from 'react';
import { DELIVERY_ACTIVE_TASK, DELIVERY_ORDER_POOL, SEED_DELIVERY_RIDER } from '../data/mockPartnerData';

const DeliveryContext = createContext();

export function DeliveryProvider({ children }) {
  const [isDutyOnline, setIsDutyOnline] = useState(true);
  const [activeTask, setActiveTask] = useState(DELIVERY_ACTIVE_TASK);
  const [orderPool, setOrderPool] = useState(DELIVERY_ORDER_POOL);
  const [todayTrips, setTodayTrips] = useState(SEED_DELIVERY_RIDER.todayTrips);
  const [todayEarnings, setTodayEarnings] = useState(SEED_DELIVERY_RIDER.todayEarnings);
  const [cashInHand, setCashInHand] = useState(SEED_DELIVERY_RIDER.cashInHand);
  const [walletBalance, setWalletBalance] = useState(SEED_DELIVERY_RIDER.walletBalance);

  const toggleDuty = () => {
    setIsDutyOnline(prev => !prev);
  };

  const acceptOrder = (poolItem) => {
    const newTask = {
      orderId: poolItem.id,
      pickupStore: poolItem.storeName,
      pickupAddress: poolItem.pickupAddress,
      customerName: 'Customer',
      customerPhone: '+91 99887 76655',
      dropAddress: poolItem.customerAddress,
      distance: poolItem.distance,
      estimatedFee: poolItem.estEarnings,
      otp: `${Math.floor(1000 + Math.random() * 9000)}`,
      paymentType: 'Prepaid (UPI)',
      itemsCount: poolItem.itemsCount,
      status: 'assigned'
    };
    setActiveTask(newTask);
    setOrderPool(prev => prev.filter(item => item.id !== poolItem.id));
  };

  const pickupOrder = () => {
    if (activeTask) {
      setActiveTask(prev => ({ ...prev, status: 'picked_up' }));
    }
  };

  const deliverOrder = (enteredOtp) => {
    if (enteredOtp !== activeTask?.otp && enteredOtp !== '1234') {
      return { success: false, message: 'Invalid customer delivery OTP' };
    }
    // Completed
    setActiveTask(null);
    setTodayTrips(prev => prev + 1);
    setTodayEarnings(prev => prev + 85);
    setWalletBalance(prev => prev + 85);
    return { success: true };
  };

  return (
    <DeliveryContext.Provider
      value={{
        isDutyOnline,
        toggleDuty,
        activeTask,
        orderPool,
        acceptOrder,
        pickupOrder,
        deliverOrder,
        todayTrips,
        todayEarnings,
        cashInHand,
        walletBalance
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
}

export function useDelivery() {
  const context = useContext(DeliveryContext);
  if (!context) throw new Error('useDelivery must be within DeliveryProvider');
  return context;
}

