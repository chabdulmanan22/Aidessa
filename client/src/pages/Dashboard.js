import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Vote,
  Coins,
  Users,
  Copy,
  Clock,
  Timer
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { getUserMeta, getActivityLog, getActiveVotes as dsGetActiveVotes } from '../utils/datastore';
import HeroGridBoxesAnimation from '../components/HeroGridBoxesAnimation';

const LiveTimer = ({ endTime, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    if (!endTime) return;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const diff = end - now;
      if (diff <= 0) {
        setTimeLeft('Ended');
        clearInterval(interval);
        if (onExpire) onExpire();
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      let str = '';
      if (days > 0) str += `${days}d `;
      str += `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      setTimeLeft(str);
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime, onExpire]);

  if (!endTime) return null;
  return <span>{timeLeft}</span>;
};


const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [totalPoints, setTotalPoints] = useState(0);
  const [pointsVoting, setPointsVoting] = useState(0);
  const [pointsContribution, setPointsContribution] = useState(0);
  const [pointsReferral, setPointsReferral] = useState(0);
  const [votesAllowed, setVotesAllowed] = useState(0);
  const [votesUsed, setVotesUsed] = useState(0);
  const [activeRoundsCount, setActiveRoundsCount] = useState(0);
  const [activeVotes, setActiveVotes] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [verifiedLoss, setVerifiedLoss] = useState(0);
  const [unverifiedLoss, setUnverifiedLoss] = useState(0);
  const [amountRestituted, setAmountRestituted] = useState(0);
  const [userRank, setUserRank] = useState(0);


  // Load live user dashboard data
  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
        const me = await axios.get('/api/auth/me', { headers });
        const u = me.data?.user || me.data?.data?.user || {};
        setTotalPoints(u.points || 0);
        setPointsVoting(u.stats?.votingPoints || 0);
        setPointsContribution(u.stats?.contributionPoints || 0);
        setPointsReferral(u.stats?.referralPoints || 0);
        setVotesAllowed(u.votingRights || 0);
        setVotesUsed(u.stats?.totalVotes || 0);
        setVerifiedLoss(u.verifiedLoss || 0);
        setUnverifiedLoss(u.unverifiedLoss || 0);
        setAmountRestituted(u.amountRestituted || 0);
        setUserRank(u.rank || 0);
        try {
          const vr = await axios.get('/api/votes', { params: { status: 'active', limit: 200 }, headers });
          const votes = vr.data?.data?.votes || [];
          setActiveRoundsCount(votes.length || 0);
          setActiveVotes(votes);
        } catch {
          setActiveRoundsCount(0);
          setActiveVotes([]);
        }
        const activity = getActivityLog().filter((a) => a.userEmail === (u.email || user.email));
        setRecentActivity(activity.slice(0, 10));
      } catch (_) {
        // fallback to local meta
        if (user?.email) {
          const meta = getUserMeta(user.email);
          setTotalPoints(meta.points || 0);
          setPointsVoting(meta.pointsVoting || 0);
          setPointsContribution(meta.pointsContribution || 0);
          setPointsReferral(meta.pointsReferral || 0);
          setVotesAllowed(meta.votesAllowed || 0);
          setVotesUsed(meta.votesUsed || 0);
          setVerifiedLoss(user?.verifiedLoss || 0);
          setUnverifiedLoss(user?.unverifiedLoss || 0);
          setAmountRestituted(user?.amountRestituted || 0);
          setUserRank(0);
          const dsVotes = dsGetActiveVotes();
          setActiveRoundsCount(dsVotes.length);
          setActiveVotes(dsVotes);
          const activity = getActivityLog().filter((a) => a.userEmail === user.email);
          setRecentActivity(activity.slice(0, 10));
        }
      }
    };
    load();
    const onUpdate = () => load();
    window.addEventListener('datastore:update', onUpdate);

    // WebSocket connection with reconnection logic
    let ws = null;
    let reconnectTimeout = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;

    const connectWebSocket = () => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        // In development, if we are on port 3006, the server is on 3000
        let host = window.location.host;
        if (host.includes(':3006')) {
          host = host.replace('3006', '3000');
        } else if (window.location.hostname === 'localhost' && !host.includes(':')) {
          // If just localhost (unlikely without port), assume 3000? No, usually has port.
          // If we are in production build served by express, host is correct.
        }

        const url = `${protocol}//${host}/ws`;
        console.log('Connecting to WebSocket at:', url);
        ws = new WebSocket(url);

        ws.onopen = () => {
          console.log('WebSocket connected');
          reconnectAttempts = 0;
        };

        ws.onmessage = (ev) => {
          try {
            const payload = JSON.parse(ev.data);
            console.log('Dashboard received WebSocket event:', payload.type);
            if (payload && payload.type) {
              if (payload.type === 'vote_created_notification') {
                // Also refresh data
                load();
              }
              // Match all user-related events (including admin overrides)
              if (/user_(vote|contribution|referral|points|voting|status|updated|registered|deleted|overrides|voting_updated)/i.test(payload.type)) {
                console.log('Dashboard: Reloading due to user event:', payload.type);
                load();
              }
              // Match vote status changes and updates
              if (/vote_(started|paused|resumed|completed|created|updated|deleted)/i.test(payload.type)) {
                console.log('Dashboard: Reloading due to vote event:', payload.type);
                load();
              }
              // Match contribution status changes
              if (/contribution_(approved|rejected|verified)/i.test(payload.type)) {
                console.log('Dashboard: Reloading due to contribution event:', payload.type);
                load();
              }
              // Also match general users_updated events
              if (/users?_(updated|fetched)/i.test(payload.type)) {
                console.log('Dashboard: Reloading due to users event:', payload.type);
                load();
              }
            }
          } catch (err) {
            console.error('Error parsing WebSocket message:', err);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
          console.log('WebSocket disconnected');
          ws = null;
          // Attempt to reconnect
          if (reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++;
            reconnectTimeout = setTimeout(() => {
              connectWebSocket();
            }, Math.min(1000 * Math.pow(2, reconnectAttempts), 30000)); // Exponential backoff, max 30s
          }
        };
      } catch (err) {
        console.error('Error creating WebSocket connection:', err);
      }
    };

    connectWebSocket();

    return () => {
      window.removeEventListener('datastore:update', onUpdate);
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (ws) {
        ws.close();
        ws = null;
      }
    };
  }, [user?.email]);

  const copyReferralCode = () => {
    if (!user?.referralCode) {
      toast.error('Referral code not available');
      return;
    }
    const link = `${window.location.origin}/home?ref=${user.referralCode}`;
    navigator.clipboard.writeText(link);
    toast.success('Referral link copied to clipboard!');
  };


  if (!user) {
    return (
      <div className="relative w-full min-h-screen bg-[#F8E7C9] flex items-center justify-center overflow-hidden">
        <HeroGridBoxesAnimation />
        <div className="relative z-10 font-editorial text-2xl text-[#064E3B]">Loading dashboard...</div>
      </div>
    );
  }

  const dashCountUsed = (vote) => {
    if (vote.myVotingRights) {
      return vote.myVotingRights.used;
    }
    // Fallback if myVotingRights is missing (e.g. not populated correctly or older API)
    const submissions = vote.submissions;
    const dashUserIds = [
      user?.email,
      user?._id,
      user?.id,
      String(user?._id || ''),
      String(user?.id || '')
    ].filter(Boolean);
    const seen = new Set();
    let total = 0;
    for (const k of dashUserIds) {
      if (seen.has(k)) continue;
      seen.add(k);
      total += Number(submissions?.[k] || 0);
    }
    return total;
  };

  const dashAllowedSum = (activeVotes || []).reduce((sum, v) => {
    if (v.myVotingRights && typeof v.myVotingRights.total === 'number') {
      return sum + v.myVotingRights.total;
    }
    const dashUserIds = [
      user?.email,
      user?._id,
      user?.id,
      String(user?._id || ''),
      String(user?.id || '')
    ].filter(Boolean);
    let offset = 0;
    if (v.overrides) {
      for (const uid of dashUserIds) {
        if (v.overrides[uid] !== undefined) {
          offset = Number(v.overrides[uid]);
          break;
        }
      }
    }
    const base = Number(v.maxVotesPerUser) || Number(votesAllowed) || 1;
    return sum + Math.max(0, base + offset);
  }, 0);

  const dashUsedSum = (activeVotes || []).reduce((sum, v) => sum + dashCountUsed(v), 0);
  const dashAllowed = (activeVotes && activeVotes.length > 0) ? dashAllowedSum : (votesAllowed || 0);
  const dashUsed = (activeVotes && activeVotes.length > 0) ? dashUsedSum : (votesUsed || 0);
  const dashRemaining = Math.max(0, dashAllowed - dashUsed);

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] bg-[#F8E7C9] text-[#064E3B] py-8 sm:py-12 overflow-hidden">
      {/* Persistent Animated Grid Texture */}
      <HeroGridBoxesAnimation />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
        >
          <div>
            <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-[#064E3B] tracking-[-0.02em]">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-[#064E3B]/70 text-sm sm:text-base font-sans mt-1">
              Track your restitution progress, active voting rounds, and ecosystem participation.
            </p>
          </div>
        </motion.div>

        {/* Spam Notification Statement (Clean Text, No Card, No Icon) */}
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[#064E3B]/80 text-sm sm:text-base font-medium font-sans leading-relaxed"
        >
          If our emails have landed in your spam or junk folder, please mark them as <span className="font-semibold text-[#064E3B]">“Not Spam”</span> to ensure you receive future restitution updates.
        </motion.p>

        {/* Active Votes Notifications */}
        {activeVotes && activeVotes.length > 0 && (
          <div className="space-y-4">
            {activeVotes.map((vote) => (
              <motion.div
                key={vote._id || vote.id || Math.random()}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/20 p-5 text-[#064E3B] shadow-[0_8px_30px_rgba(6,78,59,0.06)] flex flex-col md:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="p-3 bg-[#064E3B]/[0.08] text-[#064E3B] rounded-[8px] shrink-0 border border-[#064E3B]/15">
                    <Vote className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-editorial text-xl font-normal text-[#064E3B]">{vote.title || 'New Vote Created!'}</h4>
                    <p className="text-sm text-[#064E3B]/70 font-sans">A new proposal needs your attention</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto justify-between">
                  <div className="text-xs sm:text-sm font-sans flex flex-col gap-1 items-start md:items-end w-full sm:w-auto text-[#064E3B]/75">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#064E3B]" />
                      <span>Starts: {vote.startTime ? new Date(vote.startTime).toLocaleString() : 'Now'}</span>
                    </div>
                    {vote.endTime && (
                      <div className="flex items-center gap-2">
                        <Timer className="w-4 h-4 text-[#064E3B]" />
                        <span>Ends: {new Date(vote.endTime).toLocaleString()}</span>
                        <span className="ml-2 font-mono font-bold text-[#064E3B] bg-[#064E3B]/10 px-2 py-0.5 rounded-full border border-[#064E3B]/20">
                          <LiveTimer endTime={vote.endTime} />
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => navigate(`/voting?voteId=${vote._id || vote.id}`)}
                    className="px-5 py-2.5 bg-[#064E3B] hover:bg-[#043C2D] text-[#F8E7C9] rounded-[8px] font-semibold text-sm transition-all flex items-center justify-center gap-2 shrink-0 w-full sm:w-auto shadow-sm active:scale-95 cursor-pointer"
                  >
                    <span>Vote Now</span>
                    <Vote className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* 4 Cards in 1 Line: Vote, Verified Loss, Unverified Loss, Amount Restituted */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {/* 1. Vote Card */}
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            onClick={() => navigate('/voting')}
            className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-5 sm:p-6 text-[#064E3B] shadow-[0_8px_30px_rgba(6,78,59,0.06)] hover:border-[#064E3B]/35 hover:shadow-[0_12px_40px_rgba(6,78,59,0.1)] transition-all duration-[1500ms] ease-out text-left group cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[11px] font-bold text-[#064E3B]/60 uppercase tracking-wider font-sans">
                Voting Status
              </h4>
              <span className="text-[10px] font-bold text-[#064E3B] bg-[#064E3B]/[0.08] border border-[#064E3B]/15 px-2 py-0.5 rounded-[4px] font-sans">
                Rounds: {activeRoundsCount}
              </span>
            </div>
            <div className="flex items-center gap-3 my-1">
              <div className="p-2 sm:p-2.5 bg-[#064E3B]/[0.08] border border-[#064E3B]/15 rounded-[8px] text-[#064E3B] group-hover:bg-[#064E3B] group-hover:text-[#F8E7C9] transition-colors duration-[1500ms]">
                <Vote className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="font-editorial text-2xl sm:text-3xl font-normal text-[#064E3B] group-hover:text-[#043C2D]">
                VOTE
              </div>
            </div>
            <p className="text-[#064E3B]/60 text-xs font-sans mt-1">
              Provide feedback & vote
            </p>
          </motion.button>

          {/* 2. Verified Loss Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.1 }}
            className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-5 sm:p-6 text-[#064E3B] shadow-[0_8px_30px_rgba(6,78,59,0.06)] hover:border-[#064E3B]/35 hover:shadow-[0_12px_40px_rgba(6,78,59,0.1)] transition-all duration-[1500ms] ease-out flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[11px] font-bold text-[#064E3B]/60 uppercase tracking-wider font-sans">
                Verified Loss
              </h4>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-500/[0.1] border border-emerald-600/20 px-2 py-0.5 rounded-[4px] font-sans">
                Verified
              </span>
            </div>
            <div className="font-editorial text-2xl sm:text-3xl font-normal text-[#064E3B] my-1">
              ${verifiedLoss.toLocaleString()}
            </div>
            <p className="text-[#064E3B]/60 text-xs font-sans mt-1">
              Protocol verified claims
            </p>
          </motion.div>

          {/* 3. Unverified Loss Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-5 sm:p-6 text-[#064E3B] shadow-[0_8px_30px_rgba(6,78,59,0.06)] hover:border-[#064E3B]/35 hover:shadow-[0_12px_40px_rgba(6,78,59,0.1)] transition-all duration-[1500ms] ease-out flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[11px] font-bold text-[#064E3B]/60 uppercase tracking-wider font-sans">
                Unverified Loss
              </h4>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-500/[0.1] border border-amber-600/20 px-2 py-0.5 rounded-[4px] font-sans">
                Pending
              </span>
            </div>
            <div className="font-editorial text-2xl sm:text-3xl font-normal text-[#064E3B] my-1">
              ${unverifiedLoss.toLocaleString()}
            </div>
            <p className="text-[#064E3B]/60 text-xs font-sans mt-1">
              Under protocol review
            </p>
          </motion.div>

          {/* 4. Amount Restituted Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
            className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-5 sm:p-6 text-[#064E3B] shadow-[0_8px_30px_rgba(6,78,59,0.06)] hover:border-[#064E3B]/35 hover:shadow-[0_12px_40px_rgba(6,78,59,0.1)] transition-all duration-[1500ms] ease-out flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[11px] font-bold text-[#064E3B]/70 uppercase tracking-wider font-sans">
                Amount Restituted
              </h4>
              <span className="text-[10px] font-bold text-[#064E3B] bg-[#064E3B]/[0.08] border border-[#064E3B]/15 px-2 py-0.5 rounded-[4px] font-sans">
                Restored
              </span>
            </div>
            <div className="font-editorial text-2xl sm:text-3xl font-normal text-[#064E3B] my-1">
              ${amountRestituted.toLocaleString()}
            </div>
            <p className="text-[#064E3B]/60 text-xs font-sans mt-1">
              Total compensation paid
            </p>
          </motion.div>
        </div>

        {/* Your Stats & Activity (Live) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-6 sm:p-8 text-[#064E3B] shadow-[0_12px_40px_rgba(6,78,59,0.08)]"
        >
          <div className="pb-4 border-b border-[#064E3B]/10 min-h-[44px] flex items-center justify-between">
            <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#064E3B]">
              Your Stats
            </h3>
            <span className="text-xs font-bold uppercase tracking-wider text-[#064E3B]/60 font-sans hidden sm:inline-block">
              Live Metrics
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-6 mb-8">
            {/* Leaderboard Ranking */}
            <div className={`rounded-[8px] p-5 transition-all duration-300 border ${
              userRank >= 5000 && userRank <= 5009 
                ? 'bg-[#064E3B]/[0.08] border-[#064E3B]/30' 
                : 'bg-[#064E3B]/[0.03] border-[#064E3B]/10'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[11px] font-bold text-[#064E3B]/60 uppercase tracking-wider font-sans">Leaderboard Ranking</h4>
                <Trophy className="w-5 h-5 text-[#064E3B]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-editorial text-3xl font-normal text-[#064E3B]">#{userRank || '—'}</span>
                {userRank >= 5000 && userRank <= 5009 && (
                  <span className="text-[10px] font-bold text-[#064E3B] bg-[#064E3B]/10 border border-[#064E3B]/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-sans">
                    Top Tier
                  </span>
                )}
              </div>
              <p className="text-[#064E3B]/60 text-xs mt-1.5 font-sans">Global standing in the ecosystem</p>
            </div>

            {/* Voting Rights */}
            <div className="rounded-[8px] bg-[#064E3B]/[0.03] border border-[#064E3B]/10 p-5">
              <h4 className="text-[11px] font-bold text-[#064E3B]/60 uppercase tracking-wider mb-2 font-sans">Voting Rights</h4>
              <div className="space-y-2 font-sans text-sm">
                <div className="flex justify-between">
                  <span className="text-[#064E3B]/70">Allowed:</span>
                  <span className="font-semibold text-[#064E3B]">{dashAllowed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#064E3B]/70">Used:</span>
                  <span className="font-semibold text-[#064E3B]">{dashUsed}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#064E3B]/10">
                  <span className="text-[#064E3B]/70">Remaining:</span>
                  <span className="font-bold text-[#064E3B]">{dashRemaining}</span>
                </div>
              </div>
            </div>

            {/* Voting Rounds */}
            <div className="rounded-[8px] bg-[#064E3B]/[0.03] border border-[#064E3B]/10 p-5">
              <h4 className="text-[11px] font-bold text-[#064E3B]/60 uppercase tracking-wider mb-2 font-sans">Voting Rounds</h4>
              <div className="space-y-2 font-sans text-sm">
                <div className="flex justify-between">
                  <span className="text-[#064E3B]/70">Active Rounds:</span>
                  <span className="font-semibold text-[#064E3B]">{activeRoundsCount}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#064E3B]/10">
                  <span className="text-[#064E3B]/70">Total Points:</span>
                  <span className="font-bold text-[#064E3B]">{totalPoints.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Referral Points */}
            <div className="rounded-[8px] bg-[#064E3B]/[0.05] border border-[#064E3B]/15 p-5">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[11px] font-bold text-[#064E3B]/70 uppercase tracking-wider font-sans">Referral Points</h4>
                <Users className="w-5 h-5 text-[#064E3B]" />
              </div>
              <div className="space-y-1">
                <div className="font-editorial text-3xl font-normal text-[#064E3B]">{pointsReferral.toLocaleString()}</div>
                <p className="text-[#064E3B]/60 text-xs font-sans">Real points from invited users (+10 each)</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="pt-2">
            <h4 className="font-editorial text-xl sm:text-2xl font-normal text-[#064E3B] mb-3">
              Your Recent Activity
            </h4>

            <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
              {recentActivity.length === 0 ? (
                <div className="rounded-[8px] bg-[#064E3B]/[0.02] border border-[#064E3B]/10 p-4 text-center">
                  <p className="text-[#064E3B]/60 text-sm font-sans">No recent activity logged yet.</p>
                </div>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="rounded-[8px] bg-[#064E3B]/[0.02] border border-[#064E3B]/10 p-3.5 flex justify-between items-center font-sans">
                    <div>
                      <span className="text-sm font-semibold text-[#064E3B] block">{activity.message}</span>
                      <span className="text-xs text-[#064E3B]/60 capitalize">{activity.type}</span>
                    </div>
                    <span className="text-xs text-[#064E3B]/50 font-mono">{new Date(activity.time).toLocaleTimeString()}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Dashboard;

