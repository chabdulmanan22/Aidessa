import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { getJoinWizard, setJoinWizard } from '../utils/datastore';

const JoinContact = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: '',
    countryCode: '+1',
    phone: '',
    telegramUsername: '',
    address1: '',
    address2: '',
    city: '',
    stateProvince: '',
    postalCode: '',
  });

  useEffect(() => {
    const wiz = getJoinWizard();
    const d = wiz.details || {};
    const c = wiz.contact || {};
    setForm({
      email: c.email || d.email || '',
      countryCode: c.countryCode || '+1',
      phone: c.phone || '',
      telegramUsername: c.telegramUsername || '',
      address1: c.address1 || '',
      address2: c.address2 || '',
      city: c.city || '',
      stateProvince: c.stateProvince || '',
      postalCode: c.postalCode || '',
    });
  }, []);

  const requiredFilled =
    form.email &&
    form.countryCode &&
    form.phone &&
    form.address1 &&
    form.city &&
    form.stateProvince &&
    form.postalCode;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (!requiredFilled) return;
    setJoinWizard({ contact: form });
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');
    const nextUrl = ref ? `/join-loss?ref=${encodeURIComponent(ref)}` : '/join-loss';
    navigate(nextUrl);
  };

  const handleBack = () => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');
    const backUrl = ref ? `/join-details?ref=${encodeURIComponent(ref)}` : '/join-details';
    navigate(backUrl);
  };

  return (
    <div className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-6 sm:p-10 md:p-12 text-[#064E3B] shadow-[0_12px_40px_rgba(6,78,59,0.08)]">
      {/* Card Header matching Home Page icon & editorial typography */}
      <div className="flex items-center gap-3.5 sm:gap-4 mb-6 sm:mb-8 pb-5 border-b border-[#064E3B]/10">
        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-[8px] bg-[#064E3B]/[0.08] text-[#064E3B] border border-[#064E3B]/15 shrink-0">
          <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-[#064E3B]" strokeWidth={1.8} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#064E3B]" />
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-[#064E3B] uppercase">
              Step 2 of 3 • Contact & Address
            </span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-normal text-[#064E3B] tracking-[-0.02em] leading-tight">
            Contact & Address
          </h1>
        </div>
      </div>

      {/* Form Fields matching Home Page styling */}
      <div className="space-y-5 sm:space-y-6">
        <div>
          <label className="block font-sans text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 sm:py-3 rounded-[8px] bg-white border border-[#064E3B]/20 text-[#064E3B] placeholder-[#064E3B]/35 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] transition-all duration-200"
          />
        </div>

        <div>
          <label className="block font-sans text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5">
            Phone Number
          </label>
          <div className="grid grid-cols-3 gap-3">
            <input
              type="text"
              name="countryCode"
              value={form.countryCode}
              onChange={handleChange}
              placeholder="+1"
              className="col-span-1 px-4 py-2.5 sm:py-3 rounded-[8px] bg-white border border-[#064E3B]/20 text-[#064E3B] placeholder-[#064E3B]/35 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] transition-all duration-200"
            />
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="555-123-4567"
              className="col-span-2 px-4 py-2.5 sm:py-3 rounded-[8px] bg-white border border-[#064E3B]/20 text-[#064E3B] placeholder-[#064E3B]/35 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] transition-all duration-200"
            />
          </div>
        </div>

        <div>
          <label className="block font-sans text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5">
            Telegram Username (Optional)
          </label>
          <input
            type="text"
            name="telegramUsername"
            value={form.telegramUsername}
            onChange={handleChange}
            placeholder="@yourusername"
            className="w-full px-4 py-2.5 sm:py-3 rounded-[8px] bg-white border border-[#064E3B]/20 text-[#064E3B] placeholder-[#064E3B]/35 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] transition-all duration-200"
          />
        </div>

        <div>
          <label className="block font-sans text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5">
            Street Address
          </label>
          <input
            type="text"
            name="address1"
            value={form.address1}
            onChange={handleChange}
            placeholder="123 Main St"
            className="w-full px-4 py-2.5 sm:py-3 rounded-[8px] bg-white border border-[#064E3B]/20 text-[#064E3B] placeholder-[#064E3B]/35 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] transition-all duration-200"
          />
        </div>

        <div>
          <label className="block font-sans text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5">
            Street Address Line 2 (Optional)
          </label>
          <input
            type="text"
            name="address2"
            value={form.address2}
            onChange={handleChange}
            placeholder="Apt, suite, unit, building, floor, etc."
            className="w-full px-4 py-2.5 sm:py-3 rounded-[8px] bg-white border border-[#064E3B]/20 text-[#064E3B] placeholder-[#064E3B]/35 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] transition-all duration-200"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block font-sans text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5">
              City
            </label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="e.g. San Francisco"
              className="w-full px-4 py-2.5 sm:py-3 rounded-[8px] bg-white border border-[#064E3B]/20 text-[#064E3B] placeholder-[#064E3B]/35 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] transition-all duration-200"
            />
          </div>
          <div>
            <label className="block font-sans text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5">
              Province / State
            </label>
            <input
              type="text"
              name="stateProvince"
              value={form.stateProvince}
              onChange={handleChange}
              placeholder="e.g. CA"
              className="w-full px-4 py-2.5 sm:py-3 rounded-[8px] bg-white border border-[#064E3B]/20 text-[#064E3B] placeholder-[#064E3B]/35 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] transition-all duration-200"
            />
          </div>
        </div>

        <div>
          <label className="block font-sans text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5">
            Postal / ZIP Code
          </label>
          <input
            type="text"
            name="postalCode"
            value={form.postalCode}
            onChange={handleChange}
            placeholder="e.g. 94103"
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
          onClick={handleNext}
          disabled={!requiredFilled}
          className="inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-2.5 sm:py-3 rounded-[8px] bg-[#064E3B] text-[#F8E7C9] text-sm sm:text-base font-semibold hover:bg-[#043C2D] border border-[#043C2D] shadow-md shadow-[#064E3B]/20 active:scale-95 transition-all duration-200 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#064E3B]"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

export default JoinContact;
