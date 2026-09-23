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

  const HardRankCircle = ({ rank, displayRank }) => {
    const val = displayRank || rank;
    return (
      <div className="w-12 h-10 rounded-xl border border-cyan-400/40 bg-cyan-500/15 flex items-center justify-center text-cyan-300 font-bold text-xs px-2 shadow-md flex-shrink-0 whitespace-nowrap">
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

  const LeaderboardCard = ({ userData, position, hardRank, isCurrentUser = false, isPersonal = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: isPersonal ? 0 : Math.min((hardRank || 1) * 0.02, 0.15) }}
      className={`bg-[#031d24]/60 backdrop-blur-lg rounded-2xl p-6 border transition-all duration-300 ${isCurrentUser
        ? 'border-cyan-400 bg-cyan-500/20 shadow-lg shadow-cyan-950/40'
        : 'border-white/20 hover:border-cyan-500/30'
        } ${position <= 3 ? 'relative overflow-hidden' : ''}`}
    >



      {/* Top 3 Background Effect */}
      {position <= 3 && (
        <div className={`absolute inset-0 bg-gradient-to-r ${getRankColor(position)} opacity-10`} />
      )}

      <div className="relative flex items-center space-x-4">
        {/* Unified Rank Badge */}
        <div className="flex-shrink-0">
          <HardRankCircle
            rank={hardRank}
            displayRank={isPersonal ? (user?.rank || (5000 + (position || 1))) : (userData.displayRank || userData.rank)}
          />
        </div>

        {/* Avatar */}
        <div className="flex-shrink-0">
          {userData.profileImage ? (
            <img
              src={userData.profileImage}
              alt={userData.firstName}
              className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
            />
          ) : (
            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getRankColor(position)} flex items-center justify-center`}>
              <User className="w-6 h-6 text-white" />
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="text-white font-semibold truncate">
              {userData.fullName}
            </h3>
            {isCurrentUser && (
              <span className="px-2.5 py-0.5 bg-gradient-to-r from-[#086a7e] to-[#0ea5e9] text-white font-bold text-xs rounded-full shadow-sm">You</span>
            )}

            {userData.role === 'admin' && (
              <Crown className="w-4 h-4 text-yellow-500" />
            )}
          </div>
          <p className="text-gray-400 text-sm">
            Member since {new Date(userData.createdAt).toLocaleDateString()}
          </p>
          {userData.bio && (
            <p className="text-gray-300 text-sm mt-1 line-clamp-1">{userData.bio}</p>
          )}
        </div>

        {/* Stats */}
        <div className="flex-shrink-0 text-right">
          <div className="flex items-center space-x-1 mb-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-white font-bold text-lg">
              {getPointsForCategory(userData, category).toLocaleString()}
            </span>
          </div>
          <p className="text-gray-400 text-xs">
            {category === 'total' ? 'Total Points' :
              category === 'voting' ? 'Voting Points' : 'Contribution Points'}
          </p>


        </div>
      </div>

      {/* Progress Bar for Top 10 */}
      {position <= 10 && leaderboard.length > 0 && (
        <div className="mt-4">
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className={`h-2 rounded-full bg-gradient-to-r ${getRankColor(position)}`}
              style={{
                width: `${(getPointsForCategory(userData, category) / getPointsForCategory(leaderboard[0], category)) * 100}%`
              }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );

  const StatCard = ({ icon: Icon, title, value, subtitle, gradient = "from-[#086a7e] to-[#0ea5e9]" }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#031d24]/80 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/20 shadow-lg shadow-cyan-950/50"
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} shadow-md shadow-cyan-950/40`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
          <p className="text-gray-300 text-sm">{title}</p>
          {subtitle && <p className="text-cyan-200/60 text-xs">{subtitle}</p>}
        </div>
      </div>
    </motion.div>
  );

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#085464] via-[#05323c] to-[#02141a] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">🏆 Leaderboard</h1>
          <p className="text-gray-300">
            See how you rank among beneficiaries and celebrate top beneficiaries shaping platform decisions through regular voting.
          </p>

        </motion.div>



        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Users"
            value={stats.totalUsers?.toLocaleString() || '0'}
            gradient="from-[#086a7e] to-[#0891b2]"
          />
          <StatCard
            icon={TrendingUp}
            title="Active Users"
            value={stats.activeUsers?.toLocaleString() || '0'}
            subtitle="Last 30 days"
            gradient="from-[#0d6e82] to-[#06b6d4]"
          />
        </div>


        {/* Your Rank Section */}
        {user && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white">Your Ranking</h2>
            </div>

            <div className="bg-gradient-to-r from-[#05323c]/70 to-[#02141a]/80 backdrop-blur-xl rounded-3xl p-1 border border-cyan-500/30 shadow-2xl shadow-cyan-950/60">
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
          </div>
        )}

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">🥇 Top Champions 🥇</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 2nd Place */}
              <div className="order-1 md:order-1">
                <LeaderboardCard
                  userData={leaderboard[1]}
                  position={2}
                  hardRank={2}
                  isCurrentUser={user?._id === leaderboard[1]?._id}
                />
              </div>

              {/* 1st Place */}
              <div className="order-2 md:order-2">
                <div className="relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-3 py-1 rounded-full text-sm font-bold">
                      👑 CHAMPION
                    </div>
                  </div>
                  <LeaderboardCard
                    userData={leaderboard[0]}
                    position={1}
                    hardRank={1}
                    isCurrentUser={user?._id === leaderboard[0]?._id}
                  />
                </div>
              </div>

              {/* 3rd Place */}
              <div className="order-3 md:order-3">
                <LeaderboardCard
                  userData={leaderboard[2]}
                  position={3}
                  hardRank={3}
                  isCurrentUser={user?._id === leaderboard[2]?._id}
                />
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <motion.div

          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Top Champions
            </h2>
            <span className="text-gray-400 text-sm">Platform Contributors</span>

          </div>

          {leaderboard.length > 0 ? (
            <div className="space-y-4">
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
            <div className="text-center py-16">
              <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No users found</h3>
              <p className="text-gray-400">
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
