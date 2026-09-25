import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Mail, Globe, CheckCircle2 } from 'lucide-react';
import HeroGridBoxesAnimation from '../components/HeroGridBoxesAnimation';

const joinNoticeHref = () => {
  try {
    const ref = localStorage.getItem('landingReferralCode');
    return ref ? `/join-notice?ref=${encodeURIComponent(ref)}` : '/join-notice';
  } catch {
    return '/join-notice';
  }
};

const PrivacyPolicy = () => {
  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] bg-[#F8E7C9] text-[#064E3B] py-8 sm:py-12 md:py-14 overflow-hidden">
      {/* Persistent Animated Uneven Grid Mosaic Background */}
      <HeroGridBoxesAnimation />

      <div className="relative z-10 max-w-5xl mx-auto px-3.5 xs:px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">

        {/* Top Navigation & Header */}
        <div className="space-y-5 sm:space-y-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#064E3B]/80 hover:text-[#064E3B] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to home</span>
          </Link>

          <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto">
            {/* Eyebrow Tag - Responsive Single-Line Fit */}
            <div className="flex items-center justify-center w-full px-1">
              <div className="inline-flex items-center gap-1.5 xs:gap-2 text-center max-w-full">
                <span className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-[#064E3B] shrink-0" />
                <span className="text-[9px] xs:text-[10.5px] sm:text-xs font-black tracking-[0.08em] xs:tracking-[0.14em] sm:tracking-[0.2em] text-[#064E3B] uppercase whitespace-nowrap">
                  LEGAL &bull; DATA PROTECTION &bull; ON-CHAIN DISCLOSURES
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-editorial text-[2.15rem] xs:text-4xl sm:text-5xl font-normal text-[#064E3B] tracking-[-0.02em] leading-[1.12] sm:leading-tight">
              Aidessa Privacy Policy
            </h1>

            {/* Tracking / Revision Status */}
            <p className="font-sans text-[11px] xs:text-xs sm:text-sm text-[#064E3B]/70 uppercase tracking-wider font-semibold max-w-md mx-auto leading-relaxed">
              Last Updated: November 2025 &bull; Decentralized Architecture Disclosures
            </p>
          </div>
        </div>

        {/* Intro Overview Card */}
        <div className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-4 xs:p-5 sm:p-7 md:p-8 shadow-[0_12px_40px_rgba(6,78,59,0.08)] space-y-3 sm:space-y-4">
          <p className="font-sans text-xs xs:text-sm sm:text-base leading-relaxed text-[#064E3B]/90 font-normal">
            This Privacy Policy explains how Aidessa ("we," "our," or "the platform") collects, uses, and protects information when you use our website and decentralized services.
          </p>
          <p className="font-sans text-xs xs:text-sm sm:text-base leading-relaxed text-[#064E3B] font-bold">
            Aidessa is designed to protect victims, ensure transparency, and maintain community trust across all restitution protocols.
          </p>
        </div>

        {/* Policy Content Sections */}
        <div className="space-y-5 sm:space-y-6 md:space-y-8">

          {/* Section 1 */}
          <section className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-4 xs:p-5 sm:p-7 md:p-8 shadow-[0_12px_40px_rgba(6,78,59,0.08)] space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2.5 xs:gap-3 pb-3 border-b border-[#064E3B]/10">
              <span className="flex h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-[6px] bg-[#064E3B]/[0.08] text-[#064E3B] text-[11px] xs:text-xs sm:text-sm font-bold font-sans">
                01
              </span>
              <h2 className="font-editorial text-lg xs:text-xl sm:text-2xl font-normal text-[#064E3B] leading-snug">
                What We Collect
              </h2>
            </div>
            <p className="font-sans text-xs xs:text-sm sm:text-base leading-relaxed text-[#064E3B]/85">
              Aidessa is built to minimize personal data collection. We collect only what is necessary to verify claims and operate the protocol.
            </p>
            <div className="pt-2">
              <h3 className="font-sans font-bold text-xs xs:text-sm sm:text-base text-[#064E3B] mb-2">
                1.1 Information You Provide
              </h3>
              <p className="font-sans text-xs xs:text-sm sm:text-base text-[#064E3B]/85 mb-3">
                When submitting a claim or contacting us, you may voluntarily provide:
              </p>
              <ul className="space-y-2">
                {['Wallet addresses and transaction hashes', 'Scam-related evidence (screenshots, messages, links)', 'Email address (optional)', 'Description of incident'].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 font-sans text-xs xs:text-sm sm:text-base text-[#064E3B]/85">
                    <CheckCircle2 className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-[#064E3B] shrink-0 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="font-sans text-[11px] xs:text-xs sm:text-sm text-[#064E3B]/75 mt-3.5 sm:mt-4 italic bg-[#FAF3E3]/40 p-3 rounded-[6px] border border-[#064E3B]/10 leading-relaxed">
                You choose what personal data to include. Do not upload sensitive documents such as passports, national identity cards, or bank statements unless explicitly requested for verification.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-4 xs:p-5 sm:p-7 md:p-8 shadow-[0_12px_40px_rgba(6,78,59,0.08)] space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2.5 xs:gap-3 pb-3 border-b border-[#064E3B]/10">
              <span className="flex h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-[6px] bg-[#064E3B]/[0.08] text-[#064E3B] text-[11px] xs:text-xs sm:text-sm font-bold font-sans">
                02
              </span>
              <h2 className="font-editorial text-lg xs:text-xl sm:text-2xl font-normal text-[#064E3B] leading-snug">
                Blockchain Data
              </h2>
            </div>
            <p className="font-sans text-xs xs:text-sm sm:text-base leading-relaxed text-[#064E3B]/85">
              When interacting with our smart contracts, the following data is permanently recorded on-chain:
            </p>
            <ul className="space-y-2">
              {['Wallet addresses', 'RFND token balances', 'Proof-of-loss records', 'Governance actions'].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 font-sans text-xs xs:text-sm sm:text-base text-[#064E3B]/85">
                  <CheckCircle2 className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-[#064E3B] shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="font-sans text-[11px] xs:text-xs sm:text-sm text-[#064E3B]/75 font-semibold pt-1">
              Blockchain data is public, immutable, and outside our operational control once written.
            </p>
          </section>

          {/* Section 3 */}
          <section className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-4 xs:p-5 sm:p-7 md:p-8 shadow-[0_12px_40px_rgba(6,78,59,0.08)] space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2.5 xs:gap-3 pb-3 border-b border-[#064E3B]/10">
              <span className="flex h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-[6px] bg-[#064E3B]/[0.08] text-[#064E3B] text-[11px] xs:text-xs sm:text-sm font-bold font-sans">
                03
              </span>
              <h2 className="font-editorial text-lg xs:text-xl sm:text-2xl font-normal text-[#064E3B] leading-snug">
                How We Use Your Information
              </h2>
            </div>
            <ul className="space-y-2">
              {[
                'Verify victim claims and cross-reference loss records',
                'Assess evidence and substantiate defendant ties',
                'Issue proof-of-loss tokens for distribution tracking',
                'Allocate governance rights to legitimate claimants',
                'Communicate with victims and community members',
                'Improve our services and audit methodologies',
                'Prevent fraud, sybil attacks, and multi-claim abuse',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 font-sans text-xs xs:text-sm sm:text-base text-[#064E3B]/85">
                  <CheckCircle2 className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-[#064E3B] shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="font-sans text-xs xs:text-sm sm:text-base text-[#064E3B] font-bold pt-1">
              We never sell, trade, or rent your personal data to third parties.
            </p>
          </section>

          {/* Section 4 */}
          <section className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-4 xs:p-5 sm:p-7 md:p-8 shadow-[0_12px_40px_rgba(6,78,59,0.08)] space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2.5 xs:gap-3 pb-3 border-b border-[#064E3B]/10">
              <span className="flex h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-[6px] bg-[#064E3B]/[0.08] text-[#064E3B] text-[11px] xs:text-xs sm:text-sm font-bold font-sans">
                04
              </span>
              <h2 className="font-editorial text-lg xs:text-xl sm:text-2xl font-normal text-[#064E3B] leading-snug">
                How We Protect Your Information
              </h2>
            </div>
            <p className="font-sans text-xs xs:text-sm sm:text-base leading-relaxed text-[#064E3B]/85">
              We apply technical and organizational measures to safeguard off-chain data, including:
            </p>
            <ul className="space-y-2">
              {['Encrypted storage protocols', 'Secure submission portals with rate limiting', 'Minimal data retention schedules', 'Limited access strictly by authorized verification council members'].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 font-sans text-xs xs:text-sm sm:text-base text-[#064E3B]/85">
                  <CheckCircle2 className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-[#064E3B] shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="font-sans text-[11px] xs:text-xs sm:text-sm text-[#064E3B]/75 pt-1">
              However, no electronic transmission or digital repository is completely impervious, and we cannot guarantee absolute immunity against novel attack vectors.
            </p>
          </section>

          {/* Section 5 & 6 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <section className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-4 xs:p-5 sm:p-7 shadow-[0_12px_40px_rgba(6,78,59,0.08)] space-y-2.5 sm:space-y-3">
              <div className="flex items-center gap-2.5 xs:gap-3 pb-3 border-b border-[#064E3B]/10">
                <span className="flex h-6 w-6 xs:h-7 xs:w-7 shrink-0 items-center justify-center rounded-[6px] bg-[#064E3B]/[0.08] text-[#064E3B] text-[11px] xs:text-xs font-bold font-sans">
                  05
                </span>
                <h2 className="font-editorial text-lg xs:text-xl font-normal text-[#064E3B]">
                  Data Sharing
                </h2>
              </div>
              <p className="font-sans text-xs xs:text-sm leading-relaxed text-[#064E3B]/85">
                We share data solely when necessary for claim verification, security audits, law enforcement mandates, or governance transparency. We never disclose data for marketing purposes.
              </p>
            </section>

            <section className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-4 xs:p-5 sm:p-7 shadow-[0_12px_40px_rgba(6,78,59,0.08)] space-y-2.5 sm:space-y-3">
              <div className="flex items-center gap-2.5 xs:gap-3 pb-3 border-b border-[#064E3B]/10">
                <span className="flex h-6 w-6 xs:h-7 xs:w-7 shrink-0 items-center justify-center rounded-[6px] bg-[#064E3B]/[0.08] text-[#064E3B] text-[11px] xs:text-xs font-bold font-sans">
                  06
                </span>
                <h2 className="font-editorial text-lg xs:text-xl font-normal text-[#064E3B]">
                  Data Retention
                </h2>
              </div>
              <p className="font-sans text-xs xs:text-sm leading-relaxed text-[#064E3B]/85">
                Off-chain records are retained only as long as needed for verification, compliance, and fraud auditability. You may request deletion of off-chain records subject to statutory requirements.
              </p>
            </section>
          </div>

          {/* Section 7 & 8 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <section className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-4 xs:p-5 sm:p-7 shadow-[0_12px_40px_rgba(6,78,59,0.08)] space-y-2.5 sm:space-y-3">
              <div className="flex items-center gap-2.5 xs:gap-3 pb-3 border-b border-[#064E3B]/10">
                <span className="flex h-6 w-6 xs:h-7 xs:w-7 shrink-0 items-center justify-center rounded-[6px] bg-[#064E3B]/[0.08] text-[#064E3B] text-[11px] xs:text-xs font-bold font-sans">
                  07
                </span>
                <h2 className="font-editorial text-lg xs:text-xl font-normal text-[#064E3B]">
                  Cookies &amp; Analytics
                </h2>
              </div>
              <p className="font-sans text-xs xs:text-sm leading-relaxed text-[#064E3B]/85">
                Aidessa employs minimal, privacy-centric telemetry to measure protocol performance. We do not operate cross-site advertising pixels or sell browsing telemetry.
              </p>
            </section>

            <section className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-4 xs:p-5 sm:p-7 shadow-[0_12px_40px_rgba(6,78,59,0.08)] space-y-2.5 sm:space-y-3">
              <div className="flex items-center gap-2.5 xs:gap-3 pb-3 border-b border-[#064E3B]/10">
                <span className="flex h-6 w-6 xs:h-7 xs:w-7 shrink-0 items-center justify-center rounded-[6px] bg-[#064E3B]/[0.08] text-[#064E3B] text-[11px] xs:text-xs font-bold font-sans">
                  08
                </span>
                <h2 className="font-editorial text-lg xs:text-xl font-normal text-[#064E3B]">
                  Children's Privacy
                </h2>
              </div>
              <p className="font-sans text-xs xs:text-sm leading-relaxed text-[#064E3B]/85">
                Aidessa is strictly intended for individuals aged 18 and older. We do not knowingly solicit or collect personally identifiable information from minors.
              </p>
            </section>
          </div>

          {/* Section 9, 10, 11 */}
          <section className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-4 xs:p-5 sm:p-7 md:p-8 shadow-[0_12px_40px_rgba(6,78,59,0.08)] space-y-4 sm:space-y-5">
            <div>
              <div className="flex items-center gap-2.5 xs:gap-3 pb-3 border-b border-[#064E3B]/10">
                <span className="flex h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-[6px] bg-[#064E3B]/[0.08] text-[#064E3B] text-[11px] xs:text-xs sm:text-sm font-bold font-sans">
                  09
                </span>
                <h2 className="font-editorial text-lg xs:text-xl sm:text-2xl font-normal text-[#064E3B] leading-snug">
                  Your Legal Rights &amp; Requests
                </h2>
              </div>
              <p className="font-sans text-xs xs:text-sm sm:text-base leading-relaxed text-[#064E3B]/85 pt-3">
                Depending on your jurisdiction (including GDPR, CCPA, or applicable global data privacy statutes), you may possess rights to inspect, correct, export, or request deletion of your personal records.
              </p>
              <p className="font-sans text-xs xs:text-sm sm:text-base font-semibold text-[#064E3B] pt-2 break-words">
                All data inquiries may be lodged directly to our privacy desk at:{' '}
                <a
                  href="mailto:Support@aidessa.org"
                  className="underline underline-offset-2 hover:text-[#043C2D] font-bold"
                >
                  Support@aidessa.org
                </a>
              </p>
            </div>

            <div className="pt-3.5 sm:pt-4 border-t border-[#064E3B]/10">
              <h3 className="font-editorial text-base xs:text-lg sm:text-xl font-normal text-[#064E3B] mb-2">
                10. International Operations &amp; 11. Amendments
              </h3>
              <p className="font-sans text-xs sm:text-sm leading-relaxed text-[#064E3B]/80">
                Aidessa functions as a distributed international protocol. By engaging with our interfaces, you consent to cross-border data routing. We may refresh this policy periodically; continued interaction signifies assent to updated terms.
              </p>
            </div>
          </section>

          {/* Section 12: Official Contact Card */}
          <section className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-4 xs:p-5 sm:p-7 md:p-8 shadow-[0_12px_40px_rgba(6,78,59,0.08)] space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2.5 xs:gap-3 pb-3 border-b border-[#064E3B]/10">
              <span className="flex h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-[6px] bg-[#064E3B]/[0.08] text-[#064E3B] text-[11px] xs:text-xs sm:text-sm font-bold font-sans">
                12
              </span>
              <h2 className="font-editorial text-lg xs:text-xl sm:text-2xl font-normal text-[#064E3B] leading-snug">
                Contact Privacy Desk
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1">
              <a
                href="mailto:Support@aidessa.org"
                className="rounded-[8px] border border-[#064E3B]/12 bg-[#FAF3E3]/35 hover:bg-white hover:border-[#064E3B]/35 p-3.5 sm:p-4 transition-all flex items-center gap-3 group"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] bg-[#064E3B]/[0.08] text-[#064E3B] group-hover:bg-[#064E3B] group-hover:text-[#F8E7C9] transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] xs:text-[11px] font-sans font-bold uppercase tracking-wider text-[#064E3B]/60">Email Support</div>
                  <div className="text-xs xs:text-sm font-sans font-semibold text-[#064E3B] truncate">Support@aidessa.org</div>
                </div>
              </a>

              <a
                href="https://aidessa.org"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-[8px] border border-[#064E3B]/12 bg-[#FAF3E3]/35 hover:bg-white hover:border-[#064E3B]/35 p-3.5 sm:p-4 transition-all flex items-center gap-3 group"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] bg-[#064E3B]/[0.08] text-[#064E3B] group-hover:bg-[#064E3B] group-hover:text-[#F8E7C9] transition-colors">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] xs:text-[11px] font-sans font-bold uppercase tracking-wider text-[#064E3B]/60">Official Portal</div>
                  <div className="text-xs xs:text-sm font-sans font-semibold text-[#064E3B] truncate">aidessa.org</div>
                </div>
              </a>
            </div>
          </section>

        </div>

        {/* Bottom Callout & Action */}
        <div className="rounded-[8px] sm:rounded-[10px] bg-[#064E3B] text-[#F8E7C9] p-5 xs:p-6 sm:p-8 md:p-10 text-center space-y-4 sm:space-y-5 shadow-[0_12px_40px_rgba(6,78,59,0.12)]">
          <h3 className="font-editorial text-xl xs:text-2xl sm:text-3xl font-normal text-[#F8E7C9] tracking-[-0.02em] leading-tight">
            Have Questions About Your Privacy or Claim?
          </h3>
          <p className="font-sans text-xs xs:text-sm sm:text-base text-[#F8E7C9]/85 max-w-xl mx-auto leading-relaxed font-normal">
            Our privacy and compliance team is available to assist you with data requests, identity questions, or verification protocols.
          </p>
          <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-center gap-2.5 sm:gap-3 pt-2">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-[6px] border border-[#F8E7C9]/35 bg-transparent hover:bg-[#F8E7C9]/10 px-5 py-2.5 text-xs xs:text-sm font-medium text-[#F8E7C9] transition-colors cursor-pointer w-full xs:w-auto"
            >
              <ArrowLeft size={16} />
              <span>Back to home</span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-[6px] bg-[#F8E7C9] hover:bg-[#FFFDF9] px-6 py-2.5 text-xs xs:text-sm font-medium text-[#064E3B] border border-[#EED5AF] shadow-sm transition-all cursor-pointer w-full xs:w-auto"
            >
              <span>Contact our team</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
