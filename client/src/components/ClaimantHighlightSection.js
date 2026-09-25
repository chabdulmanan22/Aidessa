import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const CLAIMANTS = [
  {
    id: 'claire',
    name: 'Claire',
    location: 'Australia',
    amount: '$68,400',
    status: 'Reclaimed',
    image: '/images/claimants/claire.png'
  },
  {
    id: 'david',
    name: 'David',
    location: 'Canada',
    amount: '$142,300',
    status: 'Reclaimed',
    image: '/images/claimants/david.png'
  },
  {
    id: 'arthur',
    name: 'Arthur',
    location: 'United Kingdom',
    amount: '$89,750',
    status: 'Reclaimed',
    image: '/images/claimants/arthur.png'
  },
  {
    id: 'rachel',
    name: 'Rachel',
    location: 'United States',
    amount: '$47,200',
    status: 'Reclaimed',
    image: '/images/claimants/rachel.png'
  },
  {
    id: 'mia',
    name: 'Mia',
    location: 'Australia',
    amount: '$24,500',
    status: 'Reclaimed',
    image: '/images/claimants/mia.png'
  },
  {
    id: 'marcus',
    name: 'Marcus',
    location: 'United States',
    amount: '$94,800',
    status: 'Reclaimed',
    image: '/images/claimants/marcus.png'
  },
  {
    id: 'emma',
    name: 'Emma',
    location: 'United States',
    amount: '$186,500',
    status: 'Reclaimed',
    image: '/images/claimants/emma.png'
  },
  {
    id: 'robert',
    name: 'Robert',
    location: 'United States',
    amount: '$128,600',
    status: 'Reclaimed',
    image: '/images/claimants/robert.png'
  }
];

const ClaimantHighlightSection = () => {
  const navigate = useNavigate();

  const handleAction = () => {
    try {
      const ref = localStorage.getItem('landingReferralCode');
      navigate(ref ? `/join-notice?ref=${encodeURIComponent(ref)}` : '/join-notice');
    } catch {
      navigate('/join-notice');
    }
  };

  return (
    <section className="w-full bg-[#F8E7C9] text-[#064E3B] py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#EED5AF] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Subtext, Metrics & Hero-style CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 space-y-5 sm:space-y-6"
          >
            {/* Tag / Eyebrow */}
            <div className="inline-flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#064E3B] rounded-[2px]" />
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-[#064E3B] uppercase">
                CLAIMANT HIGHLIGHTS
              </span>
            </div>

            {/* Editorial Serif Headline */}
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-[3.25rem] font-normal text-[#064E3B] tracking-[-0.02em] leading-[1.1] sm:leading-[1.08]">
              Real victims. <br />
              <span className="text-[#043C2D]">Real recoveries.</span>
            </h2>

            {/* Description Copy */}
            <p className="font-sans text-sm sm:text-base lg:text-lg text-[#064E3B]/80 font-normal leading-relaxed max-w-xl">
              1 in 3 crypto fraud victims believe their stolen funds are lost forever. Aidessa verifies legitimate claims and returns recovered assets through on-chain Proof-of-Loss protocols and private liquidity pools.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-1 sm:pt-2">
              <div className="rounded-[8px] bg-[#FFFDF9] border border-[#064E3B]/15 p-3 sm:p-4 shadow-[0_1px_3px_rgba(6,78,59,0.04)]">
                <div className="font-editorial text-xl sm:text-2xl md:text-3xl font-normal text-[#064E3B]">$142.8M+</div>
                <div className="font-sans text-[11px] sm:text-xs text-[#064E3B]/70 font-medium pt-0.5">Returned to Claimants</div>
              </div>
              <div className="rounded-[8px] bg-[#FFFDF9] border border-[#064E3B]/15 p-3 sm:p-4 shadow-[0_1px_3px_rgba(6,78,59,0.04)]">
                <div className="font-editorial text-xl sm:text-2xl md:text-3xl font-normal text-[#064E3B]">10,000+</div>
                <div className="font-sans text-[11px] sm:text-xs text-[#064E3B]/70 font-medium pt-0.5">Verified Fraud Victims</div>
              </div>
            </div>

            {/* Action Button - Matching Hero Button Shape & Style */}
            <div className="pt-1 sm:pt-2">
              <button
                type="button"
                onClick={handleAction}
                className="inline-flex items-center gap-2.5 sm:gap-3 px-6 py-3 sm:px-7 sm:py-3.5 rounded-[6px] bg-[#064E3B] text-[#F8E7C9] text-sm sm:text-base font-medium hover:bg-[#043C2D] border border-[#043C2D] transition-all duration-200 group shadow-sm cursor-pointer"
              >
                <span>Request a refund</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={1.8} />
              </button>
            </div>
          </motion.div>

          {/* Right Column: 4x2 Grid of 8 Full-Bleed Photo Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              {CLAIMANTS.map((claimant, idx) => (
                <motion.div
                  key={claimant.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="relative rounded-[8px] sm:rounded-[10px] overflow-hidden aspect-[4/5] group border border-[#064E3B]/20 hover:border-[#064E3B]/50 transition-all duration-300 shadow-[0_2px_8px_rgba(6,78,59,0.08)] hover:shadow-[0_12px_30px_rgba(6,78,59,0.16)] cursor-pointer bg-[#064E3B]/10"
                >
                  {/* Full Card Image (User provided authentic photo) */}
                  <img
                    src={claimant.image}
                    alt={claimant.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  {/* Dark Gradient Overlay for Crisp Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />

                  {/* Card Content Overlay at Bottom - Scaled Down Compact Typography */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-2.5 md:p-3 z-10 flex items-end justify-between gap-1">
                    {/* Left: Name and Location (compact font) */}
                    <div className="text-left min-w-0">
                      <div className="font-sans font-semibold text-white text-[11px] xs:text-xs sm:text-[13px] tracking-tight leading-tight truncate drop-shadow-sm">
                        {claimant.name}
                      </div>
                      <div className="text-[9px] xs:text-[10px] sm:text-[11px] text-white/80 font-normal leading-tight pt-0.5 truncate drop-shadow-sm">
                        {claimant.location}
                      </div>
                    </div>

                    {/* Right: Reclaimed Amount and Label (compact font) */}
                    <div className="text-right shrink-0">
                      <div className="font-sans font-bold text-white text-[11px] xs:text-xs sm:text-[13px] tracking-tight leading-tight drop-shadow-sm">
                        {claimant.amount}
                      </div>
                      <div className="text-[8px] xs:text-[9px] sm:text-[10px] text-white/80 font-normal leading-tight pt-0.5 uppercase tracking-wider drop-shadow-sm">
                        {claimant.status}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ClaimantHighlightSection;
