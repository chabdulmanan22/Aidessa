import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Lock, ArrowLeft } from 'lucide-react';
import HeroGridBoxesAnimation from '../components/HeroGridBoxesAnimation';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    passwordConfirm: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirm) {
      return toast.error('Passwords do not match');
    }
    if (formData.password.length < 8) {
      return toast.error('Password must be at least 8 characters');
    }
    setLoading(true);
    try {
      const res = await axios.post(`/api/password/reset/${token}`, {
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
      });
      toast.success(res.data.message || 'Password reset successfully');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
    setLoading(false);
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] bg-[#F8E7C9] text-[#064E3B] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background Animated Grid Texture */}
      <HeroGridBoxesAnimation />

      <div className="relative z-10 max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-6 sm:p-8 text-[#064E3B] shadow-[0_16px_50px_rgba(6,78,59,0.08)] space-y-6"
        >
          {/* Header */}
          <div className="pb-4 border-b border-[#064E3B]/10 flex items-center gap-3">
            <div className="p-2.5 rounded-[8px] bg-[#064E3B]/[0.08] text-[#064E3B] border border-[#064E3B]/15 shrink-0">
              <Lock className="w-5 h-5 text-[#064E3B]" />
            </div>
            <div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-normal text-[#064E3B] leading-tight">
                Reset Password
              </h2>
              <p className="text-xs text-[#064E3B]/60 font-sans mt-0.5">
                Enter your new account password below
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 font-sans">
            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-[#064E3B]/20 rounded-[8px] text-sm text-[#064E3B] placeholder-[#064E3B]/35 focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] pr-10 transition-all"
                  placeholder="Enter new password"
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

            <div>
              <label htmlFor="passwordConfirm" className="block text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="passwordConfirm"
                  id="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-[#064E3B]/20 rounded-[8px] text-sm text-[#064E3B] placeholder-[#064E3B]/35 focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] pr-10 transition-all"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#064E3B]/50 hover:text-[#064E3B] cursor-pointer"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#064E3B] hover:bg-[#043C2D] text-[#F8E7C9] font-semibold text-sm rounded-[8px] border border-[#043C2D] shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#064E3B]/70 hover:text-[#064E3B] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;