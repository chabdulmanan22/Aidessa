import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ScamAlertIcon = () => (
  <svg
    className="w-7 h-7 transition-transform duration-300 group-hover:scale-105"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 3.5L5.5 7.8V15.2C5.5 21.6 9.9 27.5 16 29C22.1 27.5 26.5 21.6 26.5 15.2V7.8L16 3.5Z"
      fill="currentColor"
      fillOpacity="0.08"
    />
    <path
      d="M16 3.5L5.5 7.8V15.2C5.5 21.6 9.9 27.5 16 29C22.1 27.5 26.5 21.6 26.5 15.2V7.8L16 3.5Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 10V16.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="16" cy="21" r="1.3" fill="currentColor" />
  </svg>
);

const RefundProgramsIcon = () => (
  <svg
    className="w-7 h-7 transition-transform duration-300 group-hover:scale-105"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="16" cy="16" r="12.5" fill="currentColor" fillOpacity="0.08" />
    <path
      d="M16 4.5C9.65 4.5 4.5 9.65 4.5 16C4.5 18.1 5.08 20.08 6.08 21.8"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <polyline
      points="2.5 18 6.08 21.8 10 18.2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 27.5C22.35 27.5 27.5 22.35 27.5 16C27.5 13.9 26.92 11.92 25.92 10.2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <polyline
      points="29.5 14 25.92 10.2 22 13.8"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="16" cy="16" r="4.5" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M14.5 16H17.5M16 14.5V17.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const HowRefundsIcon = () => (
  <svg
    className="w-7 h-7 transition-transform duration-300 group-hover:scale-105"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="5" y="6.5" width="22" height="19" rx="3.5" fill="currentColor" fillOpacity="0.08" />
    <rect
      x="5"
      y="6.5"
      width="22"
      height="19"
      rx="3.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line x1="5" y1="12" x2="27" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="9.5" cy="9.25" r="1.1" fill="currentColor" />
    <circle cx="13" cy="9.25" r="1.1" fill="currentColor" />
    <path d="M10 18.5H21.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <polyline
      points="18 15.5 21.5 18.5 18 21.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const renderResourceIcon = (id) => {
  switch (id) {
    case 'scam-alerts':
      return <ScamAlertIcon />;
    case 'refund-programs':
      return <RefundProgramsIcon />;
    case 'how-refunds':
      return <HowRefundsIcon />;
    default:
      return <ScamAlertIcon />;
  }
};

const StaticResourceCard = ({ id, to, title, description }) => (
  <Link
    to={to}
    className="group flex h-full min-h-[250px] sm:min-h-[290px] w-full max-w-[380px] md:max-w-none flex-col items-center p-5 sm:p-7 md:p-8 text-center justify-between rounded-[8px] bg-[#FFFDF9] border border-[#064E3B]/15 hover:border-[#064E3B]/45 hover:bg-white transition-all duration-300 shadow-[0_1px_3px_rgba(6,78,59,0.04)] hover:shadow-[0_8px_24px_rgba(6,78,59,0.08)] cursor-pointer"
  >
    {/* Refined bespoke icon container */}
    <div className="mb-4 sm:mb-5 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-[8px] bg-[#064E3B]/[0.06] text-[#064E3B] border border-[#064E3B]/12 group-hover:bg-[#064E3B] group-hover:text-[#F8E7C9] group-hover:border-[#064E3B] transition-all duration-300">
      {renderResourceIcon(id)}
    </div>

    {/* Editorial Serif Headline (matching hero section) */}
    <h3 className="font-editorial text-xl sm:text-2xl md:text-[1.65rem] font-normal text-[#064E3B] group-hover:text-[#043C2D] leading-[1.2] mb-2 sm:mb-3 transition-colors">
      {title}
    </h3>

    {/* Clean Body Typography (matching hero section) */}
    <p className="font-sans text-xs sm:text-[13.5px] md:text-sm text-[#064E3B]/80 leading-[1.6] sm:leading-[1.65] font-normal flex-1 mb-4 sm:mb-5">
      {description}
    </p>

    {/* Prominent Action Button */}
    <div className="inline-flex items-center justify-center gap-2 px-5 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold text-[#F8E7C9] bg-[#064E3B] group-hover:bg-[#043C2D] shadow-[0_2px_8px_rgba(6,78,59,0.15)] group-hover:shadow-[0_4px_14px_rgba(6,78,59,0.25)] transition-all duration-300 mt-auto">
      <span>Read</span>
      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
    </div>
  </Link>
);

export default StaticResourceCard;
