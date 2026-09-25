import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';
import { clearJoinWizard, setJoinWizard } from '../utils/datastore';

const JoinNotice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const ref = searchParams.get('ref');

  useEffect(() => {
    clearJoinWizard();
    if (ref) {
      setJoinWizard({ referralCode: ref });
    }
  }, [ref]);

  const handleNext = () => {
    const nextUrl = ref ? `/join-details?ref=${encodeURIComponent(ref)}` : '/join-details';
    navigate(nextUrl);
  };

  return (
    <div className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-6 sm:p-10 md:p-12 text-[#064E3B] shadow-[0_12px_40px_rgba(6,78,59,0.08)]">
      {/* Card Header matching Home Page icon & editorial typography */}
      <div className="flex items-center gap-3.5 sm:gap-4 mb-6 sm:mb-8 pb-5 border-b border-[#064E3B]/10">
        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-[8px] bg-[#064E3B]/[0.08] text-[#064E3B] border border-[#064E3B]/15 shrink-0">
          <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-[#064E3B]" strokeWidth={1.8} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#064E3B]" />
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-[#064E3B] uppercase">
              Verification Protocol
            </span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-normal text-[#064E3B] tracking-[-0.02em] leading-tight">
            Important Notice
          </h1>
        </div>
      </div>

      {/* Body Content with Home Page Font & Spacing */}
      <div className="space-y-4 sm:space-y-4.5 text-[#064E3B]/85 font-sans text-sm sm:text-[15.5px] leading-relaxed">
        <p>
          Please read carefully before proceeding. Aidessa helps eligible fraud victims access refund allocations through structured verification.
        </p>
        <p>
          To process your request accurately, you will need to provide basic incident details, your contact email, and documentation or transaction hashes related to your loss.
        </p>
        <p>
          All submitted evidence is encrypted and reviewed securely by our verification system.
        </p>

        {/* Warning statement inline without separate box, slightly smaller font */}
        <p className="text-xs sm:text-[13px] text-[#064E3B]/80 font-normal leading-relaxed">
          <strong className="font-semibold text-red-700">Warning:</strong> Any individual found to have submitted false or misleading information may be disqualified from recovery assistance and could be prosecuted for fraud or attempted extortion.
        </p>

        <p>
          By completing this form, you confirm that the information provided is accurate to the best of your knowledge. If you are unsure about any details, we recommend you review your records before submitting.
        </p>
        <p>
          Thank you for your cooperation.
        </p>
      </div>

      {/* Action Buttons matching Home Page Button Style */}
      <div className="mt-8 sm:mt-10 pt-5 border-t border-[#064E3B]/10 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center justify-center px-6 py-2.5 sm:py-3 rounded-[8px] border border-[#064E3B]/25 text-[#064E3B] text-sm sm:text-base font-semibold hover:bg-[#064E3B]/[0.06] hover:border-[#064E3B]/40 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-2.5 sm:py-3 rounded-[8px] bg-[#064E3B] text-[#F8E7C9] text-sm sm:text-base font-semibold hover:bg-[#043C2D] border border-[#043C2D] shadow-md shadow-[#064E3B]/20 active:scale-95 transition-all duration-200 group cursor-pointer"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

export default JoinNotice;