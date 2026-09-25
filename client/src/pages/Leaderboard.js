import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Medal,
  Crown,
  TrendingUp,
  Users,
  Award,
  Star,
  Target,
  Calendar,
  Filter,
  Search,
  ChevronUp,
  ChevronDown,
  User,
  Coins,
  Vote
} from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { getUsersList, getUserMeta, getReceipts } from '../utils/datastore';
import toast from 'react-hot-toast';
import HeroGridBoxesAnimation from '../components/HeroGridBoxesAnimation';


let _cachedLeaderboard = null;
let _cachedStats = {
  totalUsers: 13780,
  activeUsers: 11713,
  totalPoints: 0,
  averagePoints: 0
};
let _cachedUserRank = null;

const Leaderboard = () => {
  const { user } = useContext(AuthContext);
  const [leaderboard, setLeaderboard] = useState(_cachedLeaderboard || []);
  const [userRank, setUserRank] = useState(_cachedUserRank || null);
  const [loading, setLoading] = useState(false);
  const [timeframe, setTimeframe] = useState('all');
  const [baseUserCount, setBaseUserCount] = useState(13780);
  const [category, setCategory] = useState('total');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState(_cachedStats);
  const fetchingRef = useRef(false);
  const lastFetchRef = useRef(0);

  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe, category, currentPage]);

  // Real-time updates disabled for ranks

  const fetchLeaderboard = async () => {
    try {
      if (fetchingRef.current) return;
      fetchingRef.current = true;


      // Fetch base user count setting
      try {
        const baseRes = await axios.get('/api/settings/BASE_USER_COUNT');
        if (baseRes.data?.success && baseRes.data?.data?.value) {
          setBaseUserCount(Number(baseRes.data.data.value));
        }
      } catch (e) { }

      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const typeParam = category === 'contributions' ? 'contributions' : category;
      const res = await axios.get('/api/users/leaderboard', { params: { limit: 50, type: typeParam }, headers: token ? { Authorization: `Bearer ${token}` } : undefined });
      const rawList = res?.data?.data?.users || res?.data?.data?.leaderboard || [];
      const apiList = rawList.filter(u => u.role !== 'admin' && u.email !== 'support@veritasaid.com');
      let data = apiList.map(u => ({
        _id: u._id || u.email,
        username: (u.email || '').split('@')[0],
        firstName: u.firstName || ((u.email || '').split('@')[0]),
        lastName: u.lastName || '',
        email: u.email,
        role: u.role,
        points: {
          total: u.points || 0,
          voting: u.stats?.votingPoints || 0,
          contributions: u.stats?.contributionPoints || 0,
        },
        stats: {
          totalVotes: u.stats?.totalVotes || 0,
          totalContributions: u.stats?.totalContributions || 0,
        },
        createdAt: u.createdAt || new Date().toISOString(),
        lastActivity: u.lastLogin || u.updatedAt || u.createdAt || new Date().toISOString(),
        profileImage: null,
        fullName: u.fullName || `${u.firstName || ''} ${u.lastName || ''}`.trim() || (u.email || '').split('@')[0],
        badges: [],
        rank: u.rank,
        rankOverride: u.overrides?.rankOverride,
      }));

      // Sync current user points with dashboard state
      if (user && user.email) {
        data = data.map(u => {
          if (u.email === user.email) {
            return {
              ...u,
              points: {
                total: user.points || 0,
                voting: user.stats?.votingPoints || 0,
                contributions: user.stats?.contributionPoints || 0,
              }
            };
          }
          return u;
        });
      }

      // Ensure the current user is in 'data' even if not returned by API
      if (user && user.email && !data.find((u) => u.email === user.email)) {
        data.push({
          _id: user._id || user.email,
          username: (user.email || '').split('@')[0],
          firstName: user.firstName || user.name || 'You',
          lastName: user.lastName || '',
          email: user.email,
          points: {
            total: user.points || 0,
            voting: user.stats?.votingPoints || 0,
            contributions: user.stats?.contributionPoints || 0,
          },
          stats: {
            totalVotes: user.stats?.totalVotes || 0,
            totalContributions: user.stats?.totalContributions || 0,
          },
          createdAt: user.createdAt || new Date().toISOString(),
          fullName: user.fullName || user.name || (user.email || '').split('@')[0],
          badges: [],
          overrides: user.overrides || {},
        });
      }

      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        data = data.filter(
          (u) =>
            (u.username || '').toLowerCase().includes(term) ||
            (u.fullName || '').toLowerCase().includes(term) ||
            (u.email || '').toLowerCase().includes(term)
        );
      }

      // Sort by selected category points (desc)
      const getCat = (ud) => {
        if (!ud.points) return 0;
        switch (category) {
          case 'voting':
            return ud.points.voting || 0;
          case 'contributions':
            return ud.points.contributions || 0;
          case 'total':
          default:
            return ud.points.total || 0;
        }
      };

      data.sort((a, b) => getCat(b) - getCat(a));

      // Display rank matching 1, 2, 3, 4, 5, 6, 7, 8, 9, 10...
      data = data.map((u, i) => {
        u.displayRank = u.rankOverride !== undefined ? u.rankOverride : (u.rank || (i + 1));
        return u;
      });

      setLeaderboard(data);
      setTotalPages(1);

      const totalUsers = res?.data?.data?.totalUsers || baseUserCount || 6000;
      const totalPoints = data.reduce((sum, u) => sum + (u.points?.total || 0), 0);
      const activeUsersBase = res?.data?.data?.activeUsers || Math.floor(totalUsers * 0.85);
      const averagePoints = data.length > 0 ? Math.round(totalPoints / data.length) : 0;

      const newStats = {
        totalUsers,
        activeUsers: activeUsersBase,
        totalPoints,
        averagePoints,
      };
      setStats(newStats);

      _cachedLeaderboard = data;
      _cachedStats = newStats;

      // Current user rank: use user.rank from auth context (/me endpoint) for consistency
      if (user && (user.email || user._id)) {
        const rankIndex = data.findIndex(u =>
          (user.email && u.email === user.email) ||
          (user._id && String(u._id) === String(user._id))
        );
        const authRank = user.rank;
        if (rankIndex !== -1) {
          const ud = data[rankIndex];
          const displayRank = ud.displayRank || authRank || (rankIndex + 1);
          const userRankObj = { position: displayRank, displayRank, user: ud, hardRank: displayRank };
          setUserRank(userRankObj);
          _cachedUserRank = userRankObj;
        } else {
          // User not in current page but we still know their rank from /me
          const userRankObj = authRank ? { position: authRank, displayRank: authRank, user: null, hardRank: authRank } : null;
          setUserRank(userRankObj);
          _cachedUserRank = userRankObj;
        }
      } else {
        setUserRank(null);
        _cachedUserRank = null;
      }


    } catch (error) {
      try {
        const users = getUsersList();
        const receipts = getReceipts();
        let data = users.map(u => {
          const meta = getUserMeta(u.email);
          const userReceipts = receipts.filter(r => r.userEmail === u.email);
          return {
            _id: u.email,
            username: (u.email || '').split('@')[0],
            firstName: u.name || (u.email || '').split('@')[0],
            lastName: '',
            email: u.email,
            role: u.role || 'user',
            points: {
              total: meta.points || 0,
              voting: meta.pointsVoting || 0,
              contributions: meta.pointsContribution || 0,
            },
            stats: {
              totalVotes: meta.votesUsed || 0,
              totalContributions: userReceipts.length || 0,
            },
            createdAt: u.createdAt || new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            profileImage: null,
            fullName: u.name || (u.email || '').split('@')[0],
            badges: [],
          };
        });

        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          data = data.filter(user =>
            (user.username || '').toLowerCase().includes(term) ||
            (user.fullName || '').toLowerCase().includes(term)
          );
        }

        // Add 13780 anonymous users
        const mockUsers = Array.from({ length: 13780 }, (_, i) => ({
          _id: `mock_${i}`,
          username: `anon_${Math.floor(Math.random() * 100000) + 10000}`,
          firstName: `Anonymous`,
          lastName: ``,
          email: `hidden@user.local`,
          role: 'user',
          points: {
            total: 0,
            voting: 0,
            contributions: 0,
          },
          stats: {
            totalVotes: 0,
            totalContributions: 0,
          },
          createdAt: new Date().toISOString(),
          lastActivity: new Date().toISOString(),
          profileImage: null,
          fullName: `Anonymous User`,
          badges: [],
        }));

        data = [...data, ...mockUsers];

        // Sync current user points with dashboard state (Offline mode)
        if (user && user.email) {
          data = data.map(u => {
            if (u.email === user.email || (user._id && u._id === user._id)) {
              return {
                ...u,
                points: {
                  total: user.points || 0,
                  voting: user.stats?.votingPoints || 0,
                  contributions: user.stats?.contributionPoints || 0,
                }
              };
            }
            return u;
          });
        }

        const sortByCategory = (a, b) => {
          const getCat = (ud) => {
            switch (category) {
              case 'voting': return ud.points?.voting || 0;
              case 'contributions': return ud.points?.contributions || 0;
              case 'total':
              default: return ud.points?.total || 0;
            }
          };
          const valB = getCat(b);
          const valA = getCat(a);
          if (valB !== valA) return valB - valA;
          if (String(a._id).startsWith('mock_')) return 1;
          if (String(b._id).startsWith('mock_')) return -1;
          return 0;
        };
        data.sort(sortByCategory);

        // Restricted to Top 10 Elite only
        const top10Data = data.slice(0, 10);

        setLeaderboard(top10Data);
        setTotalPages(1);
        const actualDbTotal = users.length;
        const totalUsers = actualDbTotal + 13780;
        const totalPoints = data.reduce((sum, u) => sum + (u.points?.total || 0), 0);
        const activeUsers = Math.floor(totalUsers * 0.85);
        const averagePoints = actualDbTotal > 0 ? Math.round(totalPoints / actualDbTotal) : 0;
        setStats({ totalUsers, activeUsers, totalPoints, averagePoints });

        if (user?.email) {
          const rankIndex = data.findIndex(u => u.email === user.email || (user._id && u._id === user._id));
          if (rankIndex !== -1) {
            setUserRank({ position: 5000 + rankIndex, displayRank: 5000 + rankIndex, user: data[rankIndex] });
          } else {
            setUserRank(null);
          }
        } else {
          setUserRank(null);
        }
      } catch (err2) {
        console.error('Fetch leaderboard error (offline fallback):', error, err2);
        toast.error('Failed to load leaderboard. Showing Top 10 from local data.');
        setLeaderboard([]);
        setStats({ totalUsers: 13780, activeUsers: 11713, totalPoints: 0, averagePoints: 0 });
        setUserRank(null);
      }
    } finally {
      lastFetchRef.current = Date.now();
      fetchingRef.current = false;
      setLoading(false);
    }
  };

  const getRankIcon = (data_or_pos, isPersonal = false) => {
    // If it's a number (used for Champion/Silver/Bronze icons in layout)
    if (typeof data_or_pos === 'number') {
      const pos = data_or_pos;
      switch (pos) {
        case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
        case 2: return <Medal className="w-6 h-6 text-gray-400" />;
        case 3: return <Trophy className="w-6 h-6 text-orange-500" />;
        default: return <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm font-bold">{pos}</div>;
      }
    }
    // If it's the full user object
    const u = data_or_pos;
    const disp = u.displayRank;
    const actualPos = leaderboard.findIndex(l => l._id === u._id) + 1;

    // For Top 10 list, we hide the server badge unless it's the personal section header
    if (!isPersonal) {
      if (actualPos >= 1 && actualPos <= 3) {
        return getRankIcon(actualPos);
      }
      if (actualPos > 3 && actualPos <= 10) {
        return null;
      }
    }

    return (
      <div className="min-w-[4.5rem] h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-gray-300 text-xs font-bold px-3 text-center whitespace-nowrap">
        #{disp}
      </div>
    );
  };

  const getRankColor = (position) => {
    switch (position) {
      case 1:
        return 'from-yellow-500 to-yellow-600';
      case 2:
        return 'from-gray-400 to-gray-500';
      case 3:
        return 'from-orange-500 to-orange-600';
      default:
        return 'from-[#086a7e] to-[#0ea5e9]';
    }
  };

  const HardRankCircle = ({ rank, displayRank, position }) => {
    const val = displayRank || rank;
    const isTop1 = position === 1;
    const isTop2 = position === 2;
    const isTop3 = position === 3;
    const colorClass = isTop1
      ? 'bg-amber-500/15 border-amber-500/35 text-amber-800'
      : isTop2
      ? 'bg-slate-400/20 border-slate-400/35 text-slate-700'
      : isTop3
      ? 'bg-orange-500/15 border-orange-500/35 text-orange-800'
      : 'bg-[#064E3B]/[0.06] border-[#064E3B]/15 text-[#064E3B]';

    return (
      <div className={`min-w-[3.25rem] px-2.5 py-1 rounded-[6px] border flex items-center justify-center font-mono font-bold text-xs shadow-xs shrink-0 whitespace-nowrap ${colorClass}`}>
        #{val}
      </div>
    );
  };

  const getPointsForCategory = (userData, cat) => {
    switch (cat) {
      case 'voting':
        return userData.points?.voting || 0;
      case 'contributions':
        return userData.points?.contributions || 0;
      case 'total':
      default:
        return userData.points?.total || 0;
    }
  };

  const LeaderboardCard = ({ userData, position, hardRank, isCurrentUser = false, isPersonal = false }) => {
    const maxPts = leaderboard.length > 0 ? getPointsForCategory(leaderboard[0], category) : 1;
    const currPts = getPointsForCategory(userData, category);
    const progressPct = maxPts > 0 ? Math.min(100, (currPts / maxPts) * 100) : 0;
    const initial = (userData.fullName || userData.firstName || userData.name || userData.email || 'U').charAt(0).toUpperCase();

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: 'easeOut', delay: isPersonal ? 0 : Math.min((hardRank || 1) * 0.05, 0.3) }}
        className={`rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] p-4 sm:p-5 text-[#064E3B] shadow-[0_6px_25px_rgba(6,78,59,0.05)] hover:shadow-[0_12px_35px_rgba(6,78,59,0.09)] transition-all duration-[1500ms] ease-out border ${
          isCurrentUser
            ? 'border-[#064E3B]/40 ring-1 ring-[#064E3B]/20'
            : 'border-[#064E3B]/15 hover:border-[#064E3B]/35'
        }`}
      >
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Left side: Rank badge + Avatar + User info */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="shrink-0">
              <HardRankCircle
                rank={hardRank}
                displayRank={isPersonal ? (user?.rank || (5000 + (position || 1))) : (userData.displayRank || userData.rank)}
                position={position}
              />
            </div>

            {/* Avatar */}
            <div className="shrink-0">
              {userData.profileImage ? (
                <img
                  src={userData.profileImage}
                  alt={userData.firstName}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-[#064E3B]/20"
                />
              ) : (
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#064E3B] text-[#F8E7C9] flex items-center justify-center font-editorial text-base sm:text-lg font-normal border border-[#064E3B]/20 shrink-0">
                  {initial}
                </div>
              )}
            </div>

            {/* Name & Details */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-editorial text-base sm:text-lg font-normal text-[#064E3B] truncate leading-tight">
                  {userData.fullName || userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'Beneficiary'}
                </h3>
                {isCurrentUser && (
                  <span className="px-2 py-0.5 bg-[#064E3B] text-[#F8E7C9] font-semibold text-[11px] rounded-full font-sans shadow-xs">
                    You
                  </span>
                )}
                {userData.role === 'admin' && (
                  <Crown className="w-4 h-4 text-amber-500" />
                )}
              </div>
              <p className="text-[#064E3B]/60 text-xs font-sans mt-0.5">
                Member since {new Date(userData.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Right side: Points */}
          <div className="shrink-0 text-right">
            <div className="flex items-center justify-end gap-1.5">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500/20" />
              <span className="font-editorial text-xl sm:text-2xl font-normal text-[#064E3B]">
                {currPts.toLocaleString()}
              </span>
            </div>
            <p className="text-[#064E3B]/60 text-[11px] font-sans">
              {category === 'total' ? 'Total Points' :
                category === 'voting' ? 'Voting Points' : 'Contribution Points'}
            </p>
          </div>
        </div>

        {/* Bottom Progress Bar */}
        {position <= 10 && leaderboard.length > 0 && (
          <div className="w-full bg-[#064E3B]/10 rounded-full h-1 mt-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                position === 1 ? 'bg-amber-500' : position === 2 ? 'bg-slate-400' : position === 3 ? 'bg-orange-500' : 'bg-[#064E3B]'
              }`}
            />
          </div>
        )}
      </motion.div>
    );
  };

  const StatCard = ({ icon: Icon, title, value, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-5 sm:p-6 text-[#064E3B] shadow-[0_8px_30px_rgba(6,78,59,0.06)] hover:border-[#064E3B]/35 hover:shadow-[0_12px_40px_rgba(6,78,59,0.1)] transition-all duration-[1500ms] ease-out flex items-center gap-4"
    >
      <div className="p-3 bg-[#064E3B]/[0.08] border border-[#064E3B]/15 rounded-[8px] text-[#064E3B] shrink-0">
        <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
      <div>
        <div className="font-editorial text-2xl sm:text-3xl font-normal text-[#064E3B]">
          {value}
        </div>
        <p className="text-[#064E3B]/70 text-xs sm:text-sm font-sans mt-0.5">{title}</p>
        {subtitle && <p className="text-[#064E3B]/50 text-xs font-sans mt-0.5">{subtitle}</p>}
      </div>
    </motion.div>
  );

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] bg-[#F8E7C9] text-[#064E3B] py-8 sm:py-12 overflow-hidden">
      {/* Persistent Animated Grid Texture */}
      <HeroGridBoxesAnimation />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
        >
          <div>
            <div className="flex items-center gap-3">
              <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-[#064E3B]" />
              <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-[#064E3B] tracking-[-0.02em]">
                Leaderboard
              </h1>
            </div>
            <p className="text-[#064E3B]/70 text-sm sm:text-base font-sans mt-1">
              See how you rank among beneficiaries and celebrate top beneficiaries shaping platform decisions through regular voting.
            </p>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          <StatCard
            icon={Users}
            title="Total Users"
            value={stats.totalUsers?.toLocaleString() || '0'}
          />
          <StatCard
            icon={TrendingUp}
            title="Active Users"
            value={stats.activeUsers?.toLocaleString() || '0'}
            subtitle="Last 30 days"
          />
        </div>

        {/* Your Rank Section */}
        {user && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#064E3B]" />
              <h2 className="font-editorial text-2xl sm:text-3xl font-normal text-[#064E3B]">Your Ranking</h2>
            </div>

            <LeaderboardCard
              userData={userRank?.user || {
                ...user,
                fullName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || (user.email || '').split('@')[0],
                points: {
                  total: user.points || 0,
                  voting: user.stats?.votingPoints || 0,
                  contributions: user.stats?.contributionPoints || 0
                },
                createdAt: user.createdAt || new Date().toISOString(),
                displayRank: user?.overrides?.rankOverride || user?.rank || 5000
              }}
              position={userRank?.displayRank || user?.overrides?.rankOverride || user?.rank || 5000}
              hardRank={userRank?.hardRank}
              isPersonal={true}
              isCurrentUser={true}
            />
          </div>
        )}

        {/* Top Champions List */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#064E3B]/10 min-h-[44px]">
            <div className="flex items-center gap-2.5">
              <Trophy className="w-5 h-5 text-[#064E3B]" />
              <h2 className="font-editorial text-2xl sm:text-3xl font-normal text-[#064E3B]">
                Top Champions
              </h2>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#064E3B]/60 font-sans">
              Platform Contributors
            </span>
          </div>

          {leaderboard.length > 0 ? (
            <div className="space-y-3">
              {leaderboard
                .filter((u, i) => {
                  const r = u.displayRank !== undefined ? u.displayRank : (u.rank !== undefined ? u.rank : (i + 1));
                  return Number(r) <= 10;
                })
                .slice(0, 10)
                .map((userData, index) => {
                  const position = index + 1;
                  return (
                    <LeaderboardCard
                      key={userData._id}
                      userData={userData}
                      position={position}
                      hardRank={position}
                      isCurrentUser={user?._id === userData._id}
                    />
                  );
                })}
            </div>
          ) : (
            <div className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-10 text-center text-[#064E3B] shadow-[0_8px_30px_rgba(6,78,59,0.06)]">
              <Trophy className="w-12 h-12 text-[#064E3B]/30 mx-auto mb-3" />
              <h3 className="font-editorial text-2xl font-normal text-[#064E3B] mb-1">No users found</h3>
              <p className="text-[#064E3B]/60 text-sm font-sans max-w-md mx-auto">
                {searchTerm
                  ? 'Try adjusting your search criteria.'
                  : 'Be the first to earn points and claim the top spot!'
                }
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;

