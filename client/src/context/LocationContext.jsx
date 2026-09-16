import React, { createContext, useContext, useState } from 'react';

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [selectedLocation, setSelectedLocation] = useState({
    id: 'addr-default',
    type: 'Location',
    tag: 'Delivery Area',
    addressLine1: 'Road No 12, Banjara Hills',
    area: 'Banjara Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500034',
    shortDisplay: 'Banjara Hills, Hyderabad',
    lat: 17.4156,
    lng: 78.4350
  });

  const [savedAddresses, setSavedAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem('paw_addresses');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);

  const switchLocation = (address) => {
    setSelectedLocation(address);
    setIsLocationModalOpen(false);
  };

  const addAddress = (newAddr) => {
    const created = {
      ...newAddr,
      id: `addr-${Date.now()}`,
      shortDisplay: `${newAddr.area || newAddr.addressLine1}, ${newAddr.city}`
    };
    setSavedAddresses(prev => {
      const updated = [created, ...prev];
      localStorage.setItem('paw_addresses', JSON.stringify(updated));
      return updated;
    });
    setSelectedLocation(created);
    return created;
  };

  const deleteAddress = (id) => {
    setSavedAddresses(prev => {
      const updated = prev.filter(a => a.id !== id);
      localStorage.setItem('paw_addresses', JSON.stringify(updated));
      return updated;
    });
  };

  const detectCurrentLocation = () => {
    setIsDetectingGPS(true);
    setTimeout(() => {
      setIsDetectingGPS(false);
      const detected = {
        id: 'addr-gps',
        type: 'Current Location',
        tag: 'GPS Detected',
        addressLine1: 'Near Park View Enclave, Banjara Hills',
        area: 'Banjara Hills',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500034',
        shortDisplay: 'Banjara Hills, Hyderabad (Live GPS)',
        lat: 17.4168,
        lng: 78.4380
      };
      setSelectedLocation(detected);
      setIsLocationModalOpen(false);
    }, 900);
  };

  return (
    <LocationContext.Provider
      value={{
        selectedLocation,
        savedAddresses,
        isLocationModalOpen,
        isDetectingGPS,
        setIsLocationModalOpen,
        switchLocation,
        addAddress,
        deleteAddress,
        detectCurrentLocation
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocationContext must be used within LocationProvider');
  return context;
}
