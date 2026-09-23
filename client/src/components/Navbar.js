import React, { useState } from 'react';
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
    if (item.name === 'Home' && !user) return false;
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
        <div className="flex items-center justify-between h-16 overflow-visible flex-nowrap">
          <div className="flex items-center flex-shrink-0 pl-3 xs:pl-5 sm:pl-8 lg:pl-10">
            <Link to="/" onClick={() => setActiveTab('/')} className="flex items-center py-1 group ml-0.5 sm:ml-1" aria-label="Aidessa Home">
              <img
                src="/images/aidessa_logo.svg"
                alt="Aidessa"
                className="h-8 xs:h-9 sm:h-10 md:h-11 w-auto max-h-11 object-contain group-hover:scale-105 transition-transform duration-200"
              />
            </Link>
          </div>

          <div className="hidden md:flex flex-1 items-center justify-center space-x-6 min-w-0">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;

              // For protected routes when user is not logged in, redirect to login
              if (item.protected && !user) {
                return (
                  <Link
                    key={item.name}
                    to="/login"
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-[6px] transition-colors duration-200 text-[#064E3B]/80 hover:text-[#064E3B] hover:bg-[#EED5AF]/50 font-medium border border-transparent"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              }

              const isContact = item.name === 'Contact Us';
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-[6px] transition-colors duration-200 ${isActive(item.path)
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

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-3 flex-shrink-0">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-[6px] bg-[#FFFDF9] border border-[#064E3B]/20 hover:bg-[#EED5AF]/40 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-[#064E3B] rounded-full flex items-center justify-center">
                    <span className="text-[#F8E7C9] text-sm font-semibold">
                      {(user.fullName || user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim()).charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[#064E3B] font-medium">{user.fullName || user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim()}</span>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-[#FFFDF9] rounded-[6px] border border-[#064E3B]/20 shadow-md"
                    >
                      <div className="p-2">
                        <Link
                          to="/profile"
                          className="flex items-center space-x-2 px-3 py-2 rounded-[6px] text-[#064E3B] hover:bg-[#F8E7C9] transition-colors duration-200 font-medium"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User className="w-4 h-4 text-[#064E3B]" />
                          <span>Profile</span>
                        </Link>

                        {user.role === 'admin' && (
                          <>
                            <div className="border-t border-[#064E3B]/10 my-2"></div>
                            {adminItems.map((item) => {
                              const Icon = item.icon;
                              return (
                                <Link
                                  key={item.name}
                                  to={item.path}
                                  className="flex items-center space-x-2 px-3 py-2 rounded-[6px] text-[#064E3B] hover:bg-[#F8E7C9] transition-colors duration-200 font-medium"
                                  onClick={() => setIsProfileOpen(false)}
                                >
                                  <Icon className="w-4 h-4 text-[#064E3B]" />
                                  <span>{item.name}</span>
                                </Link>
                              );
                            })}
                          </>
                        )}

                        <div className="border-t border-[#064E3B]/10 my-2"></div>
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 px-3 py-2 rounded-[6px] text-red-700 hover:bg-red-50 transition-colors duration-200 w-full font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
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
                    to="/profile"
                    className="flex items-center space-x-2 px-3 py-2 rounded-[6px] text-[#064E3B] hover:bg-[#EED5AF]/50 transition-colors duration-200 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
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

    </nav>
  );
};

export default Navbar;
