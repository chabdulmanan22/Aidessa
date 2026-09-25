import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Copy, Check, Link as LinkIcon, Gift } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import { getJoinApplications } from '../utils/datastore';
import HeroGridBoxesAnimation from '../components/HeroGridBoxesAnimation';

const Referral = () => {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        if (!user?._id && !user?.id) {
          const apps = getJoinApplications();
          const code = user?.referralCode || '';
          const list = apps.filter(a => String(a.referralCode || '') === String(code));
          setReferrals(list);
          return;
        }
        const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
        const uid = String(user?._id || user?.id);
        const res = await axios.get(`/api/users/${uid}/referrals`, { params: { limit: 100 }, headers });
        const apiRefs = res.data?.data?.referrals || [];
        setReferrals(apiRefs.map(r => ({
          firstName: r.firstName,
          lastName: r.lastName,
          email: r.email,
          time: r.createdAt,
          status: r.status || 'active'
        })));
      } catch (e) {
        const apps = getJoinApplications();
        const code = user?.referralCode || '';
        const list = apps.filter(a => String(a.referralCode || '') === String(code));
        setReferrals(list);
      }
    };
    load();
  }, [user?.referralCode, user?._id, user?.id]);

  const link = user?.referralCode ? `${window.location.origin}/home?ref=${user.referralCode}` : '';

  const copyLink = () => {
    if (!link) return;
    const onSuccess = () => {
      setCopied(true);
      toast.success('Referral link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(link).then(onSuccess).catch(() => fallbackCopy());
    } else {
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    const textArea = document.createElement("textarea");
    textArea.value = link;
    textArea.style.position = "absolute";
    textArea.style.left = "-999999px";
    document.body.prepend(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      toast.success('Referral link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    } finally {
      textArea.remove();
    }
  };

  const referralPoints = (user?.stats?.referralPoints !== undefined) 
    ? user.stats.referralPoints 
    : (referrals.length * 10);

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
              <Users className="w-8 h-8 text-[#064E3B]" />
              <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-[#064E3B] tracking-[-0.02em]">
                Referral
              </h1>
            </div>
            <p className="text-[#064E3B]/70 text-sm sm:text-base font-sans mt-1">
              Share your link and track your referrals to earn ecosystem points.
            </p>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-5 sm:p-6 text-[#064E3B] shadow-[0_8px_30px_rgba(6,78,59,0.06)] hover:border-[#064E3B]/35 hover:shadow-[0_12px_40px_rgba(6,78,59,0.1)] transition-all duration-[1500ms] flex items-center gap-4"
          >
            <div className="p-3 bg-[#064E3B]/[0.08] border border-[#064E3B]/15 rounded-[8px] text-[#064E3B] shrink-0">
              <Users className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="font-editorial text-2xl sm:text-3xl font-normal text-[#064E3B]">
                {referrals.length}
              </div>
              <p className="text-[#064E3B]/70 text-xs sm:text-sm font-sans mt-0.5">Total Referrals</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.1 }}
            className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-5 sm:p-6 text-[#064E3B] shadow-[0_8px_30px_rgba(6,78,59,0.06)] hover:border-[#064E3B]/35 hover:shadow-[0_12px_40px_rgba(6,78,59,0.1)] transition-all duration-[1500ms] flex items-center gap-4"
          >
            <div className="p-3 bg-[#064E3B]/[0.08] border border-[#064E3B]/15 rounded-[8px] text-[#064E3B] shrink-0">
              <Gift className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="font-editorial text-2xl sm:text-3xl font-normal text-[#064E3B]">
                {referralPoints.toLocaleString()}
              </div>
              <p className="text-[#064E3B]/70 text-xs sm:text-sm font-sans mt-0.5">Points Earned (+10 each)</p>
            </div>
          </motion.div>
        </div>

        {/* Your Referral Link Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.15 }}
          className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-6 sm:p-8 text-[#064E3B] shadow-[0_8px_30px_rgba(6,78,59,0.06)]"
        >
          <div className="pb-4 border-b border-[#064E3B]/10 min-h-[44px] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-[8px] bg-[#064E3B]/[0.08] text-[#064E3B] border border-[#064E3B]/15 shrink-0">
                <LinkIcon className="w-5 h-5 text-[#064E3B]" />
              </div>
              <div>
                <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#064E3B]">
                  Your Referral Link
                </h3>
                <p className="text-[#064E3B]/60 text-xs font-sans mt-0.5">
                  Share this unique link to invite beneficiaries and receive reward points
                </p>
              </div>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#064E3B]/60 font-sans hidden sm:inline-block">
              Invite Link
            </span>
          </div>

          <div className="pt-6">
            {user?.referralCode ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-[#064E3B]/[0.03] border border-[#064E3B]/15 rounded-[8px] p-2 sm:p-2.5">
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 font-mono text-xs sm:text-sm text-[#064E3B] hover:text-[#043C2D] underline break-all px-2 py-1 select-all"
                >
                  {link}
                </a>
                <button
                  type="button"
                  onClick={copyLink}
                  className="px-5 py-2.5 rounded-[6px] bg-[#064E3B] hover:bg-[#043C2D] text-[#F8E7C9] font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shrink-0 shadow-sm active:scale-95 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-[#F8E7C9]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#F8E7C9]" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="rounded-[8px] bg-[#064E3B]/[0.02] border border-[#064E3B]/10 p-4 text-[#064E3B]/60 text-sm font-sans text-center">
                No referral code available for your account.
              </div>
            )}
          </div>
        </motion.div>

        {/* Your Referrals Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
          className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-6 sm:p-8 text-[#064E3B] shadow-[0_8px_30px_rgba(6,78,59,0.06)]"
        >
          <div className="pb-4 border-b border-[#064E3B]/10 min-h-[44px] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-[8px] bg-[#064E3B]/[0.08] text-[#064E3B] border border-[#064E3B]/15 shrink-0">
                <Users className="w-5 h-5 text-[#064E3B]" />
              </div>
              <div>
                <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#064E3B]">
                  Your Referrals
                </h3>
                <p className="text-[#064E3B]/60 text-xs font-sans mt-0.5">
                  Beneficiaries who registered through your invitation link
                </p>
              </div>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#064E3B]/60 font-sans">
              {referrals.length} Total
            </span>
          </div>

          <div className="pt-6">
            {referrals.length === 0 ? (
              <div className="rounded-[8px] bg-[#064E3B]/[0.02] border border-[#064E3B]/10 p-8 sm:p-10 text-center">
                <Users className="w-10 h-10 text-[#064E3B]/30 mx-auto mb-3" />
                <h4 className="font-editorial text-xl font-normal text-[#064E3B] mb-1">
                  No Referrals Yet
                </h4>
                <p className="text-[#064E3B]/60 text-sm font-sans max-w-md mx-auto">
                  Share your referral link above with others. You will receive 10 points for each registered beneficiary.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {referrals.map((r, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 rounded-[8px] bg-[#064E3B]/[0.02] hover:bg-[#064E3B]/[0.04] border border-[#064E3B]/10 p-3.5 sm:p-4 transition-colors font-sans"
                  >
                    <div>
                      <p className="font-editorial text-base sm:text-lg font-normal text-[#064E3B]">
                        {`${r.firstName || ''} ${r.lastName || ''}`.trim() || r.email || 'Beneficiary'}
                      </p>
                      <p className="text-xs text-[#064E3B]/60 font-sans mt-0.5">{r.email}</p>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-1">
                      <span className="text-xs text-[#064E3B]/50 font-mono">
                        {new Date(r.time || Date.now()).toLocaleDateString()}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full capitalize font-sans">
                        {r.status || 'Active'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Referral;

