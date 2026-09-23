import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Smartphone, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Lock,
  RefreshCw
} from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../../context/AuthContext';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, loginWithPhone, loginWithGoogle } = useAuth();
  
  const [authMethod, setAuthMethod] = useState('email'); // 'email' | 'phone'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState('input'); // 'input' | 'otp'
  const [otpValues, setOtpValues] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let interval = null;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = (e) => {
    e.preventDefault();
    setStep('otp');
    setTimer(30);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    loginWithPhone(phoneNumber, otpValues.join(''));
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otpValues];
      newOtp[index] = value;
      setOtpValues(newOtp);
      // Auto focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md shadow-2xl border border-slate-100 overflow-hidden relative max-h-[92vh] sm:max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        
        {/* Mobile Grab Bar */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-2 sm:hidden shrink-0" />

        {/* Close Button */}
        <button
          onClick={() => {
            setIsAuthModalOpen(false);
            setStep('input');
          }}
          className="absolute right-4 top-4 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-600 flex items-center justify-center transition-colors shadow-xs"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header with Branding */}
        <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-500 p-5 sm:p-6 text-white text-center relative overflow-hidden shrink-0">
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-center mb-2">
            <div className="bg-white p-2 rounded-2xl shadow-md">
              <Logo size="md" showText={false} to="" />
            </div>
          </div>
          <h3 className="font-heading font-extrabold text-lg sm:text-xl text-white">Welcome to PAW NEAR</h3>
          <p className="text-xs text-amber-100 mt-1">India's Fastest 15-Min Pet Food & Care Platform</p>
        </div>

        {/* Modal Form */}
        <div className="p-5 sm:p-6 overflow-y-auto overscroll-contain flex-1">
          {step === 'input' ? (
            <div className="space-y-4">
              
              {/* Method Switcher Tabs */}
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setAuthMethod('phone')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    authMethod === 'phone' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile OTP</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod('email')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    authMethod === 'email' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email ID</span>
                </button>
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendOtp} className="space-y-3">
                {authMethod === 'phone' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Enter Mobile Number
                    </label>
                    <div className="flex rounded-xl border border-slate-200 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200 overflow-hidden bg-slate-50">
                      <span className="px-3 py-2.5 bg-slate-100 text-xs font-bold text-slate-600 border-r border-slate-200 flex items-center">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        maxLength="10"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="98765 43210"
                        className="w-full px-3 py-2.5 text-sm bg-transparent outline-none font-medium text-slate-900"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Enter Email Address
                    </label>
                    <input
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      placeholder="alex.pawlover@gmail.com"
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none bg-slate-50"
                      required
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 active:scale-98 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>{isLoading ? 'Sending Verification...' : 'Get Instant OTP'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Social Login Separator */}
              <div className="relative py-2 flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] text-slate-400 uppercase font-semibold absolute">
                  Or continue with
                </span>
              </div>

              {/* Google Social Login */}
              <button
                type="button"
                onClick={loginWithGoogle}
                className="w-full py-2.5 px-4 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-2xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          ) : (
            /* OTP Verification Step */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-2">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Enter 4-Digit Security Code</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Code sent to <span className="font-bold text-slate-700">{authMethod === 'phone' ? `+91 ${phoneNumber}` : emailAddress}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="text-[11px] text-amber-600 font-bold hover:underline mt-1"
                >
                  Change {authMethod === 'phone' ? 'number' : 'email'}
                </button>
              </div>

              {/* 4 Boxes OTP Input */}
              <div className="flex justify-center gap-3 py-2">
                {otpValues.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-12 h-12 text-center text-lg font-black bg-slate-50 border-2 border-slate-200 focus:border-amber-500 focus:bg-white rounded-2xl outline-none transition-all shadow-inner"
                    required
                  />
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 active:scale-98 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Verify & Proceed</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <div className="text-xs text-slate-500 flex items-center justify-center gap-2 pt-2">
                {timer > 0 ? (
                  <span>Resend code in <strong className="text-amber-600">{timer}s</strong></span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setTimer(30)}
                    className="text-amber-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Resend OTP
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
