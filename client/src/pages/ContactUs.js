import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Send, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import HeroGridBoxesAnimation from '../components/HeroGridBoxesAnimation';

const WhatsAppIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 175.216 175.552" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* White outer halo/speech-bubble border */}
    <path
      fill="#FFFFFF"
      d="m12.966 161.238 10.439-38.114a73.42 73.42 0 0 1-9.821-36.772c.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954z"
    />
    {/* Official WhatsApp Green speech bubble */}
    <path
      fill="#25D366"
      d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.313-6.179 22.558 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.517 31.126 8.523h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.928z"
    />
    {/* Solid White Telephone Handset */}
    <path
      fill="#FFFFFF"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647"
    />
  </svg>
);

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
    <div className="relative w-full min-h-[calc(100vh-4rem)] bg-[#F8E7C9] text-[#064E3B] py-12 md:py-16 overflow-hidden">
      {/* Persistent Animated Grid Texture */}
      <HeroGridBoxesAnimation />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Page Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h1 className="font-editorial text-3xl md:text-5xl font-normal text-[#064E3B] tracking-[-0.02em] leading-tight">
            Contact Aidessa Support
          </h1>
          <p className="text-[#064E3B]/75 text-sm sm:text-base md:text-lg leading-relaxed font-sans">
            Have questions about refund programs, claims, or protocol verification? Send us a message and our support team will get back to you promptly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Contact Info Card (Left) */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="flex-1 flex flex-col justify-between rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-6 sm:p-8 text-[#064E3B] shadow-[0_12px_40px_rgba(6,78,59,0.08)]">
              <div>
                {/* Aligned Header Line */}
                <div className="flex items-center justify-between pb-4 border-b border-[#064E3B]/10 min-h-[44px]">
                  <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#064E3B] flex items-center gap-2.5">
                    <MessageSquare className="w-5 h-5 text-[#064E3B]" strokeWidth={1.8} />
                    <span>Contact Information</span>
                  </h3>
                </div>

                {/* Unboxed Contact Info */}
                <div className="space-y-6 pt-6">
                  {/* Direct Email */}
                  <div className="flex items-start gap-3.5">
                    <div className="p-2 rounded-[8px] bg-[#064E3B]/[0.08] text-[#064E3B] border border-[#064E3B]/15 shrink-0 mt-0.5">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-[#064E3B]/60 uppercase tracking-wider mb-0.5">Direct Email</h4>
                      <a
                        href="mailto:support@veritasaid.com"
                        className="text-sm sm:text-base font-semibold text-[#064E3B] hover:underline underline-offset-2 break-all transition-colors font-sans"
                      >
                        support@veritasaid.com
                      </a>
                    </div>
                  </div>

                  {/* Administrative & Registered Office */}
                  <div className="flex items-start gap-3.5">
                    <div className="p-2 rounded-[8px] bg-[#064E3B]/[0.08] text-[#064E3B] border border-[#064E3B]/15 shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="space-y-3">
                      {companyAddress && (
                        <div>
                          <h4 className="text-[11px] font-bold text-[#064E3B]/60 uppercase tracking-wider mb-0.5">Administrative Office</h4>
                          <p className="text-sm font-medium text-[#064E3B] leading-snug whitespace-pre-line font-sans">
                            {companyAddress}
                          </p>
                        </div>
                      )}
                      {companyAddress2 && (
                        <div className="pt-2 border-t border-[#064E3B]/10">
                          <h4 className="text-[11px] font-bold text-[#064E3B]/60 uppercase tracking-wider mb-0.5">Registered Office</h4>
                          <p className="text-sm font-medium text-[#064E3B] leading-snug whitespace-pre-line font-sans">
                            {companyAddress2}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* WhatsApp Support */}
                  <div className="flex items-start gap-3.5">
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-[8px] bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 shrink-0 mt-0.5 flex items-center justify-center transition-all duration-200 group"
                      title="Chat on WhatsApp"
                    >
                      <WhatsAppIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    </a>
                    <div>
                      <h4 className="text-[11px] font-bold text-[#064E3B]/60 uppercase tracking-wider mb-0.5">WhatsApp Support</h4>
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm sm:text-base font-bold text-[#064E3B] hover:text-[#043C2D] underline underline-offset-2 inline-flex items-center gap-1.5 font-sans group"
                      >
                        <span>Chat on WhatsApp</span>
                        <span className="group-hover:translate-x-0.5 transition-transform duration-200">&rarr;</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="mt-8 pt-5 border-t border-[#064E3B]/10 text-xs text-[#064E3B]/75 leading-relaxed font-sans">
                <p className="font-semibold text-[#064E3B] mb-1 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5 text-[#064E3B]" /> Security Notice
                </p>
                Aidessa support will never ask for your private keys or seed phrase. All official support messages route to support@veritasaid.com.
              </div>
            </div>
          </div>

          {/* Interactive Form Card (Right) */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="flex-1 flex flex-col justify-between rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-6 sm:p-8 text-[#064E3B] shadow-[0_12px_40px_rgba(6,78,59,0.08)]">
              {submitted ? (
                <div className="py-12 text-center space-y-4 my-auto">
                  <div className="w-16 h-16 bg-[#064E3B]/[0.08] text-[#064E3B] border border-[#064E3B]/20 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-[#064E3B]" />
                  </div>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#064E3B]">Message Sent Successfully!</h3>
                  <p className="text-[#064E3B]/75 text-sm max-w-md mx-auto font-sans leading-relaxed">
                    Your inquiry has been routed directly to <span className="font-semibold text-[#064E3B]">support@veritasaid.com</span>. Our support team will review and reply to your email shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 bg-[#064E3B] hover:bg-[#043C2D] text-[#F8E7C9] font-semibold text-sm rounded-[8px] transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Aligned Header Line */}
                    <div className="pb-4 border-b border-[#064E3B]/10 min-h-[44px]">
                      <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#064E3B]">
                        Send Us a Direct Message
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-6">
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="John Doe"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full px-4 py-2.5 sm:py-3 bg-white border border-[#064E3B]/20 rounded-[8px] text-sm text-[#064E3B] placeholder-[#064E3B]/35 focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5">
                          Your Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="john@example.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full px-4 py-2.5 sm:py-3 bg-white border border-[#064E3B]/20 rounded-[8px] text-sm text-[#064E3B] placeholder-[#064E3B]/35 focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] transition-all"
                        />
                      </div>
                    </div>

                    <div className="mt-5">
                      <label className="block text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5">
                        Subject (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Inquiry about refund claim / case status"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-4 py-2.5 sm:py-3 bg-white border border-[#064E3B]/20 rounded-[8px] text-sm text-[#064E3B] placeholder-[#064E3B]/35 focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] transition-all"
                      />
                    </div>

                    <div className="mt-5">
                      <label className="block text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5">
                        Your Message *
                      </label>
                      <textarea
                        rows={5}
                        required
                        placeholder="Type your message or inquiry here..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-[#064E3B]/20 rounded-[8px] text-sm text-[#064E3B] placeholder-[#064E3B]/35 focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] transition-all resize-y"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-2.5 sm:py-3 rounded-[8px] bg-[#064E3B] text-[#F8E7C9] font-semibold text-sm sm:text-base hover:bg-[#043C2D] border border-[#043C2D] shadow-md shadow-[#064E3B]/20 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>{loading ? 'Sending...' : 'Send Message'}</span>
                    </button>
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
