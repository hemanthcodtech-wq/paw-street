import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useVendor } from '../../context/VendorContext';
import { useDelivery } from '../../context/DeliveryContext';

export default function AuthBridgePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const { setVendorToken, setVendor } = useVendor?.() || {};
  const [message, setMessage] = useState('Verifying Google credentials...');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    const token = params.get('token');
    const userJson = params.get('user');
    const role = params.get('role') || 'customer';
    const email = params.get('email');
    const name = params.get('name');
    const errorMsg = params.get('message');

    if (status === 'success' && token) {
      try {
        const userData = userJson ? JSON.parse(userJson) : null;

        if (role === 'vendor') {
          localStorage.setItem('paw_vendor_token', token);
          if (userData && setVendor) setVendor(userData);
          setMessage('Welcome back! Redirecting to Vendor Hub...');
          setTimeout(() => navigate('/vendor/dashboard'), 800);
        } else if (role === 'delivery') {
          localStorage.setItem('paw_rider_token', token);
          setMessage('Welcome back! Redirecting to Delivery Fleet...');
          setTimeout(() => navigate('/delivery/dashboard'), 800);
        } else {
          localStorage.setItem('paw_token', token);
          if (userData && setUser) setUser(userData);
          setMessage('Welcome back! Redirecting...');
          setTimeout(() => navigate('/'), 800);
        }
      } catch (e) {
        console.error('Bridge parse error:', e);
        navigate('/login?error=Invalid+session');
      }
    } else if (status === 'not_registered') {
      setMessage(`No account found with ${email || 'this Google email'}. Redirecting to Sign Up...`);
      setTimeout(() => {
        if (role === 'vendor') {
          navigate(`/vendor/onboarding?email=${encodeURIComponent(email || '')}&name=${encodeURIComponent(name || '')}`);
        } else {
          navigate(`/login?mode=signup&email=${encodeURIComponent(email || '')}&name=${encodeURIComponent(name || '')}&alert=not_registered`);
        }
      }, 1200);
    } else {
      setMessage(errorMsg || 'Authentication failed or was cancelled.');
      setTimeout(() => navigate('/login'), 1800);
    }
  }, [location, navigate, setUser, setVendor]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-xl border border-amber-100">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-500 mx-auto flex items-center justify-center mb-4 animate-bounce">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v2h-2zm0-10h2v8h-2z" />
          </svg>
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-2">Google Auth Bridge</h2>
        <p className="text-sm font-medium text-slate-600">{message}</p>
        <div className="mt-6 flex justify-center">
          <div className="w-6 h-6 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    </div>
  );
}

