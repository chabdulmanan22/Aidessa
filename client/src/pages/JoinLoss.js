import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';
import { addJoinApplication as dsAddJoinApplication, getJoinWizard, setJoinWizard } from '../utils/datastore';

const JoinLoss = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ totalAmount: '', breakdown: '', period: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const wiz = getJoinWizard();
    const l = wiz.loss || {};
    setForm({
      totalAmount: l.totalAmount || '',
      breakdown: l.breakdown || '',
      period: l.period || '',
    });
  }, []);

  const requiredFilled = form.totalAmount && form.period;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBack = () => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');
    const backUrl = ref ? `/join-contact?ref=${encodeURIComponent(ref)}` : '/join-contact';
    navigate(backUrl);
  };

  const handleSubmit = async () => {
    if (!requiredFilled) return;
    const wiz = getJoinWizard();
    const details = wiz.details || {};
    const contact = wiz.contact || {};

    const params = new URLSearchParams(location.search);
    const referralCode = params.get('ref') || wiz.referralCode || localStorage.getItem('landingReferralCode') || undefined;

    const combinedPrefill = { ...details, ...contact, ...form };
    setJoinWizard({ loss: form });

    setSubmitting(true);
    try {
      await axios.post('/api/join', {
        firstName: combinedPrefill.firstName,
        lastName: combinedPrefill.lastName,
        email: combinedPrefill.email,
        details: combinedPrefill,
        referralCode
      });
      dsAddJoinApplication({
        firstName: combinedPrefill.firstName,
        lastName: combinedPrefill.lastName,
        email: combinedPrefill.email,
        details: combinedPrefill,
        referralCode
      });
      navigate('/join-submitted', { state: { prefill: { ...combinedPrefill, referralCode } } });
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-6 sm:p-10 md:p-12 text-[#064E3B] shadow-[0_12px_40px_rgba(6,78,59,0.08)]">
      {/* Card Header matching Home Page icon & editorial typography */}
      <div className="flex items-center gap-3.5 sm:gap-4 mb-6 sm:mb-8 pb-5 border-b border-[#064E3B]/10">
        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-[8px] bg-[#064E3B]/[0.08] text-[#064E3B] border border-[#064E3B]/15 shrink-0">
          <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-[#064E3B]" strokeWidth={1.8} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#064E3B]" />
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-[#064E3B] uppercase">
              Step 3 of 3 • Loss Details
            </span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-normal text-[#064E3B] tracking-[-0.02em] leading-tight">
            Loss Details
          </h1>
        </div>
      </div>

      {/* Form Fields matching Home Page styling */}
      <div className="space-y-6">
        <div>
          <label className="block font-sans text-xs sm:text-sm font-semibold text-[#064E3B] mb-1">
            Total Amount Lost
          </label>
          <p className="text-xs text-[#064E3B]/70 font-sans mb-2">
            Enter the total amount lost across all companies. Use USD or specify the currency.
          </p>
          <input
            type="text"
            name="totalAmount"
            value={form.totalAmount}
            onChange={handleChange}
            placeholder="$3,500 USD"
            className="w-full px-4 py-2.5 sm:py-3 rounded-[8px] bg-white border border-[#064E3B]/20 text-[#064E3B] placeholder-[#064E3B]/35 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] transition-all duration-200"
          />
        </div>

        <div>
          <label className="block font-sans text-xs sm:text-sm font-semibold text-[#064E3B] mb-1">
            Breakdown of Loss by Company
          </label>
          <p className="text-xs text-[#064E3B]/70 font-sans mb-2">
            If the loss was spread across multiple companies, list each company with the corresponding amount. Example: Company A – $2,000, Company B – $1,500
          </p>
          <textarea
            name="breakdown"
            value={form.breakdown}
            onChange={handleChange}
            rows={5}
            placeholder={`Company A – $2,000\nCompany B – $1,500`}
            className="w-full px-4 py-3 rounded-[8px] bg-white border border-[#064E3B]/20 text-[#064E3B] placeholder-[#064E3B]/35 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] transition-all duration-200 resize-y"
          />
        </div>

        <div>
          <label className="block font-sans text-xs sm:text-sm font-semibold text-[#064E3B] mb-1">
            Period of Incident
          </label>
          <p className="text-xs text-[#064E3B]/70 font-sans mb-2">
            Enter the time period over which the loss occurred. Example: 2016 – 2025
          </p>
          <input
            type="text"
            name="period"
            value={form.period}
            onChange={handleChange}
            placeholder="2016 – 2025"
            className="w-full px-4 py-2.5 sm:py-3 rounded-[8px] bg-white border border-[#064E3B]/20 text-[#064E3B] placeholder-[#064E3B]/35 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] transition-all duration-200"
          />
        </div>
      </div>

      {/* Action Buttons matching Home Page Button Style */}
      <div className="mt-8 sm:mt-10 pt-5 border-t border-[#064E3B]/10 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center justify-center px-6 py-2.5 sm:py-3 rounded-[8px] border border-[#064E3B]/25 text-[#064E3B] text-sm sm:text-base font-semibold hover:bg-[#064E3B]/[0.06] hover:border-[#064E3B]/40 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!requiredFilled || submitting}
          className="inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-2.5 sm:py-3 rounded-[8px] bg-[#064E3B] text-[#F8E7C9] text-sm sm:text-base font-semibold hover:bg-[#043C2D] border border-[#043C2D] shadow-md shadow-[#064E3B]/20 active:scale-95 transition-all duration-200 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#064E3B]"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <span>Submit Application</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default JoinLoss;