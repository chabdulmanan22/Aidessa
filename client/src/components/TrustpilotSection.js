import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import axios from 'axios';

const DEFAULT_TRUSTPILOT = {
  title: 'Excellent',
  starRating: '4.5',
  subheading: 'We’ve helped over 10,000+ fraud victims already!',
  reviewCount: '780 reviews',
  reviewLink: 'https://www.trustpilot.com/review/veritasaid.com',
  buttonText: 'Are you a victim? Request a refund'
};

const TrustpilotSection = () => {
  const [data, setData] = useState(DEFAULT_TRUSTPILOT);
  const navigate = useNavigate();

  useEffect(() => {
    loadTrustpilotData();
    window.addEventListener('datastore:update', loadTrustpilotData);
    return () => window.removeEventListener('datastore:update', loadTrustpilotData);
  }, []);

  const loadTrustpilotData = async () => {
    try {
      const res = await axios.get('/api/settings/TRUSTPILOT_DATA');
      const val = res.data?.data?.value;
      if (val && typeof val === 'object') {
        setData({
          title: val.title || DEFAULT_TRUSTPILOT.title,
          starRating: val.starRating || DEFAULT_TRUSTPILOT.starRating,
          subheading: val.subheading || DEFAULT_TRUSTPILOT.subheading,
          reviewCount: val.reviewCount || DEFAULT_TRUSTPILOT.reviewCount,
          reviewLink: val.reviewLink || DEFAULT_TRUSTPILOT.reviewLink,
          buttonText: val.buttonText || DEFAULT_TRUSTPILOT.buttonText
        });
      }
    } catch (_) {}
  };

  const handleAction = () => {
    const ref = localStorage.getItem('landingReferralCode');
    navigate(ref ? `/join-notice?ref=${encodeURIComponent(ref)}` : '/join-notice');
  };

  const renderStars = () => {
    const numericRating = parseFloat(data.starRating || 4.5);
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (numericRating >= i) {
        stars.push(
          <div key={i} className="w-7 h-7 sm:w-8 sm:h-8 bg-[#00b67a] flex items-center justify-center rounded-[3px] shadow-xs">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-white" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          </div>
        );
      } else if (numericRating >= i - 0.5) {
        stars.push(
          <div key={i} className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-400 relative overflow-hidden rounded-[3px] shadow-xs">
            <div className="absolute top-0 left-0 bottom-0 w-1/2 bg-[#00b67a]"></div>
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-white" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
            </div>
          </div>
        );
      } else {
        stars.push(
          <div key={i} className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-300 flex items-center justify-center rounded-[3px] shadow-xs">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-white" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          </div>
        );
      }
    }
    return stars;
  };

  return (
    <section className="w-full bg-[#F8E7C9] text-[#064E3B] py-16 px-4 sm:px-6 lg:px-8 border-t border-[#EED5AF] relative overflow-hidden">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center space-y-7 relative z-10">
        
        {/* Main Heading */}
        <motion.h2 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-editorial text-4xl sm:text-5xl md:text-6xl font-normal tracking-[-0.02em] leading-tight text-[#064E3B]"
        >
          Rated <span className="text-[#064E3B] underline decoration-[#064E3B]/20 underline-offset-6">{data.title || 'Excellent'}</span> on Trustpilot.
        </motion.h2>

        {/* Subheading */}
        <motion.p 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-sans text-base sm:text-lg text-[#064E3B]/80 font-normal max-w-xl leading-relaxed"
        >
          {data.subheading}
        </motion.p>

        {/* Trustpilot Rating Card - Matching Upper Cards Shape & Texture */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-[8px] bg-[#FFFDF9] border border-[#064E3B]/15 hover:border-[#064E3B]/45 hover:bg-white p-6 sm:p-8 flex flex-col items-center justify-center space-y-3.5 shadow-[0_1px_3px_rgba(6,78,59,0.04)] hover:shadow-[0_8px_24px_rgba(6,78,59,0.08)] max-w-sm w-full transition-all duration-300"
        >
          {/* Rating Title */}
          <div className="font-editorial text-2xl sm:text-3xl font-normal tracking-tight text-[#064E3B]">
            {data.title}
          </div>

          {/* 5 Trustpilot Stars Graphic */}
          <div className="flex items-center space-x-1">
            {renderStars()}
          </div>

          {/* Review Link */}
          <div className="font-sans text-xs sm:text-sm text-[#064E3B]/75 font-normal pt-1">
            Based on{' '}
            <a
              href={data.reviewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-bold text-[#064E3B] hover:text-[#043C2D] transition-colors cursor-pointer"
            >
              {data.reviewCount}
            </a>
          </div>

          {/* Trustpilot Brand Logo */}
          <a
            href={data.reviewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 pt-1.5 group cursor-pointer"
          >
            <svg className="w-5 h-5 text-[#00b67a] fill-current" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
            <span className="font-sans text-lg font-bold tracking-tight text-[#064E3B] group-hover:text-[#00b67a] transition-colors">
              Trustpilot
            </span>
          </a>
        </motion.div>

        {/* Action Button - Matching Hero Section Button Shape */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-2 w-full max-w-sm"
        >
          <button
            onClick={handleAction}
            className="inline-flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-[6px] bg-[#064E3B] hover:bg-[#043C2D] text-[#F8E7C9] font-medium text-base border border-[#043C2D] shadow-sm transition-all duration-200 group cursor-pointer"
          >
            <span>{data.buttonText ? data.buttonText.replace('→', '').trim() : 'Request a refund'}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={1.8} />
          </button>
        </motion.div>

      </div>
    </section>
  );
};

export default TrustpilotSection;
