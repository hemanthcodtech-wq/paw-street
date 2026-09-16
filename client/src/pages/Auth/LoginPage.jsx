import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Smartphone, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  RefreshCw, 
  Zap, 
  KeyRound,
  AlertCircle
} from 'lucide-react';
import Logo from '../../components/common/Logo';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, loginWithPhone, loginWithEmail, loginWithGoogle, sendEmailOtp, verifyEmailOtp } = useAuth();

  const [authMethod, setAuthMethod] = useState('email'); // 'email' | 'phone'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Steps: 'input' | 'otp' | 'forgot_email' | 'forgot_otp'
  const [step, setStep] = useState('input');
  
  // OTP State
  const [otpValues, setOtpValues] = useState(['', '', '', '']);
  const [resetOtp, setResetOtp] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [timer, setTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [statusNotice, setStatusNotice] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let interval = null;
    if ((step === 'otp' || step === 'forgot_otp') && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Handle Mobile/Email OTP Login Send
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    setStatusNotice('');
    const target = `${phoneNumber}@sms.pawnear.com`;
    const res = await sendEmailOtp(target, 'Login');
    if (res && res.message) {
      setStatusNotice(res.message);
    }
    setIsLoading(false);
    setStep('otp');
    setTimer(30);
  };

  // Handle Verify Login OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otp = otpValues.join('');
    if (otp.length < 4) {
      setErrorMessage('Please enter all 4 digits of the OTP.');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    const target = `${phoneNumber}@sms.pawnear.com`;
    const res = await verifyEmailOtp(target, otp);
    setIsLoading(false);
    if (res && res.success) {
      loginWithPhone(phoneNumber, otp);
      navigate('/');
    } else {
      setErrorMessage(res?.message || 'Invalid or expired OTP code.');
    }
  };

  // Handle Standard Email & Password Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    setStatusNotice('');
    const res = await loginWithEmail(email, password);
    setIsLoading(false);
    if (res && res.success) {
      navigate('/');
    } else {
      setErrorMessage(res?.message || 'Invalid email address or password.');
    }
  };

  // Handle Forgot Password - Request Reset Code
  const handleRequestForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    setStatusNotice('');

    try {
      const res = await api.forgotPassword(forgotEmail);
      if (res && res.success) {
        setStatusNotice(res.message || `Password reset code sent to ${forgotEmail}`);
        setStep('forgot_otp');
        setTimer(60);
      } else {
        setErrorMessage(res?.message || 'Unable to find an account with that email.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error requesting password reset.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Reset Password with OTP & New Password
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!resetOtp || resetOtp.length < 4) {
      setErrorMessage('Please enter the verification code sent to your email.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setStatusNotice('');

    try {
      const res = await api.resetPassword({
        email: forgotEmail,
        otp: resetOtp,
        newPassword
      });

      if (res && res.success) {
        setStatusNotice('Password successfully reset! Logging you in...');
        if (res.token && res.user) {
          localStorage.setItem('paw_user', JSON.stringify({ ...res.user, isLoggedIn: true }));
          localStorage.setItem('paw_token', res.token);
        }
        setTimeout(() => {
          navigate('/');
        }, 1200);
      } else {
        setErrorMessage(res?.message || 'Invalid or expired OTP code.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google OAuth Sign In
  const handleSocialLogin = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setErrorMessage('Google authentication cancelled or failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otpValues];
      newOtp[index] = value;
      setOtpValues(newOtp);
      if (value && index < 3) {
        const nextInput = document.getElementById(`login-otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 sm:py-12 px-4 font-sans text-slate-900 selection:bg-[#FFB703] selection:text-slate-950">
      <div className="w-full max-w-md bg-white rounded-3xl border border-amber-100 shadow-2xl overflow-hidden relative">
        
        {/* Top Gradient Banner with Branding */}
        <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-500 p-7 text-white text-center relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/15 rounded-full blur-xl pointer-events-none animate-float" />
          <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-black/10 rounded-full blur-lg pointer-events-none" />

          {/* Logo container */}
          <div className="flex justify-center mb-3">
            <div className="bg-white p-2.5 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
              <Logo size="md" showText={false} to="" />
            </div>
          </div>

          <h1 className="font-heading font-black text-2xl text-white tracking-tight">
            {step === 'forgot_email' || step === 'forgot_otp' ? 'Reset Password' : 'Welcome to PAW NEAR'}
          </h1>
          <p className="text-xs text-amber-100 mt-1 max-w-xs mx-auto">
            {step === 'forgot_email' || step === 'forgot_otp' 
              ? 'Enter your email to receive a secure password reset passcode'
              : 'Sign in to access 15-min delivery, saved pet profiles & orders'}
          </p>

          {/* Value Badges */}
          <div className="flex items-center justify-center gap-3 mt-3 pt-3 border-t border-white/20 text-[11px] font-semibold text-amber-100">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-200 fill-amber-200" /> 15-Min Delivery
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" /> 100% Genuine
            </span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-6 sm:p-8 space-y-4">

          {/* Status & Error Alerts */}
          {statusNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{statusNotice}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Normal Sign In View */}
          {step === 'input' && (
            <>
              {/* Method Switcher Tabs */}
              <div className="flex bg-slate-100 p-1 rounded-2xl mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('email');
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${
                    authMethod === 'email'
                      ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Mail className={`w-3.5 h-3.5 ${authMethod === 'email' ? 'text-amber-500' : ''}`} />
                  <span>Email & Password</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('phone');
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${
                    authMethod === 'phone'
                      ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Smartphone className={`w-3.5 h-3.5 ${authMethod === 'phone' ? 'text-amber-500' : ''}`} />
                  <span>Mobile OTP</span>
                </button>
              </div>

              {/* Form A: Email & Password */}
              {authMethod === 'email' ? (
                <form onSubmit={handleEmailLogin} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-extrabold text-slate-700 uppercase tracking-wider mb-1.5 text-[11px]">
                      Email Address
                    </label>
                    <div className="flex items-center rounded-2xl border border-slate-200 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-100 px-3.5 py-3 bg-slate-50/50 transition-all duration-200">
                      <Mail className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full text-xs sm:text-sm bg-transparent outline-none font-semibold text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="font-extrabold text-slate-700 uppercase tracking-wider text-[11px]">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotEmail(email);
                          setErrorMessage('');
                          setStatusNotice('');
                          setStep('forgot_email');
                        }}
                        className="text-[11px] font-bold text-amber-600 hover:text-amber-700 hover:underline"
                      >
                        Forgot?
                      </button>
                    </div>
                    <div className="flex items-center rounded-2xl border border-slate-200 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-100 px-3.5 py-3 bg-slate-50/50 transition-all duration-200">
                      <Lock className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full text-xs sm:text-sm bg-transparent outline-none font-semibold text-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-slate-600 p-1 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-[#FFB703] hover:bg-[#E5A015] active:scale-98 text-slate-950 font-black text-sm rounded-2xl shadow-md hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </form>
              ) : (
                /* Form B: Mobile OTP */
                <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-extrabold text-slate-700 uppercase tracking-wider mb-1.5 text-[11px]">
                      Mobile Number
                    </label>
                    <div className="flex rounded-2xl border border-slate-200 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-100 overflow-hidden transition-all bg-slate-50/50">
                      <span className="bg-slate-100 px-3.5 py-3 text-xs font-extrabold text-slate-700 flex items-center border-r border-slate-200 shrink-0">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        placeholder="Enter 10-digit number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        maxLength={10}
                        required
                        className="w-full px-3.5 py-3 text-xs sm:text-sm bg-transparent outline-none font-semibold text-slate-800"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || phoneNumber.length < 10}
                    className="w-full py-3.5 bg-[#FFB703] hover:bg-[#E5A015] active:scale-98 disabled:opacity-50 text-slate-950 font-black text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>{isLoading ? 'Sending Passcode...' : 'Get OTP Passcode'}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </form>
              )}

              {/* Social Login Separator */}
              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest absolute">
                  or connect with
                </span>
              </div>

              {/* Continue with Google */}
              <button
                type="button"
                onClick={handleSocialLogin}
                className="w-full py-3 px-4 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl text-xs font-bold text-slate-700 flex items-center justify-center gap-3 transition-all duration-200 shadow-2xs hover:shadow-xs active:scale-98"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Link to Register page */}
              <div className="pt-3 text-center text-xs text-slate-500 border-t border-slate-100">
                Don't have an account yet?{' '}
                <Link to="/register" className="font-extrabold text-amber-600 hover:text-amber-700 hover:underline">
                  Create Account
                </Link>
              </div>
            </>
          )}

          {/* 2. Login Mobile OTP Verification Step */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-center">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-1">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-black text-slate-900 text-lg">Verify OTP Code</h3>
              <p className="text-xs text-slate-500">
                Enter the 4-digit passcode sent to <br />
                <span className="font-extrabold text-slate-800">+91 {phoneNumber}</span>
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="text-amber-600 ml-2 underline font-bold"
                >
                  Edit
                </button>
              </p>

              {/* 4 Digit Inputs */}
              <div className="flex justify-center gap-3 my-4">
                {otpValues.map((val, idx) => (
                  <input
                    key={idx}
                    id={`login-otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-12 h-14 text-center text-xl font-black bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-amber-500 focus:bg-white outline-none transition-all shadow-inner"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#FFB703] hover:bg-[#E5A015] active:scale-98 text-slate-950 font-black text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{isLoading ? 'Verifying...' : 'Verify & Sign In'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <div className="text-xs text-slate-500 flex items-center justify-center gap-2 pt-2">
                {timer > 0 ? (
                  <span>Resend in <strong className="text-amber-600">{timer}s</strong></span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-amber-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Resend Code
                  </button>
                )}
              </div>
            </form>
          )}

          {/* 3. Forgot Password - Step 1: Request Email */}
          {step === 'forgot_email' && (
            <form onSubmit={handleRequestForgotPassword} className="space-y-4 text-xs">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage('');
                  setStatusNotice('');
                  setStep('input');
                }}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-800 font-bold mb-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>

              <div className="text-left space-y-1">
                <h3 className="font-heading font-black text-base text-slate-900">
                  Forgot Your Password?
                </h3>
                <p className="text-slate-500 text-xs">
                  Enter your registered account email and we'll send you a 6-digit passcode to reset your password.
                </p>
              </div>

              <div>
                <label className="block font-extrabold text-slate-700 uppercase tracking-wider mb-1.5 text-[11px]">
                  Registered Email Address
                </label>
                <div className="flex items-center rounded-2xl border border-slate-200 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-100 px-3.5 py-3 bg-slate-50/50 transition-all">
                  <Mail className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    className="w-full text-xs sm:text-sm bg-transparent outline-none font-semibold text-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !forgotEmail}
                className="w-full py-3.5 bg-[#FFB703] hover:bg-[#E5A015] active:scale-98 disabled:opacity-50 text-slate-950 font-black text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{isLoading ? 'Sending Passcode...' : 'Send Password Reset Code'}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          )}

          {/* 4. Forgot Password - Step 2: Verify OTP & Enter New Password */}
          {step === 'forgot_otp' && (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5 text-xs text-left">
              <button
                type="button"
                onClick={() => setStep('forgot_email')}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-800 font-bold mb-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Email</span>
              </button>

              <div className="space-y-1">
                <h3 className="font-heading font-black text-base text-slate-900">
                  Set New Password
                </h3>
                <p className="text-slate-500 text-xs">
                  Enter the passcode sent to <strong>{forgotEmail}</strong>
                </p>
              </div>

              {/* OTP Input */}
              <div>
                <label className="block font-extrabold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                  6-Digit Email Passcode
                </label>
                <div className="flex items-center rounded-2xl border border-slate-200 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-100 px-3.5 py-2.5 bg-slate-50">
                  <KeyRound className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP code"
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value.trim())}
                    maxLength={6}
                    required
                    className="w-full text-xs sm:text-sm bg-transparent outline-none font-mono font-bold tracking-widest text-slate-900"
                  />
                </div>
              </div>

              {/* New Password Input */}
              <div>
                <label className="block font-extrabold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                  New Password (min 6 chars)
                </label>
                <div className="flex items-center rounded-2xl border border-slate-200 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-100 px-3.5 py-2.5 bg-slate-50">
                  <Lock className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full text-xs sm:text-sm bg-transparent outline-none font-semibold text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block font-extrabold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                  Confirm New Password
                </label>
                <div className="flex items-center rounded-2xl border border-slate-200 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-100 px-3.5 py-2.5 bg-slate-50">
                  <Lock className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full text-xs sm:text-sm bg-transparent outline-none font-semibold text-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#FFB703] hover:bg-[#E5A015] active:scale-98 text-slate-950 font-black text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>{isLoading ? 'Resetting Password...' : 'Save New Password & Sign In'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <div className="text-center pt-1 text-xs text-slate-500">
                {timer > 0 ? (
                  <span>Resend code in <strong className="text-amber-600">{timer}s</strong></span>
                ) : (
                  <button
                    type="button"
                    onClick={handleRequestForgotPassword}
                    className="text-amber-600 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Resend Reset Code
                  </button>
                )}
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
