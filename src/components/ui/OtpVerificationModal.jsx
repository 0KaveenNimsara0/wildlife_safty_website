import React, { useState, useEffect, useRef } from 'react';
import { Shield, ArrowRight, X, Mail, RefreshCw } from 'lucide-react';

export default function OtpVerificationModal({ 
  isOpen, 
  onClose, 
  onVerify, 
  email, 
  loading,
  onResend,
  mode = 'login' // 'login', 'register', or 'reset-password'
}) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [attempts, setAttempts] = useState(3);
  const [errorText, setErrorText] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!isOpen) {
      setOtp(['', '', '', '', '', '']);
      setCountdown(300);
      setAttempts(3);
      setErrorText('');
      setIsVerifying(false);
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
    setErrorText('');

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

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      try {
        setIsVerifying(true);
        setErrorText('');
        await onVerify(otpValue);
      } catch (err) {
        const remaining = attempts - 1;
        setAttempts(remaining);
        
        if (remaining <= 0) {
          setErrorText('SECURITY LOCKOUT: 3 failed attempts. Returning to login.');
          setTimeout(() => {
            onClose();
          }, 2000);
        } else {
          setErrorText(`Wrong or expired OTP. ${remaining} attempts remaining.`);
          setOtp(['', '', '', '', '', '']);
          if (inputRefs.current[0]) inputRefs.current[0].focus();
        }
      } finally {
        setIsVerifying(false);
      }
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in font-sans">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-[#111827] p-10 rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 animate-slide-up overflow-hidden">
        
        {/* Decorative Orbs inside modal */}
        <div className="absolute top-0 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 -left-20 w-64 h-64 bg-slate-500/5 rounded-full blur-[80px]" />

        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
        >
          <X size={20} />
        </button>

        <div className="text-center space-y-6 mb-10">
          <div className="mx-auto w-24 h-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center border border-emerald-500/20 relative group overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-50" />
            <Shield className="text-emerald-500 relative z-10" size={40} />
          </div>
          <div>
            <h3 className="text-3xl font-black text-white tracking-tight uppercase italic underline decoration-emerald-500/50 underline-offset-8">
              Verification <span className="text-emerald-500 not-italic">Required</span>
            </h3>
            <p className="text-[10px] font-black text-slate-500 mt-6 uppercase tracking-[0.3em]">
              Security code dispatched to terminal
            </p>
            <div className="inline-flex items-center gap-3 mt-3 px-5 py-2 bg-white/5 rounded-2xl border border-white/5">
              <Mail size={14} className="text-emerald-500" />
              <span className="text-xs font-bold text-slate-300 tracking-wider lowercase">{email}</span>
            </div>
          </div>
        </div>

        {errorText && (
          <div className="flex items-start gap-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-6 py-5 rounded-[2rem] mb-8 animate-shake">
            <RefreshCw size={18} className="mt-0.5 flex-shrink-0 animate-reverse-spin" />
            <span className="text-[10px] font-black uppercase tracking-[0.15em] leading-relaxed">{errorText}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
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
                className={`w-12 h-16 text-center text-2xl font-black bg-black/40 border-2 rounded-2xl focus:outline-none transition-all shadow-2xl tracking-tighter
                  ${digit ? 'border-emerald-500 text-white shadow-emerald-500/10' : 'border-white/5 text-slate-700 focus:border-emerald-500/40'}`}
              />
            ))}
          </div>

          <div className="text-center h-4">
            {countdown > 0 ? (
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Session expires in <span className="text-emerald-500">{formatTime(countdown)}</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={onResend}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 hover:text-emerald-400 flex items-center justify-center gap-2 mx-auto transition-colors"
              >
                <RefreshCw size={14} />
                Renew Cipher Request
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || isVerifying || otp.join('').length !== 6 || attempts <= 0}
            className="w-full py-5 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-emerald-500 shadow-2xl shadow-emerald-950/50 transition-all flex items-center justify-center gap-4 group disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            {loading || isVerifying ? (
               <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Decrypting...</span>
               </div>
            ) : (
                <>
                  <span>Validate Security Access</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
