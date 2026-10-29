import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_SEED } from '../data/mockData';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(USER_SEED);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [pets, setPets] = useState(USER_SEED.pets);
  const [selectedLocation, setSelectedLocation] = useState({
    city: 'Hyderabad',
    area: 'Banjara Hills, Road No 12',
    pincode: '500034',
    label: 'Home'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedSession();
  }, []);

  const loadSavedSession = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('paw_mobile_user');
      const token = await AsyncStorage.getItem('paw_mobile_token');
      if (savedUser && token) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setIsLoggedIn(true);
        if (parsed.pets && Array.isArray(parsed.pets)) {
          setPets(parsed.pets);
        }
      } else {
        // Use default seed user for easy demonstration
        setUser(USER_SEED);
        setIsLoggedIn(true);
        setPets(USER_SEED.pets);
      }
    } catch (e) {
      console.warn('Error loading auth session:', e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (emailOrPhone, password, role = 'customer') => {
    const res = await api.login(emailOrPhone, password);
    if (res.success && res.user) {
      const userWithRole = { ...res.user, role };
      setUser(userWithRole);
      setIsLoggedIn(true);
      if (res.user.pets) setPets(res.user.pets);
      await AsyncStorage.setItem('paw_mobile_user', JSON.stringify(userWithRole));
    }
    return res;
  };

  const loginWithGoogle = async (role = 'customer') => {
    const roleLabels = {
      customer: 'Aarav Sharma',
      vendor: 'Rajesh Sharma (Partner)',
      rider: 'Suresh Varma (Fleet)'
    };
    const roleEmails = {
      customer: 'customer@thepawstreet.com',
      vendor: 'vendor@pawnear.com',
      rider: 'rider@pawnear.com'
    };
    const googleUser = {
      ...USER_SEED,
      id: `usr-google-${Date.now().toString().slice(-4)}`,
      name: roleLabels[role] || 'Paw Street User',
      email: roleEmails[role] || `${role}@pawnear.com`,
      role: role,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      isLoggedIn: true
    };
    setUser(googleUser);
    setIsLoggedIn(true);
    await AsyncStorage.setItem('paw_mobile_token', 'google_mobile_auth_token');
    await AsyncStorage.setItem('paw_mobile_user', JSON.stringify(googleUser));
    return { success: true, user: googleUser };
  };

  const register = async (userData, role = 'customer') => {
    const newUser = {
      ...USER_SEED,
      id: `usr-${Date.now().toString().slice(-5)}`,
      name: userData.name || (role === 'vendor' ? userData.storeName : 'New User'),
      email: userData.email,
      phone: userData.phone ? `+91 ${userData.phone}` : '+91 98765 43210',
      role: role,
      storeName: userData.storeName || undefined,
      vehicleType: userData.vehicleType || undefined,
      isLoggedIn: true,
      pets: userData.petType ? [{
        id: `pet-${Date.now()}`,
        name: `${userData.name}'s ${userData.petType}`,
        species: userData.petType,
        breed: 'Companion',
        age: '1 Year',
        gender: 'Male',
        weight: '12 kg',
        avatar: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80'
      }] : USER_SEED.pets
    };
    setUser(newUser);
    setIsLoggedIn(true);
    await AsyncStorage.setItem('paw_mobile_token', 'dev_token_mobile_123');
    await AsyncStorage.setItem('paw_mobile_user', JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const logout = async () => {
    await AsyncStorage.removeItem('paw_mobile_token');
    await AsyncStorage.removeItem('paw_mobile_user');
    setIsLoggedIn(false);
    setUser(null);
  };

  const addPet = async (petData) => {
    const newPet = {
      id: `pet-${Date.now()}`,
      avatar: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80',
      ...petData
    };
    const updatedPets = [...pets, newPet];
    setPets(updatedPets);
    const updatedUser = { ...(user || {}), pets: updatedPets };
    setUser(updatedUser);
    await AsyncStorage.setItem('paw_mobile_user', JSON.stringify(updatedUser));
  };

  const updateLocation = (loc) => {
    setSelectedLocation(loc);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        pets,
        addPet,
        selectedLocation,
        updateLocation,
        login,
        loginWithGoogle,
        register,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
