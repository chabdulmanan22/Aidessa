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
import HeroGridBoxesAnimation from '../components/HeroGridBoxesAnimation';

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
      <div className="relative w-full min-h-screen bg-[#F8E7C9] flex items-center justify-center overflow-hidden">
        <HeroGridBoxesAnimation />
        <div className="relative z-10 font-editorial text-2xl text-[#064E3B]">Loading voting data...</div>
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
            <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-[#064E3B] tracking-[-0.02em]">
              Voting
            </h1>
            <p className="text-[#064E3B]/70 text-sm sm:text-base font-sans mt-1">
              Cast your vote on decisions and earn points
            </p>
          </div>
        </motion.div>

        {/* Ineligibility Message for 0 Verified Loss (Clean Text, No Card, No Icon) */}
        {user && (user.verifiedLoss || 0) <= 0 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="space-y-1"
          >
            <h3 className="font-editorial text-xl sm:text-2xl font-normal text-red-700">
              Voting Restricted
            </h3>
            <p className="text-[#064E3B]/80 text-sm sm:text-base font-sans leading-relaxed">
              You are not eligible to vote because you do not have a verified loss.
            </p>
            <p className="text-red-700/80 text-xs sm:text-sm font-sans">
              Voting is reserved for verified holders who have experienced financial losses.
            </p>
          </motion.div>
        )}

        {/* Voting Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-6 sm:p-8 text-[#064E3B] shadow-[0_8px_30px_rgba(6,78,59,0.06)]"
        >
          <div className="pb-4 border-b border-[#064E3B]/10 min-h-[44px] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-[8px] bg-[#064E3B]/[0.08] text-[#064E3B] border border-[#064E3B]/15 shrink-0">
                <Vote className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#064E3B]">
                  Voting Status
                </h3>
                <p className="text-[#064E3B]/60 text-xs font-sans mt-0.5">
                  Your active rights and round allocations
                </p>
              </div>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#064E3B]/60 font-sans hidden sm:inline-block">
              Live Allocation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-6">
            <div className="rounded-[8px] bg-[#064E3B]/[0.03] border border-[#064E3B]/10 p-5">
              <h4 className="text-[11px] font-bold text-[#064E3B]/60 uppercase tracking-wider mb-1.5 font-sans">
                Total Rights
              </h4>
              <div className="font-editorial text-2xl sm:text-3xl font-normal text-[#064E3B]">
                {headerAllowed}
              </div>
              <p className="text-[#064E3B]/60 text-xs font-sans mt-1">Total voting rights available</p>
            </div>

            <div className="rounded-[8px] bg-[#064E3B]/[0.03] border border-[#064E3B]/10 p-5">
              <h4 className="text-[11px] font-bold text-[#064E3B]/60 uppercase tracking-wider mb-1.5 font-sans">
                Rights Used
              </h4>
              <div className="font-editorial text-2xl sm:text-3xl font-normal text-[#064E3B]">
                {headerUsed}
              </div>
              <p className="text-[#064E3B]/60 text-xs font-sans mt-1">Total votes cast across rounds</p>
            </div>

            <div className="rounded-[8px] bg-[#064E3B]/[0.06] border border-[#064E3B]/20 p-5">
              <h4 className="text-[11px] font-bold text-[#064E3B]/70 uppercase tracking-wider mb-1.5 font-sans">
                Remaining Rights
              </h4>
              <div className="font-editorial text-2xl sm:text-3xl font-normal text-[#064E3B]">
                {headerRemaining}
              </div>
              <p className="text-[#064E3B]/60 text-xs font-sans mt-1">Available to cast now</p>
            </div>
          </div>
        </motion.div>

        {/* Active Votes (admin-set) */}
        <div>
          {(!activeVotes || activeVotes.length === 0) ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-8 sm:p-10 text-center text-[#064E3B] shadow-[0_8px_30px_rgba(6,78,59,0.06)]"
            >
              <div className="w-12 h-12 rounded-full bg-[#064E3B]/[0.08] text-[#064E3B] border border-[#064E3B]/15 flex items-center justify-center mx-auto mb-3">
                <Vote className="w-6 h-6" />
              </div>
              <h4 className="font-editorial text-2xl font-normal text-[#064E3B] mb-1">
                No Active Voting Rounds
              </h4>
              <p className="text-[#064E3B]/60 text-sm font-sans max-w-md mx-auto">
                There are currently no proposals open for voting. Please check back later.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {activeVotes.map((vote) => {
                const { remaining: perRoundRemaining, total: perRoundTotal } = getVoteRights(vote);
                const hasVerifiedLoss = (user?.verifiedLoss || 0) > 0;
                return (
                  <motion.div
                    key={vote.id}
                    id={`vote-${vote.id}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-6 sm:p-8 text-[#064E3B] shadow-[0_8px_30px_rgba(6,78,59,0.06)]"
                  >
                    <div className="pb-4 border-b border-[#064E3B]/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-[8px] bg-[#064E3B]/[0.08] text-[#064E3B] border border-[#064E3B]/15 shrink-0">
                          <BarChart3 className="w-5 h-5 text-[#064E3B]" />
                        </div>
                        <div>
                          <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#064E3B]">
                            {vote.title}
                          </h3>
                        </div>
                      </div>

                      {vote.endTime && (
                        <div className="flex items-center gap-2 text-xs sm:text-sm font-sans text-[#064E3B]/75 bg-[#064E3B]/[0.04] border border-[#064E3B]/10 px-3 py-1.5 rounded-[6px] shrink-0">
                          <Clock className="w-4 h-4 text-[#064E3B]" />
                          <span>Time remaining:</span>
                          <span className="font-mono font-bold text-[#064E3B] bg-[#064E3B]/10 px-2 py-0.5 rounded-full border border-[#064E3B]/20">
                            {formatRemaining(vote.endTime)}
                          </span>
                        </div>
                      )}
                    </div>

                    {vote.description && (
                      <p className="text-[#064E3B]/70 text-sm font-sans my-4 leading-relaxed">
                        {vote.description}
                      </p>
                    )}

                    <div className="space-y-3 mt-4">
                      {vote.options.map((opt) => {
                        const isSelected = selectedOptions[vote.id] === opt.id;
                        const disabled = vote.status !== 'active' || perRoundRemaining <= 0 || !hasVerifiedLoss;

                        const displayedVotes = getDisplayedVotes(vote, opt);
                        const goalVotes = opt.targetVotes || 0;

                        const smoothDisplayed = getSmoothValue(vote, opt);
                        const smoothWidth = goalVotes > 0
                          ? Math.min(100, (smoothDisplayed / goalVotes) * 100)
                          : getSmoothProgress(vote, opt);

                        return (
                          <div key={opt.id} className="relative rounded-[8px] overflow-hidden border border-[#064E3B]/15 hover:border-[#064E3B]/40 transition-colors">
                            <button
                              type="button"
                              onClick={() => !disabled && onSelectOption(vote, opt)}
                              disabled={disabled}
                              className={`w-full p-4 transition-all duration-300 flex items-center justify-between relative overflow-hidden text-left cursor-pointer ${
                                isSelected
                                  ? 'bg-[#064E3B]/[0.08] border-[#064E3B]'
                                  : 'bg-white hover:bg-[#064E3B]/[0.02]'
                              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {/* Background fill: goal-based */}
                              <div
                                className="absolute left-0 top-0 bottom-0 bg-[#064E3B]/[0.06] transition-all duration-1000"
                                style={{ width: `${smoothWidth}%` }}
                              />

                              <div className="flex items-center gap-3 relative z-10">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                  isSelected ? 'border-[#064E3B] bg-[#064E3B]' : 'border-[#064E3B]/40 bg-white'
                                }`}>
                                  {isSelected && <span className="w-2 h-2 rounded-full bg-[#F8E7C9]" />}
                                </div>
                                <span className="font-semibold text-sm sm:text-base text-[#064E3B] font-sans">
                                  {opt.text}
                                </span>
                              </div>
                              <div className="text-right relative z-10">
                                <span className="text-sm font-bold text-[#064E3B] block font-mono">
                                  {displayedVotes}
                                </span>
                                <span className="text-[10px] text-[#064E3B]/60 font-sans uppercase tracking-wider">
                                  Total votes
                                </span>
                              </div>
                            </button>

                            {/* Animated bottom bar */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#064E3B]/10 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${smoothWidth}%` }}
                                transition={{ duration: 1.5, ease: 'easeOut' }}
                                className="h-full bg-[#064E3B]"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-5 pt-4 border-t border-[#064E3B]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="text-xs text-[#064E3B]/70 font-sans">
                        Your remaining in this round: <span className="text-[#064E3B] font-bold font-mono">{perRoundRemaining}</span> of <span className="text-[#064E3B] font-bold font-mono">{perRoundTotal}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onSubmitVote(vote)}
                        disabled={selectedOptions[vote.id] == null || vote.status !== 'active' || perRoundRemaining <= 0 || !hasVerifiedLoss}
                        className="w-full sm:w-auto px-6 py-2.5 bg-[#064E3B] hover:bg-[#043C2D] text-[#F8E7C9] rounded-[8px] font-semibold text-sm transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>{submittingVoteId === vote.id ? 'Submitting...' : 'Submit Vote'}</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Voting;

