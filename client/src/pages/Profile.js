import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  Award, 
  Edit3, 
  Save, 
  X,
  Shield,
  MapPin,
  Phone,
  Wallet,
  Send
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import HeroGridBoxesAnimation from '../components/HeroGridBoxesAnimation';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    name: (user?.fullName || user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim()),
    email: user?.email || '',
    username: user?.username || (user?.email ? String(user.email).split('@')[0] : ''),
    address: user?.address || '',
    telegramUsername: user?.telegramUsername || '',
    phoneNumber: user?.phoneNumber || '',
    walletAddress: user?.walletAddress || ''
  });

  useEffect(() => {
    const syncFromAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/auth/me', token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
        const u = res.data?.data?.user || user;
        if (u) {
          setFormData({
            firstName: u.firstName || '',
            lastName: u.lastName || '',
            name: (u.fullName || u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim()),
            email: u.email || '',
            username: u.username || (u.email ? String(u.email).split('@')[0] : ''),
            address: u.address || '',
            telegramUsername: u.telegramUsername || '',
            phoneNumber: u.phoneNumber || '',
            walletAddress: u.walletAddress || ''
          });
        }
      } catch {
        if (user) {
          setFormData({
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            name: (user?.fullName || user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim()),
            email: user?.email || '',
            username: user?.username || (user?.email ? String(user.email).split('@')[0] : ''),
            address: user?.address || '',
            telegramUsername: user?.telegramUsername || '',
            phoneNumber: user?.phoneNumber || '',
            walletAddress: user?.walletAddress || ''
          });
        }
      }
    };
    syncFromAuth();
  }, [user]);

  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      if (params.get('edit')) {
        setIsEditing(true);
      }
    } catch (_) {}
  }, [location.search]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {};
      const cleaned = {
        firstName: (formData.firstName || '').trim(),
        lastName: (formData.lastName || '').trim(),
        email: (formData.email || '').trim(),
        username: (formData.username || '').trim(),
        address: (formData.address || '').trim(),
        telegramUsername: (formData.telegramUsername || '').trim().replace(/^@+/, '').replace(/\s+/g, '_'),
        phoneNumber: (formData.phoneNumber || '').trim(),
        walletAddress: (formData.walletAddress || '').trim()
      };

      const errors = [];
      if (cleaned.firstName && cleaned.firstName.length < 2) errors.push('First name must be at least 2 characters');
      if (cleaned.lastName && cleaned.lastName.length < 2) errors.push('Last name must be at least 2 characters');
      if (cleaned.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned.email)) errors.push('Enter a valid email');
      if (cleaned.username && !/^[a-zA-Z0-9_]{3,32}$/.test(cleaned.username)) errors.push('Username must be 3-32 characters');
      if (cleaned.telegramUsername && !/^[a-zA-Z0-9_]{3,32}$/.test(cleaned.telegramUsername)) errors.push('Telegram username must be 3-32 characters (letters, numbers, underscore)');
      if (cleaned.phoneNumber && !/^\+?[0-9\s\-().]{7,20}$/.test(cleaned.phoneNumber)) errors.push('Phone number must be 7-20 digits and may include +, spaces, dashes, parentheses, dots');
      if (cleaned.walletAddress && cleaned.walletAddress.length < 10) errors.push('Wallet address must be at least 10 characters');
      if (errors.length) {
        toast.error(errors[0]);
        return;
      }

      Object.entries(cleaned).forEach(([k, v]) => { if (v) payload[k] = v; });
      const token = localStorage.getItem('token');
      if (token && token.startsWith('placeholder-token-')) {
        const localUpdated = { ...user, ...payload };
        updateUser(localUpdated);
        localStorage.setItem('user', JSON.stringify(localUpdated));
        try { window.dispatchEvent(new Event('datastore:update')); } catch (_) {}
        setIsEditing(false);
        toast.success('Profile updated successfully');
        return;
      }

      const response = await axios.put('/api/auth/profile', payload, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
      const updated = response.data?.data?.user || response.data?.user;
      if (updated) {
        updateUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
      }
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      const serverMsg = error.response?.data?.message;
      const firstDetail = Array.isArray(error.response?.data?.errors) && error.response.data.errors[0]?.msg;
      toast.error(firstDetail || serverMsg || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      name: (user?.fullName || user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim()),
      email: user?.email || '',
      username: user?.username || (user?.email ? String(user.email).split('@')[0] : ''),
      address: user?.address || '',
      telegramUsername: user?.telegramUsername || '',
      phoneNumber: user?.phoneNumber || '',
      walletAddress: user?.walletAddress || ''
    });
    setIsEditing(false);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'from-emerald-600 to-teal-700';
      case 'moderator':
        return 'from-teal-500 to-emerald-600';
      default:
        return 'from-[#085464] to-[#059669]';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return Shield;
      case 'moderator':
        return Award;
      default:
        return User;
    }
  };

  if (!user) {
    return (
      <div className="relative w-full min-h-screen bg-[#F8E7C9] flex items-center justify-center overflow-hidden">
        <HeroGridBoxesAnimation />
        <div className="relative z-10 font-editorial text-2xl text-[#064E3B]">Loading profile...</div>
      </div>
    );
  }

  const RoleIcon = getRoleIcon(user.role);

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] bg-[#F8E7C9] text-[#064E3B] py-8 sm:py-12 overflow-hidden">
      {/* Persistent Animated Grid Texture */}
      <HeroGridBoxesAnimation />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
        >
          <div>
            <div className="flex items-center gap-3">
              <User className="w-8 h-8 text-[#064E3B]" />
              <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-[#064E3B] tracking-[-0.02em]">
                {isEditing ? 'Edit Profile' : 'User Profile'}
              </h1>
            </div>
            <p className="text-[#064E3B]/70 text-sm sm:text-base font-sans mt-1">
              Manage your personal credentials, communication handles, and address details.
            </p>
          </div>
        </motion.div>

        {/* Profile Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-6 sm:p-8 text-[#064E3B] shadow-[0_8px_30px_rgba(6,78,59,0.06)]"
        >
          {/* Top Avatar & Overview Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[#064E3B]/10">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#064E3B] text-[#F8E7C9] rounded-full flex items-center justify-center border-2 border-[#064E3B]/20 shadow-sm font-editorial text-3xl sm:text-4xl font-normal shrink-0">
                  {(user.fullName || user.name || user.firstName || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#064E3B] text-[#F8E7C9] rounded-full flex items-center justify-center border-2 border-[#FFFDF9] shadow-xs">
                  <RoleIcon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <h2 className="font-editorial text-2xl sm:text-3xl font-normal text-[#064E3B] leading-tight">
                  {user.fullName || user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Beneficiary User'}
                </h2>
                <p className="text-[#064E3B]/60 text-xs sm:text-sm font-sans mt-0.5">
                  {user.email}
                </p>
                <div className="mt-2.5 flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#064E3B]/[0.08] text-[#064E3B] border border-[#064E3B]/15 capitalize font-sans">
                    <RoleIcon className="w-3 h-3 mr-1" />
                    {user.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : 'Beneficiary'}
                  </span>
                  <span className="text-[11px] text-[#064E3B]/50 font-sans">
                    Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-5 py-2.5 rounded-[8px] bg-[#064E3B] hover:bg-[#043C2D] text-[#F8E7C9] font-semibold text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {/* View Mode Details */}
          {!isEditing && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
              <div className="rounded-[8px] bg-[#064E3B]/[0.02] border border-[#064E3B]/10 p-4">
                <span className="text-[11px] font-bold text-[#064E3B]/60 uppercase tracking-wider block font-sans">Email Address</span>
                <span className="text-sm font-semibold text-[#064E3B] font-sans mt-1 block break-all">{user.email || '—'}</span>
              </div>
              <div className="rounded-[8px] bg-[#064E3B]/[0.02] border border-[#064E3B]/10 p-4">
                <span className="text-[11px] font-bold text-[#064E3B]/60 uppercase tracking-wider block font-sans">Username</span>
                <span className="text-sm font-semibold text-[#064E3B] font-sans mt-1 block">{user.username || (user.email ? String(user.email).split('@')[0] : '—')}</span>
              </div>
              <div className="rounded-[8px] bg-[#064E3B]/[0.02] border border-[#064E3B]/10 p-4">
                <span className="text-[11px] font-bold text-[#064E3B]/60 uppercase tracking-wider block font-sans">Telegram Username</span>
                <span className="text-sm font-semibold text-[#064E3B] font-sans mt-1 block">{user.telegramUsername ? `@${user.telegramUsername}` : '—'}</span>
              </div>
              <div className="rounded-[8px] bg-[#064E3B]/[0.02] border border-[#064E3B]/10 p-4">
                <span className="text-[11px] font-bold text-[#064E3B]/60 uppercase tracking-wider block font-sans">Phone Number</span>
                <span className="text-sm font-semibold text-[#064E3B] font-sans mt-1 block">{user.phoneNumber || '—'}</span>
              </div>
              <div className="rounded-[8px] bg-[#064E3B]/[0.02] border border-[#064E3B]/10 p-4 sm:col-span-2">
                <span className="text-[11px] font-bold text-[#064E3B]/60 uppercase tracking-wider block font-sans">Address</span>
                <span className="text-sm font-semibold text-[#064E3B] font-sans mt-1 block">{user.address || '—'}</span>
              </div>
              <div className="rounded-[8px] bg-[#064E3B]/[0.02] border border-[#064E3B]/10 p-4 sm:col-span-2">
                <span className="text-[11px] font-bold text-[#064E3B]/60 uppercase tracking-wider block font-sans">Wallet Address</span>
                <span className="text-sm font-mono font-semibold text-[#064E3B] mt-1 block break-all">{user.walletAddress || '—'}</span>
              </div>
            </div>
          )}

          {/* Edit Form */}
          {isEditing && (
            <div className="pt-6">
              <div className="pb-4 mb-6 border-b border-[#064E3B]/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-[#064E3B]" />
                  <h3 className="font-editorial text-2xl font-normal text-[#064E3B]">
                    Edit Profile Information
                  </h3>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#064E3B]/60 font-sans hidden sm:inline-block">
                  Update Details
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 font-sans">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5 font-sans">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#064E3B]/20 rounded-[8px] text-sm text-[#064E3B] placeholder-[#064E3B]/35 focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] transition-all font-sans"
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5 font-sans">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#064E3B]/20 rounded-[8px] text-sm text-[#064E3B] placeholder-[#064E3B]/35 focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] transition-all font-sans"
                    placeholder="Last Name"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5 font-sans">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#064E3B]/20 rounded-[8px] text-sm text-[#064E3B] placeholder-[#064E3B]/35 focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] transition-all font-sans"
                    placeholder="Email"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5 font-sans">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#064E3B]/20 rounded-[8px] text-sm text-[#064E3B] placeholder-[#064E3B]/35 focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] transition-all font-sans"
                    placeholder="Username"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5 font-sans">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#064E3B]/20 rounded-[8px] text-sm text-[#064E3B] placeholder-[#064E3B]/35 focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] transition-all font-sans"
                    placeholder="Address"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5 font-sans">Telegram Username</label>
                  <input
                    type="text"
                    value={formData.telegramUsername}
                    onChange={(e) => setFormData({ ...formData, telegramUsername: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#064E3B]/20 rounded-[8px] text-sm text-[#064E3B] placeholder-[#064E3B]/35 focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] transition-all font-sans"
                    placeholder="Telegram Username"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5 font-sans">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#064E3B]/20 rounded-[8px] text-sm text-[#064E3B] placeholder-[#064E3B]/35 focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] transition-all font-sans"
                    placeholder="Phone Number"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5 font-sans">Wallet Address</label>
                  <input
                    type="text"
                    value={formData.walletAddress}
                    onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#064E3B]/20 rounded-[8px] text-sm text-[#064E3B] placeholder-[#064E3B]/35 focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] transition-all font-mono"
                    placeholder="Wallet Address"
                  />
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center justify-end space-x-3 pt-6 mt-6 border-t border-[#064E3B]/10">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-5 py-2.5 rounded-[8px] bg-white hover:bg-[#064E3B]/[0.04] border border-[#064E3B]/20 text-[#064E3B] font-semibold text-xs sm:text-sm transition-colors cursor-pointer flex items-center space-x-1.5"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-[8px] bg-[#064E3B] hover:bg-[#043C2D] text-[#F8E7C9] font-semibold text-xs sm:text-sm transition-colors shadow-sm disabled:opacity-50 cursor-pointer flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;

