import React, { useState, useEffect, useRef } from 'react';
import { Shield, ArrowRight, X, Mail, RefreshCw } from 'lucide-react';

export default function OtpVerificationModal({ 
  isOpen, 
  onClose, 
  onVerify, 
  email, 
  loading,
  onResend,
  mode = 'login' // 'login' or 'register'
}) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!isOpen) {
      setOtp(['', '', '', '', '', '']);
      setCountdown(300);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Auto-focus first input
    setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, 100);

    return () => clearInterval(timer);
  }, [isOpen]);

  const handleChange = (index, value) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      onVerify(otpValue);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md glass p-8 rounded-[2.5rem] shadow-2xl border-white/40 ring-1 ring-slate-900/5 animate-slide-up overflow-hidden">
        
        {/* Decorative Orbs inside modal */}
        <div className="absolute top-0 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-[50px]" />
        <div className="absolute bottom-0 -left-10 w-40 h-40 bg-sky-500/10 rounded-full blur-[50px]" />

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
        >
          <X size={20} />
        </button>

        <div className="text-center space-y-4 mb-8">
          <div className="mx-auto w-20 h-20 bg-emerald-50 rounded-[20px] flex items-center justify-center border-2 border-emerald-100 shadow-inner relative group">
            <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full group-hover:bg-emerald-500/30 transition-all" />
            <Shield className="text-emerald-600 relative z-10" size={36} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Identity Verification</h3>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              We've sent a secure 6-digit code to
            </p>
            <div className="inline-flex items-center gap-2 mt-1 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
              <Mail size={14} className="text-emerald-600" />
              <span className="text-sm font-bold text-slate-700">{email}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-12 h-14 text-center text-xl font-black bg-white/50 border-2 rounded-2xl focus:outline-none focus:bg-white transition-all shadow-sm
                  ${digit ? 'border-emerald-500 text-emerald-700' : 'border-slate-100 text-slate-800 focus:border-emerald-300'}`}
              />
            ))}
          </div>

          <div className="text-center">
            {countdown > 0 ? (
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Code expires in <span className="text-emerald-600 font-black">{formatTime(countdown)}</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={onResend}
                className="text-xs font-black uppercase tracking-wider text-emerald-600 hover:text-emerald-700 flex items-center justify-center gap-2 mx-auto"
              >
                <RefreshCw size={14} />
                Resend Code
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || otp.join('').length !== 6}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-emerald-600 shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-900"
          >
            {loading ? 'Verifying...' : mode === 'register' ? 'Complete Registration' : 'Secure Login'}
            {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
      </div>
    </div>
  );
}
