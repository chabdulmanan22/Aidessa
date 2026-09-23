import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Send, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ContactUs = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [companyAddress, setCompanyAddress] = useState('12 N 2nd Street STE 100,\nRichmond, KY 40475');
  const [companyAddress2, setCompanyAddress2] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('https://wa.me/message/QO7NOBRERE3MO1');

  React.useEffect(() => {
    const loadSettings = async () => {
      try {
        const [addrRes, addr2Res, waRes] = await Promise.all([
          axios.get('/api/settings/COMPANY_ADDRESS').catch(() => ({ data: {} })),
          axios.get('/api/settings/COMPANY_ADDRESS_2').catch(() => ({ data: {} })),
          axios.get('/api/settings/WHATSAPP_LINK').catch(() => ({ data: {} }))
        ]);
        if (addrRes.data?.data?.value) setCompanyAddress(addrRes.data.data.value);
        if (addr2Res.data?.data?.value) setCompanyAddress2(addr2Res.data.data.value);
        if (waRes.data?.data?.value) setWhatsappLink(waRes.data.data.value);
      } catch (_) {}
    };
    loadSettings();
    window.addEventListener('datastore:update', loadSettings);
    return () => window.removeEventListener('datastore:update', loadSettings);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Please fill in all required fields (Name, Email, Message)');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/mail/contact', form);
      if (res.data?.success) {
        toast.success('Your message has been sent to support@veritasaid.com');
        setSubmitted(true);
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(res.data?.message || 'Failed to send message');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 border border-white/30 text-white text-xs md:text-sm font-bold tracking-wider uppercase backdrop-blur-md shadow-xs">
            <Mail className="w-3.5 h-3.5 text-white" />
            Direct Support
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Contact Aidessa Support
          </h1>
          <p className="text-sky-100 text-base md:text-lg leading-relaxed">
            Have questions about refund programs, claims, or protocol verification? Send us a message and our support team will get back to you promptly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Info Cards */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#06b6d4]" />
                Contact Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div className="p-2.5 rounded-lg bg-[#085464] text-cyan-300 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Direct Email</h4>
                    <a
                      href="mailto:support@veritasaid.com"
                      className="text-sm font-semibold text-cyan-300 hover:text-cyan-200 break-all transition-colors"
                    >
                      support@veritasaid.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div className="p-2.5 rounded-lg bg-[#085464] text-cyan-300 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                    {companyAddress && (
                      <div>
                        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Administrative Office</h4>
                        <p className="text-sm font-medium text-slate-200 leading-snug whitespace-pre-line">
                          {companyAddress}
                        </p>
                      </div>
                    )}
                    {companyAddress2 && (
                      <div className="pt-2 border-t border-slate-800">
                        <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider">Registered Office</h4>
                        <p className="text-sm font-medium text-slate-200 leading-snug whitespace-pre-line">
                          {companyAddress2}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 shadow-md">
                  <div className="p-2.5 rounded-lg bg-[#25D366]/20 text-[#25D366] shrink-0">
                    <span className="text-xl">💬</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#25D366] uppercase tracking-wider">WhatsApp Support</h4>
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-extrabold text-[#25D366] hover:text-[#20ba59] transition-colors underline underline-offset-2 flex items-center gap-1 mt-0.5"
                    >
                      Chat on WhatsApp &rarr;
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs leading-relaxed">
                <p className="font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Security Notice
                </p>
                Aidessa support will never ask for your private keys or seed phrase. All official support messages route to support@veritasaid.com.
              </div>
            </div>
          </div>

          {/* Interactive Form Card */}
          <div className="lg:col-span-8">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-sm">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Message Sent Successfully!</h3>
                  <p className="text-slate-300 text-sm max-w-md mx-auto">
                    Your inquiry has been routed directly to <span className="font-semibold text-cyan-300">support@veritasaid.com</span>. Our support team will review and reply to your email shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <h3 className="text-xl font-bold text-white">Send Us a Direct Message</h3>
                    <span className="text-xs text-slate-400 font-medium">Routes to support@veritasaid.com</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm font-medium text-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                        Your Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm font-medium text-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Subject (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Inquiry about refund claim / case status"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm font-medium text-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Your Message *
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Type your message or inquiry here..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm font-medium text-white transition-all"
                    />
                  </div>

                  <div className="pt-2">
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#085464] to-[#06b6d4] text-white font-bold text-sm shadow-lg shadow-cyan-950/40 hover:brightness-110 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      {loading ? 'Sending Message...' : 'Send Message to support@veritasaid.com'}
                    </motion.button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
