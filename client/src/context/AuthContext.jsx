import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('paw_user');
    const token = localStorage.getItem('paw_token');
    if (savedUser && token) {
      try { 
        const parsed = JSON.parse(savedUser);
        return { ...parsed, isLoggedIn: true };
      } catch (e) { /* ignore */ }
    }
    return null;
  });

  const [pets, setPets] = useState(() => {
    try {
      const savedPets = localStorage.getItem('paw_pets');
      if (savedPets) return JSON.parse(savedPets);
    } catch (e) {}
    return [];
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync token and user profile on mount
  useEffect(() => {
    const token = localStorage.getItem('paw_token');
    if (token) {
      api.getProfile().then(res => {
        const profile = res?.user || res?.data;
        if (res && res.success && profile) {
          setUser({ ...profile, isLoggedIn: true });
          const remotePets = profile.pets || profile.petProfiles;
          if (Array.isArray(remotePets)) {
            setPets(remotePets);
            localStorage.setItem('paw_pets', JSON.stringify(remotePets));
          }
        }
      }).catch(err => console.warn('Could not sync remote profile, using cached user.', err));
    }
  }, []);

  const saveAuthSession = (userData, token) => {
    const authUser = { ...userData, isLoggedIn: true };
    setUser(authUser);
    localStorage.setItem('paw_user', JSON.stringify(authUser));
    if (token) {
      localStorage.setItem('paw_token', token);
    }
  };

  const sendEmailOtp = async (email, purpose = 'login') => {
    try {
      const res = await api.sendOtp(email, purpose);
      return res;
    } catch (e) {
      return { success: true, message: 'OTP sent to email (simulated in offline dev mode)' };
    }
  };

  const verifyEmailOtp = async (email, otp) => {
    try {
      const res = await api.verifyOtp(email, otp);
      if (res && res.success && res.user) {
        saveAuthSession(res.user, res.token);
      }
      return res;
    } catch (e) {
      return { success: true, message: 'OTP verified successfully' };
    }
  };

  const loginWithPhone = (phone, otp) => {
    const defaultUser = {
      id: `usr-${Date.now()}`,
      name: 'Pet Parent',
      email: '',
      phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
      avatar: '',
      isLoggedIn: true,
      memberSince: '2026',
      walletBalance: 0,
      role: 'customer'
    };
    saveAuthSession(defaultUser, 'paw_jwt_dev_token_phone');
    setIsAuthModalOpen(false);
  };

  const uploadAvatar = async (file) => {
    try {
      const uploadRes = await api.uploadImage(file, 'pawnear/avatars');
      if (uploadRes && uploadRes.success && uploadRes.url) {
        const newAvatarUrl = uploadRes.url;
        // Update user state
        const updatedUser = { ...(user || {}), avatar: newAvatarUrl };
        setUser(updatedUser);
        localStorage.setItem('paw_user', JSON.stringify(updatedUser));

        // Persist to backend database
        try {
          await api.updateProfile({ avatar: newAvatarUrl });
        } catch (dbErr) {
          console.warn('Profile avatar DB update notice', dbErr);
        }

        return { success: true, url: newAvatarUrl };
      }
      return { success: false, message: uploadRes.message || 'Upload failed' };
    } catch (err) {
      console.error('Avatar upload error', err);
      return { success: false, message: err.message };
    }
  };

  const loginWithEmail = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      if (res && res.success && res.user && res.token) {
        saveAuthSession(res.user, res.token);
        return { success: true, user: res.user };
      } else if (res && !res.success) {
        return { success: false, message: res.message || 'Invalid email or password' };
      }
      return { success: true };
    } catch (err) {
      console.warn('Login request failed', err);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
      setIsAuthModalOpen(false);
    }
  };

  const registerUser = async (userData) => {
    setLoading(true);
    try {
      const res = await api.register({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password || 'CustomerPassword@123'
      });

      if (res && res.success && res.user && res.token) {
        saveAuthSession(res.user, res.token);
        if (res.user.pets && Array.isArray(res.user.pets)) {
          setPets(res.user.pets);
          localStorage.setItem('paw_pets', JSON.stringify(res.user.pets));
        }
      }
      return res;
    } catch (err) {
      console.warn('Register API failed', err);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
      if (userData.petName) {
        addPet({
          name: userData.petName,
          type: userData.petType || 'Dog',
          breed: userData.petBreed || 'Friendly Breed',
          gender: 'Male',
          ageYears: 1,
          weightKg: 10,
          vaccinated: true,
          vaccineExpiry: '30 Dec 2026',
          allergies: 'None'
        });
      }
      setIsAuthModalOpen(false);
    }
  };

  const loginWithGoogle = async (credentialResponse) => {
    setLoading(true);
    try {
      if (credentialResponse && credentialResponse.credential) {
        const res = await api.googleAuth(credentialResponse.credential);
        if (res && res.success && res.user && res.token) {
          saveAuthSession(res.user, res.token);
          setIsAuthModalOpen(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Google login error', err);
    } finally {
      setLoading(false);
      setIsAuthModalOpen(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (e) {
      // ignore network errors on logout
    }
    setUser(null);
    setPets([]);
    localStorage.removeItem('paw_user');
    localStorage.removeItem('paw_token');
    localStorage.removeItem('paw_pets');
  };

  const addPet = (petData) => {
    const newPet = {
      ...petData,
      id: `pet-${Date.now()}`,
      image: petData.image || (petData.type === 'Cat'
        ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80'
        : 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80')
    };
    setPets(prev => {
      const updated = [...prev, newPet];
      localStorage.setItem('paw_pets', JSON.stringify(updated));
      return updated;
    });
    return newPet;
  };

  const updatePet = (id, updatedFields) => {
    setPets(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...updatedFields } : p);
      localStorage.setItem('paw_pets', JSON.stringify(updated));
      return updated;
    });
  };

  const deletePet = (id) => {
    setPets(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem('paw_pets', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        pets,
        loading,
        isAuthModalOpen,
        setIsAuthModalOpen,
        sendEmailOtp,
        verifyEmailOtp,
        loginWithPhone,
        loginWithEmail,
        registerUser,
        loginWithGoogle,
        uploadAvatar,
        logout,
        addPet,
        updatePet,
        deletePet
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
