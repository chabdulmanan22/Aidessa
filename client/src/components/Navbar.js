import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Home,
  BarChart3,
  Coins,
  Trophy,
  User,
  Settings,
  LogOut,
  Lock,
  Eye,
  EyeOff,
  ChevronDown,
  Shield,
  FileText,
  LogIn,
  Mail
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Reset password modal state
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleSendOtp = async () => {
    if (!resetEmail) {
      toast.error('Enter your email first');
      return;
    }
    setSendingOtp(true);
    try {
      await axios.post('/api/password/forgot-otp', { email: resetEmail });
      toast.success('OTP sent to your email');
    } catch (e) {
      const msg = e.response?.data?.message || 'Failed to send OTP';
      toast.error(msg);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleChangePasswordWithOtp = async () => {
    if (!resetEmail) {
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
      await axios.post('/api/password/reset-otp', { email: resetEmail, otp: otpCode, newPassword: newPass });
      toast.success('Password changed successfully');
      setShowResetPassword(false);
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

  const handleJoinNow = () => {
    try {
      const ref = localStorage.getItem('landingReferralCode');
      navigate(ref ? `/join-notice?ref=${encodeURIComponent(ref)}` : '/join-notice');
    } catch {
      navigate('/join-notice');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const logoPath = '/images/aidessa_logo.svg';

  // Sliding pill navigation state for guest links (Home, Contact Us, Login, Request a refund)
  const [activeTab, setActiveTab] = useState(() => {
    if (location.pathname.startsWith('/contact')) return '/contact';
    if (location.pathname.startsWith('/login')) return '/login';
    if (location.pathname.startsWith('/join')) return '/join-notice';
    return null;
  });
  const [hoveredTab, setHoveredTab] = useState(null);

  React.useEffect(() => {
    if (location.pathname.startsWith('/contact')) {
      setActiveTab('/contact');
    } else if (location.pathname.startsWith('/login')) {
      setActiveTab('/login');
    } else if (location.pathname.startsWith('/join')) {
      setActiveTab('/join-notice');
    }
  }, [location.pathname]);

  const guestNavLinks = [
    { id: '/', name: 'Home', path: '/', icon: Home, isAction: false },
    { id: '/contact', name: 'Contact Us', path: '/contact', icon: Mail, isAction: false },
    { id: '/login', name: 'Login', path: '/login', icon: LogIn, isAction: false },
    { id: '/join-notice', name: 'Request a refund', path: '/join-notice', isAction: true },
  ];

  const [canContribute, setCanContribute] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    const checkContributionStatus = async () => {
      try {
        const [activeRes, publicRes, roundRes] = await Promise.all([
          axios.get('/api/settings/contributionActive'),
          axios.get('/api/settings/publicContributionsEnabled'),
          axios.get('/api/settings/contributionRound')
        ]);

        const isActive = activeRes.data?.data?.value ?? true;
        const isPublic = publicRes.data?.data?.value === true;
        const round = roundRes.data?.data?.value;
        const nowMs = Date.now();
        const hasRound = Boolean(round && round.startTime && round.endTime && nowMs <= new Date(round.endTime).getTime());

        setCanContribute(isActive && (isPublic || hasRound));
      } catch (error) {
        // Silently fail, default to false
      }
    };

    checkContributionStatus();

    // Listen for updates via custom event if any
    const handleUpdate = () => checkContributionStatus();
    window.addEventListener('datastore:update', handleUpdate);
    return () => window.removeEventListener('datastore:update', handleUpdate);
  }, []);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Dashboard', path: '/dashboard', icon: BarChart3, protected: true },
    { name: 'Voting', path: '/voting', icon: BarChart3, protected: true },
    { name: 'Contribute', path: '/contribute', icon: Coins },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy, protected: true },
    { name: 'Referral', path: '/referral', icon: User, protected: true },
    { name: 'Contact Us', path: '/contact', icon: Mail },
  ];

  const filteredNavItems = navItems.filter(item => {
    if (item.name === 'Contribute') return canContribute;
    if (item.name === 'Home') return false;
    if (item.name === 'Contact Us' && !user) return false;
    if (item.protected && !user) return false;
    return true;
  });



  const adminItems = [
    { name: 'Admin Panel', path: '/admin', icon: Shield },
    { name: 'User Management', path: '/admin/users', icon: User },
    { name: 'Vote Management', path: '/admin/votes', icon: BarChart3 },
    { name: 'Contribution Management', path: '/admin/contributions', icon: Coins },
  ];

  const isActive = (path) => location.pathname === path;
  const isHome = location.pathname === '/';

  const navBgClass = isOpen
    ? 'bg-[#F8E7C9] border-b border-[#064E3B]/15 shadow-sm'
    : isHome
      ? (scrolled
          ? 'bg-[#F8E7C9]/95 backdrop-blur-md border-b border-[#064E3B]/15 shadow-sm'
          : 'bg-transparent border-b-0 shadow-none')
      : 'bg-[#F8E7C9]/95 backdrop-blur-md border-b border-[#064E3B]/15 shadow-sm';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBgClass}`}>
      <div className="w-full pl-0 pr-4 sm:pr-6 lg:pr-8">
        <div className="relative flex items-center justify-between h-16 overflow-visible flex-nowrap">
          {/* Logo (Left) */}
          <div className="flex items-center flex-shrink-0 pl-3 xs:pl-5 sm:pl-8 lg:pl-10">
            <Link to="/" onClick={() => setActiveTab('/')} className="flex items-center py-1 group ml-0.5 sm:ml-1" aria-label="Aidessa Home">
              <img
                src="/images/aidessa_logo.svg"
                alt="Aidessa"
                className="h-8 xs:h-9 sm:h-10 md:h-11 w-auto max-h-11 object-contain group-hover:scale-105 transition-transform duration-200"
              />
            </Link>
          </div>

          {/* Centered Navigation Links (Center-Oriented) */}
          {user ? (
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center space-x-3 lg:space-x-5 min-w-0">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-[6px] transition-colors duration-200 ${isActive(item.path)
                      ? 'bg-[#064E3B] text-[#F8E7C9] font-medium border border-[#043C2D] shadow-sm'
                      : 'text-[#064E3B] hover:text-[#043C2D] hover:bg-[#EED5AF]/50 font-medium border border-transparent'
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive(item.path) ? 'text-[#F8E7C9]' : 'text-[#064E3B]'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="hidden md:flex flex-1 items-center justify-center space-x-6 min-w-0" />
          )}

          {/* User Menu / Guest Links (Right Corner) */}
          <div className="hidden md:flex items-center space-x-3 flex-shrink-0">
            {user ? (
              <div 
                className="relative"
                onMouseEnter={() => setIsProfileOpen(true)}
                onMouseLeave={() => setIsProfileOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-1.5 py-1 focus:outline-none group cursor-pointer"
                  aria-label="User profile menu"
                >
                  {/* High Quality Profile Avatar */}
                  <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#064E3B] to-[#0d7256] p-[1.5px] shadow-sm group-hover:shadow-md transition-all group-hover:scale-105">
                    <div className="w-full h-full rounded-full bg-[#064E3B] flex items-center justify-center border border-[#F8E7C9]/25 text-[#F8E7C9] font-editorial text-base sm:text-lg font-normal">
                      {(user.firstName || user.fullName || user.name || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    {/* Active Status Indicator */}
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#FFFDF9]" />
                  </div>

                  {/* Dropdown Chevron Arrow */}
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-[#064E3B] transition-transform duration-200 ${
                      isProfileOpen ? 'rotate-180 text-[#043C2D]' : 'group-hover:translate-y-0.5'
                    }`}
                    strokeWidth={2.4}
                  />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 top-full mt-2 w-64 sm:w-72 bg-[#FFFDF9] rounded-[10px] border border-[#064E3B]/15 shadow-[0_16px_50px_rgba(6,78,59,0.12)] p-4 text-[#064E3B] z-50 font-sans"
                    >
                      {/* Top Header: User Name & Email */}
                      <div className="pb-3 border-b border-[#064E3B]/10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#064E3B] text-[#F8E7C9] flex items-center justify-center font-editorial text-lg font-normal shrink-0 border border-[#064E3B]/20">
                            {(user.firstName || user.fullName || user.name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-editorial text-lg sm:text-xl font-normal text-[#064E3B] truncate leading-tight">
                              {user.fullName || user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Demo User'}
                            </h4>
                            <p className="text-xs text-[#064E3B]/60 truncate font-sans mt-0.5">
                              {user.email || ''}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* 3 Main Options (From Bottom of Dashboard) */}
                      <div className="pt-2 space-y-1">
                        {/* 1. Edit Profile */}
                        <Link
                          to="/profile?edit=1"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 p-2.5 rounded-[8px] hover:bg-[#064E3B]/[0.05] transition-colors group cursor-pointer"
                        >
                          <div className="p-2 rounded-[6px] bg-[#064E3B]/[0.08] text-[#064E3B] group-hover:bg-[#064E3B] group-hover:text-[#F8E7C9] transition-colors">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm font-semibold text-[#064E3B] block">Edit Profile</span>
                            <span className="text-[11px] text-[#064E3B]/60 block">Update your personal information</span>
                          </div>
                        </Link>

                        {/* 2. Reset Password */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileOpen(false);
                            setResetEmail(user?.email || '');
                            setShowResetPassword(true);
                          }}
                          className="w-full flex items-center gap-3 p-2.5 rounded-[8px] hover:bg-[#064E3B]/[0.05] transition-colors text-left group cursor-pointer"
                        >
                          <div className="p-2 rounded-[6px] bg-[#064E3B]/[0.08] text-[#064E3B] group-hover:bg-[#064E3B] group-hover:text-[#F8E7C9] transition-colors">
                            <Lock className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm font-semibold text-[#064E3B] block">Reset Password</span>
                            <span className="text-[11px] text-[#064E3B]/60 block">Change your account password</span>
                          </div>
                        </button>

                        {/* Admin Portal link if user is admin */}
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 p-2.5 rounded-[8px] hover:bg-[#064E3B]/[0.05] transition-colors group cursor-pointer"
                          >
                            <div className="p-2 rounded-[6px] bg-[#064E3B]/[0.08] text-[#064E3B] group-hover:bg-[#064E3B] group-hover:text-[#F8E7C9] transition-colors">
                              <Shield className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs sm:text-sm font-semibold text-[#064E3B] block">Admin Portal</span>
                              <span className="text-[11px] text-[#064E3B]/60 block">Administrative dashboard</span>
                            </div>
                          </Link>
                        )}

                        <div className="border-t border-[#064E3B]/10 my-1 pt-1"></div>

                        {/* 3. Log Out */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-3 p-2.5 rounded-[8px] hover:bg-red-500/[0.08] transition-colors text-left group cursor-pointer"
                        >
                          <div className="p-2 rounded-[6px] bg-red-500/[0.1] text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                            <LogOut className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm font-semibold text-red-700 block">Log Out</span>
                            <span className="text-[11px] text-red-600/70 block">End your current session</span>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div
                className="relative flex items-center gap-1 sm:gap-1.5 p-1 rounded-[8px]"
                onMouseLeave={() => setHoveredTab(null)}
              >
                {guestNavLinks.map((item) => {
                  const isSelected = (hoveredTab !== null ? hoveredTab : activeTab) === item.id;
                  const Icon = item.icon;

                  const innerContent = (
                    <>
                      {isSelected && (
                        <motion.div
                          layoutId="nav-sliding-pill"
                          className="absolute inset-0 bg-[#064E3B] rounded-[6px] shadow-sm z-0"
                          transition={{
                            type: 'spring',
                            stiffness: 420,
                            damping: 32,
                            mass: 0.7
                          }}
                        />
                      )}
                      <span className={`relative z-10 flex items-center space-x-1.5 transition-colors duration-200 ${
                        isSelected ? 'text-[#F8E7C9]' : 'text-[#064E3B] hover:text-[#043C2D]'
                      }`}>
                        {Icon && <Icon className="w-4 h-4" />}
                        <span className="font-medium whitespace-nowrap">{item.name}</span>
                      </span>
                    </>
                  );

                  if (item.isAction) {
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onMouseEnter={() => setHoveredTab(item.id)}
                        onClick={() => {
                          setActiveTab(item.id);
                          handleJoinNow();
                        }}
                        className="relative px-3.5 py-2 rounded-[6px] text-sm font-medium transition-colors cursor-pointer select-none border border-transparent"
                      >
                        {innerContent}
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      onMouseEnter={() => setHoveredTab(item.id)}
                      onClick={() => setActiveTab(item.id)}
                      className="relative px-3.5 py-2 rounded-[6px] text-sm font-medium transition-colors cursor-pointer select-none border border-transparent"
                    >
                      {innerContent}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>




          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#064E3B] hover:text-[#043C2D] p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#F8E7C9] border-t border-[#064E3B]/20 max-h-[calc(100vh-4rem)] overflow-y-auto"
          >
            <div className="px-4 py-4 pb-6 space-y-2">
              {!user && (
                <>
                  <Link
                    to="/"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-[6px] transition-colors duration-200 ${
                      isActive('/')
                        ? 'bg-[#064E3B] text-[#F8E7C9] font-medium border border-[#043C2D] shadow-sm'
                        : 'text-[#064E3B] hover:bg-[#EED5AF]/50 font-medium'
                    }`}
                    onClick={() => {
                      setActiveTab('/');
                      setIsOpen(false);
                    }}
                  >
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </Link>
                  <Link
                    to="/contact"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-[6px] transition-colors duration-200 ${
                      isActive('/contact')
                        ? 'bg-[#064E3B] text-[#F8E7C9] font-medium border border-[#043C2D] shadow-sm'
                        : 'text-[#064E3B] hover:bg-[#EED5AF]/50 font-medium'
                    }`}
                    onClick={() => {
                      setActiveTab('/contact');
                      setIsOpen(false);
                    }}
                  >
                    <Mail className="w-4 h-4" />
                    <span>Contact Us</span>
                  </Link>
                </>
              )}

              {filteredNavItems.map((item) => {
                const Icon = item.icon;

                // For protected routes when user is not logged in, redirect to login
                if (item.protected && !user) {
                  return (
                    <Link
                      key={item.name}
                      to="/login"
                      className="flex items-center space-x-2 px-3 py-2 rounded-[6px] transition-colors duration-200 text-[#064E3B]/80 hover:bg-[#EED5AF]/50 font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-[6px] transition-colors duration-200 ${isActive(item.path)
                      ? 'bg-[#064E3B] text-[#F8E7C9] font-medium border border-[#043C2D] shadow-sm'
                      : 'text-[#064E3B] hover:bg-[#EED5AF]/50 font-medium'
                      }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {user && user.role === 'admin' && (
                <>
                  <div className="border-t border-[#064E3B]/10 my-2"></div>
                  {adminItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        className="flex items-center space-x-2 px-3 py-2 rounded-[6px] text-[#064E3B] hover:bg-[#EED5AF]/50 transition-colors duration-200 font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </>
              )}

              {user ? (
                <>
                  <div className="border-t border-[#064E3B]/10 my-2"></div>
                  <Link
                    to="/profile?edit=1"
                    className="flex items-center space-x-2 px-3 py-2 rounded-[6px] text-[#064E3B] hover:bg-[#EED5AF]/50 transition-colors duration-200 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setResetEmail(user?.email || '');
                      setShowResetPassword(true);
                    }}
                    className="flex items-center space-x-2 px-3 py-2 rounded-[6px] text-[#064E3B] hover:bg-[#EED5AF]/50 transition-colors duration-200 font-medium w-full text-left"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Reset Password</span>
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-2 px-3 py-2 rounded-[6px] text-red-700 hover:bg-red-50 transition-colors duration-200 w-full font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="border-t border-[#064E3B]/10 my-2"></div>
                  <Link
                    to="/login"
                    className="flex items-center space-x-2 px-3 py-2 rounded-[6px] text-[#064E3B] hover:bg-[#EED5AF]/50 transition-colors duration-200 font-medium"
                    onClick={() => {
                      setActiveTab('/login');
                      setIsOpen(false);
                    }}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                  <button
                    onClick={() => {
                      setActiveTab('/join-notice');
                      handleJoinNow();
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-center space-x-2 px-3 py-3 rounded-[6px] bg-[#064E3B] text-[#F8E7C9] font-medium hover:bg-[#043C2D] border border-[#043C2D] transition-colors duration-200 w-full shadow-sm cursor-pointer"
                  >
                    <span>Request a refund</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Password Modal */}
      {showResetPassword && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 bg-[#064E3B]/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 font-sans"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowResetPassword(false);
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/20 p-6 sm:p-8 w-full max-w-md text-[#064E3B] shadow-[0_24px_60px_rgba(6,78,59,0.22)] space-y-5 relative my-auto"
          >
            <div className="pb-3 border-b border-[#064E3B]/10 flex items-center justify-between">
              <div>
                <h2 className="font-editorial text-2xl sm:text-3xl font-normal text-[#064E3B]">Reset Password</h2>
                <p className="text-xs text-[#064E3B]/60 mt-0.5">Enter your email and OTP to update your password</p>
              </div>
              <button 
                type="button"
                onClick={() => setShowResetPassword(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#064E3B]/50 hover:text-[#064E3B] hover:bg-[#064E3B]/10 transition-colors text-lg font-bold cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-[#064E3B]/20 rounded-[8px] text-sm text-[#064E3B] placeholder-[#064E3B]/35 focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] transition-all"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5">Verification Code</label>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp}
                    className="px-4 py-2.5 rounded-[8px] bg-[#064E3B] text-[#F8E7C9] text-xs sm:text-sm font-semibold hover:bg-[#043C2D] disabled:opacity-50 shrink-0 cursor-pointer shadow-sm transition-all"
                  >
                    {sendingOtp ? 'Sending...' : 'Send OTP'}
                  </button>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-white border border-[#064E3B]/20 rounded-[8px] text-sm text-[#064E3B] placeholder-[#064E3B]/35 focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] transition-all"
                    placeholder="Enter 6-digit OTP"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5">New Password</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#064E3B]/20 rounded-[8px] text-sm text-[#064E3B] placeholder-[#064E3B]/35 focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 pr-9 transition-all"
                      placeholder="New password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#064E3B]/50 hover:text-[#064E3B] cursor-pointer"
                    >
                      {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showConfirmPass ? 'text' : 'password'}
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#064E3B]/20 rounded-[8px] text-sm text-[#064E3B] placeholder-[#064E3B]/35 focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 pr-9 transition-all"
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#064E3B]/50 hover:text-[#064E3B] cursor-pointer"
                    >
                      {showConfirmPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleChangePasswordWithOtp}
                  disabled={changingPwd}
                  className="w-full py-2.5 bg-[#064E3B] hover:bg-[#043C2D] text-[#F8E7C9] font-semibold text-sm rounded-[8px] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {changingPwd ? 'Changing...' : 'Change Password'}
                </button>
              </div>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setShowResetPassword(false)}
                  className="text-xs font-semibold text-[#064E3B]/60 hover:text-[#064E3B] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>,
        document.body
      )}
    </nav>
  );
};

export default Navbar;
