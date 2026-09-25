import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import HeroGridBoxesAnimation from '../components/HeroGridBoxesAnimation';

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { updateUser } = useAuth();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('Verifying your email address...');
    const hasRun = React.useRef(false);

    useEffect(() => {
        if (hasRun.current) return;

        const performVerification = async () => {
            hasRun.current = true;
            try {
                const response = await axios.get(`/api/auth/verify-email/${token}`);

                if (response.data.success) {
                    if (response.data.alreadyVerified) {
                        setStatus('success');
                        setMessage(response.data.message);
                        return;
                    }

                    const { token: jwtToken, user } = response.data.data;

                    // Set authentication data
                    localStorage.setItem('token', jwtToken);
                    localStorage.setItem('user', JSON.stringify(user));
                    axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
                    updateUser(user);

                    setStatus('success');
                    setMessage(response.data.message || 'Email verified successfully!');
                    toast.success('Email verified! Welcome to Aidessa.');

                    // Redirect to dashboard after a short delay
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 3000);
                }
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
                // Only show toast once
                toast.error('Verification failed');
            }
        };

        if (token) {
            performVerification();
        } else {
            setStatus('error');
            setMessage('Invalid verification token.');
        }
    }, [token, navigate, updateUser]);

    return (
        <div className="relative w-full min-h-[calc(100vh-4rem)] bg-[#F8E7C9] text-[#064E3B] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            {/* Background Animated Grid Texture */}
            <HeroGridBoxesAnimation />

            <div className="relative z-10 max-w-lg w-full">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="rounded-[10px] bg-[#FFFDF9] border border-[#064E3B]/15 p-8 sm:p-12 text-[#064E3B] shadow-[0_16px_50px_rgba(6,78,59,0.08)] text-center space-y-6"
                >
                    {/* Status Icon */}
                    <div className="flex justify-center">
                        {status === 'verifying' && (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#064E3B]/[0.08] border-2 border-[#064E3B]/20 flex items-center justify-center text-[#064E3B]">
                                <Loader2 className="h-9 w-9 text-[#064E3B] animate-spin" />
                            </div>
                        )}
                        {status === 'success' && (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-700">
                                <CheckCircle className="h-9 w-9 text-emerald-700" strokeWidth={2.2} />
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center text-red-600">
                                <XCircle className="h-9 w-9 text-red-600" strokeWidth={2.2} />
                            </div>
                        )}
                    </div>

                    <div>
                        <p className="text-[11px] sm:text-xs font-bold tracking-[0.2em] text-[#064E3B]/70 uppercase mb-2">
                            Account Verification
                        </p>
                        <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#064E3B] tracking-[-0.02em] leading-tight">
                            {status === 'verifying' && 'One Moment...'}
                            {status === 'success' && 'Email Verified!'}
                            {status === 'error' && 'Verification Error'}
                        </h2>

                        <p className="text-sm sm:text-base text-[#064E3B]/80 font-sans max-w-sm mx-auto mt-3 leading-relaxed">
                            {message}
                        </p>
                    </div>

                    {status === 'success' && !message.includes('safely login') && (
                        <div className="flex flex-col items-center pt-2">
                            <div className="w-48 h-1.5 bg-[#064E3B]/10 rounded-full overflow-hidden mb-3">
                                <motion.div
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 3, ease: 'linear' }}
                                    className="h-full bg-[#064E3B]"
                                />
                            </div>
                            <p className="text-xs text-[#064E3B]/60 font-sans">Redirecting to your dashboard...</p>
                        </div>
                    )}

                    {status === 'success' && message.includes('safely login') && (
                        <div className="pt-2">
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full py-3 bg-[#064E3B] hover:bg-[#043C2D] text-[#F8E7C9] font-semibold text-sm rounded-[8px] border border-[#043C2D] shadow-sm transition-all cursor-pointer"
                            >
                                Go to Login
                            </button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="pt-2">
                            <button
                                onClick={() => navigate('/register')}
                                className="w-full py-3 bg-[#064E3B] hover:bg-[#043C2D] text-[#F8E7C9] font-semibold text-sm rounded-[8px] border border-[#043C2D] shadow-sm transition-all cursor-pointer"
                            >
                                Back to Registration
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default VerifyEmail;
