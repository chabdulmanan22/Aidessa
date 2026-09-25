import React, { useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import StaticResourceCard from '../components/StaticResourceCard';
import HeroGridBoxesAnimation from '../components/HeroGridBoxesAnimation';
import ClaimantHighlightSection from '../components/ClaimantHighlightSection';
import LiveClaimantNotification from '../components/LiveClaimantNotification';
import { STATIC_FEATURED_RESOURCES } from '../data/staticFeaturedResources';



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



  return (
    <div className="min-h-screen">
      {/* Hero Pin Wrapper for Stacking Card Reveal */}
      <div ref={heroWrapperRef} className="relative w-full h-[115vh] sm:h-[130vh] -mt-16">
        <div className="sticky top-0 h-screen min-h-[100dvh] w-full overflow-hidden z-10">
          <section className="relative w-full h-full flex flex-col justify-start sm:justify-center overflow-hidden bg-[#F8E7C9] pt-20 sm:pt-24 pb-8 sm:pb-16 md:pt-28 md:pb-20">
            {/* Animated Uneven Mosaic Grid Boxes Background */}
            <HeroGridBoxesAnimation />

            {/* Hero Main Content */}
            <div className="relative z-10 w-full px-5 xs:px-6 sm:px-10 md:px-14 lg:px-16 max-w-7xl mx-auto flex-1 flex flex-col justify-start sm:justify-center pt-5 xs:pt-7 sm:pt-0">
              <motion.div
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-xl sm:max-w-2xl space-y-4 xs:space-y-5 sm:space-y-6 flex flex-col items-center sm:items-start text-center sm:text-left mx-auto sm:mx-0"
              >
                {/* Eyebrow Tag: Clean tag without pill container */}
                <div className="flex items-center justify-center sm:justify-start w-full">
                  <div className="inline-flex items-center gap-2 text-center sm:text-left max-w-full">
                    <span className="w-2 h-2 rounded-full bg-[#064E3B] shrink-0" />
                    <span className="text-[10px] xs:text-[11px] sm:text-xs font-black tracking-[0.12em] xs:tracking-[0.16em] sm:tracking-[0.25em] text-[#064E3B] uppercase whitespace-nowrap sm:whitespace-normal">
                      TRUST INFRASTRUCTURE • ON-CHAIN FRAUD RECOVERY
                    </span>
                  </div>
                </div>

                {/* Bold Editorial Main Headline - Thick, commanding, high-impact on mobile */}
                <h1 className="font-editorial text-[2.35rem] xs:text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[4.85rem] font-bold sm:font-normal text-[#064E3B] tracking-[-0.03em] leading-[1.08] sm:leading-[1.04] text-center sm:text-left">
                  Driven by Truth. <br />
                  <span className="text-[#043C2D]">Returning what’s yours</span>
                </h1>

                {/* Description Copy - Rich contrast and readability */}
                <p className="font-sans text-[14.5px] xs:text-[15.5px] sm:text-base md:text-lg text-[#064E3B]/90 font-medium sm:font-normal leading-[1.6] max-w-lg mx-auto sm:mx-0 text-center sm:text-left">
                  Aidessa helps government agencies securely return cryptocurrency recovered from fraud, financial crimes, and illegal business practices to verified victims through on-chain Proof-of-Loss tokens (RFND).
                </p>

                {/* Action Buttons - Request Refund & Talk to Us */}
                <div className="pt-1.5 sm:pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3.5 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      const ref = localStorage.getItem('landingReferralCode');
                      navigate(ref ? `/join-notice?ref=${encodeURIComponent(ref)}` : '/join-notice');
                    }}
                    className="inline-flex items-center gap-3 px-8 py-3.5 rounded-[8px] bg-[#064E3B] text-[#F8E7C9] text-[15px] sm:text-base font-semibold hover:bg-[#043C2D] border border-[#043C2D] shadow-md shadow-[#064E3B]/20 active:scale-95 transition-all duration-200 group cursor-pointer"
                  >
                    <span>Request a refund</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/contact')}
                    className="inline-flex items-center gap-3 px-8 py-3.5 rounded-[8px] bg-[#FFFDF9] text-[#064E3B] text-[15px] sm:text-base font-semibold hover:bg-[#064E3B] hover:text-[#F8E7C9] border border-[#064E3B]/35 hover:border-[#064E3B] shadow-md shadow-[#064E3B]/10 active:scale-95 transition-all duration-200 group cursor-pointer"
                  >
                    <span>Talk to Us</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
                  </button>
                </div>

                {/* Highlighted Trust Badge with Rectangular Border */}
                <div className="pt-2.5 sm:pt-3 flex justify-center sm:justify-start">
                  <div className="inline-flex items-center px-4 py-2.5 sm:px-4.5 sm:py-2.5 rounded-[6px] bg-[#064E3B]/[0.08] border border-[#064E3B]/30 shadow-sm text-xs sm:text-[13.5px] font-semibold text-[#064E3B] leading-snug text-center sm:text-left backdrop-blur-sm">
                    <span>A trusted nonprofit providing support and advocacy for victims of digital fraud.</span>
                  </div>
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
