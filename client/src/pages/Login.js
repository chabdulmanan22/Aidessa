import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import HeroGridBoxesAnimation from '../components/HeroGridBoxesAnimation';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password, rememberMe);

    if (result.success) {
      const from = location.state?.from?.pathname || "/dashboard";
      const search = location.state?.from?.search || "";
      navigate(`${from}${search}`, { replace: true });
    } else {
      setServerErrors(result.errors || []);
    }

    setLoading(false);
  };

  const handleForgotPassword = () => {
    setShowForgot(true);
  };

  const sendOtp = async () => {
    if (!formData.email) {
      toast.error('Enter your email first');
      return;
    }
    setSendingOtp(true);
    try {
      await axios.post('/api/password/forgot-otp', { email: formData.email });
      toast.success('OTP sent to your email');
    } catch (e) {
      const msg = e.response?.data?.message || 'Failed to send OTP';
      toast.error(msg);
    } finally {
      setSendingOtp(false);
    }
  };

  const changePasswordWithOtp = async () => {
    if (!formData.email) {
      toast.error('Enter your email');
      return;
    }
    if (!otpCode) {
      toast.error('Enter the OTP');
      return;
    }
    if (!newPass || newPass.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (newPass !== confirmPass) {
      toast.error('Passwords do not match');
      return;
    }
    setChangingPwd(true);
    try {
      await axios.post('/api/password/reset-otp', { email: formData.email, otp: otpCode, newPassword: newPass });
      toast.success('Password changed. You can log in now');
      setShowForgot(false);
      setOtpCode('');
      setNewPass('');
      setConfirmPass('');
    } catch (e) {
      const msg = e.response?.data?.message || 'Failed to change password';
      toast.error(msg);
    } finally {
      setChangingPwd(false);
    }
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center py-10 sm:py-14 px-4 sm:px-6 overflow-hidden bg-[#F8E7C9]">
      {/* Background Animated Grid Texture */}
      <HeroGridBoxesAnimation />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-lg mx-auto"
      >
        <div className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-6 sm:p-9 md:p-10 text-[#064E3B] shadow-[0_12px_40px_rgba(6,78,59,0.08)]">
          {/* Card Header matching Home Page editorial styling */}
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-[11px] sm:text-xs font-bold tracking-[0.2em] text-[#064E3B]/70 uppercase mb-1.5">
              Claimant Portal
            </p>
            <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#064E3B] tracking-[-0.02em] leading-tight mb-1">
              Log in
            </h1>
            <p className="text-xs sm:text-sm text-[#064E3B]/70 font-sans">
              Welcome back, access your claim status
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-[#064E3B]/40" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 rounded-[8px] bg-white border border-[#064E3B]/20 text-[#064E3B] placeholder-[#064E3B]/35 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
              {serverErrors.filter(e => e.path === 'email').map((e, i) => (
                <p key={i} className="mt-1 text-xs text-red-600">{e.msg || e.message}</p>
              ))}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-[#064E3B]/40" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-9 pr-10 py-2.5 rounded-[8px] bg-white border border-[#064E3B]/20 text-[#064E3B] placeholder-[#064E3B]/35 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] transition-all duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#064E3B]/50 hover:text-[#064E3B]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {serverErrors.filter(e => e.path === 'password').map((e, i) => (
                <p key={i} className="mt-1 text-xs text-red-600">{e.msg || e.message}</p>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 accent-[#064E3B] text-[#064E3B] border-[#064E3B]/30 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs sm:text-sm text-[#064E3B]/80 cursor-pointer font-sans">
                  Remember me
                </label>
              </div>

              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={loading}
                className="text-xs sm:text-sm font-semibold text-[#064E3B] hover:underline underline-offset-2 cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3 sm:py-3.5 rounded-[8px] bg-[#064E3B] text-[#F8E7C9] text-base font-semibold hover:bg-[#043C2D] border border-[#043C2D] shadow-md shadow-[#064E3B]/20 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50 group"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#F8E7C9] border-t-transparent"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                <>
                  <span>Log in</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {showForgot && (
            <div className="mt-6 pt-5 border-t border-[#064E3B]/10 space-y-4">
              <div className="text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-[#064E3B]/70 mb-2">Reset Password</p>
                <label className="block text-xs sm:text-sm font-semibold text-[#064E3B] mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-[8px] bg-white border border-[#064E3B]/20 text-[#064E3B] placeholder-[#064E3B]/35 text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B]"
                  placeholder="Enter your email"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={sendingOtp}
                  className="px-4 py-2.5 rounded-[8px] bg-[#064E3B] text-[#F8E7C9] text-xs sm:text-sm font-semibold hover:bg-[#043C2D] disabled:opacity-50 transition-all shrink-0 cursor-pointer"
                >
                  {sendingOtp ? 'Sending...' : 'Send OTP'}
                </button>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-[8px] bg-white border border-[#064E3B]/20 text-[#064E3B] placeholder-[#064E3B]/35 text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B]"
                  placeholder="Enter OTP"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full pl-3 pr-9 py-2.5 rounded-[8px] bg-white border border-[#064E3B]/20 text-[#064E3B] placeholder-[#064E3B]/35 text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B]"
                    placeholder="New password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#064E3B]/50 hover:text-[#064E3B]"
                  >
                    {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    className="w-full pl-3 pr-9 py-2.5 rounded-[8px] bg-white border border-[#064E3B]/20 text-[#064E3B] placeholder-[#064E3B]/35 text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B]"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#064E3B]/50 hover:text-[#064E3B]"
                  >
                    {showConfirmPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={changePasswordWithOtp}
                disabled={changingPwd}
                className="w-full py-2.5 rounded-[8px] bg-[#064E3B] text-[#F8E7C9] text-sm font-semibold hover:bg-[#043C2D] disabled:opacity-50 transition-all cursor-pointer"
              >
                {changingPwd ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-[#064E3B]/10 text-center">
            <p className="text-xs sm:text-sm text-[#064E3B]/70 font-sans">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-[#064E3B] underline underline-offset-4 hover:text-[#043C2D] transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;