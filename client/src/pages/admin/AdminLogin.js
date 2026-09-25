import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { 
  Shield, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import HeroGridBoxesAnimation from '../../components/HeroGridBoxesAnimation';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);

  const { login, isAuthenticated, isBlocked } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isBlocked) {
      const blockTime = localStorage.getItem('adminBlockTime');
      if (blockTime) {
        const interval = setInterval(() => {
          const remaining = Math.max(0, parseInt(blockTime) - Date.now());
          setBlockTimeRemaining(remaining);
          
          if (remaining <= 0) {
            clearInterval(interval);
            setBlockTimeRemaining(0);
          }
        }, 1000);

        return () => clearInterval(interval);
      }
    }
  }, [isBlocked]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isBlocked) {
      toast.error('Account is temporarily blocked. Please wait.');
      return;
    }

    if (!credentials.username || !credentials.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      await login(credentials.username, credentials.password);
      toast.success('Login successful! Welcome to Admin Panel');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-center items-center py-10 sm:py-14 px-4 sm:px-6 overflow-hidden bg-[#F8E7C9] admin-scope">
      {/* Background Animated Grid Texture */}
      <HeroGridBoxesAnimation />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="inline-flex items-center justify-center mb-2"
          >
            <img src="/images/logo.png" alt="Aidessa Logo" className="h-12 sm:h-14 w-auto object-contain drop-shadow-sm" />
          </motion.div>
          <p className="text-xs sm:text-sm text-[#064E3B]/70 font-sans">
            Aidessa Administrative Access
          </p>
        </div>

        {/* Login Form Card matching Home page card identity */}
        <div className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-6 sm:p-9 text-[#064E3B] shadow-[0_12px_40px_rgba(6,78,59,0.08)]">
          {/* Security Blocked Status */}
          {isBlocked && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-[8px] text-red-800"
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                <div>
                  <p className="text-red-900 text-xs sm:text-sm font-semibold">Account Temporarily Blocked</p>
                  <p className="text-red-700 text-xs mt-0.5">
                    Try again in: {formatTime(blockTimeRemaining)}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-[#064E3B]/40" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={handleInputChange}
                  placeholder="Enter admin username"
                  disabled={isBlocked || isLoading}
                  className="w-full pl-9 pr-3 py-2.5 rounded-[8px] bg-white border border-[#064E3B]/20 text-[#064E3B] placeholder-[#064E3B]/35 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] transition-all duration-200 disabled:opacity-50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-[#064E3B]/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  placeholder="Enter admin password"
                  disabled={isBlocked || isLoading}
                  className="w-full pl-9 pr-10 py-2.5 rounded-[8px] bg-white border border-[#064E3B]/20 text-[#064E3B] placeholder-[#064E3B]/35 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] transition-all duration-200 disabled:opacity-50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#064E3B]/50 hover:text-[#064E3B] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isBlocked || isLoading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 rounded-[8px] bg-[#064E3B] text-[#F8E7C9] text-base font-semibold hover:bg-[#043C2D] border border-[#043C2D] shadow-md shadow-[#064E3B]/20 active:scale-95 transition-all duration-200 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#F8E7C9] border-t-transparent"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                'Sign In to Admin Panel'
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-5 border-t border-[#064E3B]/10">
            <div className="flex items-start gap-2.5 p-3 rounded-[8px] bg-[#064E3B]/[0.03] border border-[#064E3B]/10 text-left">
              <Shield className="w-4 h-4 text-[#064E3B] shrink-0 mt-0.5" />
              <div>
                <p className="text-[#064E3B] font-semibold text-xs uppercase tracking-wider">Security Notice</p>
                <p className="text-[#064E3B]/70 text-xs mt-0.5 leading-relaxed font-sans">
                  This is a secure administrative area. All access attempts are logged and monitored.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-[#064E3B]/60 font-sans">
            Aidessa Admin Panel v2.0 • Secure Access Portal
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;