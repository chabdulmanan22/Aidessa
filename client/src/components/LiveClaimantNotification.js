import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CLAIMANTS } from './ClaimantHighlightSection';

const LiveClaimantNotification = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const nextDelayRef = useRef(2000); // 2000ms auto-pause, 3000ms when manually closed

  // Initial appearance: appear 2 seconds after page load
  useEffect(() => {
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(initialTimer);
  }, []);

  // Main infinite auto-cycle loop:
  // When isVisible is true -> stay visible for 5s, then set isVisible = false
  // When isVisible is false -> wait nextDelayRef (2s for auto, 3s if closed), advance index, set isVisible = true
  useEffect(() => {
    let timer;

    if (isVisible) {
      // Hold card for 5 seconds
      timer = setTimeout(() => {
        nextDelayRef.current = 2000; // Reset auto-cycle delay to 2 seconds
        setIsVisible(false);
      }, 5000);
    } else {
      // Wait for pause duration (2s auto, or 3s if user clicked X), then show next card
      timer = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % CLAIMANTS.length);
        setIsVisible(true);
      }, nextDelayRef.current);
    }

    return () => clearTimeout(timer);
  }, [isVisible]);

  // User manually closes the card
  const handleClose = (e) => {
    e.stopPropagation();
    nextDelayRef.current = 3000; // Wait exactly 3 seconds before next card appears
    setIsVisible(false);
  };

  // Click card to navigate to refund notice
  const handleCardClick = () => {
    try {
      const ref = localStorage.getItem('landingReferralCode');
      navigate(ref ? `/join-notice?ref=${encodeURIComponent(ref)}` : '/join-notice');
    } catch {
      navigate('/join-notice');
    }
  };

  const claimant = CLAIMANTS[currentIndex];
  if (!claimant) return null;

  return (
    <div className="fixed bottom-4 left-3 right-3 sm:right-auto sm:left-6 sm:bottom-6 z-40 select-none pointer-events-none flex justify-center sm:justify-start">
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={claimant.id}
            initial={{ opacity: 0, y: 35, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            onClick={handleCardClick}
            className="pointer-events-auto relative w-full sm:w-[350px] max-w-[360px] bg-[#FFFDF9]/95 backdrop-blur-md border border-[#064E3B]/20 rounded-[10px] p-3 sm:p-3.5 shadow-xl shadow-[#064E3B]/10 cursor-pointer hover:border-[#064E3B]/40 hover:shadow-2xl transition-all duration-200 group overflow-hidden"
          >
            {/* Top Right Action: Close Cross */}
            <div className="absolute top-2.5 right-2.5 flex items-center z-20">
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close notification"
                title="Close"
                className="p-1 text-[#064E3B]/50 hover:text-[#064E3B] hover:bg-[#064E3B]/10 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 pr-7">
              {/* Claimant Image with Verified Badge */}
              <div className="relative flex-shrink-0">
                <img
                  src={claimant.image}
                  alt={claimant.name}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-[#064E3B]/25 shadow-sm group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-600 border-2 border-[#FFFDF9] flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white stroke-[3.5]" />
                </div>
              </div>

              {/* Claimant Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-[#064E3B]/70">
                    Verified Recovery
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#064E3B] truncate leading-tight">
                  {claimant.name}
                  <span className="text-[11px] sm:text-xs font-normal text-[#064E3B]/70 ml-1.5">
                    • {claimant.location}
                  </span>
                </div>
                <div className="text-[11px] sm:text-xs font-semibold text-[#064E3B]/85 mt-1 flex items-baseline gap-1.5">
                  <span className="text-xs sm:text-sm font-black text-[#064E3B]">
                    {claimant.amount}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-medium text-emerald-800 uppercase tracking-wide">
                    Refunded
                  </span>
                </div>
              </div>
            </div>

            {/* 5-second countdown progress indicator bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#064E3B]/10 overflow-hidden">
              <motion.div
                key={claimant.id}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 5, ease: 'linear' }}
                className="h-full bg-emerald-700/60"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveClaimantNotification;
