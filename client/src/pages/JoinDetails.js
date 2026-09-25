import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, ArrowRight } from 'lucide-react';
import { getJoinWizard, setJoinWizard } from '../utils/datastore';

const JoinDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ firstName: '', lastName: '', gender: '', dob: '' });

  useEffect(() => {
    const wiz = getJoinWizard();
    const d = wiz.details || {};
    setForm({
      firstName: d.firstName || '',
      lastName: d.lastName || '',
      gender: d.gender || '',
      dob: d.dob || '',
    });
    try {
      const params = new URLSearchParams(location.search);
      let ref = params.get('ref');
      const email = params.get('email');
      if (!ref) ref = localStorage.getItem('landingReferralCode');
      const contact = wiz.contact || {};
      const mergedContact = { ...contact };
      if (email) mergedContact.email = email;
      const updates = { details: d, contact: mergedContact };
      if (ref) updates.referralCode = ref;
      setJoinWizard(updates);
    } catch { }
  }, [location.search]);

  const isValid = form.firstName && form.lastName && form.gender && form.dob;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (!isValid) return;
    setJoinWizard({ details: form });
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');
    const nextUrl = ref ? `/join-contact?ref=${encodeURIComponent(ref)}` : '/join-contact';
    navigate(nextUrl);
  };

  const handleBack = () => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');
    const backUrl = ref ? `/join-notice?ref=${encodeURIComponent(ref)}` : '/join-notice';
    navigate(backUrl);
  };

  return (
    <div className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-6 sm:p-10 md:p-12 text-[#064E3B] shadow-[0_12px_40px_rgba(6,78,59,0.08)]">
      {/* Card Header matching Home Page icon & editorial typography */}
      <div className="flex items-center gap-3.5 sm:gap-4 mb-6 sm:mb-8 pb-5 border-b border-[#064E3B]/10">
        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-[8px] bg-[#064E3B]/[0.08] text-[#064E3B] border border-[#064E3B]/15 shrink-0">
          <User className="w-6 h-6 sm:w-7 sm:h-7 text-[#064E3B]" strokeWidth={1.8} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#064E3B]" />
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-[#064E3B] uppercase">
              Step 1 of 3 • Claimant Identity
            </span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-normal text-[#064E3B] tracking-[-0.02em] leading-tight">
            Personal Details
          </h1>
        </div>
      </div>

      {/* Form Fields matching Home Page styling */}
      <div className="space-y-5 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block font-sans text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="e.g. John"
              className="w-full px-4 py-2.5 sm:py-3 rounded-[8px] bg-white border border-[#064E3B]/20 text-[#064E3B] placeholder-[#064E3B]/35 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] transition-all duration-200"
            />
          </div>
          <div>
            <label className="block font-sans text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="e.g. Doe"
              className="w-full px-4 py-2.5 sm:py-3 rounded-[8px] bg-white border border-[#064E3B]/20 text-[#064E3B] placeholder-[#064E3B]/35 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] transition-all duration-200"
            />
          </div>
        </div>

        <div>
          <label className="block font-sans text-xs sm:text-sm font-semibold text-[#064E3B] mb-2">
            Gender
          </label>
          <div className="flex items-center gap-4 sm:gap-6">
            <label
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-[8px] border cursor-pointer transition-all duration-200 ${
                form.gender === 'male'
                  ? 'bg-[#064E3B]/[0.08] border-[#064E3B] text-[#064E3B] font-semibold'
                  : 'bg-white border-[#064E3B]/20 text-[#064E3B]/80 hover:border-[#064E3B]/40'
              }`}
            >
              <input
                type="radio"
                name="gender"
                value="male"
                checked={form.gender === 'male'}
                onChange={handleChange}
                className="accent-[#064E3B] w-4 h-4 cursor-pointer"
              />
              <span className="font-sans text-sm sm:text-base">Male</span>
            </label>
            <label
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-[8px] border cursor-pointer transition-all duration-200 ${
                form.gender === 'female'
                  ? 'bg-[#064E3B]/[0.08] border-[#064E3B] text-[#064E3B] font-semibold'
                  : 'bg-white border-[#064E3B]/20 text-[#064E3B]/80 hover:border-[#064E3B]/40'
              }`}
            >
              <input
                type="radio"
                name="gender"
                value="female"
                checked={form.gender === 'female'}
                onChange={handleChange}
                className="accent-[#064E3B] w-4 h-4 cursor-pointer"
              />
              <span className="font-sans text-sm sm:text-base">Female</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block font-sans text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5">
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            className="w-full px-4 py-2.5 sm:py-3 rounded-[8px] bg-white border border-[#064E3B]/20 text-[#064E3B] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] transition-all duration-200"
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
          onClick={handleNext}
          disabled={!isValid}
          className="inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-2.5 sm:py-3 rounded-[8px] bg-[#064E3B] text-[#F8E7C9] text-sm sm:text-base font-semibold hover:bg-[#043C2D] border border-[#043C2D] shadow-md shadow-[#064E3B]/20 active:scale-95 transition-all duration-200 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#064E3B]"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

export default JoinDetails;