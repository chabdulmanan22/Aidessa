import React, { useState, useEffect } from 'react';
import { ExternalLink, Award } from 'lucide-react';
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
    <section className="w-full bg-[#F8E7C9] border-t border-[#EED5AF] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center text-center">
        <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#064E3B] tracking-[-0.02em] mb-6">
          As Seen On
        </h3>

        {/* Logos grid / row */}
        <div className="flex items-center justify-center flex-wrap gap-3 sm:gap-4 md:gap-5">
          {activeLinks.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-3 px-5 py-2.5 bg-[#FFFDF9] hover:bg-white border border-[#064E3B]/15 hover:border-[#064E3B]/45 rounded-[6px] transition-all duration-200 shadow-[0_1px_3px_rgba(6,78,59,0.04)] hover:shadow-sm"
              title={`Read PR coverage on ${item.title}`}
            >
              <div className="w-5 h-5 rounded-[4px] bg-[#064E3B]/[0.06] p-0.5 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                <img
                  src={item.logoUrl}
                  alt={item.title}
                  className="w-full h-full object-contain filter brightness-95 group-hover:brightness-105"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://img.icons8.com/color/144/news.png'; }}
                />
              </div>
              <span className="font-sans text-xs sm:text-sm font-medium text-[#064E3B] group-hover:text-[#043C2D] transition-colors">
                {item.title}
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-[#064E3B]/40 group-hover:text-[#064E3B] opacity-0 group-hover:opacity-100 transition-all duration-200" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PrCoverageSection;
