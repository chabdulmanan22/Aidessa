import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Vote,
  Clock,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import { getUserMeta, castVote, getActiveVotes as dsGetActiveVotes, submitVoteOption as dsSubmitVoteOption, addPoints } from '../utils/datastore';

const Voting = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [submittingVoteId, setSubmittingVoteId] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [votesRemaining, setVotesRemaining] = useState(0);
  const [votesAllowed, setVotesAllowed] = useState(0);
  const [activeVotes, setActiveVotes] = useState([]);
  const [now, setNow] = useState(Date.now());
  const [selectedOptions, setSelectedOptions] = useState({}); // { [voteId]: optionId }

  // No dummy stats/history; page reflects live datastore state only

  const loadUserRights = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      if (!token) {
        setVotesAllowed(0);
        setVotesRemaining(0);
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get('/api/auth/me', { headers });
      const u = res.data?.user || res.data?.data?.user || {};
      const allowed = Number(u.votingRights) || 0;
      const used = Number(u.stats?.totalVotes) || 0;
      setVotesAllowed(allowed);
      setVotesRemaining(Math.max(0, allowed - used));
    } catch (_) {
      setVotesAllowed(0);
      setVotesRemaining(0);
    }
  };

  // Active votes loader and countdown ticker
  useEffect(() => {
    const loadVotes = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        // Get ALL active votes - no limit on number of simultaneous active votes
        const res = await axios.get('/api/votes', {
          params: { status: 'active', limit: 200 },
          headers
        });
        const apiVotes = res.data?.data?.votes || [];
        const transformed = apiVotes.map(v => ({
          id: v._id || v.id,
          title: v.title,
          description: v.description,
          options: (v.options || []).map(opt => ({
            id: opt.id,
            text: opt.text,
            votes: Number(opt.votes) || 0,
            votesOffset: Number(opt.votesOffset) || 0,
            targetVotes: Number(opt.targetVotes) || 0,
          })),
          status: v.status,
          isProgressive: !!v.isProgressive,
          startTime: v.startTime || null,
          endTime: v.endTime || null,
          maxVotesPerUser: v.maxVotesPerUser || 1,
          pointsReward: v.pointsReward || 0,
          totalVotes: v.totalVotes || 0,
          submissions: v.submissions ? (v.submissions instanceof Map ? Object.fromEntries(v.submissions) : v.submissions) : {},
          overrides: v.overrides ? (v.overrides instanceof Map ? Object.fromEntries(v.overrides) : v.overrides) : {},
          myVotingRights: v.myVotingRights
        }));
        setActiveVotes(transformed);
      } catch (error) {
        console.error('Error loading votes:', error);
        setActiveVotes(dsGetActiveVotes());
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadVotes();
    loadUserRights();

    // Ticker for smooth animation and progressive counting
    const tick = setInterval(() => setNow(Date.now()), 1000);

    // Polling for vote data updates (e.g. if admin changed offsets/targets)
    const poll = setInterval(loadVotes, 15000);

    const onUpdate = () => loadVotes();
    window.addEventListener('datastore:update', onUpdate);

    return () => {
      clearInterval(tick);
      clearInterval(poll);
      window.removeEventListener('datastore:update', onUpdate);
    };
  }, []);

  useEffect(() => {
    if (activeVotes.length > 0) {
      const params = new URLSearchParams(location.search);
      const voteId = params.get('voteId');
      if (voteId) {
        const el = document.getElementById(`vote-${voteId}`);
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('ring-4', 'ring-purple-500');
            setTimeout(() => el.classList.remove('ring-4', 'ring-purple-500'), 3000);
          }, 500);
        }
      }
    }
  }, [activeVotes, location.search]);

  // Normalize user identifiers for submissions counting
  const userIds = [
    user?.email,
    user?._id,
    user?.id,
    String(user?._id || ''),
    String(user?.id || '')
  ].filter(Boolean);

  const countUsed = (submissions) => {
    const seen = new Set();
    let total = 0;
    for (const k of userIds) {
      if (seen.has(k)) continue;
      seen.add(k);
      total += Number(submissions?.[k] || 0);
    }
    return total;
  };

  const getVoteRights = (vote) => {
    if (vote.myVotingRights) {
      return {
        total: vote.myVotingRights.total,
        used: vote.myVotingRights.used,
        remaining: vote.myVotingRights.remaining
      };
    }

    const base = vote.maxVotesPerUser || 1;
    let offset = 0;

    if (vote.overrides) {
      for (const id of userIds) {
        if (vote.overrides[id] !== undefined) {
          offset = Number(vote.overrides[id]);
          break;
        }
      }
    }

    const total = Math.max(0, base + offset);
    const used = countUsed(vote.submissions);

    return {
      total,
      used,
      remaining: Math.max(0, total - used)
    };
  };

  useEffect(() => {
    if (!user?.email) return;
    loadUserRights();
    const onUpdate = () => { loadUserRights(); };
    window.addEventListener('datastore:update', onUpdate);
    return () => window.removeEventListener('datastore:update', onUpdate);
  }, [user?.email]);

  const formatRemaining = (endIso) => {
    if (!endIso) return null;
    const end = new Date(endIso).getTime();
    const diff = end - now;
    if (diff <= 0) return 'Ended';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const getSmoothValue = (vote, option) => {
    const offset = Number(option.votesOffset) || 0;
    const realVotes = Number(option.votes) || 0;
    if (!vote.isProgressive || !vote.startTime || !vote.endTime) return realVotes + offset;
    const start = new Date(vote.startTime).getTime();
    const end = new Date(vote.endTime).getTime();
    const current = now;
    if (current <= start) return realVotes + offset;
    if (current >= end) return realVotes + (option.targetVotes || 0) + offset;
    const elapsed = current - start;
    const total = end - start;
    const progress = Math.min(1, Math.max(0, elapsed / total));
    return realVotes + (progress * (option.targetVotes || 0)) + offset;
  };

  const getDisplayedVotes = (vote, option) => {
    return Math.floor(getSmoothValue(vote, option));
  };

  const getSmoothProgress = (vote, option) => {
    const totalInRound = vote.options.reduce((acc, o) => acc + getSmoothValue(vote, o), 0);
    if (totalInRound <= 0) return 0;
    const displayed = getSmoothValue(vote, option);
    return (displayed / totalInRound) * 100;
  };

  const onSelectOption = (vote, option) => {
    if (!user?.email && !user?._id) {
      toast.error('Please log in to vote.');
      return;
    }
    const { remaining: perRoundRemaining } = getVoteRights(vote);
    if (perRoundRemaining <= 0) {
      toast.error(`No rights remaining for this round.`);
      return;
    }
    setSelectedOptions((prev) => ({ ...prev, [vote.id]: option.id }));
    toast.success(`Selected: ${option.text}`);
  };

  const onSubmitVote = async (vote) => {
    if (!user?.email || !vote || !user?._id) {
      toast.error('Please log in to vote.');
      return;
    }

    const selectedOptionId = selectedOptions[vote.id];
    if (selectedOptionId == null) {
      toast.error('Please select an option first.');
      return;
    }
    const { remaining: perRoundRemaining } = getVoteRights(vote);
    if (perRoundRemaining <= 0) {
      toast.error(`No rights remaining for this round.`);
      return;
    }

    setSubmittingVoteId(vote.id);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      if (!token) {
        toast.error('Authentication required. Please log in.');
        setSubmittingVoteId(null);
        return;
      }
      const response = await axios.post(
        `/api/votes/${vote.id}/submit`,
        { optionId: Number(selectedOptionId) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.success) {
        const res = await axios.get('/api/votes', {
          params: { status: 'active', limit: 200 },
          headers: { Authorization: `Bearer ${token}` }
        });
        const apiVotes = res.data?.data?.votes || [];
        const transformed = apiVotes.map(v => ({
          id: v._id || v.id,
          title: v.title,
          description: v.description,
          options: (v.options || []).map(opt => ({
            id: opt.id,
            text: opt.text,
            votes: Number(opt.votes) || 0,
            votesOffset: Number(opt.votesOffset) || 0,
            targetVotes: Number(opt.targetVotes) || 0,
          })),
          status: v.status,
          isProgressive: !!v.isProgressive,
          startTime: v.startTime || null,
          endTime: v.endTime || null,
          maxVotesPerUser: v.maxVotesPerUser || 1,
          pointsReward: v.pointsReward || 0,
          totalVotes: v.totalVotes || 0,
          submissions: v.submissions ? (v.submissions instanceof Map ? Object.fromEntries(v.submissions) : v.submissions) : {},
          overrides: v.overrides ? (v.overrides instanceof Map ? Object.fromEntries(v.overrides) : v.overrides) : {},
          myVotingRights: v.myVotingRights
        }));
        setActiveVotes(transformed);
        setSelectedOptions((prev) => ({ ...prev, [vote.id]: null }));
        toast.success('Your vote has been submitted successfully!');
      }
    } catch (error) {
      console.error('Submit vote error:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || error.message || 'Failed to submit vote';
      toast.error(errorMessage);
    } finally {
      setSubmittingVoteId(null);
    }
  };

  if (isInitialLoading && activeVotes.length === 0) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading voting data...</div>
      </div>
    );
  }

  const headerAllowed = activeVotes.reduce((acc, vote) => acc + getVoteRights(vote).total, 0);
  const headerUsed = activeVotes.reduce((acc, vote) => acc + getVoteRights(vote).used, 0);
  const headerRemaining = activeVotes.reduce((acc, vote) => acc + getVoteRights(vote).remaining, 0);

  const totalDisplayedVotes = (activeVotes || []).reduce((sum, v) => {
    return sum + (v.options || []).reduce((optSum, opt) => optSum + getDisplayedVotes(v, opt), 0);
  }, 0);

  return (
    <div className="min-h-screen hero-gradient mobile-padding py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="mobile-header font-bold text-white mb-2">
            Voting
          </h1>
          <p className="text-gray-300 mobile-text">
            Cast your vote on decisions and earn points
          </p>
        </motion.div>

        {/* Ineligibility Message for 0 Verified Loss */}
        {user && (user.verifiedLoss || 0) <= 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-6 rounded-2xl bg-red-950/85 border-2 border-red-500/70 backdrop-blur-md flex items-start gap-4 shadow-xl shadow-red-950/60"
          >
            <div className="bg-red-600 rounded-full p-2.5 flex-shrink-0 animate-pulse shadow-md">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white text-xl font-black tracking-tight mb-1">Voting Restricted</h3>
              <p className="text-red-100 font-bold text-sm sm:text-base leading-snug">
                You are not eligible to vote because you do not have a verified loss.
              </p>
              <p className="text-red-200 font-bold text-xs mt-2.5 bg-red-900/80 px-3 py-1.5 rounded-lg border border-red-500/40 inline-block shadow-xs">
                Voting is reserved for verified holders who have experienced financial losses.
              </p>
            </div>
          </motion.div>
        )}

        {/* Voting Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mobile-glass rounded-xl mobile-card mb-6 sm:mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Vote className="w-6 h-6 text-green-400 mr-3" />
              <div>
                <h3 className="text-lg font-bold text-white">Voting Status</h3>
                <p className="text-gray-300 text-sm">
                  Voting rights: <span className="text-green-400 font-bold">{headerRemaining}</span> of <span className="text-green-400 font-bold">{headerAllowed}</span> remaining
                </p>
                <p className="text-gray-300 text-xs">
                  Used: <span className="text-white font-bold">{headerUsed}</span>
                </p>
                {/* Removed global voting rights display for clarity */}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                {/* Total votes label removed */}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Active Votes (admin-set) */}
        <div className="mb-8">
          {(!activeVotes || activeVotes.length === 0) ? (
            <div className="mobile-glass rounded-xl mobile-card p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <p className="text-gray-300">No active voting round. Please check back later.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {activeVotes.map((vote) => (
                <motion.div
                  key={vote.id}
                  id={`vote-${vote.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mobile-glass rounded-xl mobile-card p-6"
                >
                  <div className="flex items-center mb-4">
                    <BarChart3 className="w-6 h-6 text-blue-400 mr-3" />
                    <h3 className="text-xl font-bold text-white">{vote.title}</h3>
                  </div>
                  {vote.description && (
                    <p className="text-gray-300 text-sm mb-6">{vote.description}</p>
                  )}
                  {vote.endTime && (
                    <div className="mb-4 p-3 bg-white/5 rounded-lg flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-400" />
                      <span className="text-gray-200 text-sm">Time remaining:</span>
                      <span className="font-mono font-bold text-white">{formatRemaining(vote.endTime)}</span>
                    </div>
                  )}
                  <div className="space-y-3">
                    {vote.options.map((opt) => {
                      const isSelected = selectedOptions[vote.id] === opt.id;
                      // Check submissions by both email and user ID
                      const { remaining: perRoundRemaining } = getVoteRights(vote);
                      const hasVerifiedLoss = (user?.verifiedLoss || 0) > 0;
                      const disabled = vote.status !== 'active' || perRoundRemaining <= 0 || !hasVerifiedLoss;

                      const displayedVotes = getDisplayedVotes(vote, opt);
                      const goalVotes = opt.targetVotes || 0;

                      // Percentage toward the individual goal (targetVotes)
                      // Falls back to share-of-round if no target is set
                      const totalInRound = vote.options.reduce((acc, o) => acc + getDisplayedVotes(vote, o), 0);
                      const goalPercentage = goalVotes > 0
                        ? Math.min(100, (displayedVotes / goalVotes) * 100)
                        : (totalInRound > 0 ? (displayedVotes / totalInRound) * 100 : 0);

                      // Smooth (float) version for bar animation
                      const smoothDisplayed = getSmoothValue(vote, opt);
                      const smoothWidth = goalVotes > 0
                        ? Math.min(100, (smoothDisplayed / goalVotes) * 100)
                        : getSmoothProgress(vote, opt);

                      return (
                        <div key={opt.id} className="relative">
                          <button
                            onClick={() => !disabled && onSelectOption(vote, opt)}
                            disabled={disabled}
                            className={`w-full p-4 rounded-lg border-2 transition-all duration-300 flex items-center justify-between relative overflow-hidden ${isSelected ? 'border-cyan-400/80 bg-cyan-950/40 shadow-md shadow-cyan-950/50' : 'border-white/10 hover:border-cyan-400/60'
                              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {/* Background fill: goal-based */}
                            <div
                              className="absolute left-0 top-0 bottom-0 bg-cyan-500/15 transition-all duration-1000"
                              style={{ width: `${smoothWidth}%` }}
                            />

                            <div className="flex items-center gap-3 relative z-10">
                              <div className={`w-5 h-5 rounded-full border-2 ${isSelected ? 'border-cyan-400 bg-cyan-500' : 'border-gray-400 bg-transparent'
                                }`}></div>
                              <span className="font-semibold text-white">{opt.text}</span>
                            </div>
                            <div className="text-right relative z-10">
                              <span className="text-sm font-bold text-white block">
                                {displayedVotes}
                              </span>
                              <span className="text-[10px] text-cyan-200/70">
                                Total votes
                              </span>
                            </div>
                          </button>

                          {/* Animated bottom bar: goal-based width */}
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 rounded-b-lg overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${smoothWidth}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className="h-full bg-gradient-to-r from-[#086a7e] to-[#0ea5e9]"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 text-xs text-gray-300">
                    Your remaining in this round: <span className="text-cyan-300 font-bold">{getVoteRights(vote).remaining}</span> of <span className="text-cyan-300 font-bold">{getVoteRights(vote).total}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-end gap-3">
                    <button
                      onClick={() => onSubmitVote(vote)}
                      disabled={selectedOptions[vote.id] == null || vote.status !== 'active' || (
                        getVoteRights(vote).remaining <= 0
                      )}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#086a7e] to-[#0e7490] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-[#097d95] hover:to-[#0891b2] shadow-md shadow-cyan-950/50 transition-all duration-200 font-semibold"
                    >
                      Submit Vote
                    </button>


                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* No dummy stats/history. Only live active votes are shown. */}
      </div>
    </div>
  );
};

export default Voting;
