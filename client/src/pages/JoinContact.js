import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getJoinWizard, setJoinWizard } from '../utils/datastore';
import axios from 'axios';
import toast from 'react-hot-toast';

const JoinContact = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

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

  // Contact form state
  const [contactMsg, setContactMsg] = useState({ name: '', email: '', message: '' });
  const [sendingMsg, setSendingMsg] = useState(false);

  useEffect(() => {
    const wiz = getJoinWizard();
    const d = wiz.details || {};
    const c = wiz.contact || {};
    setForm({
      email: c.email || d.email || '',
      countryCode: c.countryCode || '',
      phone: c.phone || '',
      telegramUsername: c.telegramUsername || '',
      address1: c.address1 || '',
      address2: c.address2 || '',
      city: c.city || '',
      stateProvince: c.stateProvince || '',
      postalCode: c.postalCode || '',
    });
    setInitialized(true);
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

  const handleContactMsgChange = (e) => {
    const { name, value } = e.target;
    setContactMsg((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!contactMsg.name || !contactMsg.email || !contactMsg.message) {
      toast.error('Please fill in all fields.');
      return;
    }
    setSendingMsg(true);
    try {
      await axios.post('/api/mail', {
        to: 'support@veritasaid.com',
        subject: `Contact Form Message from ${contactMsg.name}`,
        text: `Name: ${contactMsg.name}\nEmail: ${contactMsg.email}\n\nMessage:\n${contactMsg.message}`,
      });
      toast.success('Message sent! We will get back to you soon.');
      setContactMsg({ name: '', email: '', message: '' });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSendingMsg(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#085464] via-[#05323c] to-[#02141a]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl bg-[#031d24]/80 backdrop-blur-lg border border-cyan-500/20 p-8 text-white shadow-2xl shadow-cyan-950/60"
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Contact & Address</h1>


          <div className="space-y-5">
            <div>
              <label className="block text-sm text-white/80 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm text-white/80 mb-1">Phone Number</label>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  name="countryCode"
                  value={form.countryCode}
                  onChange={handleChange}
                  className="col-span-1 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  placeholder="+1"
                />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="col-span-2 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  placeholder="555-123-4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/80 mb-1">Telegram Username</label>
              <input
                type="text"
                name="telegramUsername"
                value={form.telegramUsername}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="@yourusername"
              />
            </div>

            <div>
              <label className="block text-sm text-white/80 mb-1">Street Address</label>
              <input
                type="text"
                name="address1"
                value={form.address1}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="123 Main St"
              />
            </div>

            <div>
              <label className="block text-sm text-white/80 mb-1">Street Address Line 2 (Optional)</label>
              <input
                type="text"
                name="address2"
                value={form.address2}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="Apt, suite, unit, building, floor, etc."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-white/80 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  placeholder="San Francisco"
                />
              </div>
              <div>
                <label className="block text-sm text-white/80 mb-1">Province / State</label>
                <input
                  type="text"
                  name="stateProvince"
                  value={form.stateProvince}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  placeholder="CA"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/80 mb-1">Postal / ZIP Code</label>
              <input
                type="text"
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="94103"
              />
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/join-details')}
              className="px-5 py-2.5 rounded-lg border border-white/30 text-white hover:bg-white/10 transition"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!requiredFilled}
              className={`px-6 py-2.5 rounded-lg font-semibold bg-gradient-to-r from-[#086a7e] to-[#0e7490] text-white shadow-md shadow-cyan-950/50 transition ${requiredFilled ? 'hover:from-[#097d95] hover:to-[#0891b2]' : 'opacity-50 cursor-not-allowed'
                }`}
            >
              Next
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default JoinContact;
