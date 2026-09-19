import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bike, 
  ShieldCheck, 
  Mail,
  Lock, 
  ArrowRight, 
  ArrowLeft,
  KeyRound,
  Eye,
  EyeOff,
  RefreshCw,
  ExternalLink,
  Store,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import Logo from '../../components/common/Logo';
import { useDelivery } from '../../context/DeliveryContext';
import { api } from '../../services/api';

export default function DeliveryLoginPage() {
  const navigate = useNavigate();
  const { setRider, setIsAuthenticated } = useDelivery();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusNotice, setStatusNotice] = useState('');

  // Steps: 'login' | 'forgot_email' | 'forgot_otp'
  const [step, setStep] = useState('login');
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let interval = null;
    if (step === 'forgot_otp' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setStatusNotice('');

    try {
      const res = await api.login({ email, password, role: 'delivery' });
      if (res && res.success) {
        if (res.token) {
          localStorage.setItem('paw_rider_token', res.token);
          localStorage.setItem('paw_token', res.token);
        }
        if (res.user) {
          localStorage.setItem('paw_user', JSON.stringify({ ...res.user, isLoggedIn: true }));
        }
        setIsAuthenticated(true);
        setRider({
          id: res.user?.id || 'RDR-702',
          name: res.user?.name || 'Delivery Captain',
          phone: res.user?.phone || '+91 98451 22334',
          email: res.user?.email || email,
          avatar: res.user?.avatar || '',
          vehicleNumber: 'TS 09 EQ 4421',
          vehicleType: 'EV Bike (Ather 450X)',
          rating: 4.92,
          totalDeliveries: 412,
          todayTrips: 8,
          todayEarnings: 760,
          onlineStatus: true,
          cashInHand: 1450,
          currentZone: 'Jubilee Hills & Banjara Hills, Hyderabad'
        });
        navigate('/delivery/dashboard');
      } else {
        setErrorMessage(res?.message || 'Invalid delivery captain credentials');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Rider login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Google Login for Delivery Captain
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await api.googleAuth(null, {
        email: 'rider@pawnear.com',
        name: 'Raju Kumar',
        id: `GOOGLE-RIDER-${Date.now()}`,
        role: 'delivery'
      });
      if (res && res.success) {
        if (res.token) {
          localStorage.setItem('paw_rider_token', res.token);
          localStorage.setItem('paw_token', res.token);
        }
        if (res.user) {
          localStorage.setItem('paw_user', JSON.stringify({ ...res.user, isLoggedIn: true }));
        }
        setIsAuthenticated(true);
        setRider({
          id: res.user?.id || 'RDR-702',
          name: res.user?.name || 'Raju Kumar',
          phone: res.user?.phone || '+91 98451 22334',
          email: res.user?.email || 'rider@pawnear.com',
          avatar: res.user?.avatar || '',
          vehicleNumber: 'TS 09 EQ 4421',
          vehicleType: 'EV Bike',
          rating: 4.9,
          totalDeliveries: 412,
          todayTrips: 8,
          todayEarnings: 760,
          onlineStatus: true,
          cashInHand: 1450,
          currentZone: 'Jubilee Hills, Hyderabad'
        });
        navigate('/delivery/dashboard');
      } else {
        setErrorMessage(res?.message || 'Google sign-in failed');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Google sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Send Forgot Password OTP
  const handleRequestForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setErrorMessage('Please enter your registered rider email.');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    setStatusNotice('');

    try {
      const res = await api.forgotPassword(forgotEmail);
      if (res && res.success) {
        setStatusNotice(res.message || `Password reset passcode sent to ${forgotEmail}`);
        setStep('forgot_otp');
        setTimer(60);
      } else {
        setErrorMessage(res?.message || 'No rider account found with that email.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error requesting password reset.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset Password Submit
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
        if (res.token) {
          localStorage.setItem('paw_rider_token', res.token);
          localStorage.setItem('paw_token', res.token);
        }
        if (res.user) {
          localStorage.setItem('paw_user', JSON.stringify({ ...res.user, isLoggedIn: true }));
        }
        setIsAuthenticated(true);
        setRider({
          id: res.user?.id || 'RDR-702',
          name: res.user?.name || 'Delivery Captain',
          email: res.user?.email || forgotEmail,
          avatar: res.user?.avatar || '',
          onlineStatus: true
        });
        setTimeout(() => {
          navigate('/delivery/dashboard');
        }, 1000);
      } else {
        setErrorMessage(res?.message || 'Invalid or expired OTP code.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-slate-900 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#FFB703] selection:text-slate-950">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-block mb-1">
            <Logo to="/" size="xl" />
          </div>
          <div className="flex items-center justify-center gap-1.5 pt-1">
            <span className="bg-amber-100 text-amber-900 border border-amber-300/80 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest">
              Delivery Partner Portal
            </span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Delivery Captain Login
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
            Live turn-by-turn navigation, real-time trip execution & cash-on-delivery reconciliation.
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          
          {/* Status Notices */}
          {statusNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
              <span className="text-emerald-600">✓</span>
              <span>{statusNotice}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: STANDARD RIDER LOGIN */}
          {step === 'login' && (
            <>
              <form onSubmit={handleLogin} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Captain Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="rider@pawnear.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white transition-colors font-medium"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-700">
                      Login Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(email);
                        setStep('forgot_email');
                        setErrorMessage('');
                        setStatusNotice('');
                      }}
                      className="text-[11px] font-bold text-amber-600 hover:text-amber-700 hover:underline"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white transition-colors font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-amber-500 focus:ring-0" />
                    <span>Stay online across shifts</span>
                  </label>
                  <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> GPS Active
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-black rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm active:scale-98"
                >
                  <Bike className="w-4 h-4" />
                  <span>{isLoading ? 'Authenticating Captain...' : 'Start Delivery Duty'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Social OAuth Divider & Google Login */}
              <div className="pt-2">
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="shrink-0 mx-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Or Sign In With
                  </span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full mt-2 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs transition-all flex items-center justify-center gap-2.5 active:scale-98"
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
            </>
          )}

          {/* STEP 2: FORGOT PASSWORD - REQUEST OTP */}
          {step === 'forgot_email' && (
            <form onSubmit={handleRequestForgotPassword} className="space-y-4 text-xs">
              <div className="text-center space-y-1 pb-1">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-sm text-slate-900">Captain Password Recovery</h3>
                <p className="text-slate-500 text-[11px]">
                  We will dispatch a secure 6-digit passcode to your registered rider email via Nodemailer.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Captain Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="rider@pawnear.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-black rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <span>{isLoading ? 'Sending Passcode...' : 'Send Reset Passcode'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('login');
                  setErrorMessage('');
                  setStatusNotice('');
                }}
                className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Rider Login</span>
              </button>
            </form>
          )}

          {/* STEP 3: RESET PASSWORD - VERIFY OTP & ENTER NEW PASSWORD */}
          {step === 'forgot_otp' && (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-4 text-xs">
              <div className="text-center space-y-1 pb-1">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-sm text-slate-900">Verify OTP & Set New Password</h3>
                <p className="text-slate-500 text-[11px]">
                  Passcode sent to <strong className="text-slate-800">{forgotEmail}</strong>
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="Enter 6-digit code"
                  value={resetOtp}
                  onChange={(e) => setResetOtp(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-center text-base tracking-widest text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  New Rider Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-slate-500">
                  {timer > 0 ? `Resend OTP in ${timer}s` : 'Did not receive code?'}
                </span>
                {timer === 0 && (
                  <button
                    type="button"
                    onClick={handleRequestForgotPassword}
                    className="font-bold text-amber-600 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Resend OTP</span>
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-black rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <span>{isLoading ? 'Updating Password...' : 'Save Password & Enter'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('login');
                  setErrorMessage('');
                  setStatusNotice('');
                }}
                className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            </form>
          )}

          {/* Quick Shortcuts to other modules */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
            <Link to="/" className="hover:text-slate-900 flex items-center gap-1">
              <span>Customer Store</span>
            </Link>
            <Link to="/vendor/login" className="hover:text-amber-600 flex items-center gap-1">
              <Store className="w-3.5 h-3.5" />
              <span>Vendor Login</span>
            </Link>
            <Link to="/admin/login" className="hover:text-slate-900 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Login</span>
            </Link>
          </div>

        </div>

        <p className="text-center text-[11px] text-slate-400 font-medium">
          🔒 PAW NEAR Delivery Fleet Network • 256-Bit SSL Encrypted Live Telemetry
        </p>

      </div>

    </div>
  );
}
