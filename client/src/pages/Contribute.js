import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { addReceipt as dsAddReceipt, getActiveWallets as dsGetActiveWallets, getContributionTimer as dsGetContributionTimer, clearContributionTimer as dsClearContributionTimer, getReceipts as dsGetReceipts, getUsersMap as dsGetUsersMap } from '../utils/datastore';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  Coins,
  Users,
  DollarSign,
  Copy,
  CheckCircle
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { createPortal } from 'react-dom';
import HeroGridBoxesAnimation from '../components/HeroGridBoxesAnimation';

const Contribute = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [timer, setTimer] = useState(null);
  const [countdown, setCountdown] = useState('');
  const [selectedCoin, setSelectedCoin] = useState('');
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const [transactionHash, setTransactionHash] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wallets, setWallets] = useState([]);
  const [recentContributions, setRecentContributions] = useState([]);
  const [isContributionActive, setIsContributionActive] = useState(true);
  const [isRoundWindowActive, setIsRoundWindowActive] = useState(false);
  const [hasContributionRound, setHasContributionRound] = useState(false);
  const [roundFinished, setRoundFinished] = useState(false);
  const [publicContributionsEnabled, setPublicContributionsEnabled] = useState(false);
  const finalizeRound = () => {
    if (roundFinished) return;
    setRoundFinished(true);
    try { dsClearContributionTimer(); } catch (_) { }
    setTimer(null);
    setHasContributionRound(false);
    setIsRoundWindowActive(false);
    toast('Contribution round finished');
  };

  const canContribute = isContributionActive && (publicContributionsEnabled || hasContributionRound);

  // Load admin-defined wallets and contribution timer
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get('/api/settings/contributionActive');
        if (data.success) {
          setIsContributionActive(data.data.value);
        }
      } catch (error) {
        // Silently fail, default to true
        console.error('Error fetching contribution status:', error);
      }
      try {
        const { data } = await axios.get('/api/settings/publicContributionsEnabled');
        if (data.success) {
          setPublicContributionsEnabled(data.data.value === true);
        }
      } catch (error) {
        setPublicContributionsEnabled(false);
      }

      setTimer(dsGetContributionTimer());
      
      try {
        // Fetch wallets from server
        const wRes = await axios.get('/api/settings/activeWallets');
        const sWallets = wRes?.data?.data?.value;
        if (Array.isArray(sWallets)) {
          const activeOnly = sWallets.filter(w => w.isActive);
          setWallets(activeOnly);
        } else {
          setWallets(dsGetActiveWallets());
        }
      } catch (e) {
        console.error('Failed to fetch wallets from server:', e);
        setWallets(dsGetActiveWallets());
      }

      try {
        const res = await axios.get('/api/settings/contributionRound');
        const round = res?.data?.data?.value || null;
        const endMs = round?.endTime ? new Date(round.endTime).getTime() : 0;
        const startMs = round?.startTime ? new Date(round.startTime).getTime() : 0;
        const nowMs = Date.now();
        const hasRound = Boolean(round && round.startTime && round.endTime && nowMs <= endMs);
        setHasContributionRound(hasRound);
        setIsRoundWindowActive(Boolean(nowMs >= startMs && nowMs <= endMs));
      } catch (_) {
        const nowMs = Date.now();
        const localTimer = dsGetContributionTimer();
        setHasContributionRound(Boolean(localTimer?.endTime && nowMs <= localTimer.endTime));
        setIsRoundWindowActive(Boolean(localTimer?.endTime && nowMs <= localTimer.endTime));
      }

      // Fetch actual recent contributions from server if logged in
      let mapped = [];
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await axios.get('/api/contributions/mine', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const list = res?.data?.data?.contributions || [];
          mapped = list.map(c => ({
            id: c._id || c.id,
            user: (c.user?.firstName || 'Me'),
            amount: c.amount || 0,
            currency: c.currency || 'USD',
            usdValue: c.amount || 0,
            status: c.status === 'approved' ? 'verified' : (c.status || 'pending'),
            submittedAt: c.createdAt || new Date().toISOString(),
          }));
        }
      } catch (e) {
        console.error('Error fetching server contributions:', e);
      }

      // Fallback/Merge with local datastore for guest submissions
      if (mapped.length === 0) {
        const raw = dsGetReceipts();
        const users = dsGetUsersMap ? dsGetUsersMap() : {};
        mapped = raw.map((r) => ({
          id: r.id,
          user: ((users[r.userEmail]?.email || r.userEmail || '').split('@')[0]) || 'user',
          amount: r.amount || 0,
          currency: r.currency || 'USD',
          usdValue: r.amount || 0,
          status: r.verified ? 'verified' : (r.status || 'pending'),
          submittedAt: new Date(r.time).toISOString(),
        }));
      }

      setRecentContributions(mapped.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)).slice(0, 5));
    };
    load();
    const interval = setInterval(load, 15000); // Refresh every 15s
    const onUpdate = () => load();
    window.addEventListener('datastore:update', onUpdate);
    return () => {
      clearInterval(interval);
      window.removeEventListener('datastore:update', onUpdate);
    };
  }, []);

  // Contribution tiers removed

  // Timer countdown effect from datastore
  useEffect(() => {
    const interval = setInterval(() => {
      if (!timer?.endTime) {
        setCountdown('');
        return;
      }
      const now = Date.now();
      const diff = timer.endTime - now;
      if (diff <= 0) {
        setCountdown('00:00:00');
        finalizeRound();
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Calculate crypto amount when USD amount or coin changes
  useEffect(() => {
    if (amount && selectedCoin) {
      const w = wallets.find(c => c.symbol === selectedCoin);
      if (w && w.rate) {
        const cryptoValue = (parseFloat(amount) / Number(w.rate)).toFixed(6);
        setCryptoAmount(cryptoValue);
        setWalletAddress(w.address);
      } else if (w) {
        setWalletAddress(w.address);
        setCryptoAmount('');
      }
    } else {
      setCryptoAmount('');
      setWalletAddress('');
    }
  }, [amount, selectedCoin, wallets]);

  const getPointsForAmount = (usdAmount) => {
    const amt = parseFloat(usdAmount);
    if (amt >= 1000) return 1000;
    if (amt >= 500) return 300;
    if (amt >= 300) return 100;
    if (amt >= 100) return 30;
    if (amt >= 50) return 15;
    return 0;
  };

  const handleGenerateQR = () => {
    if (!amount || !selectedCoin) {
      toast.error('Please enter an amount and select a cryptocurrency');
      return;
    }

    if (parseFloat(amount) < 50) {
      toast.error('Minimum contribution amount is $50');
      return;
    }

    setShowQR(true);
    if (!hasContributionRound) {
      toast('No admin-set round: QR available, points won’t be added');
    } else {
      toast.success('QR code generated! Scan to send payment');
    }
  };

  const copyWalletAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success('Wallet address copied!');
  };

  // Referral removed

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const generateQRCodeData = () => {
    return `${selectedCoin}:${walletAddress}?amount=${cryptoAmount}&label=DOA Contribution`;
  };

  const handleReceiptChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      toast.error('Only PNG, JPG, and PDF files are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB');
      return;
    }
    setReceiptFile(file);
  };

  const handleSubmitProof = async () => {
    try {
      if (!amount || parseFloat(amount) < 50) {
        toast.error('Minimum contribution amount is $50');
        return;
      }
      if (!selectedCoin) {
        toast.error('Please select a cryptocurrency');
        return;
      }
      if (!walletAddress) {
        toast.error('Wallet address is missing');
        return;
      }
      if (!receiptFile) {
        toast.error('Please upload a receipt (screenshot or PDF)');
        return;
      }

      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('receipt', receiptFile);
      formData.append('amount', amount);
      formData.append('currency', selectedCoin);
      formData.append('walletAddress', walletAddress);
      if (transactionHash) formData.append('transactionHash', transactionHash);

      const { data } = await axios.post('/api/contributions/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (data?.success) {
        // Also record locally so admin views reflect immediately
        dsAddReceipt({
          userEmail: user?.email || 'anonymous@local',
          amount: Number(amount) || 0,
          currency: selectedCoin || 'USD',
          url: data?.data?.receiptUrl || transactionHash || '',
          notes: `Uploaded via API${transactionHash ? ` • tx ${transactionHash}` : ''}`
        });
        if (!hasContributionRound && !publicContributionsEnabled) {
          toast.success('Proof submitted. Points will not be added (round inactive).');
        } else {
          toast.success('Proof submitted! We will review and credit points.');
        }
        setReceiptFile(null);
        setTransactionHash('');
        setShowQR(false);
        setAmount('');
        setSelectedCoin('');
        setWalletAddress('');
        setCryptoAmount('');
      } else {
        toast.error(data?.message || 'Failed to submit proof');
      }
    } catch (err) {
      // Fallback: store receipt locally
      dsAddReceipt({
        userEmail: user?.email || 'anonymous@local',
        amount: Number(amount) || 0,
        currency: selectedCoin || 'USD',
        url: transactionHash || '',
        notes: receiptFile?.name || 'Local submission'
      });
      toast.success('Proof saved locally. Admin can verify and award points.');
      setReceiptFile(null);
      setTransactionHash('');
      setShowQR(false);
      setAmount('');
      setSelectedCoin('');
      setWalletAddress('');
      setCryptoAmount('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] bg-[#F8E7C9] text-[#064E3B] py-8 sm:py-12 overflow-hidden">
      {/* Background Animated Grid Texture */}
      <HeroGridBoxesAnimation />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="flex items-center justify-between gap-4"
        >
          <div>
            <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-[#064E3B] tracking-[-0.02em]">
              Contribute
            </h1>
            <p className="text-[#064E3B]/70 text-sm sm:text-base font-sans mt-1">
              Contribute to the DAO's progress and earn restitution points
            </p>
          </div>
          <button
            onClick={handleBackToDashboard}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[8px] bg-transparent hover:bg-[#064E3B]/[0.06] border border-[#064E3B]/20 text-[#064E3B] text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
        </motion.div>

        {/* Voluntary Notification Banner */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-4 sm:p-5 flex items-start gap-3.5 shadow-[0_8px_30px_rgba(6,78,59,0.04)]"
        >
          <div className="p-2 rounded-[6px] bg-[#064E3B]/[0.08] text-[#064E3B] shrink-0 mt-0.5">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#064E3B] block font-sans">
              Voluntary Notice
            </span>
            <p className="text-xs sm:text-sm text-[#064E3B]/80 font-sans mt-0.5 leading-relaxed">
              Contributions are voluntary and optional. Your support is appreciated but not required.
            </p>
          </div>
        </motion.div>

        {/* Timer Section - Only show if a round is actually active/running */}
        {timer?.endTime && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-6 sm:p-8 text-center text-[#064E3B] shadow-[0_8px_30px_rgba(6,78,59,0.06)] space-y-2"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <Clock className="w-5 h-5 text-[#064E3B]" />
              <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#064E3B]">
                Contribution Round
              </h3>
            </div>
            <div className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-[#064E3B] tracking-wider">
              {countdown}
            </div>
            <p className="text-xs sm:text-sm text-[#064E3B]/60 font-sans">
              Until the current contribution round ends
            </p>
          </motion.div>
        )}

        {/* Contribution Tiers & Points — visible only when contributions are on */}
        {canContribute && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-6 sm:p-8 text-[#064E3B] shadow-[0_8px_30px_rgba(6,78,59,0.06)]"
          >
            <div className="pb-4 border-b border-[#064E3B]/10 flex items-center justify-between">
              <div>
                <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#064E3B]">
                  Contribution Tiers &amp; Points
                </h3>
                <p className="text-xs text-[#064E3B]/60 font-sans mt-0.5">
                  Points awarded upon verified contribution receipt
                </p>
              </div>
              <Coins className="w-6 h-6 text-[#064E3B]/60 hidden sm:block" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6 font-sans">
              {[
                { range: '$50–$99', pts: '15 points' },
                { range: '$100–$299', pts: '30 points' },
                { range: '$300–$499', pts: '100 points' },
                { range: '$500–$999', pts: '300 points' },
                { range: '$1,000+', pts: '1,000 points' },
              ].map((tier, idx) => (
                <div key={idx} className="rounded-[8px] bg-[#064E3B]/[0.03] border border-[#064E3B]/10 p-3.5 text-center">
                  <span className="text-xs text-[#064E3B]/70 block">{tier.range}</span>
                  <span className="text-sm font-bold text-[#064E3B] block mt-1">{tier.pts}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Contribution Form */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-6 sm:p-8 text-[#064E3B] shadow-[0_8px_30px_rgba(6,78,59,0.06)] space-y-6"
        >
          <div className="pb-4 border-b border-[#064E3B]/10">
            <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#064E3B]">
              Make a Contribution
            </h3>
            <p className="text-xs text-[#064E3B]/60 font-sans mt-0.5">
              Select your currency and enter payment details
            </p>
          </div>

          <div className="space-y-5 font-sans">
            {/* Amount Input */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5">
                Enter Amount in USD
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#064E3B]/50 font-bold">
                  $
                </div>
                <input
                  type={canContribute ? "number" : "text"}
                  value={canContribute ? amount : "Contributions are currently disabled"}
                  onChange={(e) => canContribute && setAmount(e.target.value)}
                  placeholder="50"
                  className={`w-full pl-8 pr-4 py-2.5 bg-white border rounded-[8px] text-sm text-[#064E3B] placeholder-[#064E3B]/35 focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] transition-all ${
                    !canContribute 
                      ? 'border-amber-500/40 bg-amber-50/50 text-amber-700 font-medium cursor-not-allowed' 
                      : 'border-[#064E3B]/20'
                  }`}
                  min="50"
                  disabled={!canContribute}
                />
              </div>
              <p className="mt-1.5 text-xs text-[#064E3B]/60">Minimum contribution amount is $50</p>
              {amount && hasContributionRound && (
                <div className="mt-1.5 text-xs">
                  <span className="text-[#064E3B]/70">You will earn: </span>
                  <span className="text-[#064E3B] font-bold">{getPointsForAmount(amount)} points</span>
                </div>
              )}
            </div>

            {/* Cryptocurrency Selection */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#064E3B] mb-2">
                Select Cryptocurrency
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {wallets.map((crypto) => (
                  <button
                    key={crypto.symbol}
                    type="button"
                    onClick={() => setSelectedCoin(crypto.symbol)}
                    className={`p-3 rounded-[8px] border text-left transition-all cursor-pointer ${
                      selectedCoin === crypto.symbol
                        ? 'border-[#064E3B] bg-[#064E3B]/[0.08] text-[#064E3B] ring-2 ring-[#064E3B]/20'
                        : 'border-[#064E3B]/15 bg-white/60 hover:bg-[#064E3B]/[0.03] text-[#064E3B]/80'
                    } ${!canContribute ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={wallets.length === 0 || !canContribute}
                  >
                    <div className="font-bold text-sm sm:text-base text-[#064E3B]">{crypto.symbol}</div>
                    <div className="text-xs text-[#064E3B]/60 truncate">{crypto.name}</div>
                    {crypto.rate && (
                      <div className="text-xs text-[#064E3B] font-semibold mt-0.5">${crypto.rate}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Estimate Display */}
            {amount && selectedCoin && cryptoAmount && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="rounded-[8px] bg-[#064E3B]/[0.03] border border-[#064E3B]/10 p-4 space-y-2 text-sm"
              >
                <h4 className="font-semibold text-[#064E3B] text-xs uppercase tracking-wider">Payment Estimate</h4>
                <div className="flex justify-between">
                  <span className="text-[#064E3B]/70">USD Amount:</span>
                  <span className="font-semibold text-[#064E3B]">${amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#064E3B]/70">Crypto Amount:</span>
                  <span className="font-semibold text-[#064E3B]">{cryptoAmount} {selectedCoin}</span>
                </div>
                {(hasContributionRound || publicContributionsEnabled) && (
                  <div className="flex justify-between pt-1 border-t border-[#064E3B]/10">
                    <span className="text-[#064E3B]/70">Points to Earn:</span>
                    <span className="font-bold text-[#064E3B]">{getPointsForAmount(amount)} pts</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Generate / Scan Button */}
            <button
              type="button"
              onClick={handleGenerateQR}
              disabled={!amount || !selectedCoin || parseFloat(amount) < 50 || (!cryptoAmount && !walletAddress)}
              className={`w-full py-3 font-semibold text-sm rounded-[8px] transition-all shadow-sm cursor-pointer ${
                !amount || !selectedCoin || parseFloat(amount) < 50 || (!cryptoAmount && !walletAddress)
                  ? 'bg-[#064E3B]/20 text-[#064E3B]/40 cursor-not-allowed border border-transparent'
                  : 'bg-[#064E3B] hover:bg-[#043C2D] border border-[#043C2D] text-[#F8E7C9]'
              }`}
            >
              View Estimate &amp; Wallet Address (QR Code)
            </button>
          </div>
        </motion.div>

        {/* Standalone Submit Proof Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-6 sm:p-8 text-[#064E3B] shadow-[0_8px_30px_rgba(6,78,59,0.06)] space-y-6"
        >
          <div className="pb-4 border-b border-[#064E3B]/10 flex items-center gap-3">
            <div className="p-2.5 rounded-[8px] bg-[#064E3B]/[0.08] text-[#064E3B] border border-[#064E3B]/15 shrink-0">
              <CheckCircle className="w-5 h-5 text-[#064E3B]" />
            </div>
            <div>
              <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#064E3B]">
                Submit Proof of Payment
              </h3>
              <p className="text-xs text-[#064E3B]/60 font-sans mt-0.5">
                Upload your transaction receipt for verification and points allocation
              </p>
            </div>
          </div>

          <div className="space-y-4 font-sans">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5">
                Upload Receipt (PNG, JPG, PDF)
              </label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/heic,application/pdf"
                onChange={handleReceiptChange}
                className="w-full bg-white border border-[#064E3B]/20 rounded-[8px] px-3.5 py-2 text-sm text-[#064E3B] file:mr-3 file:py-1 file:px-3 file:rounded-[6px] file:border-0 file:text-xs file:font-semibold file:bg-[#064E3B] file:text-[#F8E7C9] file:cursor-pointer hover:file:bg-[#043C2D] focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25"
              />
              {receiptFile && (
                <div className="mt-1.5 text-xs text-[#064E3B]/70">
                  Selected file: <span className="font-semibold text-[#064E3B]">{receiptFile.name}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5">
                Transaction Hash (Optional)
              </label>
              <input
                value={transactionHash}
                onChange={(e) => setTransactionHash(e.target.value)}
                placeholder="0x..."
                className="w-full bg-white border border-[#064E3B]/20 rounded-[8px] px-3.5 py-2.5 text-sm text-[#064E3B] placeholder-[#064E3B]/35 focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B]"
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleSubmitProof}
                disabled={isSubmitting || !receiptFile}
                className={`w-full py-3 font-semibold text-sm rounded-[8px] transition-all shadow-sm cursor-pointer ${
                  isSubmitting || !receiptFile
                    ? 'bg-[#064E3B]/20 text-[#064E3B]/40 cursor-not-allowed border border-transparent'
                    : 'bg-[#064E3B] hover:bg-[#043C2D] border border-[#043C2D] text-[#F8E7C9]'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Proof'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* QR Code Modal (Rendered via createPortal to document.body) */}
        {showQR && typeof document !== 'undefined' && createPortal(
          <div
            className="fixed inset-0 bg-[#064E3B]/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 font-sans"
            onClick={() => setShowQR(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-[#FFFDF9] rounded-[10px] p-6 sm:p-8 border border-[#064E3B]/20 w-full max-w-md relative shadow-[0_24px_60px_rgba(6,78,59,0.22)] text-[#064E3B] space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pb-3 border-b border-[#064E3B]/10 flex items-center justify-between">
                <div>
                  <h3 className="font-editorial text-2xl font-normal text-[#064E3B]">Scan to Pay</h3>
                  <p className="text-xs text-[#064E3B]/60 mt-0.5">Use your crypto wallet app to scan</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowQR(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#064E3B]/50 hover:text-[#064E3B] hover:bg-[#064E3B]/10 transition-colors text-lg font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="bg-white p-4 rounded-[8px] border border-[#064E3B]/15 flex items-center justify-center">
                {wallets.find(c => c.symbol === selectedCoin)?.qrCode ? (
                  <img src={wallets.find(c => c.symbol === selectedCoin)?.qrCode} alt="Payment QR" className="mx-auto h-52 w-52 object-contain" />
                ) : (
                  <QRCodeSVG value={generateQRCodeData()} size={208} />
                )}
              </div>

              <div className="text-center">
                <p className="text-base sm:text-lg font-bold text-[#064E3B]">{cryptoAmount} {selectedCoin}</p>
                <p className="text-xs text-[#064E3B]/60">≈ ${amount} USD</p>
              </div>

              <div className="bg-[#064E3B]/[0.04] border border-[#064E3B]/10 rounded-[8px] p-3 space-y-1">
                <p className="text-[11px] font-semibold text-[#064E3B]/60 uppercase tracking-wider">Send to Address:</p>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-[#064E3B] break-all">{walletAddress}</span>
                  <button
                    type="button"
                    onClick={copyWalletAddress}
                    className="p-1.5 rounded-[6px] hover:bg-[#064E3B]/10 text-[#064E3B] cursor-pointer shrink-0 transition-colors"
                    title="Copy Address"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowQR(false)}
                className="w-full py-2.5 bg-[#064E3B] text-[#F8E7C9] font-semibold text-sm rounded-[8px] hover:bg-[#043C2D] border border-[#043C2D] shadow-sm transition-colors cursor-pointer"
              >
                Close
              </button>
            </motion.div>
          </div>,
          document.body
        )}

        {/* Recent Contributions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-6 sm:p-8 text-[#064E3B] shadow-[0_8px_30px_rgba(6,78,59,0.06)] space-y-4"
        >
          <div className="pb-3 border-b border-[#064E3B]/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Users className="w-5 h-5 text-[#064E3B]" />
              <h3 className="font-editorial text-2xl font-normal text-[#064E3B]">
                Recent Contributions
              </h3>
            </div>
            <span className="text-xs text-[#064E3B]/60 font-sans">Latest activity</span>
          </div>

          <div className="space-y-2.5 font-sans">
            {recentContributions.length === 0 ? (
              <div className="p-4 text-center text-xs text-[#064E3B]/60 bg-[#064E3B]/[0.02] rounded-[8px] border border-[#064E3B]/10">
                No contributions recorded yet.
              </div>
            ) : (
              recentContributions.map((c, i) => {
                const getStatusColor = (status) => {
                  switch (status) {
                    case 'verified': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
                    case 'approved': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
                    case 'rejected': return 'text-red-700 bg-red-50 border-red-200';
                    case 'under_review': return 'text-blue-700 bg-blue-50 border-blue-200';
                    default: return 'text-amber-700 bg-amber-50 border-amber-200';
                  }
                };
                const getStatusLabel = (status) => {
                  if (status === 'under_review') return 'Under Review';
                  return status.charAt(0).toUpperCase() + status.slice(1);
                };

                return (
                  <div key={i} className="flex items-center justify-between p-3 rounded-[8px] bg-[#064E3B]/[0.02] border border-[#064E3B]/10">
                    <div>
                      <p className="text-sm font-semibold text-[#064E3B]">{c.user}</p>
                      <p className="text-xs text-[#064E3B]/50">{new Date(c.submittedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <span className="text-sm font-bold text-[#064E3B]">${c.usdValue}</span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getStatusColor(c.status)}`}>
                        {getStatusLabel(c.status)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contribute;
