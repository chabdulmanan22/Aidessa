import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Home, BarChart3 } from 'lucide-react';
import HeroGridBoxesAnimation from '../components/HeroGridBoxesAnimation';

const JoinThankYou = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] bg-[#F8E7C9] text-[#064E3B] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background Animated Grid Texture */}
      <HeroGridBoxesAnimation />

      <div className="relative z-10 max-w-xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-8 sm:p-12 text-[#064E3B] shadow-[0_16px_50px_rgba(6,78,59,0.08)] text-center space-y-6"
        >
          {/* Success Icon */}
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#064E3B]/[0.08] border-2 border-[#064E3B]/20 flex items-center justify-center text-[#064E3B] shadow-sm">
              <Check className="w-8 h-8 sm:w-10 sm:h-10 text-[#064E3B]" strokeWidth={2.5} />
            </div>
          </div>

          {/* Status Label & Title */}
          <div>
            <p className="text-[11px] sm:text-xs font-bold tracking-[0.2em] text-[#064E3B]/70 uppercase mb-2">
              Application Submitted
            </p>
            <h1 className="font-editorial text-3xl sm:text-4xl md:text-[42px] font-normal text-[#064E3B] tracking-[-0.02em] leading-tight">
              Thank You
            </h1>
            <p className="text-sm sm:text-base text-[#064E3B]/80 font-sans max-w-md mx-auto mt-3 leading-relaxed">
              You have successfully submitted your claim application. Your claim will be reviewed by our team.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[8px] border border-[#064E3B]/20 bg-transparent hover:bg-[#064E3B]/[0.06] text-[#064E3B] text-sm font-semibold transition-all cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-[8px] bg-[#064E3B] hover:bg-[#043C2D] border border-[#043C2D] text-[#F8E7C9] text-sm font-semibold shadow-sm transition-all cursor-pointer group"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Trust points */}
          <div className="pt-5 border-t border-[#064E3B]/10 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-[#064E3B]/70 font-sans">
            <span>Free claim review</span>
            <span className="inline-block w-1 h-1 rounded-full bg-[#064E3B]/30" />
            <span>Track progress anytime</span>
            <span className="inline-block w-1 h-1 rounded-full bg-[#064E3B]/30" />
            <span>Secure encryption</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default JoinThankYou;