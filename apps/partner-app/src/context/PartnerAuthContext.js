import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SEED_VENDOR, SEED_DELIVERY_RIDER } from '../data/mockPartnerData';
import { partnerApi } from '../services/api';

const PartnerAuthContext = createContext();

export function PartnerAuthProvider({ children }) {
  const [partnerRole, setPartnerRole] = useState('vendor'); // 'vendor' | 'delivery'
  const [partnerUser, setPartnerUser] = useState(SEED_VENDOR);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedSession();
  }, []);

  const loadSavedSession = async () => {
    try {
      const savedRole = await AsyncStorage.getItem('paw_partner_role');
      const savedUser = await AsyncStorage.getItem('paw_partner_user');

      if (savedRole) {
        setPartnerRole(savedRole);
      }

      if (savedUser) {
        setPartnerUser(JSON.parse(savedUser));
        setIsLoggedIn(true);
      } else {
        const defaultUser = (savedRole || 'vendor') === 'vendor' ? SEED_VENDOR : SEED_DELIVERY_RIDER;
        setPartnerUser(defaultUser);
        setIsLoggedIn(true);
      }
    } catch (e) {
      console.warn('Error reading partner session:', e);
    } finally {
      setLoading(false);
    }
  };

  const switchRole = async (role) => {
    setPartnerRole(role);
    const targetUser = role === 'vendor' ? SEED_VENDOR : SEED_DELIVERY_RIDER;
    setPartnerUser(targetUser);
    await AsyncStorage.setItem('paw_partner_role', role);
    await AsyncStorage.setItem('paw_partner_user', JSON.stringify(targetUser));
  };

  const loginPartner = async (email, password, role) => {
    const res = await partnerApi.partnerLogin(email, password, role);
    if (res.success && res.user) {
      setPartnerRole(role);
      setPartnerUser(res.user);
      setIsLoggedIn(true);
      await AsyncStorage.setItem('paw_partner_role', role);
      await AsyncStorage.setItem('paw_partner_user', JSON.stringify(res.user));
    }
    return res;
  };

  const registerPartner = async (formData, role) => {
    let newUser;
    if (role === 'vendor') {
      newUser = {
        ...SEED_VENDOR,
        id: `vnd-${Date.now().toString().slice(-4)}`,
        storeName: formData.storeName || 'My Pet Store',
        ownerName: formData.name || 'Store Owner',
        email: formData.email,
        phone: formData.phone || '+91 98765 43210',
        city: formData.city || 'Hyderabad'
      };
    } else {
      newUser = {
        ...SEED_DELIVERY_RIDER,
        id: `rid-${Date.now().toString().slice(-4)}`,
        name: formData.name || 'Fleet Captain',
        email: formData.email,
        phone: formData.phone || '+91 98451 22334',
        vehicleType: formData.vehicleType || 'EV Bike',
        vehicleNumber: formData.vehicleNumber || 'TS 09 NEW 0001'
      };
    }

    setPartnerRole(role);
    setPartnerUser(newUser);
    setIsLoggedIn(true);
    await AsyncStorage.setItem('paw_partner_role', role);
    await AsyncStorage.setItem('paw_partner_user', JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const logoutPartner = async () => {
    await AsyncStorage.removeItem('paw_partner_token');
    await AsyncStorage.removeItem('paw_partner_user');
    setIsLoggedIn(false);
  };

  return (
    <PartnerAuthContext.Provider
      value={{
        partnerRole,
        partnerUser,
        isLoggedIn,
        loading,
        switchRole,
        loginPartner,
        registerPartner,
        logoutPartner
      }}
    >
      {children}
    </PartnerAuthContext.Provider>
  );
}

export function usePartnerAuth() {
  const context = useContext(PartnerAuthContext);
  if (!context) throw new Error('usePartnerAuth must be within PartnerAuthProvider');
  return context;
}

