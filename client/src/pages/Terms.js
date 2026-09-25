import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Mail, Globe, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import HeroGridBoxesAnimation from '../components/HeroGridBoxesAnimation';

const Terms = () => {
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
                  PROTOCOL GOVERNANCE &bull; LEGAL TERMS &bull; USER AGREEMENT
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-editorial text-[2.15rem] xs:text-4xl sm:text-5xl font-normal text-[#064E3B] tracking-[-0.02em] leading-[1.12] sm:leading-tight">
              Aidessa Terms of Service
            </h1>

            {/* Tracking / Revision Status */}
            <p className="font-sans text-[11px] xs:text-xs sm:text-sm text-[#064E3B]/70 uppercase tracking-wider font-semibold max-w-md mx-auto leading-relaxed">
              Last Updated: November 2025 &bull; Decentralized Restitution Protocol
            </p>
          </div>
        </div>

        {/* Intro Overview Card */}
        <div className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-4 xs:p-5 sm:p-7 md:p-8 shadow-[0_12px_40px_rgba(6,78,59,0.08)] space-y-3 sm:space-y-4">
          <p className="font-sans text-xs xs:text-sm sm:text-base leading-relaxed text-[#064E3B]/90 font-normal">
            Welcome to Aidessa ("we," "our," or "Aidessa"). By accessing or using aidessa.org, our applications, smart contracts, portals, or any associated services (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms").
          </p>
          <p className="font-sans text-xs xs:text-sm sm:text-base leading-relaxed text-[#064E3B] font-bold">
            If you do not agree to these Terms, please do not access or use our protocol and services.
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
                Nature of the Platform
              </h2>
            </div>
            <p className="font-sans text-xs xs:text-sm sm:text-base leading-relaxed text-[#064E3B]/85">
              Aidessa is a decentralized asset recovery protocol designed to:
            </p>
            <ul className="space-y-2">
              {[
                'Verify digital fraud and illegal investment victims',
                'Issue on-chain proof-of-loss tokens ("RFND")',
                'Facilitate government-sanctioned fund distribution to verified claimants',
                'Support restitution efforts through transparent on-chain processes',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 font-sans text-xs xs:text-sm sm:text-base text-[#064E3B]/85">
                  <CheckCircle2 className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-[#064E3B] shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="font-sans text-[11px] xs:text-xs sm:text-sm text-[#064E3B]/75 mt-3.5 sm:mt-4 italic bg-[#FAF3E3]/40 p-3 rounded-[6px] border border-[#064E3B]/10 leading-relaxed">
              Aidessa is not an insurance company, financial institution, broker, custodian, or licensed legal service provider. All automated functions are executed through blockchain-based smart contracts.
            </p>
          </section>

          {/* Section 2 */}
          <section className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-4 xs:p-5 sm:p-7 md:p-8 shadow-[0_12px_40px_rgba(6,78,59,0.08)] space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2.5 xs:gap-3 pb-3 border-b border-[#064E3B]/10">
              <span className="flex h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-[6px] bg-[#064E3B]/[0.08] text-[#064E3B] text-[11px] xs:text-xs sm:text-sm font-bold font-sans">
                02
              </span>
              <h2 className="font-editorial text-lg xs:text-xl sm:text-2xl font-normal text-[#064E3B] leading-snug">
                Eligibility
              </h2>
            </div>
            <p className="font-sans text-xs xs:text-sm sm:text-base leading-relaxed text-[#064E3B]/85">
              By using our Services, you confirm and warrant that you:
            </p>
            <ul className="space-y-2">
              {[
                'Are at least 18 years of age (or the age of legal majority in your jurisdiction)',
                'Are legally permitted to interact with blockchain-based protocols under applicable laws',
                'Are not located in a comprehensively sanctioned territory or listed on any government embargo list',
                'Understand the technical and financial characteristics of decentralized smart contracts',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 font-sans text-xs xs:text-sm sm:text-base text-[#064E3B]/85">
                  <CheckCircle2 className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-[#064E3B] shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="font-sans text-[11px] xs:text-xs sm:text-sm text-[#064E3B]/75 font-semibold pt-1">
              We reserve the right to restrict or deny platform access wherever mandated by international regulatory authorities.
            </p>
          </section>

          {/* Section 3 */}
          <section className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-4 xs:p-5 sm:p-7 md:p-8 shadow-[0_12px_40px_rgba(6,78,59,0.08)] space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2.5 xs:gap-3 pb-3 border-b border-[#064E3B]/10">
              <span className="flex h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-[6px] bg-[#064E3B]/[0.08] text-[#064E3B] text-[11px] xs:text-xs sm:text-sm font-bold font-sans">
                03
              </span>
              <h2 className="font-editorial text-lg xs:text-xl sm:text-2xl font-normal text-[#064E3B] leading-snug">
                No Guarantees of Compensation
              </h2>
            </div>
            <p className="font-sans text-xs xs:text-sm sm:text-base leading-relaxed text-[#064E3B]/90 font-medium">
              Submitting an incident claim does not guarantee claim verification, token issuance, distribution approval, or any specific quantum of financial restitution.
            </p>
            <p className="font-sans text-xs xs:text-sm sm:text-base leading-relaxed text-[#064E3B]/85">
              All distribution allocations are determined through structured, verifiable formulas (such as pro-rata calculations governed by case court orders or settlement fund capacity). Aidessa assumes no liability for external recovery shortfalls.
            </p>
          </section>

          {/* Section 4 */}
          <section className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-4 xs:p-5 sm:p-7 md:p-8 shadow-[0_12px_40px_rgba(6,78,59,0.08)] space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2.5 xs:gap-3 pb-3 border-b border-[#064E3B]/10">
              <span className="flex h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-[6px] bg-[#064E3B]/[0.08] text-[#064E3B] text-[11px] xs:text-xs sm:text-sm font-bold font-sans">
                04
              </span>
              <h2 className="font-editorial text-lg xs:text-xl sm:text-2xl font-normal text-[#064E3B] leading-snug">
                User Responsibilities &amp; Conduct
              </h2>
            </div>
            <p className="font-sans text-xs xs:text-sm sm:text-base leading-relaxed text-[#064E3B]/85">
              You explicitly agree not to engage in any of the following prohibited activities:
            </p>
            <ul className="space-y-2">
              {[
                'Submit fraudulent, forged, or inaccurate victim claims',
                'Upload malicious payloads, viruses, or defamatory materials',
                'Attempt sybil attacks or manipulate governance voting',
                'Interfere with smart contract integrity, server routing, or API endpoints',
                'Impersonate another individual, regulatory officer, or entity',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 font-sans text-xs xs:text-sm sm:text-base text-[#064E3B]/85">
                  <CheckCircle2 className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-[#064E3B] shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="font-sans text-xs xs:text-sm sm:text-base text-[#064E3B] font-bold pt-1">
              Violations will result in immediate denial of services, claim forfeiture, and reporting to relevant cybercrime agencies.
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
                  Token (RFND) Terms
                </h2>
              </div>
              <p className="font-sans text-xs xs:text-sm leading-relaxed text-[#064E3B]/85">
                RFND tokens are on-chain Proof-of-Loss units representing verified claims. They serve as audit ledgers for restitution pools. RFND is not an investment security, speculative asset, or guarantee of financial returns.
              </p>
            </section>

            <section className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-4 xs:p-5 sm:p-7 shadow-[0_12px_40px_rgba(6,78,59,0.08)] space-y-2.5 sm:space-y-3">
              <div className="flex items-center gap-2.5 xs:gap-3 pb-3 border-b border-[#064E3B]/10">
                <span className="flex h-6 w-6 xs:h-7 xs:w-7 shrink-0 items-center justify-center rounded-[6px] bg-[#064E3B]/[0.08] text-[#064E3B] text-[11px] xs:text-xs font-bold font-sans">
                  06
                </span>
                <h2 className="font-editorial text-lg xs:text-xl font-normal text-[#064E3B]">
                  Smart Contract Risks
                </h2>
              </div>
              <p className="font-sans text-xs xs:text-sm leading-relaxed text-[#064E3B]/85">
                You acknowledge inherent blockchain risks including network forks, validator delays, irreversibility of ledger state, and potential protocol vulnerabilities. Aidessa provides smart contract interfaces strictly on an "as-is" basis.
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
                  No Legal or Financial Advice
                </h2>
              </div>
              <p className="font-sans text-xs xs:text-sm leading-relaxed text-[#064E3B]/85">
                All platform content, research guides, and restitution parameters are published for educational transparency only. Nothing herein constitutes legal, financial, or tax counsel. Consult certified counsel for case advice.
              </p>
            </section>

            <section className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-4 xs:p-5 sm:p-7 shadow-[0_12px_40px_rgba(6,78,59,0.08)] space-y-2.5 sm:space-y-3">
              <div className="flex items-center gap-2.5 xs:gap-3 pb-3 border-b border-[#064E3B]/10">
                <span className="flex h-6 w-6 xs:h-7 xs:w-7 shrink-0 items-center justify-center rounded-[6px] bg-[#064E3B]/[0.08] text-[#064E3B] text-[11px] xs:text-xs font-bold font-sans">
                  08
                </span>
                <h2 className="font-editorial text-lg xs:text-xl font-normal text-[#064E3B]">
                  Third-Party Links
                </h2>
              </div>
              <p className="font-sans text-xs xs:text-sm leading-relaxed text-[#064E3B]/85">
                Our portals may reference external block explorers, forensic databases, or wallet software. Aidessa exerts no ownership over third-party infrastructure and is not responsible for their independent actions.
              </p>
            </section>
          </div>

          {/* Section 9 & 10 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <section className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-4 xs:p-5 sm:p-7 shadow-[0_12px_40px_rgba(6,78,59,0.08)] space-y-2.5 sm:space-y-3">
              <div className="flex items-center gap-2.5 xs:gap-3 pb-3 border-b border-[#064E3B]/10">
                <span className="flex h-6 w-6 xs:h-7 xs:w-7 shrink-0 items-center justify-center rounded-[6px] bg-[#064E3B]/[0.08] text-[#064E3B] text-[11px] xs:text-xs font-bold font-sans">
                  09
                </span>
                <h2 className="font-editorial text-lg xs:text-xl font-normal text-[#064E3B]">
                  Intellectual Property
                </h2>
              </div>
              <p className="font-sans text-xs xs:text-sm leading-relaxed text-[#064E3B]/85">
                All branding, visual styling, editorial content, and design architectures are proprietary to Aidessa. Reproduction or commercial exploitation without prior written consent is strictly prohibited.
              </p>
            </section>

            <section className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-4 xs:p-5 sm:p-7 shadow-[0_12px_40px_rgba(6,78,59,0.08)] space-y-2.5 sm:space-y-3">
              <div className="flex items-center gap-2.5 xs:gap-3 pb-3 border-b border-[#064E3B]/10">
                <span className="flex h-6 w-6 xs:h-7 xs:w-7 shrink-0 items-center justify-center rounded-[6px] bg-[#064E3B]/[0.08] text-[#064E3B] text-[11px] xs:text-xs font-bold font-sans">
                  10
                </span>
                <h2 className="font-editorial text-lg xs:text-xl font-normal text-[#064E3B]">
                  Termination of Service
                </h2>
              </div>
              <p className="font-sans text-xs xs:text-sm leading-relaxed text-[#064E3B]/85">
                We reserve the right to suspend or terminate claimant access at our discretion if bad faith, submission tampering, fraudulent claims, or breach of these Terms is discovered.
              </p>
            </section>
          </div>

          {/* Section 11 & 12 */}
          <section className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-4 xs:p-5 sm:p-7 md:p-8 shadow-[0_12px_40px_rgba(6,78,59,0.08)] space-y-4 sm:space-y-5">
            <div>
              <div className="flex items-center gap-2.5 xs:gap-3 pb-3 border-b border-[#064E3B]/10">
                <span className="flex h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-[6px] bg-[#064E3B]/[0.08] text-[#064E3B] text-[11px] xs:text-xs sm:text-sm font-bold font-sans">
                  11
                </span>
                <h2 className="font-editorial text-lg xs:text-xl sm:text-2xl font-normal text-[#064E3B] leading-snug">
                  Limitation of Liability
                </h2>
              </div>
              <p className="font-sans text-xs xs:text-sm sm:text-base leading-relaxed text-[#064E3B]/85 pt-3">
                To the maximum extent permitted by applicable law, Aidessa, its developers, contributors, and foundation members shall not be held liable for lost digital assets, network interruptions, smart contract faults, verification errors, or indirect damages arising from platform usage.
              </p>
            </div>

            <div className="pt-3.5 sm:pt-4 border-t border-[#064E3B]/10">
              <h3 className="font-editorial text-base xs:text-lg sm:text-xl font-normal text-[#064E3B] mb-2">
                12. Amendments to Terms
              </h3>
              <p className="font-sans text-xs sm:text-sm leading-relaxed text-[#064E3B]/80">
                We may modify these Terms at any time. Changes will be posted to this page with a revised "Last Updated" timestamp. Continued engagement with our services signifies conclusive acceptance of revised terms.
              </p>
            </div>
          </section>

          {/* Section 13: Official Contact Card */}
          <section className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-4 xs:p-5 sm:p-7 md:p-8 shadow-[0_12px_40px_rgba(6,78,59,0.08)] space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2.5 xs:gap-3 pb-3 border-b border-[#064E3B]/10">
              <span className="flex h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-[6px] bg-[#064E3B]/[0.08] text-[#064E3B] text-[11px] xs:text-xs sm:text-sm font-bold font-sans">
                13
              </span>
              <h2 className="font-editorial text-lg xs:text-xl sm:text-2xl font-normal text-[#064E3B] leading-snug">
                Official Contact &amp; Inquiries
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
            Have Questions About Our Terms or Protocols?
          </h3>
          <p className="font-sans text-xs xs:text-sm sm:text-base text-[#F8E7C9]/85 max-w-xl mx-auto leading-relaxed font-normal">
            Our governance and support desk is available to assist you with inquiries regarding protocol parameters, claims, or restitution policies.
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

export default Terms;
