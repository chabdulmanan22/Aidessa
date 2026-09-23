import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail } from "lucide-react";
import axios from "axios";
import PrCoverageSection from "./PrCoverageSection";
import TrustpilotSection from "./TrustpilotSection";

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

const Footer = () => {
  const location = useLocation();
  const [canContribute, setCanContribute] = React.useState(false);
  const [whatsappLink, setWhatsappLink] = React.useState("https://wa.me/message/QO7NOBRERE3MO1");
  const [companyAddress, setCompanyAddress] = React.useState("12 N 2nd Street STE 100, Richmond, KY 40475");
  const [companyAddress2, setCompanyAddress2] = React.useState("");

  React.useEffect(() => {
    const checkStatusAndSettings = async () => {
      try {
        const [activeRes, publicRes, roundRes, waRes, addrRes, addr2Res] = await Promise.all([
          axios.get("/api/settings/contributionActive").catch(() => ({ data: {} })),
          axios.get("/api/settings/publicContributionsEnabled").catch(() => ({ data: {} })),
          axios.get("/api/settings/contributionRound").catch(() => ({ data: {} })),
          axios.get("/api/settings/WHATSAPP_LINK").catch(() => ({ data: {} })),
          axios.get("/api/settings/COMPANY_ADDRESS").catch(() => ({ data: {} })),
          axios.get("/api/settings/COMPANY_ADDRESS_2").catch(() => ({ data: {} }))
        ]);

        const isActive = activeRes.data?.data?.value ?? true;
        const isPublic = publicRes.data?.data?.value === true;
        const round = roundRes.data?.data?.value;
        const nowMs = Date.now();
        const hasRound = Boolean(round && round.startTime && round.endTime && nowMs <= new Date(round.endTime).getTime());
        setCanContribute(isActive && (isPublic || hasRound));

        if (waRes.data?.data?.value) setWhatsappLink(waRes.data.data.value);
        if (addrRes.data?.data?.value) setCompanyAddress(addrRes.data.data.value);
        if (addr2Res.data?.data?.value) setCompanyAddress2(addr2Res.data.data.value);
      } catch (error) { }
    };
    checkStatusAndSettings();
    window.addEventListener("datastore:update", checkStatusAndSettings);
    return () => window.removeEventListener("datastore:update", checkStatusAndSettings);
  }, []);

  return (
    <>
      {location.pathname === '/' && (
        <>
          <PrCoverageSection />
          <TrustpilotSection />
        </>
      )}
      <footer className="bg-[#064E3B] text-[#F8E7C9] border-t border-[#043C2D] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-start">
            
            {/* Platform */}
            <div className="space-y-4">
              <h3 className="font-editorial text-lg sm:text-xl font-normal text-[#F8E7C9] tracking-tight">
                Platform
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link to="/voting" onClick={() => window.scrollTo(0, 0)} className="font-sans text-[#F8E7C9]/75 hover:text-white transition-colors duration-200 text-xs sm:text-sm">
                    Voting
                  </Link>
                </li>
                {canContribute && (
                  <li>
                    <Link to="/contribute" onClick={() => window.scrollTo(0, 0)} className="font-sans text-[#F8E7C9]/75 hover:text-white transition-colors duration-200 text-xs sm:text-sm">
                      Contribute
                    </Link>
                  </li>
                )}
                <li>
                  <Link to="/leaderboard" onClick={() => window.scrollTo(0, 0)} className="font-sans text-[#F8E7C9]/75 hover:text-white transition-colors duration-200 text-xs sm:text-sm">
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" onClick={() => window.scrollTo(0, 0)} className="font-sans text-[#F8E7C9]/75 hover:text-white transition-colors duration-200 text-xs sm:text-sm">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/referral" onClick={() => window.scrollTo(0, 0)} className="font-sans text-[#F8E7C9]/75 hover:text-white transition-colors duration-200 text-xs sm:text-sm">
                    Referral
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h3 className="font-editorial text-lg sm:text-xl font-normal text-[#F8E7C9] tracking-tight">
                Resources
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link to="/resources/scam-alerts" onClick={() => window.scrollTo(0, 0)} className="font-sans text-[#F8E7C9]/75 hover:text-white transition-colors duration-200 text-xs sm:text-sm">
                    Scam Alerts
                  </Link>
                </li>
                <li>
                  <Link to="/resources/refund-programs" onClick={() => window.scrollTo(0, 0)} className="font-sans text-[#F8E7C9]/75 hover:text-white transition-colors duration-200 text-xs sm:text-sm">
                    Refund Programs
                  </Link>
                </li>
                <li>
                  <Link to="/resources/how-refunds-work" onClick={() => window.scrollTo(0, 0)} className="font-sans text-[#F8E7C9]/75 hover:text-white transition-colors duration-200 text-xs sm:text-sm">
                    How Refunds Work
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h3 className="font-editorial text-lg sm:text-xl font-normal text-[#F8E7C9] tracking-tight">
                Legal
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link to="/privacy" onClick={() => window.scrollTo(0, 0)} className="font-sans text-[#F8E7C9]/75 hover:text-white transition-colors duration-200 text-xs sm:text-sm">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" onClick={() => window.scrollTo(0, 0)} className="font-sans text-[#F8E7C9]/75 hover:text-white transition-colors duration-200 text-xs sm:text-sm">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="font-editorial text-lg sm:text-xl font-normal text-[#F8E7C9] tracking-tight">
                Contact
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/contact" 
                    onClick={() => window.scrollTo(0, 0)} 
                    className="font-sans text-[#F8E7C9] font-medium hover:text-white transition-colors duration-200 text-xs sm:text-sm inline-flex items-center gap-2 group"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#F8E7C9]/75 group-hover:text-white transition-colors" strokeWidth={1.8} />
                    <span className="group-hover:underline underline-offset-2">Contact Us Form</span>
                  </Link>
                </li>
                <li>
                  <a 
                    href="mailto:support@veritasaid.com" 
                    className="font-sans text-[#F8E7C9]/75 hover:text-white transition-colors duration-200 text-xs sm:text-sm block break-all"
                  >
                    support@veritasaid.com
                  </a>
                </li>
                <li className="pt-1">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-white font-medium hover:text-white transition-all duration-200 text-xs sm:text-sm inline-flex items-center gap-2.5 group bg-[#043C2D] hover:bg-[#032E22] border border-[#EED5AF]/30 hover:border-[#EED5AF]/60 px-3 py-1.5 rounded-[6px] shadow-xs cursor-pointer"
                  >
                    <WhatsAppIcon className="w-5 h-5 shrink-0 group-hover:scale-105 transition-transform duration-200 drop-shadow-xs" />
                    <span className="font-semibold tracking-wide">WhatsApp Us</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h3 className="font-editorial text-lg sm:text-xl font-normal text-[#F8E7C9] tracking-tight">
                Addresses
              </h3>
              <div className="space-y-2.5">
                {companyAddress && (
                  <div className="font-sans text-[#F8E7C9]/70 text-xs sm:text-[13px] leading-relaxed whitespace-pre-line">
                    <span className="text-xs font-semibold text-[#F8E7C9] block mb-0.5">Administrative Office:</span>
                    {companyAddress}
                  </div>
                )}
                {companyAddress2 && (
                  <div className="font-sans text-[#F8E7C9]/70 text-xs sm:text-[13px] leading-relaxed whitespace-pre-line pt-2 border-t border-[#F8E7C9]/15">
                    <span className="text-xs font-semibold text-[#F8E7C9] block mb-0.5">Registered Office:</span>
                    {companyAddress2}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-[#F8E7C9]/15 mt-10 pt-5">
            <div className="flex flex-col sm:flex-row justify-between items-center font-sans text-xs text-[#F8E7C9]/60 gap-2">
              <p>© {new Date().getFullYear()} Aidessa. All rights reserved.</p>
              <p className="tracking-wide">Decentralized Recovery Protocol</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
