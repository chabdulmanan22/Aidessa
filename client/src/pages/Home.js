import React, { useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import StaticResourceCard from '../components/StaticResourceCard';
import HeroGridBoxesAnimation from '../components/HeroGridBoxesAnimation';
import ClaimantHighlightSection from '../components/ClaimantHighlightSection';
import LiveClaimantNotification from '../components/LiveClaimantNotification';
import { STATIC_FEATURED_RESOURCES } from '../data/staticFeaturedResources';

const SecureDistributionIcon = () => (
  <svg
    className="w-7 h-7 transition-transform duration-300 group-hover:scale-105"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="5" y="8" width="22" height="18" rx="3.5" fill="currentColor" fillOpacity="0.08" />
    <rect x="5" y="8" width="22" height="18" rx="3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="16" cy="17" r="4.2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M16 19.5V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M10 8V6.5C10 4.5 12.7 3 16 3C19.3 3 22 4.5 22 6.5V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const RecoveryStatsIcon = () => (
  <svg
    className="w-7 h-7 transition-transform duration-300 group-hover:scale-105"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="4.5" y="5" width="23" height="22" rx="3.5" fill="currentColor" fillOpacity="0.08" />
    <rect x="4.5" y="5" width="23" height="22" rx="3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.5 21V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M14 21V10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M18.5 21V16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M22.5 21V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ProgramTrackerIcon = () => (
  <svg
    className="w-7 h-7 transition-transform duration-300 group-hover:scale-105"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="16" cy="16" r="12" fill="currentColor" fillOpacity="0.08" />
    <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 19.5L13.5 15L17.5 19L23 11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="18.5 11.5 23 11.5 23 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TransparentVotingIcon = () => (
  <svg
    className="w-7 h-7 transition-transform duration-300 group-hover:scale-105"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="5.5" y="7" width="21" height="20" rx="3.5" fill="currentColor" fillOpacity="0.08" />
    <rect x="5.5" y="7" width="21" height="20" rx="3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11 5V9M21 5V9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <polyline points="10.5 17 14.5 21 21.5 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const heroWrapperRef = useRef(null);

  const joinNoticeHref = (() => {
    try {
      const ref = localStorage.getItem('landingReferralCode');
      return ref ? `/join-notice?ref=${encodeURIComponent(ref)}` : '/join-notice';
    } catch { return '/join-notice'; }
  })();

  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const ref = params.get('ref');
      if (ref) {
        localStorage.setItem('landingReferralCode', ref);
      }
    } catch {}
  }, [location.search]);

  const features = [
    {
      id: 'secure-dist',
      icon: SecureDistributionIcon,
      title: 'Secure Distribution',
      description: 'Help ensure recovered funds are securely distributed to verified victims through a transparent, structured recovery process.'
    },
    {
      id: 'recovery-stats',
      icon: RecoveryStatsIcon,
      title: 'Victim & Recovery Stats',
      description: 'View key statistics on verified victims, recovered funds, and active refund programs.'
    },
    {
      id: 'program-tracker',
      icon: ProgramTrackerIcon,
      title: 'Recovery Program Tracker',
      description: 'Track active refund programs, recovery milestones, and the distribution of recovered funds.'
    },
    {
      id: 'transparent-voting',
      icon: TransparentVotingIcon,
      title: 'Transparent Voting',
      description: 'Participate in transparent voting to provide feedback on recovery campaigns and fund distribution, helping improve future efforts and promote accountability, with voting results displayed in real time.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Pin Wrapper for Stacking Card Reveal */}
      <div ref={heroWrapperRef} className="relative w-full h-[120vh] sm:h-[130vh] -mt-16">
        <div className="sticky top-0 h-screen min-h-[100dvh] w-full overflow-hidden z-10">
          <section className="relative w-full h-full flex flex-col justify-center overflow-hidden bg-[#F8E7C9] pt-20 pb-10 sm:pt-24 sm:pb-16 md:pt-28 md:pb-20">
            {/* Animated Uneven Mosaic Grid Boxes Background */}
            <HeroGridBoxesAnimation />

            {/* Hero Main Content */}
            <div className="relative z-10 w-full px-5 xs:px-6 sm:px-10 md:px-14 lg:px-16 max-w-7xl mx-auto flex-1 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-xl sm:max-w-2xl space-y-4 sm:space-y-6 flex flex-col items-center sm:items-start text-center sm:text-left mx-auto sm:mx-0"
              >
                {/* Eyebrow Tag */}
                <div className="flex items-center justify-center sm:justify-start w-full">
                  <div className="inline-flex items-center gap-2 text-center sm:text-left max-w-full">
                    <span className="w-2 h-2 rounded-full bg-[#064E3B] shrink-0" />
                    <span className="text-[9px] xs:text-[10px] sm:text-xs font-black tracking-[0.08em] xs:tracking-[0.14em] sm:tracking-[0.25em] text-[#064E3B] uppercase whitespace-nowrap sm:whitespace-normal">
                      TRUST INFRASTRUCTURE • ON-CHAIN FRAUD RECOVERY
                    </span>
                  </div>
                </div>

                {/* Bold Editorial Main Headline (matching reference screenshot font) */}
                <h1 className="font-editorial text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-[4.85rem] font-normal text-[#064E3B] tracking-[-0.02em] leading-[1.08] sm:leading-[1.04] text-center sm:text-left">
                  Driven by Truth. <br />
                  <span className="text-[#043C2D]">Returning what’s yours</span>
                </h1>

                {/* Description Copy (matching reference screenshot clean typography) */}
                <p className="font-sans text-sm sm:text-base md:text-lg text-[#064E3B]/85 leading-[1.55] sm:leading-[1.6] font-normal max-w-xl text-center sm:text-left mx-auto sm:mx-0">
                  Aidessa helps government agencies securely return cryptocurrency recovered from fraud, financial crimes, and illegal business practices to verified victims through on-chain Proof-of-Loss tokens (RFND).
                </p>

                {/* Primary Action Button (Rectangular rounded-md button with arrow matching screenshot) */}
                <div className="pt-1 sm:pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      const ref = localStorage.getItem('landingReferralCode');
                      navigate(ref ? `/join-notice?ref=${encodeURIComponent(ref)}` : '/join-notice');
                    }}
                    className="inline-flex items-center gap-2.5 sm:gap-3 px-6 py-3 sm:px-7 sm:py-3.5 rounded-[6px] bg-[#064E3B] text-[#F8E7C9] text-sm sm:text-base font-medium hover:bg-[#043C2D] border border-[#043C2D] transition-all duration-200 group shadow-sm cursor-pointer"
                  >
                    <span>Request a refund</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={1.8} />
                  </button>
                </div>

                {/* Trust Badge / Sub-stat */}
                <div className="inline-flex items-center justify-center sm:justify-start gap-2 text-[11px] xs:text-xs sm:text-sm font-semibold text-[#064E3B]/80 pt-0.5 sm:pt-1 leading-snug text-center sm:text-left">
                  <span>Over 10,000+ verified fraud victims assisted through private liquidity pools</span>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </div>

      {/* Featured resources - Big Elevated Card Sheet */}
      <section className="relative z-20 w-full -mt-[18vh] sm:-mt-[25vh] md:-mt-[30vh] overflow-x-hidden rounded-t-[28px] sm:rounded-t-[46px] md:rounded-t-[56px] bg-[#FAF3E3] border-t border-[#064E3B]/20 shadow-[0_-22px_60px_rgba(6,78,59,0.12)] pt-5 sm:pt-6 pb-14 sm:pb-20 border-b border-[#EED5AF]">
        {/* Subtle Card Sheet Pill Handle */}
        <div className="flex justify-center mb-5 sm:mb-6 pt-1 sm:pt-2">
          <span className="w-10 sm:w-12 h-1.5 rounded-full bg-[#064E3B]/25" />
        </div>

        <div className="w-full min-w-0 mobile-padding">
          <div className="mb-8 sm:mb-12 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-[#064E3B] tracking-[-0.02em] mb-2 sm:mb-3 leading-[1.15] sm:leading-[1.1]"
            >
              Recovery resources and guides
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-sans text-sm sm:text-base md:text-lg text-[#064E3B]/85 max-w-2xl mx-auto leading-relaxed"
            >
              Scam alerts, Aidessa refund programs, and an overview of how we help eligible victims recover funds.
            </motion.p>
          </div>

          <div className="mx-auto grid max-w-6xl grid-cols-1 justify-items-center gap-5 sm:gap-6 md:grid-cols-3 md:justify-items-stretch md:gap-8">
            {STATIC_FEATURED_RESOURCES.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-24px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="w-full max-w-[380px] md:max-w-none"
              >
                <StaticResourceCard
                  id={item.id}
                  to={item.path}
                  title={item.title}
                  description={item.description}
                  iconSrc={item.iconSrc}
                  iconAlt={item.iconAlt}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - How Aidessa Helps */}
      <section className="w-full pt-12 pb-16 sm:pt-16 sm:pb-20 bg-[#FDF7EB] border-b border-[#EED5AF]">
        <div className="w-full mobile-padding">
          <div className="text-center mb-8 sm:mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-[#064E3B] tracking-[-0.02em] mb-2 sm:mb-3 leading-[1.15] sm:leading-[1.1]"
            >
              How Aidessa Helps
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-sans text-sm sm:text-base md:text-lg text-[#064E3B]/85 max-w-2xl mx-auto leading-relaxed"
            >
              Verify eligible victims, issue on-chain Proof-of-Loss tokens, and facilitate the secure distribution of recovered funds.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 justify-items-stretch max-w-7xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-24px' }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group flex h-full min-h-[240px] sm:min-h-[280px] w-full flex-col items-center p-5 sm:p-7 text-center justify-between rounded-[8px] bg-[#FFFDF9] border border-[#064E3B]/15 hover:border-[#064E3B]/45 hover:bg-white transition-all duration-300 shadow-[0_1px_3px_rgba(6,78,59,0.04)] hover:shadow-[0_8px_24px_rgba(6,78,59,0.08)] cursor-pointer"
                >
                  {/* Refined bespoke icon container matching upper section */}
                  <div className="mb-4 sm:mb-5 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-[8px] bg-[#064E3B]/[0.06] text-[#064E3B] border border-[#064E3B]/12 group-hover:bg-[#064E3B] group-hover:text-[#F8E7C9] group-hover:border-[#064E3B] transition-all duration-300">
                    <Icon />
                  </div>

                  {/* Editorial Serif Headline matching upper cards */}
                  <h3 className="font-editorial text-xl sm:text-2xl lg:text-[1.55rem] font-normal text-[#064E3B] group-hover:text-[#043C2D] leading-[1.2] mb-2 sm:mb-3 transition-colors">
                    {feature.title}
                  </h3>

                  {/* Clean Body Typography matching upper cards */}
                  <p className="font-sans text-xs sm:text-[13.5px] md:text-sm text-[#064E3B]/80 leading-[1.6] sm:leading-[1.65] font-normal flex-1">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Claimant Highlight / Verified Recoveries Section (matching Screenshots 1, 2, and 3) */}
      <ClaimantHighlightSection />

      {/* Navigate Alone CTA Section */}
      <section className="w-full py-14 sm:py-20 bg-[#064E3B] text-[#F8E7C9] relative overflow-hidden">
        <div className="w-full mobile-padding max-w-4xl mx-auto text-center space-y-5 sm:space-y-6 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-editorial text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-[-0.02em] text-[#F8E7C9] leading-[1.1]"
          >
            You Don’t Have to Navigate This Alone
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-sm sm:text-base md:text-lg text-[#F8E7C9]/85 leading-[1.6] sm:leading-[1.65] max-w-2xl mx-auto space-y-2.5 sm:space-y-3 font-normal"
          >
            <p>
              If you’ve lost funds to a scam or need help understanding the recovery process, reach out to Aidessa.
            </p>
            <p>
              Tell us what happened, ask your questions, and learn more about the options available to you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-2"
          >
            <Link
              to="/contact"
              className="inline-flex items-center gap-2.5 sm:gap-3 px-6 py-3 sm:px-7 sm:py-3.5 rounded-[6px] bg-[#F8E7C9] text-[#064E3B] text-sm sm:text-base font-medium hover:bg-[#FFFDF9] border border-[#EED5AF] transition-all duration-200 group shadow-sm cursor-pointer"
            >
              <span>Talk to Aidessa</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={1.8} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Live Claimant Social Proof Notification in Bottom-Left Corner */}
      <LiveClaimantNotification />
    </div>


  );
};

export default Home;
