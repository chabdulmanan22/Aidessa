import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, User, ArrowRight } from 'lucide-react';

const JoinSubmitted = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefill = location.state?.prefill || {};

  const handleCreateAccount = () => {
    navigate('/register', { state: { prefill } });
  };

  return (
    <div className="max-w-xl mx-auto rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-7 sm:p-10 md:p-12 text-[#064E3B] shadow-[0_12px_40px_rgba(6,78,59,0.08)] text-center">
      {/* Success Icon */}
      <div className="flex items-center justify-center mb-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#064E3B]/[0.08] border-2 border-[#064E3B]/20 flex items-center justify-center text-[#064E3B] shadow-sm">
          <Check className="w-8 h-8 sm:w-10 sm:h-10 text-[#064E3B]" strokeWidth={2.5} />
        </div>
      </div>

      {/* Status Label */}
      <p className="text-[11px] sm:text-xs font-bold tracking-[0.2em] text-[#064E3B]/70 uppercase mb-2">
        Application Received
      </p>

      <h1 className="font-editorial text-3xl sm:text-4xl md:text-[42px] font-normal text-[#064E3B] tracking-[-0.02em] leading-tight mb-3">
        Claim Submitted!
      </h1>

      <p className="text-sm sm:text-base text-[#064E3B]/80 font-sans max-w-md mx-auto mb-8 leading-relaxed">
        Your claim will be verified within <span className="font-bold text-[#064E3B]">48 hours</span>. Create your account now to track your status.
      </p>

      {/* Action Button matching Home Page primary style */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleCreateAccount}
          className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-2.5 sm:py-3 rounded-[8px] bg-[#064E3B] text-[#F8E7C9] text-sm sm:text-base font-semibold hover:bg-[#043C2D] border border-[#043C2D] shadow-md shadow-[#064E3B]/20 active:scale-95 transition-all duration-200 group cursor-pointer"
        >
          <User className="w-4 h-4 text-[#F8E7C9]" strokeWidth={2} />
          <span>Create Your Account</span>
          <ArrowRight className="w-4 h-4 text-[#F8E7C9] transition-transform group-hover:translate-x-1" strokeWidth={2} />
        </button>
      </div>

      {/* Trust points */}
      <div className="mt-8 pt-5 border-t border-[#064E3B]/10 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-[#064E3B]/70 font-sans">
        <span>Free to join</span>
        <span className="inline-block w-1 h-1 rounded-full bg-[#064E3B]/30" />
        <span>Track your claim status</span>
        <span className="inline-block w-1 h-1 rounded-full bg-[#064E3B]/30" />
        <span>Earn points</span>
      </div>
    </div>
  );
};

export default JoinSubmitted;

