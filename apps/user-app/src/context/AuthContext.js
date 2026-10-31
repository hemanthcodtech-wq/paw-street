import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_SEED } from '../data/mockData';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(USER_SEED);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [pets, setPets] = useState(USER_SEED.pets);
  const [hasPinnedLocation, setHasPinnedLocation] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    city: 'Hyderabad',
    area: 'Banjara Hills, Road No 12',
    pincode: '500034',
    lat: 17.4156,
    lng: 78.4350,
    label: 'Home'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedSession();
  }, []);

  const loadSavedSession = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('paw_user_profile');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setIsLoggedIn(true);
        if (parsed.pets) setPets(parsed.pets);
      } else {
        setUser(USER_SEED);
        setIsLoggedIn(true);
        setPets(USER_SEED.pets);
      }
    } catch (e) {
      console.warn('Error reading user session:', e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (emailOrPhone, password) => {
    const res = await api.login(emailOrPhone, password);
    if (res.success && res.user) {
      setUser(res.user);
      setIsLoggedIn(true);
      if (res.user.pets) setPets(res.user.pets);
      await AsyncStorage.setItem('paw_user_profile', JSON.stringify(res.user));
    }
    return res;
  };

  const loginWithTokenAndUser = async (token, userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    if (userData.pets) setPets(userData.pets);
    await AsyncStorage.setItem('paw_user_token', token);
    await AsyncStorage.setItem('paw_user_profile', JSON.stringify(userData));
  };

  const register = async (userData) => {
    const newUser = {
      ...USER_SEED,
      id: `usr-${Date.now().toString().slice(-5)}`,
      name: userData.name || 'Pet Parent',
      email: userData.email,
      phone: userData.phone ? `+91 ${userData.phone}` : '+91 98450 11223',
      role: 'customer',
      pets: userData.petName ? [{
        id: `pet-${Date.now()}`,
        name: userData.petName,
        species: userData.species || 'Dog',
        breed: userData.breed || 'Companion',
        age: userData.age || '1 Year',
        gender: userData.gender || 'Male',
        weight: '10 kg',
        avatar: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80'
      }] : USER_SEED.pets
    };
    setUser(newUser);
    setIsLoggedIn(true);
    setPets(newUser.pets);
    await AsyncStorage.setItem('paw_user_profile', JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const logout = async () => {
    await AsyncStorage.removeItem('paw_user_token');
    await AsyncStorage.removeItem('paw_user_profile');
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
    await AsyncStorage.setItem('paw_user_profile', JSON.stringify(updatedUser));
  };

  const updateLocation = (loc) => {
    setSelectedLocation(loc);
    setHasPinnedLocation(true);
    setIsLocationModalOpen(false);
  };

  const openLocationModal = () => {
    setIsLocationModalOpen(true);
  };

  const closeLocationModal = () => {
    setIsLocationModalOpen(false);
    setHasPinnedLocation(true);
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
        hasPinnedLocation,
        isLocationModalOpen,
        openLocationModal,
        closeLocationModal,
        login,
        loginWithTokenAndUser,
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
  if (!context) throw new Error('useAuth must be within AuthProvider');
  return context;
}

