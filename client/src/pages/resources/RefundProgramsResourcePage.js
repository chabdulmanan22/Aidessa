import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FileText, Search, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';
import HeroGridBoxesAnimation from '../../components/HeroGridBoxesAnimation';

const joinNoticeHref = () => {
  try {
    const ref = localStorage.getItem('landingReferralCode');
    return ref ? `/join-notice?ref=${encodeURIComponent(ref)}` : '/join-notice';
  } catch {
    return '/join-notice';
  }
};

const formatArticleDate = (val) => {
  if (!val) return '—';
  const str = String(val).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const [year, month] = str.split('-');
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const idx = parseInt(month, 10) - 1;
    if (idx >= 0 && idx < 12) return `${months[idx]} ${year}`;
  }
  try {
    const d = new Date(str);
    if (isNaN(d.getTime())) return str;
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  } catch {
    return str;
  }
};

const RefundProgramsResourcePage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get('/api/articles');
        if (cancelled) return;
        let list = Array.isArray(res.data?.data) ? res.data.data : [];
        const getTs = (a) => (a.createdDisplayDate ? new Date(a.createdDisplayDate).getTime() : new Date(a.createdAt || 0).getTime());
        list.sort((a, b) => getTs(b) - getTs(a));
        setRows(list);
      } catch {
        if (!cancelled) setRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter((r) => (r.title && r.title.toLowerCase().includes(q)) || (r.description && r.description.toLowerCase().includes(q)));
  }, [rows, search]);

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
                  VERIFIED RESTITUTION • ASSET RECOVERY REGISTRY
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-[#064E3B] tracking-[-0.02em] leading-tight">
              Aidessa Refund Programs
            </h1>

            {/* Tracking Status */}
            <p className="font-sans text-xs sm:text-sm text-[#064E3B]/75 uppercase tracking-wider font-semibold">
              Official distribution protocols & government-sanctioned restitution pools
            </p>
          </div>
        </div>

        {/* Unboxed Intro & Security Notice (bold text, no card, no icon) */}
        <div className="space-y-3 text-sm sm:text-base leading-relaxed text-[#064E3B] font-sans font-bold">
          <p>
            Aidessa is a decentralized asset recovery protocol that helps government agencies securely distribute
            cryptocurrency recovered from illegal business practices and return funds to those who lost money.
            Below are active refund programs for which Aidessa has helped securely distribute recovered funds.
          </p>
          <p>
            Aidessa will never request payment to help you pursue a claim, make threats, or instruct
            you to transfer money. If you have been targeted by an illegal business practice or scam,
            report it to Aidessa through our official channels only.
          </p>
        </div>

        {/* Search & Actions Bar Card */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#FFFDF9] p-4 sm:p-5 rounded-[8px] sm:rounded-[10px] border border-[#064E3B]/15 shadow-[0_12px_40px_rgba(6,78,59,0.08)]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#064E3B]/50" />
            <input
              type="text"
              placeholder="Search active refund programs..."
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
            Showing <span className="font-bold text-[#064E3B]">{filteredRows.length}</span> program{filteredRows.length === 1 ? '' : 's'} matching "{search}"
          </div>
        )}

        {/* Active Refund Programs Section */}
        <div id="refund-programs" className="scroll-mt-24">
          <section className="bg-[#FFFDF9] rounded-[8px] sm:rounded-[10px] p-6 sm:p-8 border border-[#064E3B]/15 shadow-[0_12px_40px_rgba(6,78,59,0.08)] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5 sm:gap-4 pb-4 border-b border-[#064E3B]/10">
              <h2 className="font-editorial text-xl sm:text-2xl font-normal text-[#064E3B] flex items-center gap-2.5 leading-snug">
                <FileText className="w-5 h-5 text-[#064E3B] shrink-0" strokeWidth={1.8} />
                <span>Active Restitution Programs</span>
              </h2>
              <span className="text-xs sm:text-sm font-semibold text-[#064E3B]/70 font-sans tracking-wide shrink-0">
                {filteredRows.length} active {filteredRows.length === 1 ? 'program' : 'programs'}
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-[#064E3B]/70 font-semibold font-sans">
                Loading refund programs...
              </div>
            ) : filteredRows.length === 0 ? (
              <div className="p-12 text-center text-[#064E3B]/70 font-medium font-sans">
                {search.trim()
                  ? `No refund programs found matching "${search}".`
                  : 'No active articles or programs are published yet. Check back soon or contact Aidessa support.'}
              </div>
            ) : (
              <>
                {/* Desktop & Tablet Table */}
                <div className="hidden sm:block overflow-hidden rounded-[8px] border border-[#064E3B]/12">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-[#FAF3E3]/60 border-b border-[#064E3B]/12">
                        <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#064E3B]/80 font-sans">
                          Refund Program & Case Name
                        </th>
                        <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#064E3B]/80 font-sans text-right">
                          Announcement Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#064E3B]/10">
                      {filteredRows.map((article) => (
                        <tr
                          key={article.slug || article._id}
                          className="hover:bg-[#FAF3E3]/35 transition-colors group"
                        >
                          <td className="px-5 py-4 align-middle">
                            <Link
                              to={`/articles/${article.slug}`}
                              className="font-sans font-semibold text-sm sm:text-base text-[#064E3B] group-hover:text-[#043C2D] inline-flex items-center gap-2 group"
                            >
                              <span className="group-hover:underline underline-offset-2">{article.title}</span>
                              <ChevronRight className="w-4 h-4 text-[#064E3B]/40 group-hover:text-[#064E3B] group-hover:translate-x-1 transition-all" />
                            </Link>
                          </td>
                          <td className="px-5 py-4 align-middle text-right font-sans text-xs sm:text-sm text-[#064E3B]/70 font-medium whitespace-nowrap">
                            {formatArticleDate(article.createdDisplayDate || article.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Screen List Cards */}
                <div className="sm:hidden space-y-3">
                  {filteredRows.map((article) => (
                    <Link
                      key={article.slug || article._id}
                      to={`/articles/${article.slug}`}
                      className="block rounded-[8px] border border-[#064E3B]/12 bg-[#FAF3E3]/35 hover:bg-white hover:border-[#064E3B]/35 p-4 transition-all shadow-[0_1px_3px_rgba(6,78,59,0.03)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-sans font-semibold text-sm text-[#064E3B] leading-snug">
                          {article.title}
                        </h3>
                        <ChevronRight className="w-4 h-4 text-[#064E3B]/50 shrink-0 mt-0.5" />
                      </div>
                      <div className="mt-2 text-[11px] font-sans text-[#064E3B]/60 font-medium">
                        {formatArticleDate(article.createdDisplayDate || article.createdAt)}
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>

        {/* Bottom Callout & Action */}
        <div className="rounded-[8px] sm:rounded-[10px] bg-[#064E3B] text-[#F8E7C9] p-8 sm:p-10 text-center space-y-5 shadow-[0_12px_40px_rgba(6,78,59,0.12)]">
          <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#F8E7C9] tracking-[-0.02em] leading-tight">
            Don't See Your Case Listed?
          </h3>
          <p className="font-sans text-sm sm:text-base text-[#F8E7C9]/85 max-w-xl mx-auto leading-relaxed font-normal">
            If you lost funds to an unregistered entity, fraudulent exchange, or rug pull not yet indexed here, submit your case details so our team can evaluate your restitution options.
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

export default RefundProgramsResourcePage;
