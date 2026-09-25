import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import axios from 'axios';

const DEFAULT_PR_LINKS = [
  { id: '1', title: 'Yahoo Finance', url: 'https://finance.yahoo.com', logoUrl: 'https://img.icons8.com/color/144/yahoo.png', active: true },
  { id: '2', title: 'Bloomberg', url: 'https://www.bloomberg.com', logoUrl: 'https://img.icons8.com/color/144/bloomberg.png', active: true },
  { id: '3', title: 'CoinDesk', url: 'https://www.coindesk.com', logoUrl: 'https://img.icons8.com/color/144/bitcoin.png', active: true },
  { id: '4', title: 'Cointelegraph', url: 'https://cointelegraph.com', logoUrl: 'https://img.icons8.com/color/144/ethereum.png', active: true }
];

const PrCoverageSection = () => {
  const [prLinks, setPrLinks] = useState(DEFAULT_PR_LINKS);

  useEffect(() => {
    loadPrLinks();
    window.addEventListener('datastore:update', loadPrLinks);
    return () => window.removeEventListener('datastore:update', loadPrLinks);
  }, []);

  const loadPrLinks = async () => {
    try {
      const res = await axios.get('/api/settings/PR_LINKS');
      const val = res.data?.data?.value;
      if (Array.isArray(val) && val.length > 0) {
        setPrLinks(val.filter(item => item.active !== false));
      }
    } catch (_) {}
  };

  const activeLinks = prLinks.filter(item => item.active !== false);
  if (activeLinks.length === 0) return null;

  return (
    <section className="w-full bg-[#F8E7C9] border-t border-b border-[#064E3B]/15 py-14 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Tag, and Subtext */}
          <div className="lg:col-span-5 text-left">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-600 inline-block shrink-0" />
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#064E3B]/70 font-sans">
                Our Coverage
              </span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl md:text-[44px] font-normal text-[#064E3B] tracking-[-0.02em] leading-[1.15]">
              As Seen On
            </h2>
            <p className="text-sm sm:text-base text-[#064E3B]/75 font-sans mt-3 max-w-md leading-relaxed">
              Recognized and referenced across leading global finance, cryptocurrency, and investigative media.
            </p>
          </div>

          {/* Right Column: Square Cards Grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {activeLinks.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] hover:bg-white border border-[#064E3B]/15 hover:border-[#064E3B]/45 p-4 sm:p-5 flex flex-col items-center justify-center text-center shadow-[0_2px_8px_rgba(6,78,59,0.03)] hover:shadow-[0_12px_30px_rgba(6,78,59,0.08)] hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                  title={`Read PR coverage on ${item.title}`}
                >
                  {/* Brand Logo */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
                    <img
                      src={item.logoUrl}
                      alt={item.title}
                      className="max-w-full max-h-full object-contain filter group-hover:brightness-105 transition-all"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://img.icons8.com/color/144/news.png'; }}
                    />
                  </div>

                  {/* Brand Name */}
                  <span className="font-sans text-xs sm:text-sm font-semibold text-[#064E3B] group-hover:text-[#043C2D] transition-colors leading-tight">
                    {item.title}
                  </span>

                  {/* External Link Hint */}
                  <span className="text-[10px] text-[#064E3B]/40 group-hover:text-[#064E3B]/75 font-sans mt-1.5 flex items-center gap-1 transition-colors">
                    <span>Visit</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PrCoverageSection;
