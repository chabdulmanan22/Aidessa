import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-[#085464] via-[#05323c] to-[#02141a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#031d24]/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-cyan-500/20 text-white shadow-2xl shadow-cyan-950/60"
        >
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-cyan-400" />
            <h1 className="text-2xl sm:text-3xl font-bold">Important Notice</h1>
          </div>

          <div className="space-y-4 text-gray-200 text-sm sm:text-base leading-relaxed">
            <p>
              Please read carefully before proceeding. Aidessa helps eligible fraud victims access refund allocations through structured verification.
            </p>
            <p>
              To process your request accurately, you will need to provide basic incident details, your contact email, and documentation or transaction hashes related to your loss.
            </p>
            <p>
              All submitted evidence is encrypted and reviewed securely by our verification system.
            </p>
            <p className="font-semibold text-red-300">
              🔺 Warning: Any individual found to have submitted false or misleading information may be disqualified from recovery assistance and could be prosecuted for fraud or attempted extortion.
            </p>
            <p>
              By completing this form, you confirm that the information provided is accurate to the best of your knowledge. If you are unsure about any details, we recommend you review your records before submitting.
            </p>
            <p>
              Thank you for your cooperation.
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-5 py-2.5 rounded-lg border border-white/30 text-white hover:bg-white/10 transition"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#086a7e] to-[#0e7490] text-white font-semibold hover:from-[#097d95] hover:to-[#0891b2] shadow-md shadow-cyan-950/50 transition"
            >
              Next
            </button>
          </div>
        </motion.div>
      </div>
    </div>

  );
};

export default JoinNotice;