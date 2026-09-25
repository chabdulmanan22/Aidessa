import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldAlert, ChevronRight, Search, ArrowLeft, ArrowRight } from 'lucide-react';
import HeroGridBoxesAnimation from '../../components/HeroGridBoxesAnimation';
import { scamAlertsIntro, scamAlertsSections } from '../../data/scamAlertsContent';

const joinNoticeHref = () => {
  try {
    const ref = localStorage.getItem('landingReferralCode');
    return ref ? `/join-notice?ref=${encodeURIComponent(ref)}` : '/join-notice';
  } catch {
    return '/join-notice';
  }
};

const ScamAlertsResourcePage = () => {
  const [sections, setSections] = useState(scamAlertsSections);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let active = true;
    axios.get('/api/scam-companies')
      .then((res) => {
        if (active && res.data?.success && Array.isArray(res.data.data?.sections)) {
          setSections(res.data.data.sections);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const totalCount = useMemo(() => {
    return sections.reduce((acc, sec) => acc + (sec.items?.length || 0), 0);
  }, [sections]);

  const filteredSections = sections.map((sec) => {
    if (!search.trim()) return sec;
    const s = search.toLowerCase();
    const items = sec.items.filter((item) => item.toLowerCase().includes(s));
    return { ...sec, items };
  }).filter((sec) => sec.items.length > 0);

  const matchedCount = useMemo(() => {
    return filteredSections.reduce((acc, sec) => acc + (sec.items?.length || 0), 0);
  }, [filteredSections]);

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
                  PUBLIC SAFETY DATABASE • FRAUD WARNINGS
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-[#064E3B] tracking-[-0.02em] leading-tight">
              {scamAlertsIntro.kicker}
            </h1>

            {/* Tracking Status */}
            <p className="font-sans text-xs sm:text-sm text-[#064E3B]/75 uppercase tracking-wider font-semibold">
              Actively cataloging <span className="font-bold text-[#064E3B]">{totalCount}+</span> reported scam platforms & fraudulent schemes
            </p>
          </div>
        </div>

        {/* Intro Alert Notice (Unboxed, bold text, no icon) */}
        <div className="space-y-3 text-sm sm:text-base leading-relaxed text-[#064E3B] font-sans font-bold">
          {scamAlertsIntro.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {/* Search & Actions Bar Card */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#FFFDF9] p-4 sm:p-5 rounded-[8px] sm:rounded-[10px] border border-[#064E3B]/15 shadow-[0_12px_40px_rgba(6,78,59,0.08)]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#064E3B]/50" />
            <input
              type="text"
              placeholder="Search company, token, or scam program..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#FAF3E3]/40 border border-[#064E3B]/20 rounded-[6px] outline-none focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B] text-sm font-medium text-[#064E3B] placeholder-[#064E3B]/45 transition-colors font-sans"
            />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to={joinNoticeHref()}
              className="inline-flex items-center justify-center gap-2 rounded-[6px] bg-[#064E3B] hover:bg-[#043C2D] text-[#F8E7C9] px-6 py-2.5 text-sm font-medium transition-all duration-200 shadow-sm cursor-pointer"
            >
              <span>Submit claim</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        {/* Search status if searching */}
        {search.trim() && (
          <div className="text-xs sm:text-sm font-sans text-[#064E3B]/80 font-medium px-1">
            Showing <span className="font-bold text-[#064E3B]">{matchedCount}</span> result{matchedCount === 1 ? '' : 's'} matching "{search}"
          </div>
        )}

        {/* Reported Companies Sections */}
        <div id="reported-programs" className="scroll-mt-24 space-y-8">
          {loading ? (
            <div className="p-12 text-center text-[#064E3B]/70 font-semibold font-sans rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15">
              Loading scam alert database...
            </div>
          ) : filteredSections.length === 0 ? (
            <div className="p-12 bg-[#FFFDF9] rounded-[8px] sm:rounded-[10px] border border-[#064E3B]/15 text-center text-[#064E3B]/70 font-medium font-sans shadow-[0_12px_40px_rgba(6,78,59,0.08)]">
              No scam companies found matching "{search}".
            </div>
          ) : (
            filteredSections.map((section) => (
              <section
                key={section.title}
                className="bg-[#FFFDF9] rounded-[8px] sm:rounded-[10px] p-6 sm:p-8 border border-[#064E3B]/15 shadow-[0_12px_40px_rgba(6,78,59,0.08)] space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5 sm:gap-4 pb-4 border-b border-[#064E3B]/10">
                  <h2 className="font-editorial text-lg sm:text-2xl font-normal text-[#064E3B] flex items-center gap-2 sm:gap-2.5 leading-snug">
                    <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-[#064E3B] shrink-0" strokeWidth={1.8} />
                    <span>{section.title}</span>
                  </h2>
                  <span className="text-xs sm:text-sm font-semibold text-[#064E3B]/70 font-sans tracking-wide shrink-0 pl-6 sm:pl-0">
                    {section.items.length} reported
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {section.items.map((name) => (
                    <div
                      key={name}
                      className="rounded-[8px] border border-[#064E3B]/12 bg-[#FAF3E3]/35 hover:bg-white hover:border-[#064E3B]/35 px-4 py-3 text-sm font-sans font-medium text-[#064E3B] shadow-[0_1px_3px_rgba(6,78,59,0.03)] hover:shadow-[0_4px_12px_rgba(6,78,59,0.08)] transition-all flex items-center justify-between group cursor-default"
                    >
                      <span className="truncate pr-2 font-medium">{name}</span>
                      <span className="h-2 w-2 rounded-full bg-red-500/80 group-hover:bg-red-600 shrink-0 transition-colors" title="Reported Fraud" />
                    </div>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>

        {/* Bottom Callout & Action */}
        <div className="rounded-[8px] sm:rounded-[10px] bg-[#064E3B] text-[#F8E7C9] p-8 sm:p-10 text-center space-y-5 shadow-[0_12px_40px_rgba(6,78,59,0.12)]">
          <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#F8E7C9] tracking-[-0.02em] leading-tight">
            Were You Affected by Any of These Entities?
          </h3>
          <p className="font-sans text-sm sm:text-base text-[#F8E7C9]/85 max-w-xl mx-auto leading-relaxed font-normal">
            Submit your case details securely to the Aidessa recovery registry so our team can evaluate your eligibility for active refund programs.
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

export default ScamAlertsResourcePage;
