import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  CheckCircle,
  X,
  ArrowRight
} from 'lucide-react';
import HeroGridBoxesAnimation from '../components/HeroGridBoxesAnimation';


const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [emailLocked, setEmailLocked] = useState(false);

  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const email = params.get('email');
      const ref = params.get('ref');
      if (email) {
        setFormData((prev) => ({ ...prev, email }));
        setEmailLocked(true);
      }
      if (ref) {
        setFormData((prev) => ({ ...prev, referralCode: ref }));
      }
    } catch { }

    if (location.state?.prefill) {
      const { firstName, lastName, email, referralCode } = location.state.prefill;
      setFormData(prev => ({
        ...prev,
        firstName: firstName || '',
        lastName: lastName || '',
        email: email || '',
        referralCode: referralCode || prev.referralCode || ''
      }));
      if (email) setEmailLocked(true);
      setIsAutoFilled(true);
    }
  }, [location.search, location.state]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setServerErrors((prev) => prev.filter(err => err.path !== e.target.name));
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);
    return { minLength, hasNumber, hasLetter, hasUpper, hasLower, hasSpecial };
  };

  const passwordValidation = validatePassword(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!acceptTerms) {
      return;
    }

    if (!passwordsMatch) {
      return;
    }

    if (
      !passwordValidation.minLength ||
      !passwordValidation.hasNumber ||
      !passwordValidation.hasUpper ||
      !passwordValidation.hasLower ||
      !passwordValidation.hasSpecial ||
      (formData.lastName?.trim().length < 2)
    ) {
      return;
    }

    setLoading(true);

    const result = await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      acceptTerms,
      referralCode: formData.referralCode
    });

    if (result.success) {
      setRegistrationSuccess(true);
    } else {
      setServerErrors(result.errors || []);
    }

    setLoading(false);
  };

  if (registrationSuccess) {
    return (
      <div className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center py-10 sm:py-14 px-4 sm:px-6 overflow-hidden bg-[#F8E7C9]">
        <HeroGridBoxesAnimation />
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 max-w-lg w-full rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-8 sm:p-10 text-center shadow-[0_12px_40px_rgba(6,78,59,0.08)] text-[#064E3B]"
        >
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-[#064E3B]/[0.08] border border-[#064E3B]/20 flex items-center justify-center text-[#064E3B]">
              <Mail className="h-8 w-8 text-[#064E3B]" strokeWidth={1.8} />
            </div>
          </div>
          <p className="text-[11px] sm:text-xs font-bold tracking-[0.2em] text-[#064E3B]/70 uppercase mb-2">
            Verification Required
          </p>
          <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#064E3B] mb-3">
            Verify Your Email
          </h2>
          <p className="text-sm sm:text-base text-[#064E3B]/80 mb-6 leading-relaxed font-sans">
            We've sent a verification link to <span className="font-semibold text-[#064E3B]">{formData.email}</span>. Please click the link in the email to activate your account.
          </p>
          <div className="bg-[#064E3B]/[0.04] border border-[#064E3B]/10 rounded-[8px] p-4 mb-6 text-left">
            <p className="text-xs sm:text-sm text-[#064E3B]/75 leading-relaxed font-sans">
              Can't find the email? Please check your spam folder and mark it as <span className="font-bold text-[#064E3B]">Not Spam</span> to avoid missing important updates.
            </p>
          </div>
          <div className="pt-4 border-t border-[#064E3B]/10">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#064E3B] hover:underline underline-offset-4">
              Return to Login
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center py-10 sm:py-14 px-4 sm:px-6 overflow-hidden bg-[#F8E7C9]">
      {/* Background Animated Grid Texture */}
      <HeroGridBoxesAnimation />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-lg mx-auto"
      >
        <div className="rounded-[8px] sm:rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-6 sm:p-9 md:p-10 text-[#064E3B] shadow-[0_12px_40px_rgba(6,78,59,0.08)]">
          {/* Card Header matching Home Page editorial styling */}
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-[11px] sm:text-xs font-bold tracking-[0.2em] text-[#064E3B]/70 uppercase mb-1.5">
              Claimant Portal
            </p>
            <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#064E3B] tracking-[-0.02em] leading-tight mb-1">
              Sign up
            </h1>
            <p className="text-xs sm:text-sm text-[#064E3B]/70 font-sans">
              Create your account to track your claim status
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5">
                  First name*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-[#064E3B]/40" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-[8px] border text-sm sm:text-base transition-all duration-200 focus:outline-none focus:ring-2 ${
                      isAutoFilled
                        ? 'bg-[#064E3B]/[0.03] border-[#064E3B]/15 text-[#064E3B]/70 cursor-not-allowed'
                        : 'bg-white border-[#064E3B]/20 text-[#064E3B] placeholder-[#064E3B]/35 focus:ring-[#064E3B]/25 focus:border-[#064E3B]'
                    } ${serverErrors.some(e => e.path === 'firstName') ? '!border-red-500 !ring-red-200' : ''}`}
                    placeholder="First name"
                    readOnly={isAutoFilled}
                  />
                  {serverErrors.filter(e => e.path === 'firstName').map((e, i) => (
                    <p key={i} className="mt-1 text-xs text-red-600">{e.msg || e.message}</p>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5">
                  Last name*
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2.5 rounded-[8px] border text-sm sm:text-base transition-all duration-200 focus:outline-none focus:ring-2 ${
                    isAutoFilled
                      ? 'bg-[#064E3B]/[0.03] border-[#064E3B]/15 text-[#064E3B]/70 cursor-not-allowed'
                      : 'bg-white border-[#064E3B]/20 text-[#064E3B] placeholder-[#064E3B]/35 focus:ring-[#064E3B]/25 focus:border-[#064E3B]'
                  } ${(formData.lastName && formData.lastName.trim().length < 2) || serverErrors.some(e => e.path === 'lastName') ? '!border-red-500 !ring-red-200' : ''}`}
                  placeholder="Last name"
                  readOnly={isAutoFilled}
                />
                {formData.lastName && formData.lastName.trim().length < 2 && (
                  <p className="mt-1 text-xs text-red-600">Last name must be at least 2 characters</p>
                )}
                {serverErrors.filter(e => e.path === 'lastName').map((e, i) => (
                  <p key={i} className="mt-1 text-xs text-red-600">{e.msg || e.message}</p>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5">
                Email*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-[#064E3B]/40" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-[8px] border text-sm sm:text-base transition-all duration-200 focus:outline-none focus:ring-2 ${
                    emailLocked
                      ? 'bg-[#064E3B]/[0.03] border-[#064E3B]/15 text-[#064E3B]/70 cursor-not-allowed'
                      : 'bg-white border-[#064E3B]/20 text-[#064E3B] placeholder-[#064E3B]/35 focus:ring-[#064E3B]/25 focus:border-[#064E3B]'
                  }`}
                  readOnly={emailLocked}
                  placeholder="Enter your email"
                />
              </div>
              {emailLocked && (
                <p className="mt-1 text-xs text-[#064E3B]/60 font-sans">Email locked from your application invitation</p>
              )}
              {serverErrors.filter(e => e.path === 'email').map((e, i) => (
                <p key={i} className="mt-1 text-xs text-red-600">{e.msg || e.message}</p>
              ))}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5">
                Password*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-[#064E3B]/40" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-9 pr-10 py-2.5 rounded-[8px] bg-white border border-[#064E3B]/20 text-[#064E3B] placeholder-[#064E3B]/35 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] transition-all duration-200 ${
                    serverErrors.some(e => e.path === 'password') ? '!border-red-500' : ''
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#064E3B]/50 hover:text-[#064E3B]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password Requirements */}
              {formData.password && (
                <div className="mt-2.5 p-2.5 rounded-[6px] bg-[#064E3B]/[0.03] border border-[#064E3B]/10 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  <div className={`flex items-center space-x-1.5 text-xs ${passwordValidation.minLength ? 'text-[#064E3B] font-medium' : 'text-[#064E3B]/45'}`}>
                    {passwordValidation.minLength ? <CheckCircle size={13} className="text-[#064E3B]" /> : <X size={13} />}
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center space-x-1.5 text-xs ${passwordValidation.hasNumber ? 'text-[#064E3B] font-medium' : 'text-[#064E3B]/45'}`}>
                    {passwordValidation.hasNumber ? <CheckCircle size={13} className="text-[#064E3B]" /> : <X size={13} />}
                    <span>Contains a number</span>
                  </div>
                  <div className={`flex items-center space-x-1.5 text-xs ${passwordValidation.hasUpper ? 'text-[#064E3B] font-medium' : 'text-[#064E3B]/45'}`}>
                    {passwordValidation.hasUpper ? <CheckCircle size={13} className="text-[#064E3B]" /> : <X size={13} />}
                    <span>Contains uppercase</span>
                  </div>
                  <div className={`flex items-center space-x-1.5 text-xs ${passwordValidation.hasLower ? 'text-[#064E3B] font-medium' : 'text-[#064E3B]/45'}`}>
                    {passwordValidation.hasLower ? <CheckCircle size={13} className="text-[#064E3B]" /> : <X size={13} />}
                    <span>Contains lowercase</span>
                  </div>
                  <div className={`flex items-center space-x-1.5 text-xs ${passwordValidation.hasSpecial ? 'text-[#064E3B] font-medium' : 'text-[#064E3B]/45'} sm:col-span-2`}>
                    {passwordValidation.hasSpecial ? <CheckCircle size={13} className="text-[#064E3B]" /> : <X size={13} />}
                    <span>Special character (@$!%*?&)</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-semibold text-[#064E3B] mb-1.5">
                Password confirmation*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-[#064E3B]/40" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-9 pr-10 py-2.5 rounded-[8px] bg-white border border-[#064E3B]/20 text-[#064E3B] placeholder-[#064E3B]/35 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#064E3B]/25 focus:border-[#064E3B] transition-all duration-200 ${
                    formData.confirmPassword && !passwordsMatch ? '!border-red-500' : ''
                  } ${serverErrors.some(e => e.path === 'confirmPassword') ? '!border-red-500' : ''}`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#064E3B]/50 hover:text-[#064E3B]"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {formData.confirmPassword && !passwordsMatch && (
                <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
              )}
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="accept-terms"
                  name="accept-terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="h-4 w-4 accent-[#064E3B] text-[#064E3B] border-[#064E3B]/30 rounded cursor-pointer"
                />
              </div>
              <div className="ml-2.5 text-xs sm:text-sm">
                <label htmlFor="accept-terms" className="text-[#064E3B]/80 cursor-pointer font-sans">
                  I accept the{' '}
                  <Link to="/privacy" className="font-semibold text-[#064E3B] underline underline-offset-2 hover:text-[#043C2D]">
                    Privacy Policy
                  </Link>{' '}
                  and{' '}
                  <Link to="/terms" className="font-semibold text-[#064E3B] underline underline-offset-2 hover:text-[#043C2D]">
                    Terms of Service
                  </Link>
                  *
                </label>
                {!acceptTerms && (
                  <p className="text-xs text-red-600 mt-0.5">You must accept the terms to continue</p>
                )}
                {serverErrors.filter(e => e.path === 'acceptTerms').map((e, i) => (
                  <p key={i} className="text-xs text-red-600 mt-0.5">{e.msg || e.message}</p>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                !acceptTerms ||
                !passwordsMatch ||
                !passwordValidation.minLength ||
                !passwordValidation.hasNumber ||
                !passwordValidation.hasUpper ||
                !passwordValidation.hasLower ||
                !passwordValidation.hasSpecial ||
                (formData.lastName?.trim().length < 2)
              }
              className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3 sm:py-3.5 rounded-[8px] bg-[#064E3B] text-[#F8E7C9] text-base font-semibold hover:bg-[#043C2D] border border-[#043C2D] shadow-md shadow-[#064E3B]/20 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#F8E7C9] border-t-transparent"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                <>
                  <span>Sign up</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#064E3B]/10 text-center">
            <p className="text-xs sm:text-sm text-[#064E3B]/70 font-sans">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-[#064E3B] underline underline-offset-4 hover:text-[#043C2D] transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
