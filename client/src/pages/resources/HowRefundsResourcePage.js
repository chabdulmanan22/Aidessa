import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import HeroGridBoxesAnimation from '../../components/HeroGridBoxesAnimation';
import { howRefundsSections } from '../../data/howRefundsContent';

const joinNoticeHref = () => {
  try {
    const ref = localStorage.getItem('landingReferralCode');
    return ref ? `/join-notice?ref=${encodeURIComponent(ref)}` : '/join-notice';
  } catch {
    return '/join-notice';
  }
};

const HowRefundsResourcePage = () => {
  // First section contains the overview and 6 bullet points
  const introSection = howRefundsSections[0];
  const mainSections = howRefundsSections.slice(1);

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] bg-[#F8E7C9] text-[#064E3B] py-10 sm:py-14 overflow-hidden">
      {/* Persistent Animated Uneven Grid Mosaic Background */}
      <HeroGridBoxesAnimation />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">

        {/* Top Navigation & Header */}
        <div className="space-y-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#064E3B]/80 hover:text-[#064E3B] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to home</span>
          </Link>

          <div className="text-center space-y-4 max-w-3xl mx-auto">
            {/* Eyebrow Tag */}
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#064E3B] shrink-0" />
                <span className="text-[10px] xs:text-[11px] sm:text-xs font-black tracking-[0.2em] text-[#064E3B] uppercase">
                  RECOVERY PROCESS • PROTOCOL GOVERNANCE
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-[#064E3B] tracking-[-0.02em] leading-tight">
              How Aidessa Provides Refunds
            </h1>

            {/* Tracking Status */}
            <p className="font-sans text-xs sm:text-sm text-[#064E3B]/75 uppercase tracking-wider font-semibold">
              A transparent look at victim identification, pro-rata calculation, and restitution distribution
            </p>
          </div>
        </div>

        {/* Intro Overview Card (Matching Home & Scam Alert Cards) */}
        {introSection && (
          <div className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-6 sm:p-8 shadow-[0_12px_40px_rgba(6,78,59,0.08)] space-y-6">
            <div className="space-y-3 font-sans text-sm sm:text-base leading-relaxed text-[#064E3B]/90 font-normal">
              {introSection.paragraphs?.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {introSection.bullets && (
              <div className="pt-2 border-t border-[#064E3B]/10">
                <h3 className="font-editorial text-lg sm:text-xl font-normal text-[#064E3B] mb-4">
                  The Six Core Steps in Every Distribution Program:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {introSection.bullets.map((bullet, bIdx) => (
                    <div
                      key={bIdx}
                      className="rounded-[8px] border border-[#064E3B]/12 bg-[#FAF3E3]/35 p-3.5 flex items-start gap-3 shadow-[0_1px_3px_rgba(6,78,59,0.03)]"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] bg-[#064E3B] text-[#F8E7C9] text-xs font-bold font-sans mt-0.5">
                        {bIdx + 1}
                      </span>
                      <span className="font-sans text-xs sm:text-sm font-semibold text-[#064E3B] leading-snug">
                        {bullet}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Detailed Process Sections */}
        <div className="space-y-6 sm:space-y-8">
          {mainSections.map((sec, sIdx) => (
            <section
              key={sIdx}
              className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-6 sm:p-8 shadow-[0_12px_40px_rgba(6,78,59,0.08)] space-y-4"
            >
              {sec.title && (
                <div className="flex items-center gap-3 pb-4 border-b border-[#064E3B]/10">
                  <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-[6px] bg-[#064E3B]/[0.08] text-[#064E3B] text-xs sm:text-sm font-bold font-sans">
                    {String(sIdx + 1).padStart(2, '0')}
                  </span>
                  <h2 className="font-editorial text-xl sm:text-2xl font-normal text-[#064E3B] leading-snug">
                    {sec.title}
                  </h2>
                </div>
              )}

              <div className="space-y-3 font-sans text-sm sm:text-base leading-relaxed text-[#064E3B]/85 font-normal">
                {sec.paragraphs?.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>

              {sec.bullets && (
                <ul className="space-y-2 pt-2">
                  {sec.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2.5 font-sans text-sm sm:text-base text-[#064E3B]/85">
                      <CheckCircle2 className="w-4 h-4 text-[#064E3B] shrink-0 mt-1" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* Bottom Callout & Action */}
        <div className="rounded-[8px] sm:rounded-[10px] bg-[#064E3B] text-[#F8E7C9] p-8 sm:p-10 text-center space-y-5 shadow-[0_12px_40px_rgba(6,78,59,0.12)]">
          <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#F8E7C9] tracking-[-0.02em] leading-tight">
            Ready to Check Your Refund Eligibility?
          </h3>
          <p className="font-sans text-sm sm:text-base text-[#F8E7C9]/85 max-w-xl mx-auto leading-relaxed font-normal">
            Submit your case details securely through our verified portal or contact Aidessa support to evaluate your eligibility for active restitution pools.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-[6px] border border-[#F8E7C9]/35 bg-transparent hover:bg-[#F8E7C9]/10 px-5 py-2.5 text-sm font-medium text-[#F8E7C9] transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Back to home</span>
            </Link>
            <Link
              to={joinNoticeHref()}
              className="inline-flex items-center gap-2 rounded-[6px] bg-[#F8E7C9] hover:bg-[#FFFDF9] px-6 py-2.5 text-sm font-medium text-[#064E3B] border border-[#EED5AF] shadow-sm transition-all cursor-pointer"
            >
              <span>Submit your claim</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HowRefundsResourcePage;
